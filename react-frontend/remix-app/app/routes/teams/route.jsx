// route responsible for listing teams of requesting user. should have a filter for showing teams created by user.

import { Outlet, useLoaderData, useNavigate } from "@remix-run/react"
import stylesUrl from "../../styles/tailwind.css"
import Layout from "./layout"
import { projectGetRequest, responseHeaders } from "../../utils/api"
import { json, redirect } from "@remix-run/node"


export const links = () => {
    return[
        {
            rel : "stylesheet",
            href : stylesUrl,
        }, 

    ]
}

export const loader = async ({request}) =>{
    let res = await projectGetRequest("/teams/team_list/",request)
    if (res.status == 401 || res.status==403){
        return redirect(`/login?redirect=/teams/`,)
    }
    let data = await res.json()
    console.log(data,'=======')
    return json(data,{headers: await responseHeaders(res.headers)})
}

export default function Screen(){
    let navigate = useNavigate()
    let {owned_teams} = useLoaderData()
    let {joined_teams} = useLoaderData()
    console.log(owned_teams,'--------',joined_teams)
    return(
        <div>
            {/* <h1>Team Management</h1>
            <h2>My Teams</h2>
            <button onClick={()=>navigate("create/")}>Create Team</button> */}
            <Layout ownedTeams={owned_teams} joinedTeams={joined_teams}/>

        </div>
    )
}