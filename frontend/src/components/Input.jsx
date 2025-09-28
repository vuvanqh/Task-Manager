
const classes = "w-full p-1 border-2 rounded-sm border-stone-300 bg-stone-200 text-stone-600 focus:outline-none focus:border-stone-500"
export default function Input({label,error,isTextarea = false,...props})
{
    return (
        <p className="flex flex-col gap-1 my-4">
            <label className="text-sm font-bold uppercase text-stone-400">{label}</label>
            {isTextarea? <textarea className={classes} {...props}></textarea> : <input className={classes} {...props}/>}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </p>
    )
}