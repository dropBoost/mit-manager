import Link from "next/link";
import BreadcrumbNav from "@/components/breadcrumb-manager";
import Image from "next/image";
import { navManager } from "../settings";
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react";
import { getCurrentAccount } from "@/utils/dataDB/getCurrentAccount";

export default async function PAGEmanager () {

  const user = await getCurrentAccount()
  const ruolo = user?.ruolo?.ruolo

  return (
    <>
    <BreadcrumbNav/>
    <main className="flex flex-col flex-1 px-3 pb-4">
      <section className="flex flex-col gap-2 border h-full rounded-2xl p-5">
        <div className="w-full flex flex-row items-end justify-center mb-5">
          <Image src={`/logo.png`} width={60} height={60} alt={"logo"}/>
        </div>
        <div className="flex flex-row h-60 gap-2">
          <div className="basis-3/6 flex flex-row items-end justify-start border border-primary w-full h-full gap-2 p-5 rounded-2xl hover:bg-primary/20 transition-all duration-300">
            <span className="text-8xl">0</span>
            <span className="font-extralight">/ ordini in attesa</span>
          </div>
          <div className="basis-3/6 flex flex-row items-end justify-start border border-primary w-full h-full gap-2 p-5 rounded-2xl hover:bg-primary/20 transition-all duration-300">
            <span className="text-8xl">0</span>
            <span className="font-extralight">/ ordini in consegna</span>
          </div>
        </div>
        <div className="w-full h-full">
          <div className="relative min-h-full overflow-hidden bg-[linear-gradient(135deg,#0a0a0a_0%,#171717_35%,hsl(var(--primary))_120%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,hsl(var(--primary)/0.85)_0%,transparent_32%),radial-gradient(circle_at_70%_80%,hsl(var(--primary)/1)_0%,transparent_28%),radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.35)_0%,transparent_25%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-size-[36px_36px] opacity-25" />
              <div className="relative z-10 flex flex-wrap">
                {navManager?.filter((nf) => nf.title !== "Manager" && nf.level?.includes(ruolo)).map((n, index) => (
                  <div key={`container-${index}`} className="xl:basis-3/12 basis-full flex flex-col items-center justify-center min-h-full uppercase p-1">
                    <div className="flex flex-col items-start justify-start border border-primary w-full h-full gap-2 p-5 rounded-2xl hover:bg-primary/20 transition-all duration-300">
                      <Button className={`uppercase font-bold`}>
                        {n.title}
                      </Button>
                      <ul className="space-y-1">
                        {n.items?.map((i, index) => (
                          <li key={`list-${index}`}>
                            <Button variant="outline" className="hover:bg-primary hover:border hover:border-primary font-light tracking-wider">
                              <ChevronRight/>{i?.title}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
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