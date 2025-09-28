import { Link} from 'react-router-dom';
import { useEffect, useState} from 'react'
import { getTasksForProject, completeTask } from '../../api/tasks';   
import Button from '../Button'

export default function TaskList({projectId,onClick}) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

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
        }
        catch
        {
            alert("failed to mark complete");
        }
    }

    useEffect(()=>{loadTasks()},[projectId]);

    return (
        <>
            {loading ? <div>Loading...</div>:  tasks.length===0? "No tasks yet" : 
                <section className="pb-4 mb-4 ">
                     <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-stone-600 mb-2">
                            Tasks
                        </h1>
                        <Button onClick={onClick}>+ New Task</Button>
                    </div>
                <ul className="space-y-2">
                    {tasks.map(t => (
                        <li key={t.id} className={`p-3 border rounded ${t.status=="complete"?"bg-green-400":"bg-white"} hover:bg-stone-100`}>
                            <div className='flex'>
                                <Link to={`/projects/${projectId}/tasks/${t.id}`}>
                                <span className="font-semibold">{t.title}</span> - {t.status}                           
                                </Link>
                                <button style={{marginLeft: "auto"}} className={`px-4 ${t.status=="complete"?"bg-green-400 text-white hover:bg-stone-400":"bg-white text-black hover:bg-green-200"} rounded-md ml-1`} onClick={()=>markComplete(t.id)} disabled={t.status==="complete"}>complete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            }
        </>
    )
}