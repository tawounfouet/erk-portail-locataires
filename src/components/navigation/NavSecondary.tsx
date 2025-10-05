"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { INavSectionProps } from "@/types/navigation.type";

interface INavSecondaryProps extends INavSectionProps
{
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[];
}

export default function NavSecondary({ 
  items,
  ...props 
}: INavSecondaryProps & React.ComponentPropsWithoutRef<typeof SidebarGroup>) 
{
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
