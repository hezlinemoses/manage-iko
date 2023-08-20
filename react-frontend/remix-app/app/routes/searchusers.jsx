import { json } from "@remix-run/node"
import {authBaseUrl} from "../constants/constants"

export const loader = async({request})=>{
    let url = new URL(request.url)
    let searchQ = url.searchParams.get("q")
    try {
        let res = await fetch(authBaseUrl+`/accounts/userlist?search=${searchQ}`)
        return json(await res.json(),{headers:res.headers})
    } catch (error) {
        return null
    }
}