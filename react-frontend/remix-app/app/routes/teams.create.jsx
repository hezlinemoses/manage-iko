import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
// route to create a team and inviting members.


export const loader = async({request})=> {
    console.log('loader fn')
    return null
}
export const action = async ({request})=>{
    try{
        let res = await fetch('http://project-service:8000/teams/create/',{
            method:"POST",
            body:{'test':'world'},
            headers:{
                'Cookie':request.headers.get('Cookie'),
                'Content-Type': 'application/json'
            }
        })
        if (res.status === 401 || res.status ===403){
            return redirect("/login?redirect=/teams/create")
        }
        let headers = res.headers
        let resData = await res.json()
        return json(resData,{headers:headers})
        
   }catch(err){
    console.log('error')
    return null
   }
}
export default function TeamCreate(){
    let data = useActionData()
    console.log(data,'action data inside comp')
    return (
        <div>
            <h2>Create Team</h2>
            <Form method="post">
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" />
                </div>
                <h3>Invite members</h3>
                <button type="submit">Submit</button>
            </Form>
        </div>
    )
}