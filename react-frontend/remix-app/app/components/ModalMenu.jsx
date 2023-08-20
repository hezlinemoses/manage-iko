import { useState } from "react"
export default function ModalMenu() {
    let [showMenu,setShowMenu] = useState(true)
    return(
        <>
        {
            showMenu && 
            <div className="flex flex-col absolute top-96">
              <div id="dropdownNavbar" className="z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                  <ul className="py-2 text-sm text-gray-700 " aria-labelledby="dropdownLargeButton">
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">Dashboard</a>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">Settings</a>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">Earnings</a>
                    </li>
                  </ul>
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                  </div>
              </div>

            </div>
        }
        </>
         
    )
}