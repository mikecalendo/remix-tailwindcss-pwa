import { useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
  useMatches,
} from 'remix';
import type { MetaFunction } from 'remix';

import mainStylesHref from 'awsm.css/dist/awsm.min.css';
import themeStylesHref from 'awsm.css/dist/awsm_theme_mischka.min.css';
import tailwindstyles from './tailwind.css';

// https://remix.run/api/app#links
export let links = () => {
  return [{ rel: 'stylesheet', href: tailwindstyles }];
};

export const meta: MetaFunction = () => {
  return {
    title: 'Remix PWA',
    description: 'An example PWA built with Remix.',
  };
};

export default function RootRoute() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  let { data, status } = useCatch();

  let message = data?.message;
  if (!message) {
    switch (status) {
      case 404:
        message = 'Page not found';
        break;
      case 500:
        message = 'Internal server error';
        break;
      default:
        message = 'Something went wrong';
    }
  }

  return (
    <Document>
      <h1>{message}</h1>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error('ERROR BOUNDARY', error);

  return (
    <Document>
      <h1>Something went wrong</h1>
    </Document>
  );
}

let isMount = true;
function Document({ children }: { children: ReactNode }) {
  let location = useLocation();
  let matches = useMatches();

  useEffect(() => {
    let mounted = isMount;
    isMount = false;
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: 'REMIX_NAVIGATION',
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: 'REMIX_NAVIGATION',
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener('controllerchange', listener);
        return () => {
          navigator.serviceWorker.removeEventListener(
            'controllerchange',
            listener
          );
        };
      }
    }
  }, [location]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#c34138" />
        <Meta />
        <link rel="stylesheet" href={mainStylesHref} />
        <link rel="stylesheet" href={themeStylesHref} />

        <link rel="manifest" href="/resources/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/icons/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/icons/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/icons/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/icons/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/icons/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/icons/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icons/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/icons/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <Links />
      </head>
      <body>
        <header>
          <h1>Remix PWA</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <a
                  href="https://github.com/jacob-ebey/remix-pwa"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Source
                </a>
              </li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>Remix Rocks</p>
        </footer>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
