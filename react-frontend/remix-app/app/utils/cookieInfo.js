import {remixEncode,user_cookie } from "../cookies"

export const getUserFromCookie = async(request)=>{
    let userCookie = await user_cookie.parse(request.headers.get('Cookie')) //remixEncode fn passed here
    if (userCookie == null){
        return null
    }
    return userCookie
}