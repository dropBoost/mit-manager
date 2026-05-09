import { DialogGeneric } from "@/components/dialogGeneric";
import { FormCategoriaProdotto } from "../components/form-categoria-prodotto";
import { ListaCategorieProdotto } from "../components/list-categorie-prodotti";
import { FormSupercategoria } from "../components/form-supercategoria-prodotto";
import { getCategorieProdotto } from "@/utils/dataDB/getCategorieProdotti";
import { getSupercategorieProdotto } from "@/utils/dataDB/getSupercategorieProdotti";
import { ListaSupercategorieScroll } from "../components/list-supercategorie-prodotti";


export default async function PAGEprodottiCategorie () {

  const categorie = await getCategorieProdotto()
  const supercategorie = await getSupercategorieProdotto()

  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Categorie Prodotti</span>
        <div className="flex flex-rot items-center gap-2">
          <DialogGeneric label="categoria +" data={<FormCategoriaProdotto supercategorie={supercategorie}/>} title={"Nuovo fornitore prodotto"} description={"Inserisci i dati del fornitore. I campi con * sono obbligatori"}/>
          <DialogGeneric label="supercategoria +" data={<FormSupercategoria/>} title="Aggiungi supercategoria"/> 
        </div>
      </div>
      <div className="flex 2xl:flex-row flex-col gap-5">
        <div className="flex-1">
          <ListaCategorieProdotto categorie={categorie}/>
        </div>
        <div className="2xl:basis-3/12">
          <ListaSupercategorieScroll supercategorie={supercategorie}/>
        </div>
      </div>
    </section>
    </>
  )
}