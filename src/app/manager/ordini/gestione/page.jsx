import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ListaOrdini from "../components/list-ordini";


export default function PAGEordiniGestione() {
  return (
    <section className="flex flex-col gap-5">
      <div className="w-full flex flex-row items-end justify-between">
        <span>Gestione Ordini</span>

        <Link href={`/manager/ordini/gestione/nuovo-ordine`}>
          <Button>
            <Plus />
          </Button>
        </Link>
      </div>

      <div className="w-full">
        <ListaOrdini/>
      </div>
    </section>
  );
}