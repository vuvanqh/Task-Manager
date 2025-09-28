import {useState} from "react";
import {confirmReset} from "../api/auth";
import {useNavigate} from "react-router-dom";
import Input from "../components/Input";

export default function ResetConfirmPage()
{
    const [form, setForm] = useState({
        token: "",
        new_password: "", 
        confirm: ""
    })
    const [error, setErr] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e)
    {
        e.preventDefault();
        setErr("");
        if(form.new_password!==form.confirm) {
            setErr("Paswords don't match");
            return;
        }
        try {
            await confirmReset(form.token, form.new_password);
            navigate("/login");
        }
        catch(e) {
            setErr(e?.message || "Failed");
        }
    }

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="font-bold mb-3"> Password Reset </h3>
        {error && <div className="mb-2 text-sm text-red-500">{error}</div>}
        <div className="flex flex-col gap-3">
            <Input label = "Token" value={form.token} onChange={e => setForm({...form, token: e.target.value})} placeholder="Token" type="text" required/>
            <Input label = "New Password" value={form.new_password} onChange={e => setForm({...form, new_password: e.target.value})} placeholder="New Password" min={6} type="password" required/>
            <Input label = "Confirm Password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} placeholder="Confirm Password" min={6} type="password" required/>
        </div>

        <menu className="flex items-center justify-end gap-4 my-4">
            <li><button className="text-stone-700 hover:text-black" onClick={()=>navigate("/")}>Cancel</button></li>
            <li><button type="submit" className="px-6 py-2 bg-stone-800 text-stone-50 hover:bg-stone-950 rounded-lg">Confirm</button></li>
        </menu>
    </form>
    </div>
    )
}