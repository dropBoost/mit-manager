"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

import { updateSedeAction } from "../actions/updateSedeAction";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      {pending ? "Aggiornamento..." : "Aggiorna sede"}
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

export function FormUpdateSede({ sede }) {
  const [state, formAction] = useActionState(updateSedeAction, initialState);

  const franchiseeLabel =
    sede?.franchisee?.ragione_sociale || sede?.id_franchisee || "";

  const statoLabel = sede?.stato?.stato
    ? `${sede.stato.stato} (${sede.stato.id})`
    : sede?.id_stato || "";

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <input type="hidden" name="id" value={sede?.id || ""} />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <DisabledField
              label="Franchisee"
              value={franchiseeLabel}
              colspan="md:col-span-6"
            />

            <DisabledField
              label="Stato"
              value={statoLabel}
              colspan="md:col-span-6"
            />

            <Field
              name="citta"
              label="Città"
              defaultValue={sede?.citta}
              colspan="md:col-span-4"
            />

            <Field
              name="localita"
              label="Località"
              defaultValue={sede?.localita}
              colspan="md:col-span-4"
            />

            <Field
              name="indirizzo"
              label="Indirizzo"
              defaultValue={sede?.indirizzo}
              colspan="md:col-span-4"
            />

            <Field
              name="tel"
              label="Telefono"
              defaultValue={sede?.tel}
              colspan="md:col-span-4"
            />

            <Field
              name="mobile"
              label="Mobile"
              defaultValue={sede?.mobile}
              colspan="md:col-span-4"
            />

            <Field
              name="email"
              label="Email"
              type="email"
              defaultValue={sede?.email}
              colspan="md:col-span-4"
            />

            <Field
              name="nominativo_ref"
              label="Nominativo referente"
              defaultValue={sede?.nominativo_ref}
              colspan="md:col-span-4"
            />

            <Field
              name="mobile_ref"
              label="Mobile referente"
              defaultValue={sede?.mobile_ref}
              colspan="md:col-span-4"
            />

            <Field
              name="email_ref"
              label="Email referente"
              type="email"
              defaultValue={sede?.email_ref}
              colspan="md:col-span-4"
            />
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