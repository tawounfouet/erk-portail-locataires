import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils";

interface IStatCardProps
{
    title: string;
    value: number;
    icon: LucideIcon;
    className?: string;
}

export default function StatCard({ title, value, icon, className = "" }: IStatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {title}
            </p>
            <p className={cn("text-2xl font-bold", className)}>
              {value}
            </p>
          </div>
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full bg-muted/50",
            className && "opacity-80"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}