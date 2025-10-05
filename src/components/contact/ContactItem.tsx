import { ChevronRight } from "lucide-react";

interface IContactItemProps
{
    title: string;
    icon: JSX.Element;
    content: string;
    action: {
        label: string;
        href: string;
        external: boolean;
    };
}

export default function ContactItem({
    title,
    icon,
    content,
    action
}: IContactItemProps)
{
    return (
        <div className="flex">
            <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                    {icon}
                </div>
            </div>

            <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-white">{title}</h4>
                
                <p className="mt-1 text-gray-600 dark:text-gray-400">{content}</p>
            
                {action && (
                    <a 
                        href={action.href}
                        target={action.external ? "_blank" : undefined}
                        rel={action.external ? "noopener noreferrer" : undefined}
                        className="mt-2 inline-flex items-center text-[#F7BF57] hover:text-[#e6af4a]"
                    >
                        {action.label}
                        <ChevronRight size={16} className="ml-1" />
                    </a>
                )}
            </div>
        </div>
    );
}