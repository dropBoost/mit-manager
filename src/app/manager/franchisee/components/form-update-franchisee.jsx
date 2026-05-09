"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

import { updateFranchiseeAction } from "../actions/updateFranchiseeAction";

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
      {pending ? "Aggiornamento..." : "Aggiorna franchisee"}
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

export function FormUpdateFranchisee({ franchisee }) {
  const [state, formAction] = useActionState(
    updateFranchiseeAction,
    initialState
  );

  const idStato =
    typeof franchisee?.stato === "object"
      ? franchisee?.stato?.id
      : franchisee?.id_stato || "";

  const statoLabel =
    typeof franchisee?.stato === "object"
      ? `${franchisee?.stato?.stato} (${franchisee?.stato?.id})`
      : franchisee?.id_stato || "";

  const ivaLabel =
    typeof franchisee?.iva === "object"
      ? `${franchisee?.iva?.nome} - ${franchisee?.iva?.valore}%`
      : franchisee?.cod_iva || "";

  const isItalia = idStato === "IT";
  const isEstero = idStato && idStato !== "IT";

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <input type="hidden" name="id" value={franchisee?.id || ""} />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <Field
              name="ragione_sociale"
              label="Ragione sociale"
              required
              defaultValue={franchisee?.ragione_sociale}
              colspan="md:col-span-4"
            />

            <DisabledField
              label="Stato"
              value={statoLabel}
              colspan="md:col-span-4"
            />

            <DisabledField
              label="Aliquota IVA"
              value={ivaLabel}
              colspan="md:col-span-4"
            />

            <DisabledField
              label="Partita IVA"
              value={franchisee?.partita_iva}
              colspan="md:col-span-3"
            />

            <Field
              name="codice_univoco"
              label="Codice univoco"
              defaultValue={franchisee?.codice_univoco}
              colspan="md:col-span-3"
            />

            <Field
              name="pec"
              label="PEC"
              type="email"
              defaultValue={franchisee?.pec}
              colspan="md:col-span-3"
            />

            <Field
              name="email"
              label="Email"
              type="email"
              defaultValue={franchisee?.email}
              colspan="md:col-span-3"
            />

            <Field
              name="tel"
              label="Telefono"
              defaultValue={franchisee?.tel}
              colspan="md:col-span-3"
            />

            <Field
              name="mobile"
              label="Mobile"
              defaultValue={franchisee?.mobile}
              colspan="md:col-span-3"
            />

            <Field
              name="referente"
              label="Referente"
              defaultValue={franchisee?.referente}
              colspan="md:col-span-3"
            />

            <Field
              name="mobile_ref"
              label="Mobile referente"
              defaultValue={franchisee?.mobile_ref}
              colspan="md:col-span-3"
            />

            <Field
              name="email_ref"
              label="Email referente"
              type="email"
              defaultValue={franchisee?.email_ref}
              colspan="md:col-span-3"
            />
          </div>

          {isItalia && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Sede legale</h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <Field
                  name="cap_sl"
                  label="CAP"
                  required
                  defaultValue={franchisee?.cap_sl}
                />

                <Field
                  name="citta_sl"
                  label="Città"
                  required
                  defaultValue={franchisee?.citta_sl}
                />

                <Field
                  name="provincia_sl"
                  label="Provincia"
                  required
                  defaultValue={franchisee?.provincia_sl}
                />

                <Field
                  name="indirizzo_sl"
                  label="Indirizzo"
                  required
                  defaultValue={franchisee?.indirizzo_sl}
                />
              </div>
            </div>
          )}

          {isEstero && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Indirizzo estero</h3>

              <Field
                name="indirizzo_sl_ext"
                label="Indirizzo estero sede legale"
                required
                defaultValue={franchisee?.indirizzo_sl_ext}
              />
            </div>
          )}

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