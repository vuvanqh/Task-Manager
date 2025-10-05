import {useEffect, useState} from "react"
import {getProjects} from "../api/projects"

import Button from "./Button"

export default function Sidebar({ selectedID, onSelect, canCreate = true, onCreateClick}) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [open, setOpen] = useState(false);
    async function load()
    {
        setLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
        }
        catch(e) {
            console.error(e);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {load()}, [onSelect]);
    const filtered = projects.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

    return <>
    <button
      className="md:hidden p-2 m-2 text-white bg-gray-800 rounded z-50 fixed top-4 left-4"
      onClick={() => setOpen(!open)}
    >
      ≡
    </button>
    <aside className={`w-1/3 px-8 py-16 bg-black text-stone-50 md:w-72 transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
        <h2 className="font-bold mb-8 uppercase md:text-xl text-stone-50">Your Projects</h2>
        <div>
            {canCreate && <Button onClick={onCreateClick}>+ New Project</Button>}
        </div>
        <input placeholder="Filter..."
               value={filter}
               onChange={(e)=>setFilter(e.target.value)}
               className="p-2 rounded text-black mt-2 mb-2 w-full"
        />
        <ul className="overflow-auto flex-1 space-y-2">
            {loading ? <div>Loading...</div>:
            filtered.map( p => (
                <li key={p.id} onClick={() => onSelect(p)} className={`p-2 rounded cursor-pointer hover:bg-stone-700 ${p.id === selectedID ? "bg-stone-600 font-bold": "hover:bg-stone-800"}`}>
                    <div className="font-semibold">{p.name}</div>
                </li>
            ))}
        </ul>
    </aside>
    </>
};