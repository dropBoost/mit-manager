import BreadcrumbNav from "@/components/breadcrumb-manager";

export default function LAYOUTspedizioni ({children}) {
  return (
    <>
    <BreadcrumbNav/>
    <main className="flex flex-col flex-1 px-4 pb-4">
      {children}
    </main>
    </>
  )
}