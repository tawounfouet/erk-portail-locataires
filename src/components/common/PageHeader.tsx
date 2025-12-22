interface IPageHeaderProps
{
    title: string;
    description: string;
}

export default function PageHeader({ title, description }: IPageHeaderProps)
{
    return (
    <div className="mb-8 mt-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">{ title }</h2>
        <p className="text-gray-300 mt-1">{ description }</p>
    </div>
    );
}