import {useParams, useNavigate} from 'react-router-dom'
import {useEffect, useState} from 'react';
import { getTask, deleteTask} from '../../api/tasks';
import TaskFormModal from './TaskFormModal'

export default function TaskView()
{
    const {projectId, taskId} = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [editing, setEditing] = useState(null);
    
    async function loadTask()
    {
        try {
            const response = await getTask(projectId, taskId);
            setTask(response);
        }
        catch
        {
            alert(err.response?.data?.detail || err.message || "failed to load task");
        }
    }

    async function handleDelete()
    {
        try {
            await deleteTask(taskId);
            navigate(`/projects/${task.project_id}`);
        }
        catch(err)
        {
            alert(err.response?.data?.detail || err.message ||"failed to delete task")
        }
    }

    useEffect(()=>{loadTask()},[taskId]);
    if(!task) return <p>Loading...</p>;

    return (
        <div className="p-6 bg-white rounded shadow">
            <div className="py-4">
                <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
                <p className="mb-4">{task.description}</p>
                <p>Status: {task.status}</p>
                <p>Priority: {task.priority}</p>
                <p>Assigned to: {task.assigned_to || "Unassigned"}</p>
            </div>
            <div className="flex-col gap-1">
                <button onClick={()=>setEditing(task)} className="px-4 py-2 bg-stone-950 text-white rounded-md hover:bg-stone-800" disabled={localStorage.getItem("role")=="user"}>
                    Edit
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 ml-1" disabled={localStorage.getItem("role")=="user"}>
                    Delete
                </button>
            </div>


             {editing && (
                <TaskFormModal
                    editData={editing}
                    projectId={projectId}
                    onClose={() => setEditing(null)}
                    onSaved={loadTask}
                    task={task}
                />
                )}
        </div>
        
    )
}