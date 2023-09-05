import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { projectGetRequest, projectPostRequest, responseHeaders } from "~/utils/api";

export const loader = async ({request})=>{
    let url = new URL(request.url);
    let team_mem_id = url.searchParams.get('team_mem_id')
    let team_name = url.searchParams.get('team_name')
    
    if (!await checkJwtCookies(request)){
        return redirect(`/login?redirect=/teams/invited?team_mem_id=${team_mem_id}`)
      }

    let res = await projectGetRequest(`/teams/check_invite_link/?team_member_id=${team_mem_id}`,request) 
    if (res.status == 401){
        return redirect(`/login?redirect=/teams/invited?team_mem_id=${team_mem_id}`,)
    }
    if (res.status === 400){
        return redirect("/teams/")
    }
    return json(team_name,{headers:await responseHeaders(res.headers)})
}

export const action = async ({request})=>{
    let formData = await request.formData()
    let body = JSON.stringify(Object.fromEntries(formData))
    // let {_action,...values} = Object.fromEntries(formData) no need of this since server will be handling it
    let res = await projectPostRequest("/teams/inv_accept_reject/",body,request)
    if (res.status == 401){
        return redirect("/login")
    }
    if (res.status === 400){
        return redirect("/teams/")
    }
    return null
}

export default function Screen() {

    let team_name = useLoaderData()
    let [searchParams,setSearchParams] = useSearchParams()
    let team_mem_id = searchParams.get('team_mem_id')
    return(
        <div id="popup-modal" tabIndex="-1" aria-modal="true" role="dialog" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-center flex">
    <div className="relative w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-xl border-2 border-gray-100">
            
            <div className="p-6 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 ">You've been invited to {team_name}</h3>
                <div className="flex items-center justify-center">
                    <Form method="post">
                        <input type="text" name="action" defaultValue="accept" hidden />
                        <input type="number" name="team_mem_id" hidden defaultValue={team_mem_id} />
                        <button data-modal-hide="popup-modal" type="submit"  className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Accept
                        </button>
                    </Form>
                    <Form method="post">
                        <input type="text" hidden name="action" defaultValue="reject" /> 
                        <input type="number" name="team_mem_id" hidden defaultValue={team_mem_id} />
                        <button data-modal-hide="popup-modal" type="submit" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 ">
                            Reject
                        </button>
                    </Form>
                </div>
                
            </div>
        </div>
    </div>
</div>
    )
}