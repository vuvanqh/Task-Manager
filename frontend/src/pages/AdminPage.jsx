import {useEffect, useState} from 'react';
import TopNav from '../components/TopNav';
import client from "../api/client";

export default function AdminPage()
{
    const [users, setUsers] = useState([]);

    function handleLogout()
    {
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/")
    }

    async function load()
    {
        try {
            const response = await client.get("/admin/users");
            setUsers(response.data.users || []);
        }
        catch (e)
        {
            console.error("admin load failed",e);
        }
    }

    async function promote(id)
    {
        if(!confirm("Promote to manager?")) return;
        try {
            await client.post(`/admin/users/${id}/promote`);
            load();
        }
        catch(err)
        {
            alert(err.response?.data?.detail || err.message || "Failed");
        }
    }

    useEffect(()=>{load();},[]);

    return (
         <div className="min-h-screen flex flex-col">
            <TopNav user={{username: localStorage.getItem("username"), role: localStorage.getItem("role")}} onLogout={handleLogout}/>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Admin - Users</h2>
                <div className="space-y-2">
                    {users.map(u=>(
                        <div key={u.id} className="p-3 border rounded flex justify-between">
                            <div>
                                <div className="font-semibold">{u.username}</div>
                                <p className="text-xs opacity-70">•{u.email}</p>
                                <p className="text-xs opacity-70">•{u.role}</p>
                                <p className="text-xs opacity-70">•{u.id}</p>
                            </div>
                            <div>
                                {u.role==="user" && <button onClick={()=>promote(u.id)} className='px-3 py-1 bg-blue-400 text-stone-400 bg-stone-950 rounded'>Promote</button>}
                            </div>   
                        </div> 
                    )
                    )}
                </div>
            </div>
        </div>
    )
}