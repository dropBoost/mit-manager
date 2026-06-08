import { getCodStato } from "@/utils/dataDB/getCodiciStato";
import { getFranchisee } from "@/utils/dataDB/getFranchisee";
import { getSedeIndirizzi } from "@/utils/dataDB/getSedeIndirizzi";
import { getSedi } from "@/utils/dataDB/getSedi";
import { FormSede } from "../components/form-sede";
import { DialogGeneric } from "@/components/dialogGeneric";
import { ListaSedi } from "../components/list-sedi";
import { ListaSedeIndirizzi } from "../components/lista-sede-indirizzi";
import { FormSedeIndirizzo } from "../components/form-sede-indirizzo";

export default async function PAGEfranchiseeIndirizzi () {

  const [franchisee, stati, sedi, sediIndirizzi] = await Promise.all([
    getFranchisee(),
    getCodStato(),
    getSedi(),
    getSedeIndirizzi()
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
        <span>Anagrafica Sedi</span>
        <DialogGeneric label="plus" data={<FormSedeIndirizzo sedi={sediOptions}/>} title={"Nuovo Indirizzo"} description={"Inserisci i dati di Indirizzo Spedizione"}/>
      </div>
      <div className="w-full">
        <ListaSedeIndirizzi indirizzi={sediIndirizzi }sedi={sediOptions}/>
      </div>
    </section>
    </>
  )
}