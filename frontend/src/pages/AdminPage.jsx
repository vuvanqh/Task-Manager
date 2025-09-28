import {useEffect, useState} from 'react';
import client from "../api/client";

export default function AdminPage()
{
    const [users, setUsers] = useState([]);

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
        catch
        {
            alert("Failed");
        }
    }

    useEffect(()=>{load();},[]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin - Users</h2>
            <div className="space-y-2">
                {users.map(u=>(
                    <div key={u.id} className="p-3 border rounded flex justify-between">
                        <div>
                            <div className="font-semibold">{u.username}</div>
                            <span className="text-xs opacity-70">•{u.email}</span>
                            <span className="text-xs opacity-70">•{u.role}</span>
                        </div>
                        <div>
                            {u.role==="user" && <button onClick={()=>promote(u.id)} className='px-3 py-1 bg-blue-400 text-stone-400 bg-stone-950 rounded'>Promote</button>}
                        </div>   
                    </div> 
                )
                )}
            </div>
        </div>
    )
}