import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload, 
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {/* LiveReload는 소스코드 변경 시 브라우저 자동 새로고침 */}
        <LiveReload /> 
      </body>
    </html>
  );
}
