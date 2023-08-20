import {user_cookie,jwt_access_cookie,jwt_refresh_cookie} from "../cookies"
export const checkJwtCookies = async(request)=>{
    let cookieHeader = request.headers.get('Cookie')
    let jwtAccessCookie = await jwt_access_cookie.parse(cookieHeader)
    let jwtRefreshCookie = await jwt_refresh_cookie.parse(cookieHeader)

    if (jwtAccessCookie == null && jwtRefreshCookie == null){
        return new Promise((resolve,reject)=>{resolve(false)})
    }
    return new Promise((resolve,reject)=>{resolve(true)})
}

export const checkUserCookies = async(request)=>{
    let cookieHeader = request.headers.get('Cookie')
    let userCookie = await user_cookie.parse(cookieHeader)

    if (userCookie == null) {
        return new Promise((resolve, reject) => {
            resolve(false)
        })
    }

    return new Promise((resolve, reject) => {
        resolve(false)
    })
}



