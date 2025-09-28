import {Link} from "react-router-dom";
import Logo from "../assets/no-projects.png";
import Button from "./Button";

export default function TopNav({user, onLogout})
{
    return (
        <header className ="bg-black text-stone-50 flex items-center justify-between px-6"
                style={{height: "64px"}}>
            <div className="flex items-center gap-3">
                <img src={Logo} alt="Logo" className="h-10 w-10 object-contain"/>
                <div className="text-lg font-bold">Task Manager</div>
            </div>

            <nav className="flex items-center gap-6">
                <Link to="/projects" className="hover:underline">
                    Projects
                </Link>
                {user?.role ==="admin" && <Link to="/admin" className="hover:underline">
                    Admin
                </Link>}
                <div className="text-sm opacity-80">{user?.username}</div>
                <Button onClick={onLogout}>Logout</Button> 
            </nav>
        </header>
    )
}