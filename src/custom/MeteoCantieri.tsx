// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("MeteoCantieri");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("MeteoCantieri");
import { Card, Badge, useTable } from "../floware";

export default function MeteoCantieri(props) {__mk();
  const table = useTable(props.pageId);
  if (!table) return null;
  const iVia = table.column("Via");
  const iStato = table.column("Stato");
  const scenari = [
    { giorni: 1, condizioni: "Sereno con nubi sparse", probabilita: 15, pioggia: false },
    { giorni: 2, condizioni: "Pioggia intermittente", probabilita: 80, pioggia: true },
    { giorni: 3, condizioni: "Rovesci nel pomeriggio", probabilita: 65, pioggia: true }
  ];
  const formato = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  const giorni = scenari.map((scenario) => {__mk();
    const data = new Date();
    data.setDate(data.getDate() + scenario.giorni);
    return { ...scenario, data: formato.format(data) };
  });
  const cantieri = iVia >= 0 && iStato >= 0 ? table.rows.filter((riga) => (__mk(), riga[iStato] !== "Concluso")) : [];
  return (
    <Card title="Meteo dimostrativo · zona dei cantieri">
      <div className="grid gap-4">
        <div>
          <Badge tone="neutral">Previsioni di esempio</Badge>
          <p className="mt-2 text-sm text-(--mk-muted)">Dati interamente inventati per i prossimi tre giorni, riferiti convenzionalmente alla stessa zona dei cantieri elencati. Nessun servizio meteo collegato: non usare per decisioni operative.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {giorni.map((giorno) => (
            (__mk(), <div key={giorno.giorni} className="rounded-lg border border-(--mk-border) bg-(--mk-subtle) p-3">
              <p className="font-semibold">{giorno.data}</p>
              <p className="mt-2">{giorno.condizioni}</p>
              <p className="mt-1 text-sm">Probabilità di pioggia: <strong>{giorno.probabilita}%</strong></p>
              {giorno.pioggia && <Badge tone="danger">Pioggia prevista · esempio</Badge>}
            </div>)
          ))}
        </div>
        <div role="note" className="rounded-lg border p-4" style={{ backgroundColor: "var(--mk-c-orange-soft)", borderColor: "var(--mk-c-orange)", color: "var(--mk-text)" }}>
          <p className="font-semibold">Attenzione: pioggia nello scenario dimostrativo</p>
          <p className="mt-1 text-sm">{giorni.filter((giorno) => (__mk(), giorno.pioggia)).map((giorno) => (__mk(), giorno.data)).join("; ")}. Richiamo alla verifica della programmazione e delle lavorazioni esposte, solo a titolo di esempio.</p>
          {cantieri.length > 0 && <p className="mt-2 text-sm"><strong>Cantieri non conclusi nella zona simulata:</strong> {cantieri.map((riga) => (__mk(), riga[iVia])).join("; ")}.</p>}
          {(iVia < 0 || iStato < 0) && <p className="mt-2 text-sm">Elenco dei cantieri non disponibile: servono le colonne Via e Stato.</p>}
          <p className="mt-2 text-sm">L’avviso non modifica stati, priorità o date degli interventi.</p>
        </div>
      </div>
    </Card>
  );
}
