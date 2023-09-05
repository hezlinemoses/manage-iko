

export const loader = async ({request})=>{
    if (!await checkJwtCookies(request)){
        return redirect("/login")
      }
}


export default function ProjectRoot(){
    return(
        <div>
            Todo
        </div>
    )
}