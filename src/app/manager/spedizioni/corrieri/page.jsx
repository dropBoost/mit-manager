import { ListaCorrieri } from "../components/list-corrieri";
import { getCorrieri } from "@/utils/dataDB/getCorrieri";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DialogGeneric } from "@/components/dialogGeneric";
import { FormCorriere } from "../components/form-corriere";

export default async function PAGEspedizioniCorrieri () {

  const corrieri = await getCorrieri()
  
  return (
    <>
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Elenco Corrieri</span>
        <DialogGeneric label="plus" data={<FormCorriere/>} title={"Aggiungi Corriere"} description={"Inserisci i dati del corriere. I campi con * sono obbligatori"}/>
      </div>
      <div className="w-full">
        <ListaCorrieri corrieri={corrieri}/>
      </div>
    </section>
    </>
  )
}