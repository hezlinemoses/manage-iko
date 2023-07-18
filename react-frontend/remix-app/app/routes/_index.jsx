import stylesUrl from "../styles/index.css";
import { Form, Link, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { authBaseUrl } from "../constants/constants";
import { json, redirect } from "@remix-run/node";
import { createCookie} from "@remix-run/node";
export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    }
  ]
};
export const loader = async ({request}) => {
  // console.log('hello from root loaderrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
  console.log('home loader function')
  try{
    // let res = await fetch('http://project-service:8000/teams/create/',{method:"POST",headers:{'Cookie':request.headers.get('Cookie'),'Content-Type': 'application/json'}})
    // let headers = res.headers
    // return json({},{headers:headers})
    return null
  }catch(e){
    console.log('dfgdfgdgdfgd')
    console.log(e.message)
    return null
  }
}

export default function IndexRoute() {
  let data = useLoaderData()
  console.log(data,'loader data')
  return (
    <div className="container">
      <div className="content">
        <h1>
          Homeererewg
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokederterte453s</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
