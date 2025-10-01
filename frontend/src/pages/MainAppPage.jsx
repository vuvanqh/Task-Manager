import {Outlet, useNavigate} from 'react-router-dom';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import ProjectView from '../components/project_components/ProjectView';
import ProjectFormModal from '../components/project_components/ProjectFormModal';
import AdminPage from './AdminPage'
import NothingSelected from '../components/project_components/NothingSelected';
import {useState} from 'react'

export default function MainAppPage({auth})
{
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [reload,setTick] = useState(0);
    const navigate = useNavigate()

    function handleLogout()
    {
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate("/")
    }

    return (
        <div className="min-h-screen flex flex-col" key={reload}>
            <TopNav user={{username: localStorage.getItem("username"), role: localStorage.getItem("role")}} onLogout={handleLogout}/>
            <div className="flex flex-1">
                <Sidebar selectedID={selectedProject?.id}
                         onSelect={ p => {setSelectedProject(p); navigate(`/projects/${p.id}`)}}
                         canCreate={localStorage.getItem("role")==="manager" || localStorage.getItem("role")==="admin"}
                         onCreateClick={() => setShowProjectModal(true)} />
                <main className="flex-1 bg-stone-50 p-6">
                   <Outlet/>
                </main>
            </div>

            {showProjectModal && <ProjectFormModal onClose={() => setShowProjectModal(false)} onSaved={()=>window.location.reload()}/>}
        </div>
    )
}