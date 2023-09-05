import { useLoaderData, useNavigate, useRouteError } from "@remix-run/react"
import { projectGetRequest, responseHeaders } from "../../utils/api"
import { json, redirect } from "@remix-run/node"
import { ErrorBoundaryContent } from "../../utils/errorboundary"
import { checkJwtCookies } from "../../utils/cookieCheck"
import { ButtonBlueSm, ButtonRedSm } from "../../components/Buttons"

export const loader = async ({request,params})=>{
    
    console.log("team detail loader --------->",params.teamId)
    if (!await checkJwtCookies(request)){
        return redirect(`/login?redirect=/teams/${params.teamId}`)
      }
    try {
        let res = await projectGetRequest(`/teams/${params.teamId}`,request)
        if(res.status == 401){
            return redirect(`/login?redirect=/teams/${params.teamId}`)
        }
        if (res.status === 400){
            return redirect("/teams/")
        }
        let data = await res.json()
        // data.owner.role = "Owner"
        return json(data,{headers:responseHeaders(res.headers)})
    } catch (error) {
        throw json({'message':"Service down!"},{status:500})
    }
}

export default function Screen() {
    let {members} = useLoaderData()
    let {owner} = useLoaderData()
    let {current_role} = useLoaderData()
    console.log(owner,'--',current_role)
    return(
        // 
        <div className="md:p-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Username
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            {current_role =="owner" || current_role == 'staff' ? 
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                                :
                                ""
                            }
                            
                        </tr>
                    </thead>
                    <tbody>
                        <TableRow member={owner} currentUserRole={current_role} />
                        {members != "" && members.filter(member=>!member.is_admin).map(member=><TableRow key={member.id} member={member} currentUserRole={current_role}/>)}
                        {/* <tr className="bg-white border-b hover:bg-gray-50 ">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Apple MacBook Pro 17"
                            </th>
                            <td className="px-6 py-4">
                                Silver
                            </td>
                            <td className="px-6 py-4">
                                Laptop
                            </td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
        </div>
    )
}



export function ErrorBoundary() {
    const error = useRouteError();
    return ErrorBoundaryContent(error)
}

function TableRow({member,currentUserRole}){
    // disable actions for normal members
    let navigate = useNavigate();
    let actions_elmt = <td className="px-6 py-4 flex gap-2"><ButtonBlueSm>Change role</ButtonBlueSm><ButtonRedSm>Delete</ButtonRedSm></td>
    function onClickNav(){
        
    }
    return(
        <tr className="bg-white border-b hover:bg-gray-50 ">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {member.username}
            </th>
            <td className="px-6 py-4">
                {member?.role == "owner" ? "Owner" : member.is_admin ? "Staff" : "Member"}
            </td>

            {currentUserRole =="owner" || currentUserRole == 'staff' ? member.role !== 'owner' ? actions_elmt : "" : "" }
            
        </tr>
    )
}