import {Outlet, useNavigate} from 'react-router-dom';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import ProjectFormModal from '../components/project_components/ProjectFormModal';
import {useEffect, useState} from 'react'

export default function MainAppPage({auth})
{
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [reload,setReload] = useState(0);
    const navigate = useNavigate()

    function handleLogout()
    {
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/")
    }
    useEffect(()=>setReload(reload+1),[]);
    return (
        <div className="min-h-screen flex flex-col">
            <TopNav user={{username: localStorage.getItem("username"), role: localStorage.getItem("role")}} onLogout={handleLogout}/>
            <div className="flex flex-1 overflow-hidden">
                    <Sidebar selectedID={selectedProject?.id}
                            onSelect={ p => {setSelectedProject(p); navigate(`/projects/${p.id}`)}}
                            canCreate={localStorage.getItem("role")==="manager" || localStorage.getItem("role")==="admin"}
                            onCreateClick={() => setShowProjectModal(true)} 
                            key={reload}/>
                <main className="flex-1 bg-stone-50 p-4 sm:p-6 md:p-8 overflow-auto">
                   <Outlet/>
                </main>
            </div>

            {showProjectModal && <ProjectFormModal onClose={() => setShowProjectModal(false)} onSaved={()=>setReload(reload+1)}/>}
        </div>
    )
}