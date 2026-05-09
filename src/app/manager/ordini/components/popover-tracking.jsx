import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { formatDate } from "@/utils/functions/date/dataFormatter"

export function PopoverTracking({label, data}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>{label}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col">
          <span>Corriere: {data.corriere.cod_corriere} {data.corriere.nome_corriere}</span>
          <span>Tracking: 
            <Link href={`${data.corriere.link_tracking}${data.tracking}`}> {data.tracking || "tracking non disponibile"}</Link>
          </span>
          <span>Data Evasione: {formatDate(data.created_at)}</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
