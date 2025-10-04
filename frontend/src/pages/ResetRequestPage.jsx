import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestReset } from "../api/auth";
import Input from "../components/Input";

export default function ResetRequestPage() {
    const [email, setEmail] = useState("");
    const [error, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
    async function handleSubmit(e)
    {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try{
            await requestReset(email);
            console.log("oke");
            navigate("/reset/confirm");
        }
        catch(e)
        {
            setErr("Failed to request reset");
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="font-bold mb-3"> Password Reset </h3>
            {error && <div className="mb-2 text-sm text-red-500">{error}</div>}
            <div className="flex flex-col gap-3">
                <Input label = "Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required/>
            </div>

            <menu className="flex items-center justify-end gap-4 my-4">
                <li><button className="text-stone-700 hover:text-black" onClick={()=>navigate("/")} disabled={loading}>Cancel</button></li>
                <li><button type="submit" className="px-6 py-2 bg-stone-800 text-stone-50 hover:bg-stone-950 rounded-lg" disabled={loading}>{loading? "Wait": "Send reset token"}</button></li>
            </menu>
        </form>
    </div>
    )
}