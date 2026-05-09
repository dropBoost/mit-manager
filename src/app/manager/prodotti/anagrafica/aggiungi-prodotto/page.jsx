import { DialogGeneric } from "@/components/dialogGeneric";
import { FormProdotto } from "../../components/form-prodotto";
import { getProdottoUnita } from "@/utils/dataDB/getProdottoUnita";
import { getFornitoriProdotto } from "@/utils/dataDB/getFornitoriProdotto";
import { getCategorieProdotto } from "@/utils/dataDB/getCategorieProdotti";
import { getProdottoBrand } from "@/utils/dataDB/getProdottoBrand";
import { getAliquoteIva } from "@/utils/dataDB/getAliquoteIva";

export default async function PAGEprodottiAnagrafica () {

 const [unita, fornitori, categorie, brands, aliquoteIva] =
    await Promise.all([
      getProdottoUnita(),
      getFornitoriProdotto(),
      getCategorieProdotto(),
      getProdottoBrand(),
      getAliquoteIva(),
    ]);

  const unitaOptions = unita.map((item) => ({
    value: item.unita,
    label: item.unita,
  }));

  const fornitoriOptions = fornitori.map((item) => ({
    value: item.id,
    label: item.ragione_sociale,
  }));

  const categorieOptions = categorie.map((item) => ({
    value: item.categoria,
    label: item.categoria,
  }));

  const brandOptions = brands.map((item) => ({
    value: item.brand,
    label: item.brand,
  }));

  const aliquoteIvaOptions = aliquoteIva.map((item) => ({
    value: item.id,
    label: `${item.cod_stato} - ${item.nome}`,
  }));


  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Aggiungi Prodotto</span>
        <DialogGeneric label={"plus"} data={"<FormFornitoreProdotto stati={statiFormatted}/>"} title={"Nuovo fornitore prodotto"} description={"Inserisci i dati del fornitore. I campi con * sono obbligatori"}/>
      </div>
      <div className="w-full">
        <FormProdotto
          unita={unitaOptions}
          fornitori={fornitoriOptions}
          categorie={categorieOptions}
          brands={brandOptions}
          aliquoteIva={aliquoteIvaOptions}
        />
      </div>
    </section>
    </>
  )
}