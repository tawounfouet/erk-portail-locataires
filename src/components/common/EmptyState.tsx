export interface IEmptyStateProps 
{
    title: string;
    description: string;
    image: string;
}

export default function EmptyState({ title, description, image }: IEmptyStateProps)
{
    return (
        <div className="flex flex-col items-center jutify-between gap-4 mt-8">
            <h1 className="text-2xl font-medium text-white">{title}</h1>
            
            <img
                src={image}
                alt="relaxing boy"
                className="opacity-60"
            />

            <p className="text-center text-gray-400">
                {description}
            </p>
        </div>
    );
}