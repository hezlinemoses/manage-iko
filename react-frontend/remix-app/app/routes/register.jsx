import stylesUrl from "../styles/tailwind.css"
import bgImg from "../assets/bg-img.png"
import { Form, useActionData } from "@remix-run/react"
import { authBaseUrl } from "../constants/constants";
import { redirect } from "react-router";


export const links = () => {
    return[
        {
            rel : "stylesheet",
            href : stylesUrl,
        }, 

    ]
}

export const action = async ({request}) => {
    console.log('innside action')
    let data = Object.fromEntries(await request.formData())
    try{
        let res = await fetch(authBaseUrl+"/accounts/register/",{method:"post",body:JSON.stringify(data),headers:{'Cookie':request.headers.get('Cookie'),'Content-Type':'application/json'}})
        console.log('res from server')
        resdata = await res.json()
        console.log(resdata)
        return redirect('/')
        
    }catch{
        return null
    }
    
}

export default function RegisterRoute(){
    let test = useActionData()
    console.log('action data',test)
    return(
        <div className="reg-container flex flex-col w-full h-screen items-center justify-center">
            
            <div className="flex w-full sm:w-2/3 p-2 sm:p-0 bg-slate-100 rounded-md shadow-md">
                <div className="font-serif w-screen h-screen hidden md:block bg-slate-100"> <img className="object-cover h-screen py-10" src={bgImg} alt="" /> </div>
                <div className="w-screen h-full md:w-screen md:h-1/2 pt-4" >
                    <h2 className="font-sans font-extrabold pl-10 mb-2">Register</h2>
                    <Form method="POST" className="w-full p-10 pt-0" >
                        <div className="mb-6">
                            <input type="text" name="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Username" required/>
                        </div> 
                        <div className="mb-6">
                            <input type="tel" name="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Phone" required/>
                        </div> 
                        <div className="mb-6">
                            <input type="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Email" required/>
                        </div> 
                        <div className="mb-6">
                            <input type="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Password" required/>
                        </div> 
                        <div className="mb-6">
                            <input type="password" name="password2" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Confirm Password" required/>
                        </div> 
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Submit</button>
                    <p className="mt-2 text-sm font-medium font-sans text-gray-500">Already have an account? <span className=" text-blue-500 cursor-pointer hover:text-blue-800">Sign in here</span> </p>
                    </Form>
                </div>
            </div>

        </div>
    )
}