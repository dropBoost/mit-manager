"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

import { updateSedeIndirizzoAction } from "../actions/updateSedeIndirizzoAction";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const initialState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full gap-2 md:w-auto">
      {pending && <Spinner data-icon="inline-start" />}
      {pending ? "Aggiornamento..." : "Aggiorna indirizzo"}
    </Button>
  );
}

function Field({
  name,
  label,
  required = false,
  type = "text",
  colspan = "",
  defaultValue = "",
}) {
  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label htmlFor={name}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue || ""}
      />
    </div>
  );
}

function DisabledField({ label, value, colspan = "" }) {
  return (
    <div className={`space-y-2 ${colspan}`}>
      <Label>{label}</Label>
      <Input value={value || ""} disabled />
    </div>
  );
}

export function FormUpdateSedeIndirizzo({ indirizzo }) {
  const [state, formAction] = useActionState(
    updateSedeIndirizzoAction,
    initialState
  );

  const sedeLabel = indirizzo?.sede
    ? `${indirizzo.sede.franchisee?.ragione_sociale || ""} - ${
        indirizzo.sede.localita || indirizzo.sede.citta || indirizzo.sede.indirizzo || ""
      }`
    : indirizzo?.id_sede || "";

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <input type="hidden" name="id" value={indirizzo?.id || ""} />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <DisabledField
              label="Sede"
              value={sedeLabel}
              colspan="md:col-span-12"
            />

            <Field
              name="alias_indirizzo"
              label="Alias indirizzo"
              defaultValue={indirizzo?.alias_indirizzo}
              colspan="md:col-span-4"
            />

            <Field
              name="nominativo"
              label="Nominativo"
              defaultValue={indirizzo?.nominativo}
              colspan="md:col-span-4"
            />

            <Field
              name="mobile"
              label="Mobile"
              defaultValue={indirizzo?.mobile}
              colspan="md:col-span-4"
            />

            <Field
              name="email"
              label="Email"
              type="email"
              defaultValue={indirizzo?.email}
              colspan="md:col-span-4"
            />

            <Field
              name="stato"
              label="Stato"
              defaultValue={indirizzo?.stato}
              colspan="md:col-span-4"
            />

            <Field
              name="provincia"
              label="Provincia"
              defaultValue={indirizzo?.provincia}
              colspan="md:col-span-4"
            />

            <Field
              name="citta"
              label="Città"
              defaultValue={indirizzo?.citta}
              colspan="md:col-span-4"
            />

            <Field
              name="cap"
              label="CAP"
              defaultValue={indirizzo?.cap}
              colspan="md:col-span-4"
            />

            <Field
              name="indirizzo"
              label="Indirizzo"
              defaultValue={indirizzo?.indirizzo}
              colspan="md:col-span-3"
            />

            <Field
              name="numero_civico"
              label="Numero civico"
              defaultValue={indirizzo?.numero_civico}
              colspan="md:col-span-1"
            />

            <div className="space-y-2 md:col-span-12">
              <Label htmlFor="note_indirizzo">Note indirizzo</Label>
              <Textarea
                id="note_indirizzo"
                name="note_indirizzo"
                defaultValue={indirizzo?.note_indirizzo || ""}
                placeholder="Note interne sull'indirizzo..."
              />
            </div>
          </div>

          {state?.message && (
            <div
              className={cn(
                "rounded-md border p-4 text-sm",
                state.success
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              )}
            >
              {state.message}
            </div>
          )}

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}