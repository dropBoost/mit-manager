import BreadcrumbNav from "@/components/breadcrumb-manager";

export default function LAYOUTordini ({children}) {
  return (
    <>
    <BreadcrumbNav/>
    <main className="flex flex-col flex-1 px-4 pb-4">
      {children}
    </main>
    </>
  )
}