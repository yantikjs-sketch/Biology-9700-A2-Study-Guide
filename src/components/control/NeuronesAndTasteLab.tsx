import React, { useEffect, useState } from 'react';
import { Brain, FlaskConical, Info, Pause, Play } from 'lucide-react';

type NeuroneType = 'sensory' | 'relay' | 'motor' | 'reflex';
type NeuronePartId =
  | 'cell-body'
  | 'dendrites'
  | 'axon'
  | 'myelin'
  | 'nodes'
  | 'terminals';
type TasteMode = 'salt' | 'sweet-bitter';
type TasteStrength = 'low' | 'moderate' | 'high';
type TasteStepId = 1 | 2 | 3 | 4;

interface NeuroneTypeMeta {
  id: NeuroneType;
  label: string;
  direction: string;
  cellBodyLocation: string;
  myelination: string;
  summary: string;
}

const NEURONE_TYPES: Record<NeuroneType, NeuroneTypeMeta> = {
  sensory: {
    id: 'sensory',
    label: 'Sensory Neurone',
    direction: 'Sensory receptor → Central Nervous System (CNS)',
    cellBodyLocation: 'Dorsal root ganglion (just outside spinal cord / CNS)',
    myelination: 'Myelinated long dendron & axon (fast saltatory conduction)',
    summary:
      'Carries impulses from sensory receptors (e.g. taste chemoreceptors or Pacinian corpuscles) to the CNS. Distinctively has one long dendron conducting impulses toward an off-centre cell body, and a shorter axon entering the CNS.',
  },
  relay: {
    id: 'relay',
    label: 'Relay (Intermediate) Neurone',
    direction: 'Sensory neurone → Motor neurone (wholly inside CNS)',
    cellBodyLocation: 'Grey matter of spinal cord or brain (CNS)',
    myelination: 'Unmyelinated short axon (short distance inside CNS)',
    summary:
      'Found completely within the CNS. Receives impulses from sensory neurones via numerous short, highly branched dendrites and integrates signals before synapsing with motor neurones.',
  },
  motor: {
    id: 'motor',
    label: 'Motor Neurone',
    direction: 'CNS → Effector (striated muscle or gland)',
    cellBodyLocation: 'Grey matter of spinal cord / brain (CNS)',
    myelination: 'Long myelinated axon (Schwann cells + nodes of Ranvier)',
    summary:
      'Has a large star-shaped cell body inside the CNS with many short dendrites receiving synaptic inputs, plus one long myelinated axon running out to effectors where axon terminals form neuromuscular junctions.',
  },
  reflex: {
    id: 'reflex',
    label: 'Reflex Arc Pathway',
    direction: 'Receptor → Sensory → Relay → Motor → Effector',
    cellBodyLocation: 'Sensory in ganglion · Relay & Motor inside CNS grey matter',
    myelination: 'Myelinated sensory & motor limbs; unmyelinated CNS relay',
    summary:
      'A rapid, involuntary pathway involving three neurones and two CNS synapses. Bypasses conscious brain processing first so protective withdrawal happens quickly.',
  },
};

interface NeuronePartDetail {
  id: NeuronePartId;
  label: string;
  structure: string;
  function: string;
  appliesTo: string;
}

const NEURONE_PARTS: Record<NeuronePartId, NeuronePartDetail> = {
  'cell-body': {
    id: 'cell-body',
    label: 'Cell Body (Soma)',
    structure:
      'Contains the nucleus, abundant rough endoplasmic reticulum (Nissl granules), ribosomes, and mitochondria.',
    function:
      'Synthesises proteins, ion channel proteins, and neurotransmitters (plus ATP for metabolism). Positioned in a ganglion on sensory neurones, or inside CNS grey matter on relay and motor neurones.',
    appliesTo: 'All neurones (location differs)',
  },
  dendrites: {
    id: 'dendrites',
    label: 'Dendrites / Dendron',
    structure:
      'Short, branched cytoplasmic extensions from the cell body (dendrites), or a single long fibre from receptor to cell body on a sensory neurone (dendron).',
    function:
      'Provide a large surface area for synapses and conduct electrical impulses TOWARD the cell body.',
    appliesTo: 'Sensory has 1 long dendron; Motor & Relay have many short dendrites',
  },
  axon: {
    id: 'axon',
    label: 'Axon',
    structure:
      'A single, slender cytoplasmic extension surrounded by an axolemma (plasma membrane) containing voltage-gated Na+ and K+ channels.',
    function:
      'Conducts action potentials AWAY from the cell body toward axon terminals. Very long in motor neurones; short in sensory and relay neurones.',
    appliesTo: 'All neurones',
  },
  myelin: {
    id: 'myelin',
    label: 'Schwann Cells & Myelin Sheath',
    structure:
      'Schwann cells wrap repeatedly around the axon/dendron in concentric lipid-rich membrane layers (myelin).',
    function:
      'Acts as an electrical insulator impermeable to Na+ and K+ ions, preventing depolarisation along internodes and dramatically increasing conduction velocity.',
    appliesTo: 'Myelinated sensory & motor neurones (absent on CNS relay neurones)',
  },
  nodes: {
    id: 'nodes',
    label: 'Nodes of Ranvier',
    structure:
      'Unmyelinated 1–2 µm gaps of exposed axolemma between adjacent Schwann cells where voltage-gated Na+ and K+ channels are densely clustered.',
    function:
      'Enable saltatory conduction: local electrical currents jump rapidly from one node to the next (~100 m s⁻¹ vs ~2 m s⁻¹ in unmyelinated axons).',
    appliesTo: 'Myelinated sensory & motor neurones',
  },
  terminals: {
    id: 'terminals',
    label: 'Axon Terminals (Synaptic Knobs)',
    structure:
      'Swollen branched tips containing many mitochondria, smooth ER, voltage-gated Ca2+ channels, and neurotransmitter vesicles (e.g. ACh).',
    function:
      'Transmit impulses across a synaptic cleft to the next neurone (in CNS) or across a neuromuscular junction to trigger muscle contraction.',
    appliesTo: 'All neurones',
  },
};

