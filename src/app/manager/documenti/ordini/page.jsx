import { getFornitoriProdotto } from "@/utils/dataDB/getFornitoriProdotto";
import { ListaFornitoriDocumentiOrdini } from "../components/lista-fornitori-documenti-ordini";

export default async function PAGEordini () {

    const fornitori = await getFornitoriProdotto();

  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>CIAO</span>
        {/* <DialogGeneric label="plus" data={<FormFranchisee stati={statiOptions} aliquoteIva={aliquoteIvaOptions}/>} title={"Nuovo Franchisee"} description={"Inserisci i dati del Franchisee"}/> */}
      </div>
      <div className="w-full">
        {/* <ListaFornitoriDocumentiOrdini fornitori={fornitori}/> */}
      </div>
    </section>
    </>
  )
}