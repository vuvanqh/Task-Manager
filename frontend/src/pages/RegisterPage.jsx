import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {register} from '../api/auth'
import Input from '../components/Input'
export default function RegisterPage()
{
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        if(form.password!==form.confirmPassword) 
        {
            setError("Passwords don't match")
            setLoading(false);
            return;
        }

        try {
            await register({
                username: form.username,
                email: form.email,
                password: form.password
            })

            navigate("/login")
        }
        catch(err)
        {
            setError(err.message || "Failed to register");
        }
        finally
        {
            setLoading(false);
        }
    }

     return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="font-bold mb-3">
                Register Page    
            </h3>
            {error && <div className="mb-2 text-sm text-red-500">{error}</div>}
            <div className="flex flex-col gap-3">
                <Input label = "Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="Username" required/>
                <Input label = "Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" type="email" required/>
                <Input label = "Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" type="password"/>
                <Input label = "Confirm Password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} placeholder="Confirm Password" type="password"/>
            </div>

            <menu className="flex items-center justify-end gap-4 my-4">
                <li><button className="text-stone-700 hover:text-black" onClick={()=>navigate("/")}>Cancel</button></li>
                <li><button type="submit" className="px-6 py-2 bg-stone-800 text-stone-50 hover:bg-stone-950 rounded-lg" disabled={loading}>{loading?"Wait":"Register"}</button></li>
            </menu>
        </form>
    </div>
    )
}