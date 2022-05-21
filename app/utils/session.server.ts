import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

import { db } from "./db.server";

interface ILoginForm {
  username: string;
  password: string;
}

export async function login({ username, password }: ILoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  }); // findUnique API는 id 또는 고유 속성으로 단일 db 레코드를 검색
  if (!user) return null;

  // 올바른 비밀번호
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;

  return { id: user.id, username };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET을 설정해야 합니다.");
}

const storage = createCookieSessionStorage({
  // secure가 true여야함
  // 사파리에서는 작동하지 않음
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

// redirect 객체를 반환하는 함수
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return userId;
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
