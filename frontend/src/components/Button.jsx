export default function Button({children, className = "", ...props})
{
    return <button className={`px-4 py-2 max-w-md md:max-w-lg text-xs md:text-base rounded-md sm:max-w-lg bg-stone-900 text-stone-400 hover:bg-stone-700 hover:text-stone-100 ${className}`} {...props}>
        {children}
    </button>
}