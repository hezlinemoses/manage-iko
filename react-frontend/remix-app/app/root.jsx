import { Outlet, Links, Scripts, useLoaderData } from "@remix-run/react";
import styles from './styles/tailwind.css'
import NavBar from "./components/NavBar";
import { user_cookie } from "./cookies";


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
 
    let user = await user_cookie.parse(request.headers.get('Cookie'))
    console.log('root loader fn')
    return user
}

export const action = async ({request})=>{
  let formData = await request.formData()
  let {_action,...values} = Object.fromEntries(formData)
  if (_action === "logout"){
    alert('dfdgfdg')
    // return json({},{headers:{'set-cookie':"jwt-acces"}})
  } 
  return null
}

export default function App() {
  let loadUser = useLoaderData()
  console.log('userrrrrrrrrrrrrr',loadUser)
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
        <section>
        
        </section>
        <Scripts/>
        {/* Hello world */}
        <Outlet/>
        {/* <LiveReload port={80} /> */}
      </body>
    </html>
  );
}


