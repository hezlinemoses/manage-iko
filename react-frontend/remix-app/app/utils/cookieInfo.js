import {remixEncode,user_cookie } from "../cookies"

export const getUserFromCookie = async(request)=>{
return await user_cookie.parse(request.headers.get('Cookie'))//remixEncode fn passed here, not anymore as this is a cookie set by remix.
}