import type { MetaFunction } from "@remix-run/node";
import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Outlet,
  useCatch
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

function Document({
  children,
  title = `농담 앱`
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}


export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}


export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>
          {error.message}
        </pre>
      </div>
    </Document>
  )
}
