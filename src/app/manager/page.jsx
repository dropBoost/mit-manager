import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import BreadcrumbNav from "@/components/breadcrumb-manager";
import Image from "next/image";

export default async function PAGEmanager () {

  return (
    <>
    <BreadcrumbNav/>
    <main className="flex flex-col flex-1 px-3 pb-4">
      <section className="flex flex-col gap-5 border h-full rounded-2xl p-5">
      <div className="w-full flex flex-row items-end justify-center">
        <Image src={`/logo.png`} width={50} height={50} unoptimized/>
      </div>
      <Separator className={`bg-primary `}/>
      <div className="w-full">
        <div className="grid lg:grid-cols-6 grid-cols-2 gap-3">
          {/* <ButtonComponentsMenu label="Anagrafica"/>
          <ButtonComponentsMenu label="Schede"/> */}
        </div>
      </div>
    </section>
    </main>
    
    </>
  )
}

export function ButtonComponentsMenu ({label, link = "#"}) {
  return (
    <Link href={link} className="flex flex-col items-center justify-center col-span-1 p-5 border aspect-video rounded-2xl bg-neutral-300 dark:bg-neutral-900 uppercase text-xs font-bold hover:bg-primary transition-all duration-300 hover:animate-pulse">
      {label}
    </Link>
  )
}