import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {login} from '../api/auth'
import { jwtDecode } from "jwt-decode";
import Input from '../components/Input'

export default function LoginPage()
{
    const [form, setForm] = useState({
        username: "",
        password: "",
    })
    const [error,setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e)
    {
        e.preventDefault();
        setError("");
        if(!form.username || !form.password)
        {
            setError("All fields required");
            return;
        }
        try {
            const data = await login(form.username, form.password);
            const token = data.access_token;
            if(!token) throw Error("No token");
            localStorage.setItem("token",token);
            try {
                const payload = jwtDecode(token);
                if(payload?.role) localStorage.setItem("role",payload.role);
                if(payload?.username) localStorage.setItem("username",payload.username);
            }
            catch{}

            navigate("/projects",{replace:true});
        }
        catch(err){
            setError(err.response?.data?.detail || err.message || "Login Failed");
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="font-bold mb-3">
                Login
            </h3>
            {error && <div className="mb-2 text-sm text-red-500">{error}</div>}
            <div className="flex flex-col gap-3">
                <Input label = "Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="Username" required/>
                <Input label = "Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" type="password"/>
                <Link to="/reset">Forgot the password</Link>
            </div>

            <menu className="flex items-center justify-end gap-4 my-4">
                <li><button className="text-stone-700 hover:text-black" onClick={()=>navigate("/")}>Cancel</button></li>
                <li><button type="submit" className="px-6 py-2 bg-stone-800 text-stone-50 hover:bg-stone-950 rounded-lg">Login</button></li>
            </menu>
        </form>
    </div>
    )
}