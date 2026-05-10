"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteRecordButton } from "@/utils/functions/deleteRecordDB/buttonDeleteRecordDB";
import { DialogGeneric } from "@/components/dialogGeneric";
import { Pen } from "lucide-react";

import { FormUpdateBrand } from "./form-update-brand";

export function ListaBrandScroll({ brands = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand prodotto</CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-full rounded-md border">
          <div className="divide-y">
            {brands.length > 0 ? (
              brands.map((item) => (
                <div
                  key={item.brand}
                  className="flex items-center justify-between gap-4 p-3"
                >
                  <span className="font-medium">
                    {item.brand}
                  </span>

                  <div className="flex items-center gap-2">
                    <DialogGeneric
                      label={<Pen/>}
                      title="Modifica brand"
                      description="Aggiorna il nome del brand."
                      data={<FormUpdateBrand item={item} />}
                    />

                    <DeleteRecordButton
                      tableName="prodotto_brand"
                      idField="brand"
                      id={item.brand}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground">
                Nessun brand trovato.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}