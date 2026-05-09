import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getSedi } from "@/utils/dataDB/getSedi";
import { getProdotto } from "@/utils/dataDB/getProdotto";
import { getListiniProdotto } from "@/utils/dataDB/getListiniProdotto";
import { getSedeIndirizzi } from "@/utils/dataDB/getSedeIndirizzi";
import { ListaOrdini } from "../components/list-ordini";
import { getOrdini } from "@/utils/dataDB/getOrdini";

export default async function PAGEordiniGestione () {

  const [ordini, sedi, prodotti, listini, indirizzi] = await Promise.all([
    getOrdini(),
    getSedi(),
    getProdotto(),
    getListiniProdotto(),
    getSedeIndirizzi(),
  ]);

  const sediOptions = sedi.map((item) => ({
    value: item.id,
    label: `${item.franchisee?.ragione_sociale || "Sede"} - ${
      item.localita || item.citta || item.indirizzo || item.id
    }`,
  }));

  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Gestione Ordini</span>
        <Link href={`/manager/ordini/gestione/nuovo-ordine`}>
          <Button><Plus/></Button>
        </Link>
      </div>
      <div className="w-full">
        <ListaOrdini ordini={ordini}/>
      </div>
    </section>
    </>
  )
}