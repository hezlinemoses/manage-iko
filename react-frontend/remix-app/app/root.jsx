import { Outlet, Links, Scripts } from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <title>remix</title>
        <Links/>
      </head>
      <body>
        <Scripts/>
        {/* Hello world */}
        <Outlet/>
        {/* <LiveReload port={80} /> */}
      </body>
    </html>
  );
}


