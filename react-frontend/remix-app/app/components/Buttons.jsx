export function ButtonGray({children,onClick}){
    return (
        <div onClick={onClick} className=" inline-flex justify-center items-center px-3 py-2 ring-1 ring-inset ring-gray-300 rounded-md text-xs md:text-sm cursor-pointer hover:bg-gray-200">
            {children}
        </div>
    )
}

export function ButtonBlueSm({children,onClick}){
    return (
        <div onClick={onClick} className=" inline-flex justify-center items-center px-2 py-1 ring-1 ring-inset ring-blue-300 rounded-md text-xs md:text-sm cursor-pointer hover:bg-blue-200">
            {children}
        </div>
    )
}

export function ButtonRedSm({children,onClick}){
    return (
        <div onClick={onClick} className=" inline-flex justify-center items-center px-2 py-1 ring-1 ring-inset ring-red-300 rounded-md text-xs md:text-sm cursor-pointer hover:bg-red-200">
            {children}
        </div>
    )
}