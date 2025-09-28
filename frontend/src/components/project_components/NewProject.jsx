import {Form} from "react-router-dom";
import Input from "../Input";
//DEPRECATED
export default function NewProject()
{
    return <div className="w-[35rem] mt-16">
        <div>
            <Input label="Project Name" name="name" type="text" required/>
            <Input label="Description" name="description" isTextarea={true} rows={4}/>
        </div>
        <menu className="flex items-center justify-end gap-4 my-4">
            <li><button className="text-stone-700 hover:text-black">Cancel</button></li>
            <li><button className="px-6 py-2 bg-stone-800 text-stone-50 hover:bg-stone-950 rounded-lg">Save</button></li>
        </menu>
    </div>
}