import { Form, useActionData,Link } from "@remix-run/react";
import { authBaseUrl } from "../constants/constants";
import {redirect} from "@remix-run/node"
import stylesUrl from "../styles/tailwind.css"
import bgImg from "../assets/bg-img.png"

export const links = () => {
    return[
        {
            rel : "stylesheet",
            href : stylesUrl,
        }, 

    ]
}

export const loader = async({request}) =>{
  console.log(request.headers.get('Cookie'))
  try {
    let res = await fetch(authBaseUrl+"/accounts/checkloginstatus",{method:"get",headers:{'Cookie':request.headers.get('Cookie'),'Content-Type': 'application/json'}})
    if(res.status === 200){
        console.log('redirecting')
        console.log(res.headers.get('set-cookie'),'header from server')
        if(res.headers.get('set-cookie')!=null){
          console.log('------')
            return redirect("/",{
                headers: res.headers,
                })
        }
        return redirect("/")
    }
    return null
} catch (error) {
    return null
}
}
export const action = async ({request})=> {
    let data = Object.fromEntries(await request.formData())
    try{
        // let cookieHeader = request.headers.get('Cookie')
        // console.log(cookieHeader)
        // let cookie = await (jwt_access.parse(cookieHeader)) || {};
        // let list = cookies.split(';')
        // const csrfCookie = list.find(cookie => cookie.trim().startsWith('csrftoken='));
        let res = await fetch(authBaseUrl+'/accounts/login/',{method:"post",body:JSON.stringify(data),
        headers:{'Cookie':request.headers.get('Cookie'),'Content-Type': 'application/json'}})
        let resData = await res.json()
        if (resData?.error){
            console.log(resData,'eeeeeee')
            return resData.error
        }
        let url = new URL(request.url)
        let redirect_str = url.searchParams.get("redirect")
        if(!redirect_str){
          redirect_str = "/"
        }
        // if there is no error.. rediredt to home page with the response headers from server which contains jwt cookies.
        return redirect(redirect_str,{
            headers: res.headers,
            })

        
    }catch(e){
        return "Service unavailable"
    }
}
export default function LoginRoute(){
    let error = useActionData()
    console.log(error,'action data/error')
    // console.log('action data',data)
    return(<>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form className="space-y-6"  method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {error && <span className=" text-sm text-red-500">{error}</span>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </Form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                <Link to={'/register'}>
              Signup
                </Link>
            </span>
          </p>
        </div>
      </div>
    </>
    )
}