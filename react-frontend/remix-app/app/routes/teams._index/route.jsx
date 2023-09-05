import { checkJwtCookies } from "../../utils/cookieCheck"

export const loader = async({request})=>{
    if (!await checkJwtCookies(request)){
        return redirect("/login")
      }
      return null
}

export default function Screen() {
    return(
        <div className="p-4 text-gray-500 text-center font-semibold">
            Here you can create,delete and manage teams!!!!
        </div>
    )
}