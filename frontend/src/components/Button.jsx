export default function Button({children, className = "", ...props})
{
    return <button className={`px-4 py-2 text-xs md:text-base rounded-md  w-full sm:w-auto bg-stone-900 text-stone-400 hover:bg-stone-700 hover:text-stone-100 ${className}`} {...props}>
        {children}
    </button>
}