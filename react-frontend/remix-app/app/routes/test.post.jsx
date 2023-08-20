import { Form, useLoaderData } from "@remix-run/react"

export const loader = async()=>{
    console.log('test post loader')
    return null
}

export function shouldRevalidate({
    actionResult,
    defaultShouldRevalidate,
  }) {
    return false
  }
export const action = async()=>{
    console.log(action)
    return {'data':'sdff','error':'error'}
}

export default function teste(){
    let data = useLoaderData()
    return(
        <>
         <Form method="post">
            <input type="text" />
            <button className="border-2 border-gray-600" type="submit">submit</button>
        </Form>
        </>
       
    )
}