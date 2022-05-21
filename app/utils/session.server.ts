import bcrypt from "bcryptjs";

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
