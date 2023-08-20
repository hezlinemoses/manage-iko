import { Menu } from "@headlessui/react";
import { Outlet } from "@remix-run/react";

export default function Layout({ownedTeams,joinedTeams}){
    return(
        <>
            <SideBarMenu/>
            <SidebarMDplus/>
            <div className="p-4 sm:ml-64 min-h-screen">
                <div className="p-4 border-2 border-gray-200 rounded-lg min-h-screen ">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}

function SidebarMDplus({ownedTeams,joinedTeams}){
    return(
        <aside id="sidebar-multi-level-sidebar" className="fixed top-24 left-0 z-40 w-64 h-screen transition-transform translate-x-0 hidden sm:block" aria-label="Sidebar" aria-modal={true} role="modal">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group bg-gray-200 " aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                    <span className="flex-1 ml-3 text-left whitespace-nowrap">My Teams</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                </button>
                                <ul id="dropdown-example" className="py-2 space-y-2 h-48 overflow-y-auto">
                                    <li>
                                        <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Products</a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Billing</a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Invoice</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </aside>

    )
}


function SideBarMenu({ownedTeams,joinedTeams}){
    return(
        <Menu>
                <Menu.Button  className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ">
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </Menu.Button>
                
                <Menu.Items className="fixed top-24 left-0 z-40 w-64 h-screen sm:hidden">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <Menu.Item>
                                    <div>
                                        <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group bg-gray-200 ">
                                                <span className="flex-1 ml-3 text-left whitespace-nowrap">My Teams</span>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                                </svg>
                                        </button>
                                        <div className="py-2 space-y-2 h-48 overflow-y-auto flex flex-col">

                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Products</a>


                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Billing</a>


                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Invoice</a>


                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Products</a>


                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Billing</a>


                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Invoice</a>

                                        </div>
                                    </div>
                                </Menu.Item>
                            </li>
                            {/* joined teams */}
                            <li>
                                <Menu.Item>
                                    <div>
                                        <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group bg-gray-200 ">
                                                <span className="flex-1 ml-3 text-left whitespace-nowrap">Joined Teams</span>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                                </svg>
                                        </button>
                                        <div className="py-2 space-y-2 h-48 overflow-y-auto flex flex-col">

                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Products</a>


                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Billing</a>


                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Invoice</a>


                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Products</a>


                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Billing</a>


                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ">Invoice</a>

                                        </div>
                                    </div>
                                </Menu.Item>
                            </li>
                            
                        </ul>
                    </div>
                </Menu.Items>

            </Menu>
    )
}