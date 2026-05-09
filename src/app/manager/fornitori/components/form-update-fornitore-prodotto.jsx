"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

import { updateFornitoreProdottoAction } from "../action/updateFornitoreProdottoAction";

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
      {pending ? "Aggiornamento..." : "Aggiorna fornitore"}
    </Button>
  );
}

function Field({
  name,
  label,
  required = false,
  type = "text",
  colspan,
  defaultValue = "",
}) {
  return (
    <div className={`space-y-2 ${colspan || ""}`}>
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

export function FormUpdateFornitoreProdotto({ fornitore }) {
  const [state, formAction] = useActionState(
    updateFornitoreProdottoAction,
    initialState
  );

  const stato =
    typeof fornitore?.stato === "object"
      ? fornitore?.stato?.id
      : fornitore?.stato || "";

  const nomeStato =
    typeof fornitore?.stato === "object"
      ? fornitore?.stato?.stato
      : fornitore?.stato || "";

  const isItalia = stato === "IT";
  const isEstero = stato && stato !== "IT";

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="space-y-8">
          <input type="hidden" name="id" value={fornitore?.id || ""} />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <Field
              name="ragione_sociale"
              label="Ragione sociale"
              colspan="2xl:col-span-2 col-span-12"
              defaultValue={fornitore?.ragione_sociale}
              required
            />

            <div className="space-y-2 xl:col-span-2 col-span-12">
              <Label htmlFor="stato_display">Stato</Label>
              <Input id="stato_display" value={nomeStato} disabled />
            </div>

            <div className="space-y-2 lg:col-span-1 col-span-2">
              <Label htmlFor="id_stato">ID</Label>
              <Input id="id_stato" value={stato} disabled />
            </div>

            <div className="space-y-2 lg:col-span-2 col-span-10">
              <Label htmlFor="partita_iva_display">Partita IVA</Label>
              <Input
                id="partita_iva_display"
                value={fornitore?.partita_iva || ""}
                disabled
              />
            </div>

            <Field
              name="codice_univoco"
              label="Codice univoco"
              colspan="lg:col-span-2 col-span-12"
              defaultValue={fornitore?.codice_univoco}
            />

            <Field
              name="pec"
              label="PEC"
              type="email"
              colspan="lg:col-span-3 col-span-12"
              defaultValue={fornitore?.pec}
            />

            <Field
              name="email"
              label="Email"
              type="email"
              required
              colspan="lg:col-span-3 col-span-12"
              defaultValue={fornitore?.email}
            />

            <Field
              name="tel"
              label="Telefono"
              colspan="lg:col-span-2 col-span-12"
              defaultValue={fornitore?.tel}
            />

            <Field
              name="referente"
              label="Referente"
              colspan="lg:col-span-2 col-span-12"
              defaultValue={fornitore?.referente}
            />

            <Field
              name="mobile_ref"
              label="Mobile referente"
              colspan="lg:col-span-2 col-span-12"
              defaultValue={fornitore?.mobile_ref}
            />

            <Field
              name="email_ref"
              label="Email referente"
              type="email"
              colspan="lg:col-span-3 col-span-12"
              defaultValue={fornitore?.email_ref}
            />
          </div>

          {isItalia && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Sede legale</h3>
                <p className="text-sm text-muted-foreground">
                  Indirizzo italiano della sede legale.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <Field
                  name="cap_sl"
                  label="CAP"
                  defaultValue={fornitore?.cap_sl}
                  required
                />

                <Field
                  name="citta_sl"
                  label="Città"
                  defaultValue={fornitore?.citta_sl}
                  required
                />

                <Field
                  name="provincia_sl"
                  label="Provincia"
                  defaultValue={fornitore?.provincia_sl}
                  required
                />

                <Field
                  name="indirizzo_sl"
                  label="Indirizzo"
                  defaultValue={fornitore?.indirizzo_sl}
                  required
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">Sede operativa</h3>
                <p className="text-sm text-muted-foreground">
                  Indirizzo italiano della sede operativa.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <Field
                  name="cap_so"
                  label="CAP"
                  defaultValue={fornitore?.cap_so}
                />

                <Field
                  name="citta_so"
                  label="Città"
                  defaultValue={fornitore?.citta_so}
                />

                <Field
                  name="provincia_so"
                  label="Provincia"
                  defaultValue={fornitore?.provincia_so}
                />

                <Field
                  name="indirizzo_so"
                  label="Indirizzo"
                  defaultValue={fornitore?.indirizzo_so}
                />
              </div>
            </div>
          )}

          {isEstero && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Indirizzi esteri</h3>
                <p className="text-sm text-muted-foreground">
                  Per stati diversi da IT vengono richiesti solo gli indirizzi
                  estesi.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  name="indirizzo_sl_ext"
                  label="Indirizzo estero sede legale"
                  defaultValue={fornitore?.indirizzo_sl_ext}
                  required
                />

                <Field
                  name="indirizzo_so_ext"
                  label="Indirizzo estero sede operativa"
                  defaultValue={fornitore?.indirizzo_so_ext}
                />
              </div>
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