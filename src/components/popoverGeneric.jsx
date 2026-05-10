import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { formatDate } from "@/utils/functions/date/dataFormatter"

export function PopoverGeneric({label, data, variant = ""}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={variant}>{label}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        {data}
      </PopoverContent>
    </Popover>
  )
}
