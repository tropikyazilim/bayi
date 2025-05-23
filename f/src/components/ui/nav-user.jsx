"use client"

import {
  UserCircleIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useClerk, UserButton } from "@clerk/clerk-react"

export function NavUser({ user }) {
  const { openUserProfile } = useClerk()
  
  const handleProfileClick = () => {
    openUserProfile()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={handleProfileClick}
          className="hover:bg-sidebar-accent/50 transition-colors duration-200"
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg bg-amber-400">DB</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
          <UserCircleIcon className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
      
    </SidebarMenu>
  )
}
