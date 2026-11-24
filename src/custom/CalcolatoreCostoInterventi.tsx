// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("CalcolatoreCostoInterventi");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("CalcolatoreCostoInterventi");
import { useState } from "react";
import { Card, TextInput, Field } from "../floware";

export default function CalcolatoreCostoInterventi(props) {__mk();
  const [metri, setMetri] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const mq = Number(metri.trim().replace(",", "."));
  const unitario = Number(prezzo.trim().replace(",", "."));
  const presenti = metri.trim() !== "" && prezzo.trim() !== "";
  const validi = isFinite(mq) && isFinite(unitario) && mq >= 0 && unitario >= 0;
  const prodotto = mq * unitario;
  const imponibile = Math.round(prodotto * 100) / 100;
  const iva = Math.round(imponibile * 22) / 100;
  const totale = imponibile + iva;
  const calcolabile = presenti && validi && isFinite(totale);
  const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });
  const errore = (metri.trim() !== "" && (!isFinite(mq) || mq < 0)) || (prezzo.trim() !== "" && (!isFinite(unitario) || unitario < 0)) || (presenti && validi && !isFinite(totale));
  return (
    <Card title="Calcolatore del costo stimato">
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextInput label="Superficie (m²)" value={metri} onChange={setMetri} placeholder="Es. 100" />
          <TextInput label="Prezzo per m² (€)" value={prezzo} onChange={setPrezzo} placeholder="Es. 25,50" />
        </div>
        <p className="text-sm text-(--mk-muted)">Usa numeri non negativi, senza separatori delle migliaia. Sono ammessi decimali con virgola o punto.</p>
        {errore && <p role="alert" className="text-sm text-(--mk-danger)">Indica valori numerici non negativi e di importo valido.</p>}
        <div aria-live="polite" aria-atomic="true" className="grid gap-3 sm:grid-cols-3">
          <Field label="Imponibile">{calcolabile ? euro.format(imponibile) : "—"}</Field>
          <Field label="IVA (22%)">{calcolabile ? euro.format(iva) : "—"}</Field>
          <Field label="Totale complessivo"><strong>{calcolabile ? euro.format(totale) : "—"}</strong></Field>
        </div>
        <p className="text-sm text-(--mk-muted)">Imponibile = superficie × prezzo unitario. Importi arrotondati ai centesimi. Il calcolo non modifica gli interventi.</p>
      </div>
    </Card>
  );
}
