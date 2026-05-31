import { getFornitoriProdotto } from "@/utils/dataDB/getFornitoriProdotto";
import { getProdotto } from "@/utils/dataDB/getProdotto";
import { getSedi } from "@/utils/dataDB/getSedi";
import { ListaSediReportOrdini } from "../components/lista-sede-report-ordini";

export default async function PAGEordiniSede () {

  const [fornitori, prodotti, sedi] = await Promise.all([
    getFornitoriProdotto(),
    getProdotto(),
    getSedi(),
  ]);

  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Report Ordini Sede</span>
      </div>
      <div className="w-full">
        <ListaSediReportOrdini sedi={sedi} fornitori={fornitori} prodotti={prodotti}/>
      </div>
    </section>
    </>
  )
}