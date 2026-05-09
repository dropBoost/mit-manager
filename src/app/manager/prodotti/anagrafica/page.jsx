import { ListaProdotti } from "../components/list-prodotti";
import { getProdotto } from "@/utils/dataDB/getProdotto";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function PAGEprodottiAnagrafica () {

  const prodotti = await getProdotto()
  
  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Anagrafica Prodotti</span>
        <Link href={`/manager/prodotti/anagrafica/aggiungi-prodotto`}>
          <Button><Plus/></Button>
        </Link>
      </div>
      <div className="w-full">
        <ListaProdotti prodotti={prodotti}/>
      </div>
    </section>
    </>
  )
}