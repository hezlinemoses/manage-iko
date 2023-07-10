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