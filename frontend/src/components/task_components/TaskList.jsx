import { Link} from 'react-router-dom';
import { useEffect, useState} from 'react'
import { getTasksForProject, completeTask } from '../../api/tasks';   
import Button from '../Button'

export default function TaskList({projectId,onClick,reload}) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");

    async function loadTasks() 
    {
        setLoading(true);
        try {
            const t = await getTasksForProject(projectId);
            setTasks(t);
        }
        catch
        {
            alert("failed to load tasks");
        }
        finally
        {
            setLoading(false);
        }
    }
    async function markComplete(id)
    {
        try {
            await completeTask(id);
            reload();   
        }
        catch
        {
            alert("failed to mark complete");
        }
    }

    useEffect(()=>{loadTasks()},[projectId]);
    const filtered = tasks.filter( task => task.title.includes(filter));
    return (
        <>
         <section className="pb-4 mb-4 ">
            <div className="flex items-center justify-between py-4">
                <h1 className="text-2xl font-bold text-stone-600 mb-2">
                    Tasks
                </h1>
                
                <Button onClick={onClick}>+ New Task</Button>
            </div>
            <input value={filter} placeholder='Filter...' className="w-full p-1 mb-4 border-2 rounded-sm border-stone-300 bg-stone-200 text-stone-600 focus:outline-none focus:border-stone-500" onChange={ (e) => setFilter(e.target.value)}/>
                {loading ? <div>Loading...</div>:  tasks.length===0? <div>No tasks yet</div> : 
                <table className="min-w-full">
                    <ul className="space-y-2">
                        {filtered.map(t => (
                            <li key={t.id} className={`p-3 border rounded ${t.status=="completed"?"bg-green-400 hover:bg-green-300":"bg-white hover:bg-stone-100"}`}>
                                <div className='flex'>
                                    <Link to={`/projects/${projectId}/tasks/${t.id}`}>
                                    <span className="font-semibold">{t.title}</span> - {t.status}                           
                                    </Link>
                                    <button style={{marginLeft: "auto"}} className={`px-4 ${t.status=="completed"?"bg-green-400 text-white hover:bg-stone-400":"bg-white text-black hover:bg-green-200"} rounded-md ml-1`} onClick={()=>markComplete(t.id)} disabled={t.status==="completed"}>complete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </table>
                }
         </section>
        </>
    )
}