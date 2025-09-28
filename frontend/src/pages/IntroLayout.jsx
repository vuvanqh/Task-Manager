import { Outlet, NavLink } from "react-router-dom";
import {useState} from "react"
import Logo from "../assets/no-projects.png";

export default function IntroLayout()
{
    const [login,setLogin] = useState(true);
    return(
        <div className="min-h-screen flex flex-col"> 
            <header className="bg-black text-white px-6 py-4 flex items-center justify-between" style={{height: "64px"}}>
                <div className="flex items-center gap-3">
                    <img src={Logo} alt="Noteboook" className="w-8 h-8 object-contain mx-auto"/>
                     <h2 className="text-3xl font-bold text-stone-300">Task Manager</h2>
                </div>

                <nav className="flex gap-4">
                    <NavLink to="/login" className={({isActive})=> isActive?"underline":null}>Login</NavLink>
                    <NavLink to="/register" className={({isActive})=> isActive?"underline":null}>Register</NavLink>
                </nav>
            </header>

            <main className="flex-1 bg-white p-8">
                <Outlet/>
            </main>
        </div>
    )
}