import { getProdotto } from "@/utils/dataDB/getProdotto";
import { getSedi } from "@/utils/dataDB/getSedi";
import { getListiniProdotto } from "@/utils/dataDB/getListiniProdotto";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FormListinoProdottoBulk } from "../components/form-listino-prodotto-bulk";

export default async function PAGEprodottiListini () {

  const [sedi, prodotti, listini] = await Promise.all([
    getSedi(),
    getProdotto(),
    getListiniProdotto(),
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
        <span>Gestione Listini</span>
        <Link href={`/manager/prodotti/listini/aggiungi-listino`}>
          <Button>Aggiungi Listino +</Button>
        </Link>
      </div>
      <div className="w-full">
        <FormListinoProdottoBulk
        sedi={sediOptions}
        prodotti={prodotti}
        listini={listini}
      />
      </div>
    </section>
    </>
  )
}