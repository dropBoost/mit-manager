import { getFornitoriProdotto } from "@/utils/dataDB/getFornitoriProdotto";
import { getProdotto } from "@/utils/dataDB/getProdotto";
import { ListaFornitoriReportOrdini } from "../components/lista-fornitori-report-ordini";

export default async function PAGEordiniFornitore () {

  const [fornitori, prodotti] = await Promise.all([
    getFornitoriProdotto(),
    getProdotto(),
  ]);

  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Report Ordini Fornitore</span>
      </div>
      <div className="w-full">
        <ListaFornitoriReportOrdini fornitori={fornitori} prodotti={prodotti}/>
      </div>
    </section>
    </>
  )
}