import type { MetaFunction } from "@remix-run/node";
import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import globalStylesUrl from './styles/global.css';
import globalMedumStylesUrl from './styles/global-medium.css';
import globalLargeStylesUrl from './styles/global-large.css';

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: globalStylesUrl },
    { rel: 'stylesheet', href: globalMedumStylesUrl, media: 'print, (min-width: 640px)' },
    { rel: 'stylesheet', href: globalLargeStylesUrl, media: 'screen and (min-width: 1024px)a' },
  ];
}

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
