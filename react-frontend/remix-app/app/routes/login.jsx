import { Form, useActionData } from "@remix-run/react";
import { authBaseUrl } from "../constants/constants";
import {createCookie} from "@remix-run/node"
import { jwt_access } from "../cookies";

export const action = async ({request})=> {
    let data = Object.fromEntries(await request.formData())
    console.log(data,'data sent')
    try{
        let cookieHeader = request.headers.get('Cookie')
        let cookie = await (jwt_access.parse(cookieHeader)) || {};
        console.log(cookie,'aaaaaaaaaa')
        // let list = cookies.split(';')
        // const csrfCookie = list.find(cookie => cookie.trim().startsWith('csrftoken='));
        let res = await fetch(authBaseUrl+'/accounts/login/',{method:"post",body:JSON.stringify(data),headers:{'Cookie':request.headers.get('Cookie'),'Content-Type': 'application/json'}})
        console.log(await res.json(),'aaaa')
        return null
    }catch(e){
        console.log(e.request?.message,'dsdfd')
        console.log(e.response?.message,'ffff')
        console.log('fdsffdfgdg')
        return null
    }
}
export default function LoginRoute(){
    // let data = useActionData()
    // console.log('action data',data)
    return(
        <div>
            <Form method="post">
                <input type="text" name="email" placeholder="email@user.com" />
                <button type="submit">Submit</button>
            </Form>
        </div>
    )
}