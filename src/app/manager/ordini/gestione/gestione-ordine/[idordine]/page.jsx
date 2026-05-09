import { getOrdineById } from "@/utils/dataDB/getOrdineByID";
import SchedaOrdine from "../../../components/scheda-ordine";

export default async function PAGEprodottiAnagrafica ({params}) {

  const { idordine } = await params;
  const ordine = await getOrdineById(idordine);

  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Gestisci Ordine</span>
      </div>
      <div className="w-full">
        <SchedaOrdine ordine={ordine} />
      </div>
    </section>
    </>
  )
}