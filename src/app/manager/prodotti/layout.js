import BreadcrumbNav from "@/components/breadcrumb-manager";

export default function LAYOUTfornitori ({children}) {
  return (
    <>
    <BreadcrumbNav/>
    <main className="flex flex-col flex-1 px-4 pb-4">
      {children}
    </main>
    </>
  )
}