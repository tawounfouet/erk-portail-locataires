import { type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { INavSectionProps } from "@/types/navigation.type";
import { usePageInfo } from "@/hooks/usePageInfo";

interface INavMainProps extends INavSectionProps
{
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[];
}

export default function NavMain({ items } : INavMainProps) {
  const { name } = usePageInfo();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link to={item.url} state={{ title: item.title }}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  className={`${name === item.title ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground" : ""}`} 
                >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