const TASTE_STEPS: Record<
  TasteStepId,
  {
    title: string;
    saltDetail: string;
    sweetDetail: string;
    keyTerm: string;
  }
> = {
  1: {
    title: 'Step 1 · Dissolving in Saliva & Microvilli Contact',
    saltDetail:
      'Sodium chloride (NaCl) dissolves in saliva, releasing free Na+ ions that diffuse through the taste pore onto the apical microvilli of the chemoreceptor cell.',
    sweetDetail:
      'Sugars or bitter compounds dissolve in saliva, diffuse through the taste pore, and bind to complementary G-protein-coupled membrane receptor proteins on the microvilli.',
    keyTerm: 'Taste pore & microvilli',
  },
  2: {
    title: 'Step 2 · Ion Influx & Graded Receptor Potential',
    saltDetail:
      'Na+ ions diffuse directly INTO the chemoreceptor cell through open apical Na+ channel proteins down an electrochemical gradient, depolarising the cell membrane (receptor potential).',
    sweetDetail:
      'Receptor binding activates an intracellular second messenger cascade (e.g. cAMP/IP3) that closes K+ channels or opens cation channels, depolarising the chemoreceptor membrane (receptor potential).',
    keyTerm: 'Receptor (generator) potential',
  },
  3: {
    title: 'Step 3 · Voltage-Gated Ca2+ Influx & Exocytosis',
    saltDetail:
      'If depolarisation reaches threshold, voltage-gated Ca2+ channels in the basal chemoreceptor membrane open. Ca2+ influx triggers vesicles to fuse with the basal membrane and release neurotransmitter by exocytosis.',
    sweetDetail:
      'Sufficient depolarisation opens voltage-gated Ca2+ channels at the base of the chemoreceptor cell; Ca2+ entry stimulates exocytosis of neurotransmitter into the synaptic cleft.',
    keyTerm: 'Voltage-gated Ca2+ channels',
  },
  4: {
    title: 'Step 4 · Action Potentials in Sensory Neurone',
    saltDetail:
      'Neurotransmitter binds receptors on the postsynaptic sensory neurone membrane, opening Na+ channels. If threshold (~-55 mV) is reached, all-or-nothing action potentials propagate to the brain.',
    sweetDetail:
      'Neurotransmitter depolarises the sensory neurone above threshold, firing action potentials along the sensory neurone axon/dendron toward the taste cortex in the brain.',
    keyTerm: 'Transducer → Action potential',
  },
};

