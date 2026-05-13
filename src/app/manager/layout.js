import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentAccount } from "@/utils/dataDB/getCurrentAccount";

export default async function LAYOUTmanager({children}) {

  const user = await getCurrentAccount()

  return (
  <TooltipProvider>
    <SidebarProvider>
      <AppSidebar user={user}/>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  </TooltipProvider>
  );
}
