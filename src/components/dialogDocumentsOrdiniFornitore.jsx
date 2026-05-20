"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ButtonPdfOrdineFornitore } from "@/app/manager/ordini/components/button-pdf-ordine-fornitore";

export function DialogDocumentsOrdiniFornitore({
  label,
  ordine,
  data = [],
  title,
  description,
  labelClose = "Chiudi",
  disabledStatus = false,
}) {
  const isPlus = label === "plus";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          size={isPlus ? "icon" : "default"}
          disabled={disabledStatus}
        >
          {isPlus ? <Plus /> : label}
        </Button>
      </DialogTrigger>

      <DialogContent className="xl:max-w-3xl! max-w-[calc(100%-6rem)]! max-h-[calc(100vh-8rem)] overflow-y-auto">
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        <div className="space-y-3">
          {data.length > 0 ? (
            data.map((fornitore) => (
              <div
                key={fornitore.id_fornitore}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">
                    {fornitore.fornitore_nome || "Fornitore non disponibile"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Prodotti: {fornitore.righe.length}
                  </p>
                </div>

                <ButtonPdfOrdineFornitore
                  ordine={ordine}
                  righe={fornitore.righe}
                  fornitore={fornitore}
                  label={`PDF`}
                />
              </div>
            ))
          ) : (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              Nessun fornitore trovato per questo ordine.
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {labelClose}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}