'use client'

import { IconHammer, IconHome, IconSettings } from "@tabler/icons-react";
import { useState } from "react";


export default function Page() {

  const [ currentPage, setCurrentPage ] = useState<'home' | 'create' | 'setting'>('home');

  return (
    <section className="flex min-h-screen bg-gray-100">
        <aside className="bg-white p-5 rounded-r-xl ">
            <a className="btn btn-ghost text-xl font-black">STUDY BUDDY</a>

            <ul className="menu w-56 mt-10 space-y-2">
              <li onClick={() => setCurrentPage('home')}>
                <a className={`${currentPage === 'home' && "menu-active"}   `}>
                    <IconHome size={14}/>
                    Home
                </a>
              </li>
              <li onClick={() => setCurrentPage('create')}>
                <a className={`${currentPage === 'create' && "menu-active"}   `}>
                    <IconHammer size={14}/>
                    Create 
                </a>
              </li>
              <li onClick={() => setCurrentPage('setting')}>
                <a className={`${currentPage === 'setting' && "menu-active"}   `}>
                    <IconSettings size={14}/>
                    Settings 
                </a>
              </li>
            </ul>

        </aside>
        <section className="w-full">
            <nav className="navbar bg-base-100 shadowsm">
                <div className="flex-1">
                  <a className="btn btn-ghost text-xl"></a>
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS Navbar component"
                          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                      <li>
                        <a className="justify-between">Profile<span className="badge">New</span>
                        </a>
                      </li>
                      <li><a>Settings</a></li>
                      <li><a>Logout</a></li>
                    </ul>
                  </div>
                </div>
            </nav>
            <main className="p-5">
                {currentPage === 'home' && <Home />}
            </main>
        </section>
    </section>
  );
}

const Home = () => {
    return <h1>HOME</h1>
};
