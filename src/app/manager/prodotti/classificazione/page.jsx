import { DialogGeneric } from "@/components/dialogGeneric";
import { FormCategoriaProdotto } from "../components/form-categoria-prodotto";
import { ListaCategorieProdotto } from "../components/list-categorie-prodotti";
import { FormSupercategoria } from "../components/form-supercategoria-prodotto";
import { FormBrand } from "../components/form-brand-prodotto";
import { getCategorieProdotto } from "@/utils/dataDB/getCategorieProdotti";
import { getProdottoBrand } from "@/utils/dataDB/getProdottoBrand";
import { getSupercategorieProdotto } from "@/utils/dataDB/getSupercategorieProdotti";
import { ListaSupercategorieScroll } from "../components/list-supercategorie-prodotti";
import { ListaBrandScroll } from "../components/lista-brand-scroll";


export default async function PAGEprodottiCategorie () {

  const categorie = await getCategorieProdotto()
  const supercategorie = await getSupercategorieProdotto()
  const brand = await getProdottoBrand()

  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Categorie Prodotti</span>
        <div className="flex flex-rot items-center gap-2">
          <DialogGeneric label="categoria +" data={<FormCategoriaProdotto supercategorie={supercategorie}/>} title={"Nuovo fornitore prodotto"} description={"Inserisci i dati del fornitore. I campi con * sono obbligatori"}/>
          <DialogGeneric label="supercategoria +" data={<FormSupercategoria/>} title="Aggiungi supercategoria"/> 
          <DialogGeneric label="brand +" data={<FormBrand/>} title="Aggiungi supercategoria"/> 
        </div>
      </div>
      <div className="flex 2xl:flex-row flex-col gap-5">
        <div className="flex-1">
          <ListaCategorieProdotto categorie={categorie}/>
        </div>
        <div className="flex flex-col gap-6 2xl:basis-3/12">
          <div className="flex-1">
            <ListaSupercategorieScroll supercategorie={supercategorie}/>
          </div>
          <div className="h-full">
            <ListaBrandScroll brands={brand}/>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}