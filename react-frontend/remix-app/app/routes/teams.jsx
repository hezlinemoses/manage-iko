// route responsible for listing teams of requesting user. should have a filter for showing teams created by user.

import { Outlet, useLoaderData } from "@remix-run/react"

export const loader = async ({request}) =>{
    return "hello"
}

export default function Teams(){
    let data = useLoaderData()
    console.log(data)
    return(
        <div>
            <h1>Team Management</h1>
            <Outlet/>
        </div>
    )
}