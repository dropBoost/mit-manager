import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ToggleDarkMode } from "./ui/toggle-dark-mode"

export default function BreadcrumbNav ({data}) {
  return (
    <header className="flex flex-row justify-between h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 bg-primary text-neutral-100! rounded-b-2xl mx-2 mb-3">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
        <Breadcrumb>
          <BreadcrumbList  className={`text-neutral-100! dark:text-neutral-100`}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Build Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className={`text-neutral-100! dark:text-neutral-100`}>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center">
        <ToggleDarkMode/>
      </div>
    </header>
  )
}