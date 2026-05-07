import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { signupAction } from "../action/signupAction";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function SignupForm({ className, ...props }) {

  const supabase = await createSupabaseServerClient();

  const { data: ruoli, error: errorRuoli } = await supabase
    .from("ruolo")
    .select("*")
    .order("ruolo", { ascending: true });

  if (errorRuoli) {
    console.error("Errore recupero ruoli:", errorRuoli.message);
  }

  console.log(ruoli)

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