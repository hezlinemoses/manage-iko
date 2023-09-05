import { Menu } from "@headlessui/react";
import { NavLink, Outlet, useNavigate } from "@remix-run/react";
import { ButtonGray } from "../../components/Buttons";

export default function Layout({ownedTeams,joinedTeams}){
    let navigate = useNavigate()
    function handleCreateButtonClick(){
        navigate("/teams/create")
    }
    return(
        <>
            <SideBarMenu ownedTeams={ownedTeams} joinedTeams={joinedTeams}/>
            <SidebarMDplus ownedTeams={ownedTeams} joinedTeams={joinedTeams}/>
            <div className="p-4 md:ml-64 min-h-fit">
                <div className="flex mb-3 justify-between">
                    <h4 className=" font-sans font-semibold text-xl text-gray-700 ">Team Management</h4>
                    <ButtonGray onClick={handleCreateButtonClick}>Create Team</ButtonGray>
                </div>
                <div className="p-4 border-2 border-gray-200 rounded-lg min-h-fit ">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}

function SidebarMDplus({ownedTeams,joinedTeams}){
    let defaultClassName = "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 "
    let activeClass = "bg-gray-200"
    return(
        <aside id="sidebar-multi-level-sidebar" className="fixed top-24 lg:left-32 left-0 z-40 w-64 h-screen transition-transform translate-x-0 hidden md:block" aria-label="Sidebar" aria-modal={true} role="modal">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group bg-gray-300 " aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                    <span className="flex-1 ml-3 text-left whitespace-nowrap">My Teams</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                </button>
                                <div id="dropdown-example" className="py-2 space-y-2 h-48 overflow-y-auto">
                                        {ownedTeams.map(
                                            team=>
                                            <NavLink key={team.id} to={`/teams/${team.id}`} prefetch="intent" className={({isActive})=> isActive ? defaultClassName+activeClass : defaultClassName} >{team.name}</NavLink>
                                        )}
                                </div>
                            </li>
                            {/* joined teams */}
                            <li>
                                <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group bg-gray-300 " aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                    <span className="flex-1 ml-3 text-left whitespace-nowrap">Joined Teams</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                </button>
                                <div id="dropdown-example" className="py-2 space-y-2 h-48 overflow-y-auto">
                                        {joinedTeams.map(
                                            team=>
                                            <NavLink key={team.team.id} to={`/teams/${team.team.id}`} prefetch="intent" className={({isActive})=> isActive ? defaultClassName+activeClass : defaultClassName} >{team.team.name}</NavLink>
                                        )}
                                </div>
                            </li>
                        </ul>
                    </div>
                </aside>

    )
}


function SideBarMenu({ownedTeams,joinedTeams}){
    let defaultClassName = "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 "
    let activeClass = "bg-gray-200"
    return(
        <Menu>
                <Menu.Button  className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ">
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </Menu.Button>
                
                <Menu.Items className="fixed top-24 left-0 z-40 w-64 h-screen md:hidden">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <Menu.Item>
                                    <div>
                                        <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group bg-gray-300 ">
                                                <span className="flex-1 ml-3 text-left whitespace-nowrap">My Teams</span>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                                </svg>
                                        </button>
                                        <div className="py-2 space-y-2 h-48 overflow-y-auto flex flex-col">

                                        {ownedTeams.map(
                                            team=>
                                            <NavLink key={team.id} to={`/teams/${team.id}`} prefetch="intent" className={({isActive})=> isActive ? defaultClassName+activeClass : defaultClassName} >{team.name}</NavLink>
                                        )}

                                        </div>
                                    </div>
                                </Menu.Item>
                            </li>
                            {/* joined teams */}
                            <li>
                                <Menu.Item>
                                    <div>
                                        <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group bg-gray-300 ">
                                                <span className="flex-1 ml-3 text-left whitespace-nowrap">Joined Teams</span>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                                </svg>
                                        </button>
                                        <div className="py-2 space-y-2 h-48 overflow-y-auto flex flex-col">

                                        {joinedTeams.map(
                                            team=>
                                            <NavLink key={team.team.id} to={`/teams/${team.team.id}`} prefetch="intent" className={({isActive})=> isActive ? defaultClassName+activeClass : defaultClassName} >{team.team.name}</NavLink>
                                        )}
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