import { getCodStato } from "@/utils/dataDB/getCodiciStato";
import { getAliquoteIva } from "@/utils/dataDB/getAliquoteIva";
import { getFranchisee } from "@/utils/dataDB/getFranchisee";
import { FormFranchisee } from "../components/form-franchisee";
import { DialogGeneric } from "@/components/dialogGeneric";
import { ListaFranchisee } from "../components/list-franchisee";

export default async function PAGEfranchiseeFranchisee () {

  const [franchisee, stati, aliquoteIva] = await Promise.all([
    getFranchisee(),
    getCodStato(),
    getAliquoteIva(),
  ]);

  const statiOptions = stati.map((item) => ({
    value: item.id,
    label: item.stato,
  }));

  const aliquoteIvaOptions = aliquoteIva.map((item) => ({
    value: item.id,
    label: `${item.stato?.id || item.cod_stato || "-"} - ${item.nome}`,
  }));


  
  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Anagrafica Franchisee</span>
        <DialogGeneric label="plus" data={<FormFranchisee stati={statiOptions} aliquoteIva={aliquoteIvaOptions}/>} title={"Nuovo Franchisee"} description={"Inserisci i dati del Franchisee"}/>
      </div>
      <div className="w-full">
        <ListaFranchisee franchisee={franchisee} stati={statiOptions} aliquoteIva={aliquoteIvaOptions}/>
      </div>
    </section>
    </>
  )
}