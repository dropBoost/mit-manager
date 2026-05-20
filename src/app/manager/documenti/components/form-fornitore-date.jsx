"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export function FormFiltroFornitoreDate({ fornitore, onSubmit }) {

  const [dataDa, setDataDa] = useState("");
  const [dataA, setDataA] = useState("");

  function handleSubmit(event) {

    event.preventDefault();

    onSubmit?.({
      id_fornitore: fornitore.id,
      data_da: dataDa,
      data_a: dataA,
    });

  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">

            <div className="space-y-2 md:col-span-3">
              <CardDescription>Fornitore</CardDescription>
              <CardTitle>{fornitore.ragione_sociale}</CardTitle>
            </div>

            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="data_da">
                Da <span className="text-destructive">*</span>
              </Label>
              <Input
                id="data_da"
                name="data_da"
                type="date"
                value={dataDa}
                onChange={(e) => setDataDa(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="data_a">
                A <span className="text-destructive">*</span>
              </Label>
              <Input
                id="data_a"
                name="data_a"
                type="date"
                value={dataA}
                onChange={(e) => setDataA(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!fornitore.id || !dataDa || !dataA}
            >
              Applica filtro
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}