import { createCookie } from "@remix-run/node";

export const jwt_access = createCookie("jwt_access",{
    path:"/",
    maxAge:300,
    sameSite:true,
    httpOnly:true,
    secure:false,
});