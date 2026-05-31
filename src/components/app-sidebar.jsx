"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { navManager } from "@/app/settings"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { FaCircle } from "react-icons/fa";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import Image from "next/image"
import { Separator } from "./ui/separator"
import { version } from "@/app/settings"

const data = {
  softwareDrop: [
    {
      name: "dropboost.it",
      url: "https://www.dropboost.it",
      icon: FaCircle,
    },
  ],
}

export function AppSidebar( { user, settings }) {

  const logo = "/logo.png"
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
              {logo ? (
                <Image
                  src={logo}
                  width={30}
                  height={100}
                  className="w-auto h-auto bg-neutral-100 rounded-full"
                  alt={settings?.companyName || "Logo"}
                />
              ) : null}
              <span className="text-xs font-semibold">MIT-MANAGER {version}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator/>
      <SidebarContent>
        <NavMain items={navManager} label="manager"/>
        <NavProjects projects={data.softwareDrop} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
