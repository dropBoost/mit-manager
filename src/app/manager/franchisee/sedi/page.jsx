import { getCodStato } from "@/utils/dataDB/getCodiciStato";
import { getFranchisee } from "@/utils/dataDB/getFranchisee";
import { getSedi } from "@/utils/dataDB/getSedi";
import { FormSede } from "../components/form-sede";
import { DialogGeneric } from "@/components/dialogGeneric";
import { ListaSedi } from "../components/list-sedi";

export default async function PAGEfranchiseeSedi () {

  const [franchisee, stati, sedi] = await Promise.all([
    getFranchisee(),
    getCodStato(),
    getSedi(),
  ]);

  const statiOptions = stati.map((item) => ({
    value: item.id,
    label: item.stato,
  }));

  const franchiseeOptions = franchisee.map((item) => ({
    value: item.id,
    label: item.ragione_sociale,
  }));

console.log(franchisee)

  
  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Anagrafica Sedi</span>
        <DialogGeneric label="plus" data={<FormSede stati={statiOptions} franchisee={franchiseeOptions}/>} title={"Nuova Sede"} description={"Inserisci i dati della Sede"}/>
      </div>
      <div className="w-full">
        <ListaSedi sedi={sedi}/>
      </div>
    </section>
    </>
  )
}