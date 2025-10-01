import {useState, useEffect} from 'react'
import { deleteProject, getProject } from '../../api/projects';
import TaskFormModal from '../task_components/TaskFormModal'
import {useNavigate, useParams} from 'react-router-dom'
import TaskList from '../task_components/TaskList'
import Button from '../Button';

{/* Separate the Tasks logic */}

export default function ProjectView()
{
    const {projectId} = useParams();
    const [reloadTasks, setReloadTasks] = useState(0);
    const navigate = useNavigate();
    const [showAdd, setShowAdd] = useState(false);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>
        {
            setLoading(true);
            async function loadProject()
            {
                try {
                    const data = await getProject(projectId);
                    console.log(data);
                    setProject(data);
                }
                catch(e) 
                {
                    aleft("Failed to load project");
                }
                finally
                {
                    setLoading(false);
                }
            }
            loadProject();
        },[projectId]);

    async function handleDelete()
    {
        if(!confirm("Delete task?")) return;
        try {
            await deleteProject(project.id);
            const num = localStorage.getItem("project_number");
            localStorage.setItem("project_number",num-1);
            navigate("/projects/")
        }
        catch(e)
        {
            alert("Failed to delete" + e.message);
        }
    }
    if(loading || !project)
        return <div className="w-full max-w-3xl mt-8 p-4 md:mt-16 md:p-6 flex-col">Loading...</div>
    return (
        <div className="w-full max-w-3xl mt-8 p-4 md:mt-16 md:p-6 flex-col">
            <header className="pb-4 mb-4 ">
                <div className="flex items-center justify-between">
                    <h1 className="text-5xl font-bold text-stone-600 mb-2">
                        {project.name}
                    </h1>
                    <Button onClick={handleDelete}>Delete</Button>
                </div>
                <div>
                    <p className="text-stone-600 whitespace-pre-wrap py-5">{project.description}</p>
                </div>
            </header>
            <hr style={{height: "2px", "backgroundColor": "#333"}}/>
            <br/>      
           <TaskList key={reloadTasks} projectId={project.id} onClick = {()=>setShowAdd(true)} reload={()=>setReloadTasks(reloadTasks+1)}/>
           {showAdd && (
                    <TaskFormModal
                    projectId={project.id}
                    onClose={() => setShowAdd(false)}
                    onSaved={() => {
                        setShowAdd(false);
                        setReloadTasks((x) => x + 1); 
                    }}
                    />
                )}
        </div>
    )
}