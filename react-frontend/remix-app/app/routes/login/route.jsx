import { Form, useActionData,Link } from "@remix-run/react";
import { authBaseUrl } from "~/constants/constants";
import {redirect} from "@remix-run/node"
import stylesUrl from "~/styles/tailwind.css"
import { jwt_refresh_cookie, user_cookie_test } from "~/cookies";
import { authGetRequest, authPostRequest, responseHeaders } from "~/utils/api";
export const links = () => {
    return[
        {
            rel : "stylesheet",
            href : stylesUrl,
        }, 

    ]
}

export const loader = async({request}) =>{
  try {
    let res = await authGetRequest("/accounts/checkloginstatus/",request)
    if(res.status === 200){
        console.log('redirecting')
        return redirect("/",{headers:await responseHeaders(res.headers)})
    }
    return null
} catch (error) {
    return null
}
}
export const action = async ({request})=> {
    let data = Object.fromEntries(await request.formData())
    try{
        let res = await authPostRequest('/accounts/login/',JSON.stringify(data),request)
        let resData = await res.json()
        if (resData?.error){
            return resData.error
        }
        let url = new URL(request.url)
        let redirect_str = url.searchParams.get("redirect")
        if(!redirect_str){
          redirect_str = "/"
        }
        // if there is no error.. rediredt to home page with the response headers from server which contains jwt cookies.
        return redirect(redirect_str,{
            headers: await responseHeaders(res.headers),
            })

        
    }catch(e){
        return "Service unavailable"
    }
}
export default function Screen(){
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
                <Link to={'/signup'}>
              Signup
                </Link>
            </span>
          </p>
        </div>
      </div>
    </>
    )
}