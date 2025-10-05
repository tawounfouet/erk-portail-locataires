import IconDisplayer from "./IconDisplayer";

interface IStatusBadge
{
    label: string;
    color: string;
    icon: string;
}

export default function StatusBadge({ label, color, icon }: IStatusBadge)
{
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${color}`}>
            <IconDisplayer iconName={icon} size={14} />
            {label}
        </span>
    );
}