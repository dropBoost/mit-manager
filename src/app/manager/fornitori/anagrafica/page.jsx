import { DialogGeneric } from "@/components/dialogGeneric";
import { FormFornitoreProdotto } from "../components/form-fornitore-prodotto";
import { getCodStato } from "@/utils/dataDB/getCodiciStato";
import { getFornitoriProdotto } from "@/utils/dataDB/getFornitoriProdotto";
import { ListaFornitoriProdotto } from "../components/lista-fornitori-prodotto";

export default async function PAGEfornitoriAnagrafica () {

  const fornitori = await getFornitoriProdotto();
  const stati = await getCodStato()
  const statiFormatted = stati?.map((s) => ({
    value: s.id,
    label: s.stato,
    phonePrefix: s.phone_prefix
  }));
  
  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Anagrafica Fornitori</span>
        <DialogGeneric label={"plus"} data={<FormFornitoreProdotto stati={statiFormatted}/>} title={"Nuovo fornitore prodotto"} description={"Inserisci i dati del fornitore. I campi con * sono obbligatori"}/>
      </div>
      <div className="w-full">
        <ListaFornitoriProdotto fornitori={fornitori}/>
      </div>
    </section>
    </>
  )
}