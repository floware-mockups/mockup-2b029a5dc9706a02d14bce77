// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ContoAllaRovesciaInterventi");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ContoAllaRovesciaInterventi");
import { useState, useEffect } from "react";
import { Card, Button, Field, useTable, usePrototype } from "../floware";

function leggiData(testo) {__mk();
  const valore = testo.trim();
  const parti = valore.includes("/") ? valore.split("/") : valore.split("-");
  if (parti.length !== 3) return null;
  const italiana = valore.includes("/");
  const anno = Number(italiana ? parti[2] : parti[0]);
  const mese = Number(parti[1]);
  const giorno = Number(italiana ? parti[0] : parti[2]);
  if (!Number.isInteger(anno) || !Number.isInteger(mese) || !Number.isInteger(giorno) || anno < 1000 || anno > 9999) return null;
  const data = new Date(anno, mese - 1, giorno);
  if (data.getFullYear() !== anno || data.getMonth() !== mese - 1 || data.getDate() !== giorno) return null;
  return data;
}

export default function ContoAllaRovesciaInterventi(props) {__mk();
  const table = useTable(props.pageId);
  const { openDetail } = usePrototype();
  const [adesso, setAdesso] = useState(() => (__mk(), Date.now()));
  useEffect(() => {__mk();
    const timer = setInterval(() => (__mk(), setAdesso(Date.now())), 60000);
    return () => (__mk(), clearInterval(timer));
  }, []);
  if (!table) return null;
  const iData = table.column("Data prevista");
  const iVia = table.column("Via");
  if (iData < 0) return <Card title="Prossimo intervento programmato"><p>La colonna Data prevista non è disponibile.</p></Card>;
  const candidati = table.rows.map((riga, indice) => ((__mk(), { indice, data: leggiData(riga[iData]), via: iVia >= 0 ? riga[iVia] : "Intervento" })));
  const futuri = candidati.filter((elemento) => (__mk(), elemento.data !== null && elemento.data.getTime() > adesso));
  futuri.sort((a, b) => (__mk(), a.data.getTime() - b.data.getTime()));
  const prossimo = futuri[0];
  const oggi = new Date(adesso);
  const giorni = prossimo ? Math.round((Date.UTC(prossimo.data.getFullYear(), prossimo.data.getMonth(), prossimo.data.getDate()) - Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate())) / 86400000) : 0;
  const formato = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "long", year: "numeric" });
  return (
    <Card title="Prossimo intervento programmato">
      <div className="grid gap-3">
        <div aria-live="polite" aria-atomic="true">
          {prossimo ? <div className="grid gap-3">
            <p className="text-2xl font-semibold">{giorni === 1 ? "Manca 1 giorno" : "Mancano " + giorni + " giorni"}</p>
            <Field label="Data prevista">{formato.format(prossimo.data)}</Field>
            <Field label="Intervento">{prossimo.via}</Field>
          </div> : <p>Non ci sono prossimi interventi programmati con una data futura.</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {prossimo && <Button onClick={() => (__mk(), openDetail(props.pageId, prossimo.indice))}>Apri intervento</Button>}
          <Button variant="secondary" onClick={() => (__mk(), setAdesso(Date.now()))}>Aggiorna ora</Button>
        </div>
        <p className="text-sm text-(--mk-muted)">Aggiornamento automatico ogni minuto. Conteggio in giorni di calendario; le date di oggi e quelle non valide sono escluse.</p>
      </div>
    </Card>
  );
}
