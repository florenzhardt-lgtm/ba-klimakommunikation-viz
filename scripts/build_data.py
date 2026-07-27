#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Baut public/data.json aus der autoritativen Kodierung der Bachelorarbeit.
Quelle: /Users/florenz/Documents/Bachelorarbeit/Korpus/_kodierung.csv (1508 Segmente).
Nur Lesen der BA-Ordner. Aggregiert Code-Counts pro Firma x Jahr, leitet
Trajektorie (3D) + Spektrum-Koordinaten ab und merged kuratierte Hero-Events.
"""
import csv, json, os

CSV = "/Users/florenz/Documents/Bachelorarbeit/Korpus/_kodierung.csv"
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "data", "data.json")

YEARS = list(range(2010, 2025))
COMPANIES = ["RWE", "VW", "BASF"]
SUBCODES = ["1a","1b","2a","2b","2c","2d","3a","3b","4a","4b","4c","4d","5a"]

META = {
    "years": YEARS,
    "companies": COMPANIES,
    "colors": {"RWE": "#38bdf8", "VW": "#a78bfa", "BASF": "#34d399"},
    "codeLabels": {
        "1a": "Kurzfristig", "1b": "Langfristig",
        "2a": "Polarisierung", "2b": "Win-Win", "2c": "Trade-off explizit", "2d": "Juxtaposition",
        "3a": "substanziell", "3b": "symbolisch",
        "4a": "präzisiert", "4b": "unverändert", "4c": "abgeschwächt", "4d": "entfernt",
        "5a": "Sektor-Selbstverortung",
    },
}

ARCH = {
    "RWE":  {"label": "Offener Konflikt · U-Form", "ratio": 1.41,
             "tagline": "Krisengetriebener Oszillierer: Framing und Substanz brechen ein und bauen sich wieder auf."},
    "VW":   {"label": "Institutionalisierte Gleichzeitigkeit · Zielhierarchie-Puffer", "ratio": 1.76,
             "tagline": "Hält beide Horizonte dauerhaft nebeneinander; das Produktziel atmet, das Leitziel bleibt."},
    "BASF": {"label": "Substanziell gedeckte Glättung · Treppe", "ratio": 2.0,
             "tagline": "Win-Win, aber mit harter Substanz gedeckt; Ziele steigen monoton, die Last wird vertagt."},
}

# Krisen-/Konvergenzjahre (Kap. 4.4 / _THEMEN_LEDGER)
CRISIS = {
    2011: {"label": "Fukushima", "affects": ["RWE"],
           "note": "Atomausstieg trifft nur RWEs Geschäftsmodell — Beginn der Ziel-Rücknahme."},
    2015: {"label": "Dieselgate", "affects": ["VW"],
           "note": "Der Skandal treibt VWs Zielkaskade an (kein Rückzug) — Gegenstück zu RWE."},
    2016: {"label": "RWE-Zielstreichung", "affects": ["RWE"],
           "note": "Einzige vollständige Streichung eines Klimaziels im Korpus (4d)."},
    2020: {"label": "Corona", "affects": [],
           "note": "Kontext, kein Bruch — VW schärft sogar nach. Keine Ziel-Rücknahme."},
    2024: {"label": "Konvergenz", "affects": ["RWE", "VW", "BASF"],
           "note": "Alle drei kippen kurzfristig — in drei Formen: Kürzung / Verlagerung / Fälligkeit. Aufschub statt Streichung."},
}

# Kuratierte Hero-Events: verifiziert gegen die gedruckten Seiten der Kap_4-Entwürfe.
# page = gedruckte Seite (Entwurf), sofern nicht anders vermerkt.
CURATED = {
    "RWE": [
        (2010, "S. 7", "1b", "bis 2025 sollen 75 Prozent unserer Stromerzeugungskapazität CO₂-frei oder CO₂-arm sein",
         "Phase 1: weitreichendes Langfristziel — aber Win-Win ist eingebaut (30 % Erneuerbare + 30 % Gas + 15 % Kernkraft)."),
        (2011, "S. 30", "4c", "ein wichtiger Baustein unserer bisherigen CO₂-Minderungsstrategie [ist] weggefallen",
         "Fukushima/Atomausstieg als exogener Bruch — Phase 2 (Polarisierung) beginnt."),
        (2016, "S. 22", "4d", "geben wir für den Konzern keine konkreten Emissionsminderungsziele mehr aus",
         "Die Zielstreichung nach der innogy-Abspaltung — Polarisierung erreicht ihren Höchstwert."),
        (2019, "Leitziel", "4a", "Klimaneutralität bis 2040",
         "Phase 3: neues Leitziel, zunehmend mit prüfbaren Daten gedeckt."),
        (2022, "S. 22", "4a", "bereits Ende März 2030 den letzten Braunkohleblock vom Netz … acht Jahre vor dem ursprünglichen Enddatum",
         "Kohleausstieg um acht Jahre vorgezogen; Vergütung an CO₂-Ziele gekoppelt."),
        (2024, "S. 23", "4c", "ein Viertel weniger, als wir bisher … veranschlagt haben",
         "Konvergenzjahr: Nettoinvestitionen 2025–2030 auf 35 Mrd. € gekürzt — offene Kürzung, Leitziel unangetastet."),
    ],
    "VW": [
        (2010, "S. 23", "1b", "an der Spitze der Automobilindustrie stehen … ökonomisch und ökologisch",
         "Die Win-Win-Formel wird gesetzt; Nachhaltigkeit als Fundament (2010, symbolisch)."),
        (2012, "S. 23", "4a", "als erster Autobauer 95 g CO₂/km bis 2020",
         "Start der neunjährigen Präzisierungs-Kaskade (4a in jedem Jahr 2012–2022)."),
        (2015, "S. 133", "4c", "95-g-Ziel verschiebt sich 2020 → 2021",
         "Dieselgate: einzige Krisen-Reaktion — Polarisierung tritt nur in Krisenjahren auf."),
        (2019, "S. 7", "1b", "die klügste Wahl für all jene Anleger",
         "goTOzero: −30 % Flotten-CO₂ bis 2025, klimaneutral 2050; Selbstbeschreibung am Kapitalmarkt."),
        (2022, "S. 67", "4a", "Dekarbonisierungsindex in der Vorstandsvergütung",
         "Produktions-CO₂-Ziel −30 % → −50 % bis 2030 verschärft; härtester Substanzmarker."),
        (2024, "S. 150", "4c", "weltweit zunehmend batterieelektrische Modelle anbieten",
         "Konvergenzjahr: das Produktziel wird gelockert („zunehmend“ statt „bis 2030 durchgängig“) — 2050 bleibt: Zielhierarchie als Puffer."),
    ],
    "BASF": [
        (2010, "S. 97", "5a", "Unternehmen einer energieintensiven Branche",
         "Sektor-Selbstverortung + Win-Win-Basis; 7,7 Mrd. € 2010 mit Klimaschutzprodukten."),
        (2015, "S. 29", "4d", "nicht mehr an den für 2020 formulierten Finanzzielen fest[zuhalten]",
         "Rücknahme — aber eines FINANZziels. Das Klimaversprechen bleibt (Kontrast zu RWE 2016)."),
        (2018, "S. 103", "4a", "CO₂-neutrale[s] Wachstum bis 2030",
         "Neues Leitziel; ab hier steigen explizite Trade-offs (2c) — billige Minderung ist ausgereizt."),
        (2021, "S. 9", "4a", "bis 2030 … globale CO₂-Emissionen im Vergleich zu 2018 um 25 % senken … Netto-Null bis 2050",
         "Absolutes Ziel + Netto-Null; ~4 Mrd. € Investition."),
        (2023, "S. 11", "4a", "spezifischen Scope-3.1-Emissionen um 15 % im Vergleich zum Jahr 2022 senken",
         "Scope-3.1-Ziel ergänzt — die Treppe steigt weiter."),
        (2024, "S. 183", "4b", "die meisten der größeren Investitionsausgaben für unsere grüne Transformation nach 2030 anfallen",
         "Konvergenzjahr: Ziel UND Betrag gehalten — nur die Fälligkeit rutscht nach 2030 (verzögerte Fälligkeit)."),
    ],
}


def norm_company(v):
    v = v.strip().upper()
    if v.startswith("R"): return "RWE"
    if v.startswith("V"): return "VW"
    if v.startswith("B"): return "BASF"
    return v


def main():
    rows = list(csv.reader(open(CSV, encoding="utf-8"), delimiter=";", quotechar='"'))
    data = rows[1:]

    # counts[company][year][subcode]
    counts = {c: {y: {s: 0 for s in SUBCODES} for y in YEARS} for c in COMPANIES}
    for r in data:
        if len(r) != 9:
            continue
        comp = norm_company(r[0])
        try:
            year = int(r[1])
        except ValueError:
            continue
        if comp not in counts or year not in counts[comp]:
            continue
        sub = (r[5].split() or [""])[0]
        if sub in SUBCODES:
            counts[comp][year][sub] += 1

    # --- Ziel-Ambition: kumulierte HK4-Bewegung (4a +1 / 4c -1 / 4d -2),
    # fortgeschrieben, global auf >= 0 offsetiert (enthält alle HK4, auch Finanzziele) ---
    ambition_raw = {c: [] for c in COMPANIES}
    for c in COMPANIES:
        cum = 0.0
        for y in YEARS:
            cc = counts[c][y]
            cum += cc["4a"] * 1.0 + cc["4c"] * -1.0 + cc["4d"] * -2.0
            ambition_raw[c].append(cum)
    amb_min = min(v for c in COMPANIES for v in ambition_raw[c])
    ambition = {c: [round(v - amb_min, 3) for v in ambition_raw[c]] for c in COMPANIES}

    companies = {}
    for c in COMPANIES:
        yearly = {}
        for y in YEARS:
            cc = counts[c][y]
            yearly[str(y)] = dict(cc)

        # --- Trajektorie (3D-Höhe) = substanzielle Klimakommunikation je Jahr ---
        # Der Thesis-Befund: "Framing UND Substanz bewegen sich gemeinsam, brechen in
        # der Krise ein und bauen sich wieder auf." Die U-Form IST die Substanz-Kurve (3a).
        # height = 3a (substanziell); long = 1b (Langfrist-Stützkurve); break aus HK4 4d.
        traj = []
        for idx, y in enumerate(YEARS):
            cc = counts[c][y]
            traj.append({"year": y,
                         "height": cc["3a"],          # (Legacy) substanzielle Segmente
                         "sym": cc["3b"],             # symbolische Gegenkurve
                         "long": cc["1b"],            # Langfrist-Bezüge
                         "metrics": {                 # drei umschaltbare 3D-Höhen
                             "substanz": cc["3a"],    # inhaltlich gedeckt -> U/Treppe/Kaskade
                             "langfrist": cc["1b"],   # Langfrist-Dominanz
                             "ambition": ambition[c][idx],  # Ziel-Entwicklung (HK4 kumuliert)
                         },
                         "break": cc["4d"] > 0,       # sichtbarer Bandriss (RWE 2016)
                         "moves": {"4a": cc["4a"], "4b": cc["4b"], "4c": cc["4c"], "4d": cc["4d"]}})

        # --- Spektrum: x Polarisierung<->Juxtaposition, y symbolisch<->substanziell ---
        spectrum = []
        for y in YEARS:
            cc = counts[c][y]
            hk2 = cc["2a"] + cc["2b"] + cc["2c"] + cc["2d"]
            hk3 = cc["3a"] + cc["3b"]
            x = (cc["2d"] - cc["2a"]) / hk2 if hk2 else None
            yv = (cc["3a"] - cc["3b"]) / hk3 if hk3 else None
            spectrum.append({"year": y, "x": round(x, 3) if x is not None else None,
                             "y": round(yv, 3) if yv is not None else None})
        # fehlende Werte forward/back-fill (Orbs sollen nie springen)
        for arr, key in [(spectrum, "x"), (spectrum, "y")]:
            last = 0.0
            for p in arr:
                if p[key] is None: p[key] = last
                else: last = p[key]

        events = [{"year": y, "page": pg, "type": t, "quote": q, "note": n, "curated": True}
                  for (y, pg, t, q, n) in CURATED[c]]

        totals = {s: sum(counts[c][y][s] for y in YEARS) for s in SUBCODES}
        companies[c] = {
            "label": ARCH[c]["label"], "ratio": ARCH[c]["ratio"], "tagline": ARCH[c]["tagline"],
            "totals": totals, "total": sum(totals.values()),
            "yearly": yearly, "trajectory": traj, "spectrum": spectrum, "events": events,
        }

    out = {"meta": META, "crisisYears": {str(k): v for k, v in CRISIS.items()}, "companies": companies}

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    # --- Verifikation ---
    print("Geschrieben:", os.path.abspath(OUT))
    for c in COMPANIES:
        t = companies[c]["totals"]
        print(f"  {c}: total={companies[c]['total']}  2a={t['2a']} 2b={t['2b']} 5a={t['5a']}  "
              f"1a={t['1a']} 1b={t['1b']}")
    grand = sum(companies[c]["total"] for c in COMPANIES)
    pol = sum(companies[c]["totals"]["2a"] for c in COMPANIES)
    print(f"  GESAMT={grand} (erwartet 1508)  Polarisierung 2a={pol} (erwartet 90)")


if __name__ == "__main__":
    main()
