import { useState } from "react"
import Button from "../Button"
import Input from "../Input"
import { createTask, editTask } from "../../api/tasks"   
import FormModal from "../FormModal"

export default function TaskFormModal({onClose, onSaved, projectId, editData,task})
{
    const [title, setTitle] = useState(editData?.title || ""); 
    const [description, setDescription] = useState(editData?.description || "");
    const [priority, setPriority] = useState(editData?.priority || 1);
    const [error, setError] = useState("");
    const [assignedTo, setAssignedTo] = useState(task?.assigned_to);
    async function handleSubmit(e)
    {
        e.preventDefault();
        setError("");
        if(!title.trim()) {
            setError("Title is required");
            return;
        }

        try {
            if(editData) {  
                await editTask(editData.id, {title, description, priority, assigned_to: assignedTo});
            }
            else {
                await createTask({title, description, priority, project_id: projectId,assigned_to: assignedTo });
            }
            onSaved();
            onClose();  
        } catch(e) {
            setError(e?.response?.data?.detail || e.message || "ERROR");
        }
    }

    return (
        <FormModal formSubject="Task"
                    handleSubmit={handleSubmit}
                    editData={editData}
                    onClose={onClose}>
            <Input label = "Task Title" value={title} onChange={ e => setTitle(e.target.value)} placeholder="Task Title" required/>
            <Input label = "Task Description" value={description} onChange={ e => setDescription(e.target.value)} placeholder="Task Description" rows={4} isTextarea={true}/>
            <Input label = "Task Priority" type="number" value={priority} onChange={e => setPriority(e.target.value)} min={1} max={5}/>
            <Input label = "Assigned To" type="number" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} placeholder="User Id" min={1} max={5}/>
        </FormModal>
    )
}