// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("CalcolatoreRitardoInterventi");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("CalcolatoreRitardoInterventi");
import { useState } from "react";
import { Card, Select, TextInput, Field, useTable } from "../floware";

function leggiData(testo) {__mk();
  const valore = testo.trim();
  const italiana = valore.includes("/");
  const parti = italiana ? valore.split("/") : valore.split("-");
  if (parti.length !== 3 || parti.some((p) => (__mk(), p.trim() === ""))) return null;
  const anno = Number(italiana ? parti[2] : parti[0]);
  const mese = Number(parti[1]);
  const giorno = Number(italiana ? parti[0] : parti[2]);
  if (!Number.isInteger(anno) || !Number.isInteger(mese) || !Number.isInteger(giorno) || anno < 1000 || anno > 9999) return null;
  const tempo = Date.UTC(anno, mese - 1, giorno);
  const data = new Date(tempo);
  if (data.getUTCFullYear() !== anno || data.getUTCMonth() !== mese - 1 || data.getUTCDate() !== giorno) return null;
  return { tempo, iso: String(anno) + "-" + (mese < 10 ? "0" : "") + String(mese) + "-" + (giorno < 10 ? "0" : "") + String(giorno) };
}

export default function CalcolatoreRitardoInterventi(props) {__mk();
  const table = useTable(props.pageId);
  const [scelta, setScelta] = useState("");
  if (!table) return null;
  const iVia = table.column("Via");
  const iPrevista = table.column("Data prevista");
  const iFine = table.column("Data fine lavori");
  if (iPrevista < 0 || iFine < 0) return <Card title="Calcolatore dei giorni di ritardo"><p>Servono le colonne Data prevista e Data fine lavori.</p></Card>;
  const opzioni = table.rows.map((riga, indice) => (__mk(), String(indice + 1) + " · " + (iVia >= 0 ? riga[iVia] : "Intervento")));
  const selezionata = opzioni.includes(scelta) ? scelta : (opzioni[0] || "");
  const indice = opzioni.indexOf(selezionata);
  const riga = table.rows[indice];
  if (!riga) return <Card title="Calcolatore dei giorni di ritardo"><p>Non ci sono interventi da calcolare.</p></Card>;
  const prevista = leggiData(riga[iPrevista]);
  const fine = leggiData(riga[iFine]);
  const fineAssente = riga[iFine].trim() === "" || riga[iFine].trim() === "—";
  const ritardo = prevista && fine ? Math.max(0, Math.round((fine.tempo - prevista.tempo) / 86400000)) : null;
  const aggiorna = (colonna, valore) => {__mk();
    if (valore === "" || leggiData(valore)) table.setCell(indice, colonna, valore);
  };
  return (
    <Card title="Calcolatore dei giorni di ritardo">
      <div className="grid gap-3">
        <Select label="Intervento" value={selezionata} options={opzioni} onChange={setScelta} />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextInput label="Data prevista" type="date" value={prevista ? prevista.iso : ""} onChange={(valore) => (__mk(), aggiorna(iPrevista, valore))} />
          <TextInput label="Data fine lavori" type="date" value={fine ? fine.iso : ""} onChange={(valore) => (__mk(), aggiorna(iFine, valore))} />
        </div>
        <div aria-live="polite" aria-atomic="true">
          {ritardo !== null ? <Field label="Ritardo in giorni di calendario"><strong>{ritardo === 1 ? "1 giorno" : String(ritardo) + " giorni"}</strong></Field> : <p>{fineAssente ? "Il ritardo è calcolabile solo dopo aver inserito la data di fine lavori." : !fine ? "Indica una data di fine lavori valida." : "Indica una data prevista valida per calcolare il ritardo."}</p>}
        </div>
        <p className="text-sm text-(--mk-muted)">Il ritardo è zero se i lavori terminano entro la data prevista. Si contano anche sabati, domeniche e festivi. Le date modificate vengono aggiornate nell’intervento e restano solo in memoria.</p>
      </div>
    </Card>
  );
}