export const NeuronesAndTasteLab: React.FC = () => {
  const [neuroneType, setNeuroneType] = useState<NeuroneType>('sensory');
  const [selectedPart, setSelectedPart] = useState<NeuronePartId>('cell-body');
  const [isPlayingImpulse, setIsPlayingImpulse] = useState<boolean>(true);

  const [tasteMode, setTasteMode] = useState<TasteMode>('salt');
  const [tasteStrength, setTasteStrength] = useState<TasteStrength>('high');
  const [tasteStep, setTasteStep] = useState<TasteStepId>(2);
  const [isPlayingTaste, setIsPlayingTaste] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlayingTaste) return;
    const timer = window.setInterval(() => {
      setTasteStep((prev) => (prev === 4 ? 1 : ((prev + 1) as TasteStepId)));
    }, 1700);
    return () => window.clearInterval(timer);
  }, [isPlayingTaste]);

  const activeNeurone = NEURONE_TYPES[neuroneType];
  const activePart = NEURONE_PARTS[selectedPart];
  const activeTasteStep = TASTE_STEPS[tasteStep];

  const isSelected = (part: NeuronePartId) => selectedPart === part;

  return (
    <div className="space-y-6">
      {/* SECTION 1: TYPES OF NEURONES & THEIR PARTS */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Brain className="h-5 w-5 text-violet-700" />
              15.1.1 Types of Mammalian Neurones &amp; Structural Parts
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Compare sensory, relay, and motor neurones, and click any structural part to inspect its 9700 role.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlayingImpulse((p) => !p)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {isPlayingImpulse ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-violet-700" /> Pause Impulse
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-violet-700" /> Animate Impulse
                </>
              )}
            </button>
            <div
              className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
              role="tablist"
              aria-label="Neurone type selector"
            >
              {(
                [
                  ['sensory', 'Sensory'],
                  ['relay', 'Relay'],
                  ['motor', 'Motor'],
                  ['reflex', 'Reflex Arc'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={neuroneType === id}
                  onClick={() => setNeuroneType(id)}
                  className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    neuroneType === id
                      ? 'bg-violet-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clickable Part Selector Pills/Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(NEURONE_PARTS) as NeuronePartId[]).map((partId) => (
            <button
              key={partId}
              type="button"
              onClick={() => setSelectedPart(partId)}
              className={`whitespace-nowrap shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedPart === partId
                  ? 'border-violet-700 bg-violet-700 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {NEURONE_PARTS[partId].label}
            </button>
          ))}
        </div>

        {/* Interactive SVG + Details Split */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Interactive Neurone Diagram */}
          <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <svg
              viewBox="0 0 640 250"
              className="w-full h-auto"
              role="img"
              aria-label={`${activeNeurone.label} structure diagram`}
            >
              {/* Direction Banner */}
              <text
                x="320"
                y="20"
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#4C1D95"
              >
                Impulse Direction: {activeNeurone.direction}
              </text>

              {neuroneType === 'sensory' && (
                <g>
                  {/* Receptor endings on left */}
                  <g
                    onClick={() => setSelectedPart('dendrites')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M 40 120 L 70 120 M 40 98 L 62 120 M 40 142 L 62 120"
                      stroke={isSelected('dendrites') ? '#D97706' : '#0284C7'}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="36" cy="96" r="5" fill="#0EA5E9" />
                    <circle cx="34" cy="120" r="5" fill="#0EA5E9" />
                    <circle cx="36" cy="144" r="5" fill="#0EA5E9" />
                    <text x="52" y="168" fontSize="10.5" fill="#0369A1" textAnchor="middle" fontWeight="600">
                      Receptor endings
                    </text>
                  </g>

                  {/* Long Dendron + Myelin Sheaths */}
                  <line
                    x1="70"
                    y1="120"
                    x2="380"
                    y2="120"
                    stroke={isSelected('dendrites') ? '#D97706' : '#0284C7'}
                    strokeWidth="5"
                    onClick={() => setSelectedPart('dendrites')}
                    className="cursor-pointer"
                  />
                  {[92, 178, 264].map((mx) => (
                    <rect
                      key={mx}
                      x={mx}
                      y="105"
                      width="72"
                      height="30"
                      rx="10"
                      fill={isSelected('myelin') ? '#FDE68A' : '#DDD6FE'}
                      stroke={isSelected('myelin') ? '#D97706' : '#7C3AED'}
                      strokeWidth="2"
                      onClick={() => setSelectedPart('myelin')}
                      className="cursor-pointer"
                    />
                  ))}
                  {/* Nodes of Ranvier gaps */}
                  {[171, 257].map((nx) => (
                    <g
                      key={nx}
                      onClick={() => setSelectedPart('nodes')}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={nx}
                        cy="120"
                        r="8"
                        fill={isSelected('nodes') ? '#F59E0B' : 'transparent'}
                        stroke="#F59E0B"
                        strokeWidth={isSelected('nodes') ? '2.5' : '1.4'}
                        strokeDasharray="3 2"
                      />
                    </g>
                  ))}
                  <text x="215" y="156" fontSize="11" fontWeight="600" fill="#0369A1" textAnchor="middle">
                    Long Dendron (Myelinated)
                  </text>

                  {/* Off-centre Cell Body (Dorsal Root Ganglion) */}
                  <g
                    onClick={() => setSelectedPart('cell-body')}
                    className="cursor-pointer"
                  >
                    <line
                      x1="376"
                      y1="120"
                      x2="376"
                      y2="78"
                      stroke="#6D28D9"
                      strokeWidth="4.5"
                    />
                    <circle
                      cx="376"
                      cy="62"
                      r="22"
                      fill={isSelected('cell-body') ? '#F59E0B' : '#7C3AED'}
                      stroke="#4C1D95"
                      strokeWidth="2.5"
                    />
                    <circle cx="376" cy="62" r="8" fill="#EDE9FE" />
                    <text x="412" y="58" fontSize="11" fontWeight="700" fill="#4C1D95">
                      Cell Body
                    </text>
                    <text x="412" y="72" fontSize="10" fill="#64748B">
                      (in ganglion outside CNS)
                    </text>
                  </g>

                  {/* Shorter Axon */}
                  <line
                    x1="380"
                    y1="120"
                    x2="545"
                    y2="120"
                    stroke={isSelected('axon') ? '#D97706' : '#6D28D9'}
                    strokeWidth="5"
                    onClick={() => setSelectedPart('axon')}
                    className="cursor-pointer"
                  />
                  <rect
                    x="412"
                    y="105"
                    width="80"
                    height="30"
                    rx="10"
                    fill={isSelected('myelin') ? '#FDE68A' : '#DDD6FE'}
                    stroke={isSelected('myelin') ? '#D97706' : '#7C3AED'}
                    strokeWidth="2"
                    onClick={() => setSelectedPart('myelin')}
                    className="cursor-pointer"
                  />
                  <text x="452" y="156" fontSize="11" fontWeight="600" fill="#5B21B6" textAnchor="middle">
                    Shorter Axon (into CNS)
                  </text>

                  {/* Axon Terminals */}
                  <g
                    onClick={() => setSelectedPart('terminals')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M 545 120 L 580 96 M 545 120 L 585 120 M 545 120 L 580 144"
                      stroke={isSelected('terminals') ? '#D97706' : '#5B21B6'}
                      strokeWidth="3.2"
                    />
                    <circle cx="585" cy="94" r="6" fill={isSelected('terminals') ? '#D97706' : '#7C3AED'} />
                    <circle cx="590" cy="120" r="6" fill={isSelected('terminals') ? '#D97706' : '#7C3AED'} />
                    <circle cx="585" cy="146" r="6" fill={isSelected('terminals') ? '#D97706' : '#7C3AED'} />
                    <text x="580" y="172" fontSize="10.5" fontWeight="600" fill="#4C1D95" textAnchor="middle">
                      Synaptic knobs
                    </text>
                  </g>

                  {/* Saltatory conduction arc hops on Sensory Neurone */}
                  {isPlayingImpulse && (
                    <g className="bio-particle-motion">
                      <circle r="6" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2">
                        <animateMotion
                          dur="1.5s"
                          repeatCount="indefinite"
                          path="M 70 120 Q 128 84, 171 120 Q 214 84, 257 120 Q 318 84, 380 120 Q 452 84, 545 120"
                        />
                      </circle>
                    </g>
                  )}

                  {/* Impulse flow arrow */}
                  <path
                    d="M 85 198 L 555 198"
                    stroke="#059669"
                    strokeWidth="3"
                    className={isPlayingImpulse ? 'animate-flow-dash' : ''}
                  />
                  <polygon points="550,192 550,204 565,198" fill="#059669" />
                  <text x="320" y="218" textAnchor="middle" fontSize="11" fontWeight="600" fill="#047857">
                    Unidirectional impulse flow: Dendron → Cell body branch → Axon → CNS
                  </text>
                </g>
              )}

              {neuroneType === 'relay' && (
                <g>
                  {/* Branched Dendrites */}
                  <g
                    onClick={() => setSelectedPart('dendrites')}
                    className="cursor-pointer"
                  >
                    {[
                      'M 185 120 L 120 75',
                      'M 185 120 L 108 108',
                      'M 185 120 L 108 134',
                      'M 185 120 L 125 168',
                      'M 120 75 L 95 62',
                      'M 125 168 L 95 182',
                    ].map((d, i) => (
                      <path
                        key={i}
                        d={d}
                        stroke={isSelected('dendrites') ? '#D97706' : '#0284C7'}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    ))}
                    <text x="112" y="198" fontSize="11" fontWeight="600" fill="#0369A1" textAnchor="middle">
                      Many branched dendrites
                    </text>
                  </g>

                  {/* Central Cell Body inside CNS */}
                  <g
                    onClick={() => setSelectedPart('cell-body')}
                    className="cursor-pointer"
                  >
                    <circle
                      cx="215"
                      cy="120"
                      r="34"
                      fill={isSelected('cell-body') ? '#F59E0B' : '#7C3AED'}
                      stroke="#4C1D95"
                      strokeWidth="2.5"
                    />
                    <circle cx="215" cy="120" r="12" fill="#EDE9FE" />
                    <text x="215" y="72" fontSize="11" fontWeight="700" fill="#4C1D95" textAnchor="middle">
                      Cell Body (in CNS grey matter)
                    </text>
                  </g>

                  {/* Short Unmyelinated Axon */}
                  <g
                    onClick={() => setSelectedPart('axon')}
                    className="cursor-pointer"
                  >
                    <line
                      x1="249"
                      y1="120"
                      x2="455"
                      y2="120"
                      stroke={isSelected('axon') ? '#D97706' : '#6D28D9'}
                      strokeWidth="5.5"
                    />
                    <text x="352" y="102" fontSize="11" fontWeight="600" fill="#5B21B6" textAnchor="middle">
                      Short UNMYELINATED Axon
                    </text>
                    <text x="352" y="144" fontSize="10" fill="#64748B" textAnchor="middle">
                      (No Schwann cell sheath — short CNS distance)
                    </text>
                  </g>

                  {/* Branched Axon Terminals */}
                  <g
                    onClick={() => setSelectedPart('terminals')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M 455 120 L 515 80 M 455 120 L 525 120 M 455 120 L 515 160"
                      stroke={isSelected('terminals') ? '#D97706' : '#5B21B6'}
                      strokeWidth="3.2"
                    />
                    <circle cx="520" cy="78" r="6" fill={isSelected('terminals') ? '#D97706' : '#7C3AED'} />
                    <circle cx="530" cy="120" r="6" fill={isSelected('terminals') ? '#D97706' : '#7C3AED'} />
                    <circle cx="520" cy="162" r="6" fill={isSelected('terminals') ? '#D97706' : '#7C3AED'} />
                    <text x="520" y="190" fontSize="11" fontWeight="600" fill="#4C1D95" textAnchor="middle">
                      Synapses to motor neurone
                    </text>
                  </g>

                  {/* Slower continuous impulse wave along unmyelinated Relay Neurone */}
                  {isPlayingImpulse && (
                    <g className="bio-particle-motion">
                      <circle r="5.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.8">
                        <animateMotion
                          dur="2.8s"
                          repeatCount="indefinite"
                          path="M 120 75 L 215 120 L 455 120 L 525 120"
                        />
                      </circle>
                    </g>
                  )}

                  <path
                    d="M 140 218 L 510 218"
                    stroke="#059669"
                    strokeWidth="3"
                    className={isPlayingImpulse ? 'animate-flow-dash-slow' : ''}
                  />
                  <polygon points="505,212 505,224 520,218" fill="#059669" />
                  <text x="325" y="236" textAnchor="middle" fontSize="11" fontWeight="600" fill="#047857">
                    Wholly enclosed within CNS spinal cord / brain (slower continuous conduction)
                  </text>
                </g>
              )}

              {neuroneType === 'motor' && (
                <g>
                  {/* Large Cell Body at Left (inside CNS) */}
                  <g
                    onClick={() => setSelectedPart('dendrites')}
                    className="cursor-pointer"
                  >
                    {[
                      'M 95 120 L 38 72',
                      'M 95 120 L 30 105',
                      'M 95 120 L 30 135',
                      'M 95 120 L 42 168',
                      'M 95 120 L 66 56',
                      'M 95 120 L 68 182',
                    ].map((d, i) => (
                      <path
                        key={i}
                        d={d}
                        stroke={isSelected('dendrites') ? '#D97706' : '#0284C7'}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    ))}
                    <text x="55" y="198" fontSize="10.5" fontWeight="600" fill="#0369A1" textAnchor="middle">
                      Dendrites
                    </text>
                  </g>

                  <g
                    onClick={() => setSelectedPart('cell-body')}
                    className="cursor-pointer"
                  >
                    <circle
                      cx="106"
                      cy="120"
                      r="32"
                      fill={isSelected('cell-body') ? '#F59E0B' : '#7C3AED'}
                      stroke="#4C1D95"
                      strokeWidth="2.5"
                    />
                    <circle cx="106" cy="120" r="11" fill="#EDE9FE" />
                    <text x="110" y="54" fontSize="11" fontWeight="700" fill="#4C1D95" textAnchor="middle">
                      Cell Body (in CNS)
                    </text>
                  </g>

                  {/* Long Myelinated Axon */}
                  <line
                    x1="138"
                    y1="120"
                    x2="515"
                    y2="120"
                    stroke={isSelected('axon') ? '#D97706' : '#6D28D9'}
                    strokeWidth="5"
                    onClick={() => setSelectedPart('axon')}
                    className="cursor-pointer"
                  />
                  {[162, 250, 338, 426].map((mx) => (
                    <rect
                      key={mx}
                      x={mx}
                      y="104"
                      width="74"
                      height="32"
                      rx="10"
                      fill={isSelected('myelin') ? '#FDE68A' : '#DDD6FE'}
                      stroke={isSelected('myelin') ? '#D97706' : '#7C3AED'}
                      strokeWidth="2"
                      onClick={() => setSelectedPart('myelin')}
                      className="cursor-pointer"
                    />
                  ))}
                  {[243, 331, 419].map((nx) => (
                    <circle
                      key={nx}
                      cx={nx}
                      cy="120"
                      r="8"
                      fill={isSelected('nodes') ? '#F59E0B' : 'transparent'}
                      stroke="#F59E0B"
                      strokeWidth={isSelected('nodes') ? '2.5' : '1.4'}
                      strokeDasharray="3 2"
                      onClick={() => setSelectedPart('nodes')}
                      className="cursor-pointer"
                    />
                  ))}
                  <text x="330" y="156" fontSize="11" fontWeight="600" fill="#5B21B6" textAnchor="middle">
                    Long Myelinated Axon (Schwann cells + Nodes of Ranvier)
                  </text>

                  {/* Motor End-Plates on Muscle */}
                  <g
                    onClick={() => setSelectedPart('terminals')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M 515 120 L 560 88 M 515 120 L 566 120 M 515 120 L 560 152"
                      stroke={isSelected('terminals') ? '#D97706' : '#5B21B6'}
                      strokeWidth="3.2"
                    />
                    <rect x="572" y="72" width="44" height="96" rx="8" fill="#FECDD3" stroke="#BE123C" strokeWidth="2" />
                    <text x="594" y="124" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#881337">
                      Muscle
                    </text>
                    <circle cx="566" cy="88" r="5" fill={isSelected('terminals') ? '#D97706' : '#7C3AED'} />
                    <circle cx="570" cy="120" r="5" fill={isSelected('terminals') ? '#D97706' : '#7C3AED'} />
                    <circle cx="566" cy="152" r="5" fill={isSelected('terminals') ? '#D97706' : '#7C3AED'} />
                  </g>

                  {/* Saltatory conduction arc hops on Motor Neurone */}
                  {isPlayingImpulse && (
                    <g className="bio-particle-motion">
                      <circle r="6" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2">
                        <animateMotion
                          dur="1.4s"
                          repeatCount="indefinite"
                          path="M 138 120 Q 199 82, 243 120 Q 287 82, 331 120 Q 375 82, 419 120 Q 468 82, 515 120"
                        />
                      </circle>
                    </g>
                  )}

                  <path
                    d="M 150 198 L 545 198"
                    stroke="#059669"
                    strokeWidth="3"
                    className={isPlayingImpulse ? 'animate-flow-dash' : ''}
                  />
                  <polygon points="540,192 540,204 555,198" fill="#059669" />
                  <text x="340" y="218" textAnchor="middle" fontSize="11" fontWeight="600" fill="#047857">
                    Saltatory conduction from CNS out to effector muscle / gland
                  </text>
                </g>
              )}

              {neuroneType === 'reflex' && (
                <g>
                  {/* 5 Boxes connected in sequence */}
                  {[
                    { x: 22, label: '1. Receptor', sub: 'Transducer', fill: '#E0F2FE', stroke: '#0284C7' },
                    { x: 142, label: '2. Sensory', sub: 'Ganglion soma', fill: '#EDE9FE', stroke: '#7C3AED' },
                    { x: 262, label: '3. Relay', sub: 'Inside CNS', fill: '#F3E8FF', stroke: '#6D28D9' },
                    { x: 382, label: '4. Motor', sub: 'CNS → Out', fill: '#EDE9FE', stroke: '#7C3AED' },
                    { x: 502, label: '5. Effector', sub: 'Muscle/Gland', fill: '#FFE4E6', stroke: '#BE123C' },
                  ].map((box, idx) => (
                    <g key={box.label}>
                      <rect
                        x={box.x}
                        y="78"
                        width="106"
                        height="74"
                        rx="10"
                        fill={box.fill}
                        stroke={box.stroke}
                        strokeWidth="2"
                      />
                      <text x={box.x + 53} y="109" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#0F172A">
                        {box.label}
                      </text>
                      <text x={box.x + 53} y="128" textAnchor="middle" fontSize="10" fill="#475569">
                        {box.sub}
                      </text>
                      {idx < 4 && (
                        <>
                          <line
                            x1={box.x + 106}
                            y1="115"
                            x2={box.x + 120}
                            y2="115"
                            stroke="#059669"
                            strokeWidth="2.5"
                          />
                          <polygon
                            points={`${box.x + 115},110 ${box.x + 115},120 ${box.x + 123},115`}
                            fill="#059669"
                          />
                        </>
                      )}
                    </g>
                  ))}

                  {/* CNS boundary */}
                  <rect
                    x="248"
                    y="48"
                    width="148"
                    height="128"
                    rx="12"
                    fill="none"
                    stroke="#4C1D95"
                    strokeDasharray="5 4"
                    strokeWidth="1.6"
                  />
                  <text x="322" y="66" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#4C1D95">
                    CNS (2 Synapses)
                  </text>

                  {/* Sequential reflex arc impulse pulse */}
                  {isPlayingImpulse && (
                    <g className="bio-particle-motion">
                      <circle r="6.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2">
                        <animateMotion
                          dur="2.4s"
                          repeatCount="indefinite"
                          path="M 75 115 L 555 115"
                        />
                      </circle>
                    </g>
                  )}
                </g>
              )}
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-t border-slate-200 pt-3 text-xs sm:text-sm">
              <div className="rounded bg-white p-2.5 border border-slate-200">
                <span className="font-semibold text-slate-900">Cell Body: </span>
                <span className="text-slate-700">{activeNeurone.cellBodyLocation}</span>
              </div>
              <div className="rounded bg-white p-2.5 border border-slate-200">
                <span className="font-semibold text-slate-900">Myelin: </span>
                <span className="text-slate-700">{activeNeurone.myelination}</span>
              </div>
              <div className="rounded bg-white p-2.5 border border-slate-200">
                <span className="font-semibold text-slate-900">Role: </span>
                <span className="text-slate-700">{activeNeurone.direction}</span>
              </div>
            </div>
          </div>

          {/* Selected Part Inspector + Neurone Overview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {activePart.label}
                </h3>
                <span className="font-mono text-xs font-semibold text-violet-800">
                  {activePart.appliesTo}
                </span>
              </div>
              <div className="space-y-2 text-sm sm:text-base leading-relaxed text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">Structure: </span>
                  {activePart.structure}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Function: </span>
                  {activePart.function}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-2">
              <h4 className="text-sm font-semibold text-slate-900">
                {activeNeurone.label} — 9700 Structural Summary
              </h4>
              <p className="text-sm leading-relaxed text-slate-700">
                {activeNeurone.summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SENSORY RECEPTOR FOR TASTE (CHEMORECEPTOR IN TASTE BUD) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-emerald-700" />
              15.1.2 Chemoreceptors for Taste (Tongue Taste Bud Transduction)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Explore how taste bud chemoreceptor cells act as transducers converting chemical stimuli into action potentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setTasteMode('salt')}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tasteMode === 'salt'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Salt (Na+ · 9700 Core)
              </button>
              <button
                type="button"
                onClick={() => setTasteMode('sweet-bitter')}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tasteMode === 'sweet-bitter'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sweet / Bitter (Receptor)
              </button>
            </div>
          </div>
        </div>

        {/* Stepper & Stimulus Concentration Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {([1, 2, 3, 4] as TasteStepId[]).map((sid) => (
              <button
                key={sid}
                type="button"
                onClick={() => {
                  setIsPlayingTaste(false);
                  setTasteStep(sid);
                }}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  tasteStep === sid
                    ? 'border-emerald-700 bg-emerald-700 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Step {sid}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsPlayingTaste((p) => !p)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {isPlayingTaste ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-emerald-700" /> Pause Steps
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-emerald-700" /> Animate Steps
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
            {(
              [
                ['low', 'Weak (Sub-threshold)'],
                ['moderate', 'Moderate'],
                ['high', 'Strong Stimulus'],
              ] as const
            ).map(([lvl, lbl]) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setTasteStrength(lvl)}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  tasteStrength === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Interactive Taste Bud & Chemoreceptor SVG */}
          <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <svg
              viewBox="0 0 540 280"
              className="w-full h-auto"
              role="img"
              aria-label="Chemoreceptor cell in human tongue taste bud transduction diagram"
            >
              {/* Tongue Papilla Epithelium + Taste Pore */}
              <path
                d="M 20 55 L 220 55 Q 235 55, 240 72 L 240 245 L 20 245 Z"
                fill="#FCE7F3"
                stroke="#F472B6"
                strokeWidth="1.5"
              />
              <path
                d="M 520 55 L 320 55 Q 305 55, 300 72 L 300 245 L 520 245 Z"
                fill="#FCE7F3"
                stroke="#F472B6"
                strokeWidth="1.5"
              />
              <text x="85" y="42" fontSize="11" fontWeight="700" fill="#9D174D">
                Tongue Epithelium
              </text>
              <text x="270" y="25" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#0F172A">
                Saliva + Dissolved Tastant ({tasteMode === 'salt' ? 'Na+ ions' : 'Sugar / Bitter molecule'})
              </text>
              <text x="270" y="44" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#0369A1">
                Taste Pore
              </text>

              {/* Microvilli at apical tip */}
              <path
                d="M 244 82 Q 252 60, 260 82 Q 268 60, 276 82 Q 284 60, 292 82"
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
              />

              {/* Chemoreceptor Cell Body */}
              <path
                d="M 240 82 L 300 82 Q 332 145, 296 205 L 244 205 Q 208 145, 240 82 Z"
                fill="#ECFDF5"
                stroke="#059669"
                strokeWidth="2.5"
              />
              <text x="270" y="146" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#065F46">
                Chemoreceptor
              </text>
              <text x="270" y="161" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#065F46">
                Cell
              </text>

              {/* Apical Channel / Receptor */}
              <rect
                x="257"
                y="74"
                width="26"
                height="16"
                rx="4"
                fill={tasteMode === 'salt' ? '#D97706' : '#7C3AED'}
              />
              <text x="355" y="84" fontSize="10.5" fontWeight="600" fill="#0F172A">
                {tasteMode === 'salt'
                  ? '← Apical Na+ Channel on Microvilli'
                  : '← Membrane Receptor Protein'}
              </text>

              {/* Step 1-2 Ion / Signal Flow */}
              {tasteStep >= 1 && (
                <>
                  <circle cx="264" cy="52" r="4.5" fill={tasteMode === 'salt' ? '#F59E0B' : '#8B5CF6'} />
                  <circle cx="277" cy="60" r="4.5" fill={tasteMode === 'salt' ? '#F59E0B' : '#8B5CF6'} />
                  {isPlayingTaste && (
                    <circle r="4" fill={tasteMode === 'salt' ? '#F59E0B' : '#8B5CF6'} className="bio-particle-motion">
                      <animateMotion dur="1.1s" repeatCount="indefinite" path="M 270 42 L 270 76" />
                    </circle>
                  )}
                </>
              )}
              {tasteStep >= 2 && (
                <>
                  <path
                    d="M 270 55 L 270 124"
                    stroke={tasteMode === 'salt' ? '#D97706' : '#7C3AED'}
                    strokeWidth="3"
                    className={isPlayingTaste ? 'animate-flow-dash' : ''}
                  />
                  {isPlayingTaste && (
                    <circle r="4" fill={tasteMode === 'salt' ? '#D97706' : '#7C3AED'} className="bio-particle-motion">
                      <animateMotion dur="1.1s" repeatCount="indefinite" path="M 270 78 L 270 130" />
                    </circle>
                  )}
                  <text x="125" y="122" fontSize="10.5" fontWeight="700" fill="#B45309">
                    {tasteMode === 'salt'
                      ? 'Na+ influx → Depolarisation'
                      : '2nd messenger → Depolarisation'}
                  </text>
                </>
              )}

              {/* Step 3: Voltage-gated Ca2+ channel + Vesicles */}
              <rect
                x="298"
                y="174"
                width="14"
                height="18"
                rx="3"
                fill={tasteStep >= 3 ? '#DC2626' : '#64748B'}
                className="svg-morph"
              />
              <text x="320" y="187" fontSize="10" fontWeight="600" fill="#991B1B">
                V-Gated Ca2+ channel
              </text>
              {tasteStep >= 3 && (
                <>
                  <path
                    d="M 332 178 L 282 186"
                    stroke="#DC2626"
                    strokeWidth="2.5"
                    className={isPlayingTaste ? 'animate-flow-dash' : ''}
                  />
                  {isPlayingTaste && (
                    <g className="bio-particle-motion">
                      <circle r="3.5" fill="#DC2626">
                        <animateMotion dur="1.0s" repeatCount="indefinite" path="M 332 178 L 282 186" />
                      </circle>
                      <circle r="3.5" fill="#7C3AED">
                        <animateMotion dur="1.0s" begin="0.3s" repeatCount="indefinite" path="M 270 194 L 270 220" />
                      </circle>
                    </g>
                  )}
                  <circle cx="262" cy="192" r="5" fill="#7C3AED" />
                  <circle cx="278" cy="196" r="5" fill="#7C3AED" />
                  <circle cx="268" cy="216" r="3.5" fill="#7C3AED" />
                  <circle cx="276" cy="218" r="3.5" fill="#7C3AED" />
                </>
              )}

              {/* Basal Synapse & Sensory Neurone */}
              <path
                d="M 232 224 Q 270 218, 308 224 L 308 258 L 485 258"
                fill="none"
                stroke="#0284C7"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <text x="415" y="242" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0369A1">
                Sensory Neurone → Brain
              </text>
              {tasteStep === 4 && tasteStrength !== 'low' && (
                <>
                  <path
                    d="M 315 258 L 495 258"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    className={isPlayingTaste ? 'animate-flow-dash' : ''}
                  />
                  {isPlayingTaste && (
                    <g className="bio-particle-motion">
                      <circle r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5">
                        <animateMotion
                          dur={tasteStrength === 'high' ? '0.8s' : '1.4s'}
                          repeatCount="indefinite"
                          path="M 315 258 L 495 258"
                        />
                      </circle>
                      {tasteStrength === 'high' && (
                        <circle r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5">
                          <animateMotion
                            dur="0.8s"
                            begin="0.4s"
                            repeatCount="indefinite"
                            path="M 315 258 L 495 258"
                          />
                        </circle>
                      )}
                    </g>
                  )}
                </>
              )}
            </svg>

            {/* Dual Trace: Graded Receptor Potential vs All-or-Nothing Action Potential */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded border border-slate-200 bg-white p-3 space-y-1">
                <p className="text-xs font-semibold text-slate-800">
                  Chemoreceptor Cell: Graded Receptor Potential
                </p>
                <svg viewBox="0 0 200 54" className="w-full h-12">
                  <line x1="10" y1="22" x2="190" y2="22" stroke="#D97706" strokeDasharray="3 3" strokeWidth="1" />
                  <path
                    d={
                      tasteStrength === 'low'
                        ? 'M 10 44 L 40 44 Q 80 30, 120 44 L 190 44'
                        : tasteStrength === 'moderate'
                          ? 'M 10 44 L 40 44 Q 85 16, 130 44 L 190 44'
                          : 'M 10 44 L 40 44 Q 85 4, 130 44 L 190 44'
                    }
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.4"
                  />
                  <text x="14" y="18" fontSize="8.5" fill="#B45309">Threshold</text>
                </svg>
              </div>

              <div className="rounded border border-slate-200 bg-white p-3 space-y-1">
                <p className="text-xs font-semibold text-slate-800">
                  Sensory Neurone: Action Potential Frequency
                </p>
                <svg viewBox="0 0 200 54" className="w-full h-12">
                  <line x1="10" y1="44" x2="190" y2="44" stroke="#CBD5E1" strokeWidth="1" />
                  {tasteStrength === 'low' && (
                    <line x1="10" y1="44" x2="190" y2="44" stroke="#94A3B8" strokeWidth="2" />
                  )}
                  {tasteStrength === 'moderate' &&
                    [45, 100, 155].map((sx) => (
                      <path
                        key={sx}
                        d={`M ${sx - 15} 44 L ${sx} 44 L ${sx + 4} 10 L ${sx + 9} 44 L ${sx + 20} 44`}
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="2.2"
                      />
                    ))}
                  {tasteStrength === 'high' &&
                    [28, 56, 84, 112, 140, 168].map((sx) => (
                      <path
                        key={sx}
                        d={`M ${sx - 10} 44 L ${sx} 44 L ${sx + 4} 10 L ${sx + 9} 44 L ${sx + 14} 44`}
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="2.2"
                      />
                    ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Right Explanation Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900">
                  {activeTasteStep.title}
                </h3>
                <span className="font-mono text-xs font-semibold text-emerald-800">
                  {activeTasteStep.keyTerm}
                </span>
              </div>
              <p className="text-base leading-relaxed text-slate-700">
                {tasteMode === 'salt'
                  ? activeTasteStep.saltDetail
                  : activeTasteStep.sweetDetail}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-violet-700" />
                Sensory Receptors as Biological Transducers (9700)
              </h4>
              <p className="text-sm leading-relaxed text-slate-700">
                Both <span className="font-semibold text-slate-900">taste chemoreceptors</span> (chemical energy → electrical energy) and <span className="font-semibold text-slate-900">Pacinian corpuscles</span> (mechanical pressure → stretch-mediated Na+ channels → electrical energy) convert stimulus energy into a graded <span className="font-semibold text-slate-900">receptor potential</span>.
              </p>
              <p className="text-sm leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-900">Key distinction:</span>{' '}
                A receptor potential is <span className="font-semibold">graded</span> (larger at higher [Na+]), whereas an action potential in the sensory neurone is <span className="font-semibold">all-or-nothing</span> (higher [Na+] encodes stronger taste by firing action potentials at a higher frequency).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
