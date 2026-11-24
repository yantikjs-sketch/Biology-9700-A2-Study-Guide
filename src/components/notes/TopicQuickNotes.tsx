import React from 'react';

interface TopicQuickNotesProps {
  topicId: 'respiration' | 'photosynthesis' | 'control';
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

  if (topicId === 'control') {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <h2 className="text-xl font-semibold text-slate-900">
            01. Striated Muscle Sarcomere Band Changes (9700 Exam Table)
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            During contraction, thin actin filaments slide inward over thick myosin filaments toward the M-line.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-3 pr-4 font-medium">Structure / Zone</th>
                  <th className="py-3 pr-4 font-medium">Composition</th>
                  <th className="py-3 font-medium">Change on Contraction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-3.5 pr-4 font-medium">A-band (Dark)</td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    Full length of thick myosin filaments (+ overlapping actin)
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-violet-700">
                    Stays CONSTANT
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium">I-band (Light)</td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    Thin actin filaments only (no myosin overlap)
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-sky-700">
                    Shortens / narrows
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium">H-zone</td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    Central region of A-band with myosin only
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-amber-700">
                    Shortens / may disappear
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium">Z-lines (Sarcomere)</td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    Attachment discs anchoring actin filaments
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-slate-900">
                    Move closer together
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-3 shadow-xs">
            <h3 className="text-lg font-semibold text-slate-900">
              02. Action Potential &amp; Cholinergic Synapse Checklist
            </h3>
            <ul className="space-y-2.5 text-base leading-relaxed text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Resting (-70 mV):</span>{' '}
                3 Na+ pumped out, 2 K+ pumped in by Na+/K+ ATPase; K+ leak channels open while voltage-gated Na+ channels stay closed.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Saltatory conduction:</span>{' '}
                Myelin insulates internodes so local circuits jump between nodes of Ranvier (~50× faster).
              </li>
              <li>
                <span className="font-semibold text-slate-900">Synaptic roles:</span>{' '}
                Ca2+ influx → ACh exocytosis → ligand-gated Na+ influx → AChE hydrolysis into choline + ethanoic acid ensures unidirectional transmission and prevents overstimulation.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-3 shadow-xs">
            <h3 className="text-lg font-semibold text-slate-900">
              03. Plant Coordination (9700 Key Mechanisms)
            </h3>
            <ul className="space-y-2.5 text-base leading-relaxed text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Venus flytrap:</span>{' '}
                2 hair deflections within ~20–30 s fire an action potential across lobes → H+ wall acidification &amp; rapid osmotic turgor snap.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Auxin (IAA):</span>{' '}
                Stimulates H+-ATPase proton pumps → low wall pH activates expansins → breaks H-bonds between cellulose microfibrils → turgor elongation.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Gibberellin (GA):</span>{' '}
                Embryo GA triggers DELLA repressor breakdown in barley aleurone cells, activating amylase transcription to hydrolyse endosperm starch.
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <h2 className="text-xl font-semibold text-slate-900">
            04. Types of Neurones &amp; Structural Comparison (9700)
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-3 pr-4 font-medium">Neurone Type</th>
                  <th className="py-3 pr-4 font-medium">Cell Body Position</th>
                  <th className="py-3 pr-4 font-medium">Dendron / Dendrites</th>
                  <th className="py-3 font-medium">Axon &amp; Myelination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-3.5 pr-4 font-medium">Sensory Neurone</td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    Dorsal root ganglion (outside CNS)
                  </td>
                  <td className="py-3.5 pr-4">
                    1 long dendron from receptor to cell body
                  </td>
                  <td className="py-3.5">
                    Shorter axon entering CNS · Myelinated (Schwann cells)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium">Relay (Intermediate)</td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    CNS grey matter (brain / spinal cord)
                  </td>
                  <td className="py-3.5 pr-4">
                    Many short, highly branched dendrites
                  </td>
                  <td className="py-3.5">
                    Short unmyelinated axon wholly within CNS
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium">Motor Neurone</td>
                  <td className="py-3.5 pr-4 text-slate-600">
                    CNS grey matter (brain / spinal cord)
                  </td>
                  <td className="py-3.5 pr-4">
                    Many short dendrites around cell body
                  </td>
                  <td className="py-3.5">
                    Long myelinated axon to muscle / gland effector
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-6 space-y-2.5 shadow-xs">
          <h3 className="text-lg font-semibold text-slate-900">
            05. Chemoreceptors for Taste (Tongue Taste Buds · 9700)
          </h3>
          <p className="text-base leading-relaxed text-slate-700">
            <span className="font-semibold text-slate-900">Salt (Na+) Transduction:</span>{' '}
            Na+ ions dissolve in saliva and diffuse through the taste pore → enter chemoreceptor microvilli via apical Na+ channels → depolarise membrane (graded <span className="font-semibold">receptor potential</span>) → open basal voltage-gated Ca2+ channels → Ca2+ influx triggers neurotransmitter exocytosis → depolarises sensory neurone above threshold to fire <span className="font-semibold">action potentials</span> to the brain.
          </p>
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
