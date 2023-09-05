// route responsible for listing teams of requesting user. should have a filter for showing teams created by user.

import { isRouteErrorResponse, useLoaderData, useNavigate, useRouteError } from "@remix-run/react"
import stylesUrl from "../../styles/tailwind.css"
import Layout from "./layout"
import { projectGetRequest, responseHeaders } from "../../utils/api"
import { json, redirect } from "@remix-run/node"
import { ErrorBoundaryContent } from "../../utils/errorboundary"
import { checkJwtCookies } from "../../utils/cookieCheck"


export const links = () => {
    return[
        {
            rel : "stylesheet",
            href : stylesUrl,
        }, 

    ]
}

export const loader = async ({request}) =>{
        
        console.log("teams root loader")
        if (!await checkJwtCookies(request)){
            return redirect("/login?redirect=/teams/")
          }
        try {
            let res = await projectGetRequest("/teams/team_list/",request)
            if (res.status == 401){
                return redirect(`/login?redirect=/teams/`,)
            }
            let data = await res.json()
            return json(data,{headers: await responseHeaders(res.headers)})
            
        } catch (error) {
            console.log(error)
                throw json({'message':"Service down!!!"},{status:500});
            
        }
        

    
}

export default function Screen(){
    let {owned_teams} = useLoaderData()
    let {joined_teams} = useLoaderData()
    return(
        <div>
            {/* <h1>Team Management</h1>
            <h2>My Teams</h2>
            <button onClick={()=>navigate("create/")}>Create Team</button> */}
            <Layout ownedTeams={owned_teams} joinedTeams={joined_teams}/>

        </div>
    )
}


export function ErrorBoundary() {
    const error = useRouteError();
    return ErrorBoundaryContent(error)
}