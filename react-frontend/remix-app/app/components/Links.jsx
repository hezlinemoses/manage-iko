import { Link, NavLink } from "@remix-run/react";
import { forwardRef } from "react";

export function MyLink({to,children,className}){
    let defaultClass = " text-gray-900 text-sm font-semibold hover:underline text-center hover:shadow-lg"
    return (
        <Link to={to} className={className + defaultClass}>{children}</Link> 
    )
}

export function MyNavLink({to,children,className}){
    let defaultClass = " text-gray-900 text-sm font-semibold hover:underline text-center hover:shadow-lg "
    return(
        <NavLink to={to} className={({isActive,isPending})=> isPending ? className+defaultClass : isActive ? className+defaultClass + " underline shadow-lg" : className+defaultClass }>{children}</NavLink>
    )
}

export let DropDownNavLink = forwardRef(({to,children},ref)=>{
    let className = "flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 "
    return(
        <NavLink to={to} ref={ref} className={({isActive,isPending})=>isActive ? className +"bg-gray-100 text-gray-900 " : className+"text-gray-700"}>{children}</NavLink>
    )
});
