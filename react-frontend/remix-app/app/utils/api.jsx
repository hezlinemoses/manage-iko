import { authBaseUrl, projectBaseUrl } from "../constants/constants";
import { jwt_access_cookie, jwt_refresh_cookie, user_cookie } from "../cookies";

export async function authGetRequest(url,request) {
    return await fetch(authBaseUrl+url,{method:"GET",headers : await requestHeaders(request)}) 
}

export async function authPostRequest(url,json_str_body,request){
    return await fetch(authBaseUrl+url,{method:"POST",body:json_str_body,headers : await requestHeaders(request)})
}

export async function projectGetRequest(url,request){
    return await fetch(projectBaseUrl+url,{method:"GET",headers : await requestHeaders(request)})
}

export async function projectPostRequest(url,json_str_body,request){
    return await fetch(projectBaseUrl+url,{method:"POST",body:json_str_body,headers : await requestHeaders(request)})
}


async function requestHeaders(request){
    // collect them cookies from current request and parse cookie values. returns a plain obj
    let cookieHeader = request.headers.get('Cookie')
    let jwtAccessToken = (await jwt_access_cookie.parse(cookieHeader)) || false;
    let jwtRefreshToken = (await jwt_refresh_cookie.parse(cookieHeader)) || false;
    return {'Content-Type': 'application/json','X-Jwt-Access':jwtAccessToken,'X-Jwt-Refresh':jwtRefreshToken}
  }

export async function responseHeaders(resHeaders){
    //
    let headers = new Headers()
    let jwtAccess = resHeaders.get('set-jwt-access')
    let jwtRefresh = resHeaders.get('set-jwt-refresh')
    let user = JSON.parse(resHeaders.get('set-user'))
    if (jwtAccess !== null){
        headers.append('Set-Cookie',await jwt_access_cookie.serialize(jwtAccess))
    }
    if (jwtRefresh !== null){
        headers.append('Set-Cookie',await jwt_refresh_cookie.serialize(jwtRefresh))
    }
    if (user !== null){
        headers.append('Set-Cookie',await user_cookie.serialize(user))
    }
    return new Promise((resolve)=>resolve(headers)) //cuz i dont wanna forget to awaittttttttttttttt!
}