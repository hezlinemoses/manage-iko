import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react"

export const loader = async () =>{
    console.log('test loader fn')
    return null
}

// export function shouldRevalidate({
//     actionResult,
//     defaultShouldRevalidate,
//   }) {
//     if(actionResult?.error === 'error'){
//         return true
//     }
//     return false
//   }

export default function (){
    let data = useLoaderData()
    let nav = useNavigate()
    return(
        <div>
            test root
            <button onClick={()=>nav("post")}>post</button>
            <Outlet/>
        </div>
    )
}