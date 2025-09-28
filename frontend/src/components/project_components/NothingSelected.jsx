
import NoProjectImage from "../../assets/no-projects.png"
import Button from "../Button";

export default function NothingSelected()
{
    return <div className="text-center w-2/3 flex flex-col items-center justify-center gap-4">
        <img src={NoProjectImage} alt="No Project Selected" className="w-16 h-16 object-contain mx-auto"/>
        <h2 className="text-3xl font-bold text-stone-600">No Project Selected</h2>
        <p className="text-stone-500 mb-4">Select a project from the sidebar or create a new one.</p>
        {/* <p className="mt-8">
            <Button>+ New Project</Button>
        </p> */}
    </div>
}