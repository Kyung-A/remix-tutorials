// 파일 이름에 .server가 붙는 이유는 컴파일러가 브라우저에 번들링할 떄 이 모듈이나 모듈의 가져오기에 대해 걱정하지 않도록 하는 힌트입니다(?)
import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// 서버측 코드가 변경 될때마다 재실행
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

export { db };
