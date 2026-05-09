import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function PAGEfornitori () {

  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Fornitori</span>
      </div>
      <Separator/>
      <div className="w-full">
        <div className="grid lg:grid-cols-6 grid-cols-2 gap-3">
          <ButtonComponentsMenu label="Anagrafica"/>
          <ButtonComponentsMenu label="Schede"/>
        </div>
      </div>
    </section>
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