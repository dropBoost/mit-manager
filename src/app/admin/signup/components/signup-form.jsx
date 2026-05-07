'use client'

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input";
import { signupAction } from "../action/signupAction";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { DialogSuperAdminPassword } from "@/components/dialogSuperAdminPassword";

export function SignupForm({ className, ...props }) {

  const supabase = createSupabaseBrowserClient();
  const [searchPrefix, setSearchPrefix] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("");
  const [ruoli, setRuoli] = useState([]);
  const [stato, setStato] = useState([]);

  useEffect(() => {
    async function fetchRuoli() {
      const { data, error } = await supabase
        .from("ruolo")
        .select("*")
        .order("ruolo", { ascending: true });

      if (error) {
        console.error("Errore recupero ruoli:", error.message);
        return;
      }

      setRuoli(data || []);
    }

    fetchRuoli();
  }, []);

  useEffect(() => {
    async function fetchStati() {
      const { data, error } = await supabase
        .from("cod_stato")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Errore recupero stati:", error.message);
        return;
      }

      setStato(data || []);
    }

    fetchStati();
  }, []);

  const statiFiltrati = (stato || []).filter((item) => {
    const search = String(searchPrefix || "").toLowerCase();

    return (
      String(item.phone_prefix || "").toLowerCase().includes(search) ||
      String(item.stato || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={signupAction} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Crea un account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Inserisci le informazioni qui sotto per creare un account
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="mobile">Mobile</FieldLabel>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="333 33 33 333"
                  required
                />
                <FieldDescription>
                  Useremo queste informazioni per contattarti e per l'accesso alla piattaforma.
                </FieldDescription>
              </Field>

              <Combobox
                items={stato || []}
                value={phonePrefix || ""}
                onValueChange={(value) => {
                  const safeValue = value || "";
                  const item = (stato || []).find((s) => s.phone_prefix === safeValue);

                  setPhonePrefix(safeValue);
                  setSearchPrefix(
                    item ? `${item.phone_prefix || ""} | ${item.stato || ""}` : safeValue
                  );
                }}
              >
                <ComboboxInput
                  placeholder="Seleziona prefisso"
                  value={searchPrefix || ""}
                  onChange={(e) => setSearchPrefix(e.target.value)}
                />

                <ComboboxContent>
                  <ComboboxEmpty>Nessun prefisso trovato.</ComboboxEmpty>

                  <ComboboxList>
                    {statiFiltrati.map((item) => (
                      <ComboboxItem key={item.id} value={item.phone_prefix}>
                        {item.phone_prefix} | {item.stato}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <Field>
                <FieldLabel htmlFor="nome">Nome</FieldLabel>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Mario"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="cognome">Cognome</FieldLabel>
                <Input
                  id="cognome"
                  name="cognome"
                  type="text"
                  placeholder="Rossi"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="ruolo">Ruolo</FieldLabel>

                <Select name="ruolo" defaultValue="manager">
                  <SelectTrigger id="ruolo" className="w-full">
                    <SelectValue placeholder="Seleziona ruolo" />
                  </SelectTrigger>

                  <SelectContent>
                    {ruoli?.map((r) => (
                      <SelectItem key={r.id} value={r.id} className={``}>{r.ruolo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      minLength={8}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Conferma Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      minLength={8}
                      required
                    />
                  </Field>
                </div>

                <FieldDescription>*almeno 8 caratteri</FieldDescription>
              </Field>

              <Field>
                <Button type="submit">Crea Account</Button>
              </Field>

              <FieldDescription className="text-center">
                Hai già un account? <a href="#">Accedi</a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/mitjapan.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.3] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Cliccando su CREA ACCOUNT, accetti i nostri Termini di servizio e l'Informativa sulla privacy.
      </FieldDescription>
    </div>
  );
}