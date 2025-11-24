import { Plus } from "lucide-react";

interface IFloatingActionButtonProps
{
    onClick: () => void;
}

export default function FloatingAddButton({onClick}: IFloatingActionButtonProps) 
{
    return (
        <div className="fixed bottom-12 right-4 z-10 mx-auto max-w-md sm:right-[calc(50%-11rem)]">
            <button 
            className="flex p-4 min-w-0 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-primary text-base font-bold leading-normal tracking-[0.015em] text-white shadow-primary/20 shadow-md"
            onClick={onClick}
            >
                <span><Plus /></span>
            </button>
        </div>
    );
};