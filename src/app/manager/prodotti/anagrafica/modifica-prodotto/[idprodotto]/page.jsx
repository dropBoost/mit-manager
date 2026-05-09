import { DialogGeneric } from "@/components/dialogGeneric";
import { getAliquoteIva } from "@/utils/dataDB/getAliquoteIva";
import { getProdottoById } from "@/utils/dataDB/getProdottoByID";
import { FormUpdateProdotto } from "../../../components/form-update-prodotto";

export default async function PAGEprodottiAnagrafica ({params}) {

  const { idprodotto } = await params;
  const prodotto = await getProdottoById(idprodotto);
  const aliquoteIva = await getAliquoteIva()
  
  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Aggiorna Prodotto</span>
        <DialogGeneric label={"plus"} data={"<FormFornitoreProdotto stati={statiFormatted}/>"} title={"Nuovo fornitore prodotto"} description={"Inserisci i dati del fornitore. I campi con * sono obbligatori"}/>
      </div>
      <div className="w-full">
        <FormUpdateProdotto prodotto={prodotto} aliquoteIva={aliquoteIva}/>
      </div>
    </section>
    </>
  )
}