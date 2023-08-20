import stylesUrl from "../../styles/index.css";
import {  Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import {user_cookie} from "../../cookies"
import {checkJwtCookies} from "../../utils/cookieCheck"
import { getUserFromCookie } from "../../utils/cookieInfo";
export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    }
  ]
};
export const headers = ({loaderHeaders})=>{
  return {"Cache-Control" : loaderHeaders.get("Cache-Control")}
}



export const loader = async ({request}) => {
  console.log('home loader function')
  let jwtPresent = await checkJwtCookies(request)
  if (!jwtPresent){
    return redirect("/login")
  }


  let user = await getUserFromCookie(request)
  return null
  return json({},{headers:{
    "Set-Cookie": await user_cookie.serialize("hezline")
  }})
  try{
    // let res = await fetch('http://project-service:8000/teams/create/',{method:"POST",headers:{'Cookie':request.headers.get('Cookie'),'Content-Type': 'application/json'}})
    // let headers = res.headers
    // return json({},{headers:headers})
    return json({},{headers:{"Cache-Control":"public,max-age=1,stale-while-revalidate=100"}})
  }catch(e){
    console.log('dfgdfgdgdfgd')
    console.log(e.message)
    return null
  }
}

async function delay(){
  return new Promise((resolve,reject)=>{setTimeout(() => {
    resolve('hello')
  }, 500);})
}

export default function IndexRoute() {
  let data = useLoaderData()
  console.log(data,'loader data')
  return (
    <div className="container">
      <div className="content">
        <h1 className=" font-sans text-2xl font-extrabold text-red-600">
          Homee!
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
