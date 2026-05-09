import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FormOrdine } from "../../components/form-ordine";
import { getSedi } from "@/utils/dataDB/getSedi";
import { getProdotto } from "@/utils/dataDB/getProdotto";
import { getListiniProdotto } from "@/utils/dataDB/getListiniProdotto";
import { getSedeIndirizzi } from "@/utils/dataDB/getSedeIndirizzi";

export default async function PAGEordiniGestione () {

  const [sedi, prodotti, listini, indirizzi] = await Promise.all([
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
        <Link href={`/manager/prodotti/anagrafica/aggiungi-prodotto`}>
          <Button><Plus/></Button>
        </Link>
      </div>
      <div className="w-full">
        <FormOrdine
          idAccount={null}
          sedi={sediOptions}
          prodotti={prodotti}
          listini={listini}
          indirizzi={indirizzi}
        />
        {/* <ListaProdotti prodotti={prodotti}/> */}
      </div>
    </section>
    </>
  )
}