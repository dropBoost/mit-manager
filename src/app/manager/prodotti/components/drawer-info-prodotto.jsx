import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function DrawerInfoProdotto({title, description, label, data, close = "chiudi"}) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DrawerTrigger>
      <DrawerContent className="min-w-120!">
        <DrawerHeader className={`gap-3`}>
          <DrawerDescription className={`text-[0.6rem]`}>{data.id}</DrawerDescription>
          <Separator/>
          <div className="flex flex-row gap-1">
            <Badge className={`text-md`}>{data.id_categoria}</Badge>
            <Badge className={`text-md`} variant="outline">{data.supercategoria_nome}</Badge>
          </div>
          <div className="flex flex-row gap-5 border rounded-2xl p-4">
            <div className="">
              <Image src={data.immagine} width={100} height={100} unoptimized className="object-cover rounded-2xl" alt={`Immagine Prodotto ${data.nome}`}/>
            </div>
            <div className="flex flex-col gap-1">
              <DrawerTitle className={`text-3xl uppercase text-primary font-bold`}>{data.nome}</DrawerTitle>
              <DrawerDescription>{data.descrizione}</DrawerDescription>
              <DrawerDescription>{data.brand} / {data.fornitore_nome}</DrawerDescription>
            </div>
          </div>
          <div className="flex flex-col gap-3 border rounded-2xl p-4">
            <div className="flex flex-row gap-1">
              <Badge className={`text-md`}>Vendita {data.iva_vendita_stato} | {data.iva_vendita_nome}</Badge>
              <Badge className={`text-md`} variant="outline">Acquisto {data.iva_acquisto_stato} | {data.iva_acquisto_nome}</Badge>
            </div>
            <div className="flex w-full flex-col gap-2 text-sm">
              <dl className="flex items-center justify-between">
                <dt>Prezzo Riferimento</dt>
                <div className="flex flex-row gap-2">
                  <dd className="text-muted-foreground">{data.prezzo_riferimento} €</dd>
                  <dd className="text-muted-foreground">{(data.prezzo_riferimento * (1+data.iva_vendita_valore/100)).toFixed(2)} €</dd>
                </div>
              </dl>
              <Separator />
              <dl className="flex items-center justify-between">
                <dt>Prezzo Vendita</dt>
                <div className="flex flex-row gap-2">
                  <dd className="text-muted-foreground">{data.prezzo_vendita} €</dd>
                  <dd className="text-muted-foreground">{(data.prezzo_vendita * (1+data.iva_vendita_valore/100)).toFixed(2)} €</dd>
                </div>
              </dl>
              <Separator />
              <dl className="flex items-center justify-between">
                <dt>Costo Acquisto</dt>
                <div className="flex flex-row gap-2">
                  <dd className="text-muted-foreground">{data.costo_acquisto} €</dd>
                  <dd className="text-muted-foreground">{(data.costo_acquisto * (1+data.iva_acquisto_valore/100)).toFixed(2)} €</dd>
                </div>
              </dl>
            </div>
          </div>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{close}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
