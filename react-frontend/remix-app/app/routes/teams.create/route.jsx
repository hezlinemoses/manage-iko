import {json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
// route to create a team and inviting members.
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import { authGetRequest, projectPostRequest, responseHeaders } from "~/utils/api";
import { checkJwtCookies } from "../../utils/cookieCheck";
import { user_cookie } from "../../cookies";


export const loader = async({request})=> {
  if (!await checkJwtCookies(request)){
    return redirect("/login?redirect=/teams/create/")
  }
    let user = await user_cookie.parse(request.headers.get('Cookie'))
    let url = new URL(request.url)
    let searchQ = url.searchParams.get("q")
    if(searchQ){
      try {
        let res = await authGetRequest(`/accounts/userlist/?search=${searchQ}`,request)
        if (res.status == 401){
          return redirect("/login?redirect=/teams/create")
        }
        let data = await res.json()
        data.currentUserId=user.id
        return json(data,{headers:await responseHeaders(res.headers)})

      } catch (error) {
        return redirect("/login?redirect=/teams/create")
      }
    }
    return {users:[],currentUser:user.id}
}
export const action = async ({request})=>{
    console.log('action function create team')
    let data = Object.fromEntries(await request.formData())
    try{
        let res = await projectPostRequest('/teams/create/',JSON.stringify(data),request) 
        if (res.status === 401){
            return redirect("/login?redirect=/teams/create")
        }
        let resData = await res.json()
        if (res.status === 400){
          return json(resData,{headers:await responseHeaders(res.headers)})
        }
        return redirect(`/teams/${resData.team_id}/`) // this should be a redirect to team detail
        
   }catch(err){
    console.log('error',err)
    return null
   }
}
export default function Screen(){
    let actionData = useActionData()
    let {users} = useLoaderData()
    let {currentUserId} = useLoaderData()
    let filteredUsers = []
    if(users.length >0){
      filteredUsers = users.filter((user)=>user.id != currentUserId)
    }
    let [selected,setSelected] = useState(new Map())
    let [searchQ,setSearchQ] = useState("")
    let submit = useSubmit()
    let navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault()
        let formData = new FormData(e.target)
        formData.append("user_ids",Array.from(selected.keys()))
        submit(formData,{method:"POST"})
    }
    let handleAutocompleteChange = (event, newValue, reason) => {
      let newMap = new Map(newValue.map((item)=>[item.id,item.username]))
        setSelected(newMap);
      };
    let handleTextChange = (event) => {

        setSearchQ(event.target.value)
      
    }
    let handleSearch = ()=>{
      if(searchQ){
        submit({ q: searchQ },{method:"get",replace:true})
      }
      
    }

    function closeModel() {
      navigate("/teams")
    }
    return (
        <div>

            {/* <!-- Main modal --> */}
            <div id="staticModal" data-modal-backdrop="static" tabIndex="-1" className="top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-center flex" aria-modal="true" role="dialog">
                <div className="relative w-full max-w-2xl max-h-full">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white rounded-lg shadow-xl border border-slate-200">
                        {/* <!-- Modal header --> */}
                        <div className="flex items-start justify-between p-4 border-b rounded-t ">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Create Team
                            </h3>
                            <button type="button" onClick={closeModel} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="staticModal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <div className="p-6 space-y-6">
                          {/* Place Form here */}
                            
                          <Form method="post" onSubmit={e=>handleSubmit(e)}>
                            <div className="relative z-0 w-full mb-6 group">
                                <input type="text" name="name" id="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Team name</label>
                                {actionData?.name && <p className=" text-sm text-red-600">{actionData.name}</p>}
                                {actionData?.error && <p className=" text-sm text-red-600">{actionData.error}</p>}
                            </div>
                            {/* <hr className="h-px my-8 bg-gray-200 border-0"></hr> */}
                            <h3 className=" text-lg font-semibold text-gray-700 mb-3">Invite members</h3>
                            <div className=" mb-4 flex">
                              <div className=" w-2/3">
                                <MemberSearchBox members={filteredUsers} textChange={handleTextChange} onSelect={handleAutocompleteChange} searched={searchQ} />
                              </div>
                            {/* <button type="button" onClick={handleSearch} className=" mb-3 px-3 py-2 text-xs font-medium text-center  text-black border border-blue-500 bg-white-300 rounded-lg hover:bg-slate-400 hover:border-transparent focus:ring-4 focus:outline-none focus:ring-blue-300">Search user</button> */}
                            <button type="button" onClick={handleSearch} className="p-2.5 ml-2 text-sm text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                              </svg>
                              <span className="sr-only">Search</span>
                            </button>
                            </div>
                            {/* <!-- Modal footer --> for this case we are placing it inside FORM component */ } 
                            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
                                <button data-modal-hide="staticModal" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Submit</button>
                                <button onClick={closeModel} data-modal-hide="staticModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">Cancel</button>
                            </div>
                        </Form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MemberSearchBox({members,onSelect,textChange,searched}){
  return (
    <Autocomplete
                multiple
                disableClearable={true}
                id="tags-standard"
                options={members}
                isOptionEqualToValue={(option,value)=>option.id === value.id}
                onChange={onSelect}
                inputValue={searched} //used to store searched value otherwise it will be cleeard on losing focus
                getOptionLabel={(option) => option.username}
                renderInput={(params) => (
                  <TextField
                  {...params}
                  variant="standard"
                  focused={true}
                  label="Members"
                  placeholder="Search user"
                  value={searched}
                  onChange={textChange}
                    />
                    )}
                />
  )
}

