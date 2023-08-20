import { createCookie } from "@remix-run/node";

export const jwt_access_cookie = createCookie("jwt_access",{
    path:"/",
    maxAge:300,
    sameSite:true,
    httpOnly:true,
    secure:false,
});

export const jwt_refresh_cookie = createCookie("jwt_refresh",{
    path:"/",
    maxAge:600,
    sameSite:true,
    httpOnly:true,
    secure:false,
});

export const user_cookie = createCookie("user",{
  path:"/",
  maxAge:900,
  sameSite:true,
  httpOnly:true,
  secure:false,
})


export const user_cookie_test = createCookie("user_test")

export function myUnescape(value) {
    let str = value.toString();
    let result = "";
    let index = 0;
    let chr, part;
    while (index < str.length) {
      chr = str.charAt(index++);
      if (chr === "%") {
        if (str.charAt(index) === "u") {
          part = str.slice(index + 1, index + 5);
          if (/^[\da-f]{4}$/i.exec(part)) {
            result += String.fromCharCode(parseInt(part, 16));
            index += 5;
            continue;
          }
        } else {
          part = str.slice(index, index + 2);
          if (/^[\da-f]{2}$/i.exec(part)) {
            result += String.fromCharCode(parseInt(part, 16));
            index += 2;
            continue;
          }
        }
      }
      result += chr;
    }
    return result;
  }


  export function remixEncode(value){
    // pass this fn as the value for decoded parameter if cookie is not set by remix
    return btoa(myUnescape(encodeURIComponent(JSON.stringify(value))))
  }