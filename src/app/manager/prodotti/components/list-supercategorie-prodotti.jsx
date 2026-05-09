"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleBooleanRecordButton } from "@/utils/functions/toggleBooleandRecord/buttonToggleBooleanRecord";
import { DeleteRecordButton } from "@/utils/functions/deleteRecordDB/buttonDeleteRecordDB";

export function ListaSupercategorieScroll({ supercategorie = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supercategorie</CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-full rounded-md border">
          <div className="divide-y">
            {supercategorie.length > 0 ? (
              supercategorie.map((item) => (
                <div key={item.id || item.supercategoria} className="flex items-center justify-between gap-4 p-3">
                  <div className="w-full flex justify-between items-center">
                  <span className="font-medium">
                    {item.supercategoria}
                  </span>

                  <ToggleBooleanRecordButton
                    tableName="supercategoria_prodotto"
                    idField="supercategoria"
                    id={item.supercategoria}
                    booleanField="attivo"
                    currentValue={item.attivo}
                  />
                  </div>
                  <DeleteRecordButton
                    tableName={'supercategoria_prodotto'}
                    idField="supercategoria"
                    id={item.supercategoria}
                  />

                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground">
                Nessuna supercategoria trovata.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}