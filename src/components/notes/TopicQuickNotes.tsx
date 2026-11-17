import React from 'react';

interface TopicQuickNotesProps {
  topicId: 'respiration' | 'photosynthesis';
}

export const TopicQuickNotes: React.FC<TopicQuickNotesProps> = ({
  topicId,
}) => {
  if (topicId === 'respiration') {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <h2 className="text-xl font-semibold text-slate-900">
            01. Aerobic Respiration Yield per Glucose (9700 Balance Sheet)
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            All stoichiometric figures are per 1 mole of glucose (C6H12O6) oxidised.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-3 pr-4 font-medium">Stage</th>
                  <th className="py-3 pr-4 font-medium">Location</th>
                  <th className="py-3 pr-4 font-medium">CO2</th>
                  <th className="py-3 pr-4 font-medium">Coenzymes Reduced</th>
                  <th className="py-3 font-medium">Direct ATP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-3.5 pr-4 font-medium">Glycolysis</td>
                  <td className="py-3.5 pr-4 text-slate-600">Cytoplasm</td>
                  <td className="py-3.5 pr-4 font-mono tabular-nums">0</td>
                  <td className="py-3.5 pr-4 font-mono tabular-nums">2 NADH</td>
                  <td className="py-3.5 font-mono tabular-nums">
                    +2 (net substrate-level)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium">Link Reaction (×2)</td>
                  <td className="py-3.5 pr-4 text-slate-600">Mitochondrial matrix</td>
                  <td className="py-3.5 pr-4 font-mono tabular-nums">2</td>
                  <td className="py-3.5 pr-4 font-mono tabular-nums">2 NADH</td>
                  <td className="py-3.5 font-mono tabular-nums">0</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium">Krebs Cycle (×2)</td>
                  <td className="py-3.5 pr-4 text-slate-600">Mitochondrial matrix</td>
                  <td className="py-3.5 pr-4 font-mono tabular-nums">4</td>
                  <td className="py-3.5 pr-4 font-mono tabular-nums">
                    6 NADH · 2 FADH2
                  </td>
                  <td className="py-3.5 font-mono tabular-nums">
                    +2 (substrate-level)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium">
                    Oxidative Phosphorylation
                  </td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    Inner membrane (cristae)
                  </td>
                  <td className="py-3.5 pr-4 font-mono tabular-nums">0</td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    Re-oxidises 10 NADH + 2 FADH2
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-blue-700 tabular-nums">
                    ~26–28 (chemiosmosis)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-3 shadow-xs">
            <h3 className="text-lg font-semibold text-slate-900">
              02. Energy Values of Respiratory Substrates
            </h3>
            <div className="space-y-2.5 text-base leading-relaxed text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Lipids (~39.4 kJ g⁻¹):</span>{' '}
                Highest proportion of C–H bonds; produces the most reduced NAD/FAD per
                gram and twice the ATP of carbohydrates (RQ ≈ 0.7).
              </p>
              <p>
                <span className="font-semibold text-slate-900">Proteins (~17.0 kJ g⁻¹):</span>{' '}
                Deaminated first; keto acids enter glycolysis or Krebs cycle (RQ ≈ 0.9).
              </p>
              <p>
                <span className="font-semibold text-slate-900">Carbohydrates (~15.8 kJ g⁻¹):</span>{' '}
                Primary immediate fuel; glucose oxidised directly (RQ = 1.0).
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-3 shadow-xs">
            <h3 className="text-lg font-semibold text-slate-900">
              03. Rice (Oryza sativa) Flood Adaptations
            </h3>
            <ul className="space-y-2.5 text-base leading-relaxed text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Aerenchyma tissue:</span>{' '}
                Continuous air channels transport atmospheric O2 from aerial leaves down
                to submerged root cortex cells.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Rapid internode elongation:</span>{' '}
                Triggered by trapped ethene + gibberellin to keep foliage above water.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Ethanol tolerance:</span>{' '}
                Root cells tolerate higher ethanol concentrations and produce abundant
                alcohol dehydrogenase during temporary anoxia.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <h2 className="text-xl font-semibold text-slate-900">
          01. Cyclic vs Non-Cyclic Photophosphorylation (9700 Comparison)
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-3 pr-4 font-medium">Feature</th>
                <th className="py-3 pr-4 font-medium">
                  Non-Cyclic Photophosphorylation
                </th>
                <th className="py-3 font-medium">
                  Cyclic Photophosphorylation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="py-3.5 pr-4 font-medium">Photosystems involved</td>
                <td className="py-3.5 pr-4">PSII (P680) and PSI (P700)</td>
                <td className="py-3.5">PSI (P700) only</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium">Photolysis of water</td>
                <td className="py-3.5 pr-4">Yes — supplies e- to PSII &amp; releases O2</td>
                <td className="py-3.5">No photolysis; no O2 released</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium">Final electron destination</td>
                <td className="py-3.5 pr-4">NADP+ (forming reduced NADP)</td>
                <td className="py-3.5">Returns to PSI via cytochrome b6f</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium">Products formed</td>
                <td className="py-3.5 pr-4 font-mono text-emerald-800">
                  ATP · Reduced NADP · O2
                </td>
                <td className="py-3.5 font-mono text-amber-800">ATP only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-3 shadow-xs">
          <h3 className="text-lg font-semibold text-slate-900">
            02. Mitochondrion vs Chloroplast Chemiosmosis
          </h3>
          <div className="space-y-2.5 text-base leading-relaxed text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Proton reservoir:</span>{' '}
              Mitochondria pump H+ into the intermembrane space; chloroplasts pump H+ into
              the thylakoid lumen.
            </p>
            <p>
              <span className="font-semibold text-slate-900">ATP synthase output side:</span>{' '}
              ATP forms in the mitochondrial matrix (respiration) vs chloroplast stroma
              (photosynthesis).
            </p>
            <p>
              <span className="font-semibold text-slate-900">Electron source:</span>{' '}
              NADH/FADH2 from oxidised organic substrates vs photolysis of H2O.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-3 shadow-xs">
          <h3 className="text-lg font-semibold text-slate-900">
            03. Calvin Cycle Stoichiometry &amp; Fate of TP (9700)
          </h3>
          <ul className="space-y-2.5 text-base leading-relaxed text-slate-700">
            <li>
              <span className="font-semibold text-slate-900">Per 3 CO2 fixed:</span>{' '}
              Forms 6 GP (3C) → reduced to 6 TP (3C) using 6 ATP and 6 reduced NADP; 1 TP
              exits while 5 TP regenerate 3 RuBP using 3 more ATP.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Carbohydrate synthesis:</span>{' '}
              Pairs of exported TP (3C) condense into hexose phosphates (glucose, fructose)
              for sucrose transport, starch storage, and cellulose cell walls.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Lipids &amp; amino acids:</span>{' '}
              TP forms glycerol (and acetyl CoA → fatty acids for lipids), while GP/TP
              combined with absorbed nitrate ions synthesise amino acids.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
