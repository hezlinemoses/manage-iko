import stylesUrl from "../styles/tailwind.css"
import bgImg from "../assets/bg-img.png"
import { Form, Link, useActionData } from "@remix-run/react"
import { authBaseUrl } from "../constants/constants";
import { redirect } from "react-router";
import {signupSchema} from "../validator/signupValidate"
export const links = () => {
    return[
        {
            rel : "stylesheet",
            href : stylesUrl,
        }, 

    ]
}

export const loader = async({request}) =>{
    console.log(request.headers.get('Cookie'))
    try {
        let res = await fetch(authBaseUrl+"/accounts/checkloginstatus",{method:"get",headers:{'Cookie':request.headers.get('Cookie'),'Content-Type': 'application/json'}})
        if(res.status === 200){
            console.log('redirecting to home')
            console.log(res.headers.get('set-cookie'),'header from server')
            if(res.headers.get('set-cookie')!=null){
                return redirect("/",{
                    headers: res.headers,
                    })
            }
            return redirect("/")
        }
        return null
    } catch (error) {
        return null
    }
}

export const action = async ({request}) => {
    console.log('innside action')
    let data = Object.fromEntries(await request.formData())
    // validate data
    // try{
    //     let {err, val} = await signupSchema.validateAsync({
    //         username : data.username,
    //         email : data.email,
    //         phone : data.phone,
    //         password : data.password,
    //     })
    //     console.log(validate,'validated')
    //     return null
    // }catch(err){
    //     let errors = err.message.split('.')
    //     for (let x of err.details){
    //         console.log(x)
    //     }
    //     console.log(err.details[0].path[0])
    //     return null
    // }
    try{
        let res = await fetch(authBaseUrl+"/accounts/register/",{method:"post",body:JSON.stringify(data),headers:{'Cookie':request.headers.get('Cookie'),'Content-Type':'application/json'}})
        console.log('res from server')
        let resdata = await res.json()
        if(resdata?.errors){
            return resdata.errors
        }
        return redirect("/",{
            headers: res.headers,
            })
        
    }catch{
        return null
    }
    
}

export default function RegisterRoute(){
    let errors = useActionData()
    console.log('action data',errors)
    return(
        <div className="reg-container flex flex-col w-full h-screen items-center justify-center">
            
            <div className="flex w-full sm:w-2/3 p-2 sm:p-0 bg-slate-100 rounded-md shadow-md">
                <div className="font-serif w-screen h-screen hidden md:block bg-slate-100"> <img className="object-cover h-screen py-10" src={bgImg} alt="" /> </div>
                <div className="w-screen h-full md:w-screen md:h-1/2 pt-4" >
                    <h2 className="font-sans font-extrabold pl-10 mb-2">Register</h2>
                    <Form method="POST" className="w-full p-10 pt-0" >
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                            <input type="text" minLength={5} name="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Username" required/>
                            {errors?.username && <span className=" text-sm text-red-500" >{errors.username}</span>}
                        </div> 
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Phone</label>
                            <input type="tel" minLength={10} maxLength={10} name="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Phone" required/>
                            {errors?.phone && <span className=" text-sm text-red-500" >{errors.phone}</span>}
                        </div> 
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                            <input type="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Email" required/>
                            {errors?.email && <span className=" text-sm text-red-500" >{errors.email}</span>}
                        </div> 
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                            <input type="password" name="password" minLength={8} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Password" required/>
                            {errors?.password && <span className=" text-sm text-red-500" >{errors.password}</span>}
                        </div> 
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                            <input type="password" name="password2" minLength={8} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Confirm Password" required/>
                            {errors?.password2 && <span className=" text-sm text-red-500" >{errors.password2}</span>}
                        </div> 
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Submit</button>
                    <p className="mt-2 text-sm font-medium font-sans text-gray-500">Already have an account? {' '} 
                        <span className=" text-blue-500 cursor-pointer hover:text-blue-800">
                            <Link to={'/login'}>

                             Sign in here
                            </Link>
                        </span> 
                    </p>
                    </Form>
                </div>
            </div>

        </div>
    )
}