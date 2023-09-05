import { Outlet, Links, Scripts, useLoaderData, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import styles from './styles/tailwind.css'
import NavBar from "./components/NavBar";
import { jwt_access_cookie, jwt_refresh_cookie, user_cookie } from "./cookies";
import { json, redirect } from "@remix-run/node";
import { ErrorBoundaryContent } from "./utils/errorboundary";
import { checkJwtCookies } from "./utils/cookieCheck";


export const links = ()=>[
  {
    rel: "stylesheet",
    href: styles,
  }
]
// export function shouldRevalidate({
//   actionResult,
//   defaultShouldRevalidate,
// }) {
//   if(actionResult?.error === 'error'){
//     return true
// }
//   return false
// }
export const loader = async ({request})=>{
  // dont redirect from this route to login.... login have to load this route first.
  let user;
    if (! await checkJwtCookies(request)){
      user = null;
      return user
    }
    user = await user_cookie.parse(request.headers.get('Cookie'))
    console.log('root loader fn',user)
    return user
}

export const action = async ({request})=>{
  let formData = await request.formData()
  let {_action,...values} = Object.fromEntries(formData)
  if (_action === "logout"){
    let headers = new Headers()
    headers.append('Set-Cookie', await jwt_access_cookie.serialize("",{maxAge:0}))
    headers.append('Set-Cookie', await jwt_refresh_cookie.serialize("",{maxAge:0}))
    headers.append('Set-Cookie', await user_cookie.serialize("",{maxAge:0}))
    return json({},{headers:headers})
    // return json({},{headers:{'set-cookie':"jwt-acces"}})
  } 
  return null
}

export default function App() {
  let loadUser = useLoaderData()
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
      <body className="w-screen h-screen">
        <header className="h-24">
          <NavBar user={loadUser}/>
        </header>
        <section className=" px-2 lg:px-32">
        
        <Outlet/>
        </section>
        <Scripts/>
        {/* Hello world */}
        {/* <LiveReload port={80} /> */}
      </body>
    </html>
  );
}


export function ErrorBoundary() {
  const error = useRouteError();
  return ErrorBoundaryContent(error)
}