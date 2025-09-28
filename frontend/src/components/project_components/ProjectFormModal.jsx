import {useState} from "react"
import Button from "../Button"
import {createProject, editProject} from "../../api/projects"
import FormModal from "../FormModal";
import Input from "../Input";

export default function ProjectFormModal({onClose, onSaved, editData})
{
    const [name, setName] = useState(editData?.name || "");
    const [description, setDescription] = useState(editData?.description || "");
    const [error, setError] = useState(""); 

    async function handleSubmit(e)
    {
        e.preventDefault();
        setError("");
        try {
            if(editData) {
                await editProject(editData.id, {name, description});
            }
            else {
                await createProject({name, description});
            }
            onSaved();
            onClose();
        }
        catch(e) {
            setError(e?.response?.data?.detail || e.message || "ERROR");
        }
    }

    return(
        <FormModal handleSubmit={handleSubmit}
                   formSubject="Project"
                   editData={editData}
                   onClose={onClose}>
            <Input label = "Project Title" value={name} onChange={e => setName(e.target.value)} placeholder="Project Name" required/>
            <Input label = "Project Description" value={description} onChange={ e => setDescription(e.target.value)} placeholder="Project Description" rows={4} isTextarea={true}/>
       </FormModal>
    )
}