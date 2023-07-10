import { Form, useActionData } from "@remix-run/react";
import { authBaseUrl } from "../constants/constants";
import {createCookie, json, redirect} from "@remix-run/node"
import { jwt_access_cookie } from "../cookies";

export const loader = async ({request}) => {
    ///check if there is user
    return null
}

export const action = async ({request})=> {
    let data = Object.fromEntries(await request.formData())
    try{
        let cookieHeader = request.headers.get('Cookie')
        console.log(cookieHeader)
        // let cookie = await (jwt_access.parse(cookieHeader)) || {};
        // let list = cookies.split(';')
        // const csrfCookie = list.find(cookie => cookie.trim().startsWith('csrftoken='));
        let res = await fetch(authBaseUrl+'/accounts/login/',{method:"post",body:JSON.stringify(data),headers:{'Cookie':request.headers.get('Cookie'),'Content-Type': 'application/json'}})
        let resData = await res.json()
        if (resData?.error){
            console.log(resData,'eeeeeee')
            return resData.error
        }
        // if there is no error.. rediredt to home page with the response headers from server which contains jwt cookies.
        return redirect("/",{
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
    return(
        <div>
            <Form method="post">
                <input type="email" name="email" placeholder="email@user.com" />
                <input type="password" name = "password" />
                {error && <>{error}</>}
                <button type="submit">Submit</button>
            </Form>
        </div>
    )
}