import { Form, Link, NavLink } from "@remix-run/react";
import ModalMenu from "./ModalMenu";
import {DropDownNavLink, MyLink, MyNavLink} from "./Links";
import { UpArrow } from "./Arrows";
import { useState } from "react";
import { Menu, Transition } from '@headlessui/react'
import { Fragment} from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function NavBar({user}) {
    return(
        <>
            <div className="navbar fixed top-0 flex bg-opacity-80 bg-slate-100 justify-between items-center w-full h-24 border border-b-gray-200 px-10 lg:px-32 z-10">
                <div className=" font-sans font-extrabold shadow-inner shadow-gray-300 text-gray-700 text-2xl lg:text-4xl">
                    <Link to={"/"}><span className="text-slate-600">MANAGE-IKO</span></Link>
                </div>
                <div className="menu-login-link flex text-gray-700">
                    {user !== null ? <NavNav user={user}/> : <MyLink to={"/login"}>Login</MyLink> }
                    {/* <ModalMenu/> */}
                    
                    
                </div>
            </div>
            <div className="navbar-blur blur-mobile fixed top-0 h-24 w-full z-9 backdrop-blur-sm bg-transparent"></div> 
        </>
        
        
    )
}



function NavNav ({user}){
    return(
        <div className="flex items-center space-x-2">
            <MyNavLink className="hidden md:block" to={"/projects"}>Projects</MyNavLink>
            <MyNavLink className="hidden md:block" to={"/teams"}>Teams</MyNavLink>
            {/* <NavDropDown user={user}/> */}
            <DropDownMenu user={user}/>
        </div>
    )
}



function DropDownMenu({user}) {

  let menuItemClass = "flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 "
  let activeClass = "bg-gray-100 text-gray-900"


    return (
      <div className="">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ring-opacity-95 hover:bg-gray-50">
              {user.username}
              <ChevronDownIcon
                className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 md:hidden">
                <Menu.Item>
                  <NavLink to={"/projects"} className={({isActive})=>isActive ? menuItemClass+activeClass : menuItemClass}>Projects</NavLink>
                </Menu.Item>

                <Menu.Item>
                  <NavLink to={"/teams"} className={({isActive})=>isActive ? menuItemClass+activeClass : menuItemClass}>Teams</NavLink>
                </Menu.Item>
              </div>
              
              <div className="py-1">
                <Menu.Item>
                  <Form method="post">

                  <button type="submit" name="_action" value="logout" className={menuItemClass} >Logout</button>
                  </Form>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    )
  }
  