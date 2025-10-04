import { useNavigate } from "react-router-dom";

export default function FormModal({handleSubmit,formSubject, editData, children, error, onClose})
{
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md md:max-w-lg">
            <h3 className="font-bold mb-3">
                {editData ? `Edit ${formSubject}` : `New ${formSubject}`}
            </h3>
            {error && <div className="mb-2 text-sm text-red-500">{error}</div>}
            <div className="flex flex-col gap-3">
                {children} 
            </div>

            <menu className="flex items-center justify-end gap-4 my-4">
                <li><button type="button" onClick={onClose} className="text-stone-700 hover:text-black">Cancel</button></li>
                <li><button type="submit" className="px-6 py-2 bg-stone-800 text-stone-50 hover:bg-stone-950 rounded-lg">{editData? "Save":"Create"}</button></li>
            </menu>
        </form>
    </div>
    )
}