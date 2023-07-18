import { json } from "@remix-run/node"
import { useNavigate } from "@remix-run/react"

export const loader = async ()=>{
    // loader function to fetch list of teams from backend
    console.log('index team')
    return null
}

export default function TeamsIndex() {
    // should return the list of teams a user has with an option to filter teams created by user.
    let navigate = useNavigate()
    return (
        <div>
            <h2>My Teams</h2>
            <button onClick={()=>navigate("create/")}>Create Team</button>
            
        </div>
    )
}