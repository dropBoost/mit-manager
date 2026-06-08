import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { formatDate } from "@/utils/functions/date/dataFormatter"
import { ButtonDeleteEvasione } from "./button-delete-evasione"

export function PopoverTracking({label, data}) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>{label}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col">
            <span>Corriere: {data.cod_corriere} {data.nome_corriere}</span>
            <span>Tracking: 
              <Link href={`${data.link_tracking}${data.tracking}`}> {data.tracking || "tracking non disponibile"}</Link>
            </span>
            <span>Data Evasione: {formatDate(data.created_at)}</span>
          </div>
          <ButtonDeleteEvasione idSpedizione={data?.id} idRiga={data?.id_ordine_riga}/>
        </div>
      </PopoverContent>
    </Popover>
  )
}
