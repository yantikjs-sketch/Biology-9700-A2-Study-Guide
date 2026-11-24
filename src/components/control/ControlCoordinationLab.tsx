import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  Sprout,
  Zap,
} from 'lucide-react';
import { DiagramImageCard } from '../common/DiagramImageCard';
import { NeuronesAndTasteLab } from './NeuronesAndTasteLab';

type ControlView = 'neurones-receptors' | 'nerve-synapse' | 'muscle' | 'plant';
type ActionPotentialPhase =
  | 'resting'
  | 'threshold'
  | 'depolarisation'
  | 'repolarisation'
  | 'hyperpolarisation';
type SynapseCondition = 'normal' | 'organophosphate' | 'curare';
type SynapseStepId = 1 | 2 | 3 | 4;
type CrossBridgeStepId = 1 | 2 | 3 | 4 | 5;
type PlantRegulatorTab = 'auxin' | 'gibberellin';
type SeedStageId = 1 | 2 | 3 | 4;

interface PhaseDetail {
  id: ActionPotentialPhase;
  label: string;
  mv: number;
  timeMs: number;
  naGate: string;
  kGate: string;
  pumpStatus: string;
  explanation: string;
  examTip: string;
}

const AP_PHASES: Record<ActionPotentialPhase, PhaseDetail> = {
  resting: {
    id: 'resting',
    label: '1. Resting Potential',
    mv: -70,
    timeMs: 0.4,
    naGate: 'Closed',
    kGate: 'Voltage-gated closed (K+ leak channels open)',
    pumpStatus: 'Active: 3 Na+ out, 2 K+ in (uses ATP)',
    explanation:
      'The Na+/K+ ATPase maintains high [Na+] outside and high [K+] inside. Because the membrane is much more permeable to K+ (through open leak channels) than Na+, K+ diffuses out, leaving negatively charged proteins inside and a resting potential of -70 mV.',
    examTip:
      'Always state BOTH the 3 Na+ out : 2 K+ in active pump AND greater membrane permeability to K+ via leak channels.',
  },
  threshold: {
    id: 'threshold',
    label: '2. Threshold Reached',
    mv: -55,
    timeMs: 1.0,
    naGate: 'Beginning to open (positive feedback)',
    kGate: 'Closed',
    pumpStatus: 'Continuous background pumping',
    explanation:
      'A stimulus (e.g. stretch-mediated Na+ channels in a Pacinian corpuscle or EPSP at a synapse) depolarises the membrane to -55 mV. If threshold is reached, an all-or-nothing action potential fires; sub-threshold stimuli fade without propagating.',
    examTip:
      'Action potentials have a fixed amplitude (~+30 to +40 mV); stronger stimuli trigger a higher FREQUENCY of impulses, not taller spikes.',
  },
  depolarisation: {
    id: 'depolarisation',
    label: '3. Depolarisation',
    mv: 35,
    timeMs: 1.6,
    naGate: 'Wide open — rapid Na+ influx',
    kGate: 'Closed',
    pumpStatus: 'Overwhelmed by rapid Na+ diffusion',
    explanation:
      'Voltage-gated Na+ channels open rapidly. Na+ ions flood inward down their steep electrochemical gradient, reversing membrane polarity from -55 mV up to +35 mV.',
    examTip:
      'Movement during depolarisation is passive facilitated diffusion through channel proteins, NOT active transport.',
  },
  repolarisation: {
    id: 'repolarisation',
    label: '4. Repolarisation',
    mv: -45,
    timeMs: 2.3,
    naGate: 'Inactivated / closing (stops Na+ entry)',
    kGate: 'Open — rapid K+ efflux',
    pumpStatus: 'Restoring gradients',
    explanation:
      'At ~+35 mV, voltage-gated Na+ channels inactivate and voltage-gated K+ channels open. K+ ions diffuse rapidly out of the axon, making the inside negative again.',
    examTip:
      'During the absolute refractory period (depolarisation + early repolarisation), Na+ channels are inactivated so no second impulse can fire—ensuring unidirectional propagation.',
  },
  hyperpolarisation: {
    id: 'hyperpolarisation',
    label: '5. Hyperpolarisation',
    mv: -80,
    timeMs: 3.1,
    naGate: 'Closed (reset to resting state)',
    kGate: 'Slowly closing (excess K+ leaves)',
    pumpStatus: 'Na+/K+ pump restores -70 mV',
    explanation:
      'Voltage-gated K+ channels close slowly, allowing extra K+ to leave so membrane potential dips briefly to -80 mV (relative refractory period) before the Na+/K+ pump and leak channels restore -70 mV.',
    examTip:
      'Refractory period prevents action potentials travelling backward and keeps each impulse discrete.',
  },
};

const SYNAPSE_STEPS: Record<
  SynapseStepId,
  { title: string; detail: string; keyEvent: string }
> = {
  1: {
    title: 'Step 1 · Action Potential & Ca2+ Influx',
    detail:
      'An action potential depolarises the presynaptic knob, opening voltage-gated Ca2+ channels. Ca2+ ions diffuse into the presynaptic cytoplasm down their electrochemical gradient.',
    keyEvent: 'Voltage-gated Ca2+ channels open',
  },
  2: {
    title: 'Step 2 · Exocytosis of Acetylcholine (ACh)',
    detail:
      'Inflowing Ca2+ triggers synaptic vesicles containing acetylcholine (ACh) to move to and fuse with the presynaptic membrane, releasing ACh into the ~20 nm synaptic cleft by exocytosis (requires ATP).',
    keyEvent: 'ACh released into synaptic cleft',
  },
  3: {
    title: 'Step 3 · Receptor Binding & Postsynaptic Na+ Influx',
    detail:
      'ACh diffuses across the cleft and binds to complementary receptor sites on ligand-gated Na+ channels in the postsynaptic membrane. Na+ channels open, Na+ floods in, generating an excitatory postsynaptic potential (EPSP).',
    keyEvent: 'Threshold reached → new action potential',
  },
  4: {
    title: 'Step 4 · Acetylcholinesterase (AChE) Breakdown & Recycling',
    detail:
      'AChE in the cleft membrane rapidly hydrolyses ACh into choline and ethanoic acid (acetate), closing Na+ channels to prevent continuous firing. Choline is reabsorbed into the presynaptic knob to resynthesise ACh using ATP from mitochondria.',
    keyEvent: 'ACh → Choline + Ethanoic acid',
  },
};

const CROSS_BRIDGE_STEPS: Record<
  CrossBridgeStepId,
  {
    title: string;
    atpState: string;
    angleDeg: number;
    attached: boolean;
    caBound: boolean;
    detail: string;
  }
> = {
  1: {
    title: '1. Ca2+ Release & Troponin Shape Change',
    atpState: 'ATP hydrolysed (ADP + Pi on cocked myosin head)',
    angleDeg: -22,
    attached: false,
    caBound: true,
    detail:
      'Action potential sweeps down T-tubules, opening Ca2+ channels in the sarcoplasmic reticulum (SR). Ca2+ binds troponin, changing its shape and pulling tropomyosin away from the myosin-binding sites on actin.',
  },
  2: {
    title: '2. Cross-Bridge Formation',
    atpState: 'ADP + Pi still bound to myosin head',
    angleDeg: -22,
    attached: true,
    caBound: true,
    detail:
      'High-energy cocked myosin heads (with ADP + Pi attached) bind tightly to the newly exposed binding sites on the thin actin filament, forming an actin-myosin cross-bridge.',
  },
  3: {
    title: '3. Power Stroke (Actin Slides Inward)',
    atpState: 'ADP + Pi released from myosin head',
    angleDeg: 28,
    attached: true,
    caBound: true,
    detail:
      'Release of Pi and ADP triggers the myosin head to pivot ~45° toward the M-line, pulling the thin actin filament past the thick myosin filament and shortening the sarcomere.',
  },
  4: {
    title: '4. ATP Binding & Cross-Bridge Detachment',
    atpState: 'Fresh ATP binds myosin head',
    angleDeg: 28,
    attached: false,
    caBound: true,
    detail:
      'A new ATP molecule binds to the myosin head, reducing myosin affinity for actin and breaking the cross-bridge. Without fresh ATP (e.g. rigor mortis), heads remain locked onto actin.',
  },
  5: {
    title: '5. ATP Hydrolysis & Re-Cocking (or Relaxation)',
    atpState: 'Myosin ATPase: ATP → ADP + Pi',
    angleDeg: -22,
    attached: false,
    caBound: false,
    detail:
      'Myosin ATPase hydrolyses ATP into ADP + Pi, using the released energy to re-cock the head for the next cycle. When stimulation stops, Ca2+ is actively pumped back into the SR using ATP, and tropomyosin re-covers actin.',
  },
};

const SEED_STAGES: Record<
  SeedStageId,
  {
    title: string;
    subtitle: string;
    detail: string;
    highlight: string;
  }
> = {
  1: {
    title: '1. Water Imbibition Through Micropyle',
    subtitle: 'Seed rehydrates & metabolic enzymes reactivate',
    detail:
      'Dry barley seeds absorb water through the micropyle and testa. Rehydration mobilises metabolic activity inside the living embryo while endosperm starch remains insoluble.',
    highlight: 'Water uptake activates embryo metabolism',
  },
  2: {
    title: '2. Embryo Synthesises Gibberellin (GA)',
    subtitle: 'Hormone diffuses outward to the aleurone layer',
    detail:
      'The hydrated embryo synthesises the plant growth regulator gibberellin (GA), which diffuses across the seed to target cells in the protein-rich aleurone layer surrounding the endosperm.',
    highlight: 'Embryo → GA → Aleurone layer',
  },
  3: {
    title: '3. DELLA Repressor Breakdown in Aleurone',
    subtitle: 'Transcription factors freed to transcribe amylase mRNA',
    detail:
      'Inside aleurone cells, gibberellin binds a nuclear receptor complex and triggers rapid breakdown of DELLA repressor proteins. Once DELLA inhibitors are degraded, transcription factors (such as PIF) bind DNA promoters to transcribe genes encoding amylase.',
    highlight: 'GA destroys DELLA → Amylase gene transcribed',
  },
  4: {
    title: '4. Amylase Hydrolyses Starch → Maltose',
    subtitle: 'Soluble sugars nourish growing radicle & plumule',
    detail:
      'Translated amylase enzyme is secreted into the endosperm, hydrolysing insoluble starch reserves into soluble maltose (and glucose via maltase), which diffuses to the embryo for ATP synthesis by aerobic respiration and seedling growth.',
    highlight: 'Starch → Maltose → Embryo respiration',
  },
};

export const ControlCoordinationLab: React.FC = () => {
  const [subView, setSubView] = useState<ControlView>('neurones-receptors');

  // Sub-view 1 states: Action Potential & Synapse
  const [apPhase, setApPhase] = useState<ActionPotentialPhase>('depolarisation');
  const [isMyelinated, setIsMyelinated] = useState(true);
  const [stimulusLevel, setStimulusLevel] = useState<
    'sub' | 'moderate' | 'strong'
  >('strong');
  const [synapseCondition, setSynapseCondition] =
    useState<SynapseCondition>('normal');
  const [synapseStep, setSynapseStep] = useState<SynapseStepId>(3);

  // Sub-view 2 states: Muscle Sarcomere
  const [contractionPct, setContractionPct] = useState<number>(35);
  const [hasAtp, setHasAtp] = useState<boolean>(true);
  const [crossBridgeStep, setCrossBridgeStep] = useState<CrossBridgeStepId>(3);
  const [isPlayingCycle, setIsPlayingCycle] = useState<boolean>(false);

  // Sub-view 3 states: Plant Coordination
  const [hairTouches, setHairTouches] = useState<number>(0);
  const [trapMessage, setTrapMessage] = useState<string>(
    'Open & primed: Touch a sensory trigger hair on the inner red lobe surface.'
  );
  const [plantRegulatorTab, setPlantRegulatorTab] =
    useState<PlantRegulatorTab>('auxin');
  const [auxinActive, setAuxinActive] = useState<boolean>(true);
  const [seedStage, setSeedStage] = useState<SeedStageId>(3);

  // Auto-advance cross-bridge step safely via interval button toggle
  React.useEffect(() => {
    if (!isPlayingCycle || !hasAtp) return;
    const timer = window.setInterval(() => {
      setCrossBridgeStep((prev) =>
        prev === 5 ? 1 : ((prev + 1) as CrossBridgeStepId)
      );
    }, 1500);
    return () => window.clearInterval(timer);
  }, [isPlayingCycle, hasAtp]);

  const activePhase = AP_PHASES[apPhase];
  const activeStep = SYNAPSE_STEPS[synapseStep];
  const activeBridge = CROSS_BRIDGE_STEPS[crossBridgeStep];
  const activeSeed = SEED_STAGES[seedStage];

  // Sarcomere live dimensions (in micrometres, 9700 realistic scale)
  const sarcomereMetrics = useMemo(() => {
    const t = contractionPct / 100;
    const aBand = 1.6; // Always constant!
    const sarcomereLen = Number((3.0 - t * 1.15).toFixed(2));
    const iBand = Number((sarcomereLen - aBand).toFixed(2));
    const hZone = Number(Math.max(0.08, 0.85 - t * 0.77).toFixed(2));
    const zOffset = t * 52; // pixels inward per side in SVG
    return { sarcomereLen, aBand, iBand, hZone, zOffset };
  }, [contractionPct]);

  // Action potential SVG coordinates
  const apMarker = useMemo(() => {
    const mapMvToY = (mv: number) => 175 - ((mv + 90) / 140) * 145;
    const x = 40 + (activePhase.timeMs / 4.2) * 340;
    const y = mapMvToY(activePhase.mv);
    return { x, y };
  }, [activePhase]);

  const handleTouchHair = () => {
    setHairTouches((prev) => {
      const next = Math.min(3, prev + 1);
      if (next === 1) {
        setTrapMessage(
          '1st deflection: Ca2+ enters hair base causing a sub-threshold depolarisation (~-50 mV). If no 2nd touch occurs within ~20–30 s, charge decays and trap stays open (saves energy on raindrops).'
        );
      } else if (next === 2) {
        setTrapMessage(
          '2nd deflection within 20 s: Threshold reached! Action potential sweeps across lobe → H+ pumped into outer cell walls → rapid osmotic water influx swells outer cells → trap snaps shut in < 1 s!'
        );
      } else {
        setTrapMessage(
          '3rd+ deflection by struggling insect: Additional action potentials seal the lobe edges tightly and trigger gland cells to secrete digestive hydrolytic enzymes (proteases).'
        );
      }
      return next;
    });
  };

  const handleDecayTimeout = () => {
    setHairTouches(0);
    setTrapMessage(
      '> 30 s elapsed without a second touch: Ca2+ is pumped back out, membrane potential decays back to resting level, and the trap remains open.'
    );
  };

  const handleResetTrap = () => {
    setHairTouches(0);
    setTrapMessage(
      'Open & primed: Touch a sensory trigger hair on the inner red lobe surface.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Topic Header & Sub-Navigation */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-300/70 pb-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-violet-800">
            Cambridge 9700 · Topic 15
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl text-balance">
            Control and Coordination Interactive Lab
          </h1>
        </div>

        <div
          className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white/90 p-1 shadow-xs"
          role="tablist"
          aria-label="Control and coordination interactive modules"
        >
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'neurones-receptors'}
            onClick={() => setSubView('neurones-receptors')}
            className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
              subView === 'neurones-receptors'
                ? 'bg-violet-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Neurones &amp; Taste Receptors
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'nerve-synapse'}
            onClick={() => setSubView('nerve-synapse')}
            className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
              subView === 'nerve-synapse'
                ? 'bg-violet-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Action Potentials &amp; Synapse
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'muscle'}
            onClick={() => setSubView('muscle')}
            className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
              subView === 'muscle'
                ? 'bg-violet-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Striated Muscle
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'plant'}
            onClick={() => setSubView('plant')}
            className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
              subView === 'plant'
                ? 'bg-violet-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Plant Coordination (15.2)
          </button>
        </div>
      </div>

      {/* VIEW 0: TYPES OF NEURONES & TASTE CHEMORECEPTORS */}
      {subView === 'neurones-receptors' && <NeuronesAndTasteLab />}

      {/* VIEW 1: ACTION POTENTIAL, MYELINATION & CHOLINERGIC SYNAPSE */}
      {subView === 'nerve-synapse' && (
        <div className="space-y-6">
          {/* Action Potential & Ion Channels */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-violet-700" />
                  15.1.3 Action Potential &amp; Membrane Ion Channel Lab
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Inspect how voltage-gated Na+ and K+ channels change membrane potential from -70 mV to +35 mV, plus saltatory conduction.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMyelinated((m) => !m)}
                  className={`whitespace-nowrap shrink-0 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    isMyelinated
                      ? 'border-violet-600 bg-violet-50 text-violet-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {isMyelinated
                    ? 'Axon: Myelinated (~100 m s⁻¹)'
                    : 'Axon: Unmyelinated (~2 m s⁻¹)'}
                </button>
              </div>
            </div>

            {/* Phase Selector Strip */}
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(AP_PHASES) as ActionPotentialPhase[]).map(
                (phaseKey) => (
                  <button
                    key={phaseKey}
                    type="button"
                    onClick={() => setApPhase(phaseKey)}
                    className={`whitespace-nowrap shrink-0 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                      apPhase === phaseKey
                        ? 'border-violet-700 bg-violet-700 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {AP_PHASES[phaseKey].label}
                  </button>
                )
              )}
            </div>

            {/* Two-Column Action Potential Curve + Ion Channel Bilayer */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              {/* Left: Oscilloscope Graph */}
              <div className="lg:col-span-6 space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                  <svg
                    viewBox="0 0 430 230"
                    className="w-full h-auto"
                    role="img"
                    aria-label="Action potential membrane potential curve over time"
                  >
                    {/* Grid lines */}
                    <line
                      x1="45"
                      y1="25"
                      x2="45"
                      y2="195"
                      stroke="#64748B"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="45"
                      y1="195"
                      x2="410"
                      y2="195"
                      stroke="#64748B"
                      strokeWidth="1.5"
                    />

                    {/* Reference voltage dashed lines */}
                    {/* +35 mV */}
                    <line
                      x1="45"
                      y1="46"
                      x2="405"
                      y2="46"
                      stroke="#CBD5E1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="8"
                      y="50"
                      fontSize="11"
                      fill="#475569"
                      fontFamily="IBM Plex Mono"
                    >
                      +35
                    </text>

                    {/* 0 mV */}
                    <line
                      x1="45"
                      y1="82"
                      x2="405"
                      y2="82"
                      stroke="#CBD5E1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="20"
                      y="86"
                      fontSize="11"
                      fill="#475569"
                      fontFamily="IBM Plex Mono"
                    >
                      0
                    </text>

                    {/* -55 mV threshold */}
                    <line
                      x1="45"
                      y1="139"
                      x2="405"
                      y2="139"
                      stroke="#D97706"
                      strokeDasharray="5 4"
                      strokeWidth="1.2"
                    />
                    <text
                      x="8"
                      y="143"
                      fontSize="11"
                      fill="#B45309"
                      fontFamily="IBM Plex Mono"
                    >
                      -55
                    </text>
                    <text
                      x="295"
                      y="134"
                      fontSize="10"
                      fill="#B45309"
                      fontWeight="600"
                    >
                      Threshold (-55 mV)
                    </text>

                    {/* -70 mV resting */}
                    <line
                      x1="45"
                      y1="154"
                      x2="405"
                      y2="154"
                      stroke="#94A3B8"
                      strokeDasharray="3 3"
                    />
                    <text
                      x="8"
                      y="158"
                      fontSize="11"
                      fill="#334155"
                      fontFamily="IBM Plex Mono"
                    >
                      -70
                    </text>

                    {/* Refractory shaded zone */}
                    <rect
                      x="130"
                      y="25"
                      width="120"
                      height="170"
                      fill="#EDE9FE"
                      opacity="0.45"
                    />
                    <text
                      x="136"
                      y="38"
                      fontSize="10"
                      fill="#5B21B6"
                      fontWeight="600"
                    >
                      Refractory Period
                    </text>

                    {/* Action Potential Curve */}
                    <path
                      d="M 45 154 L 105 154 Q 120 152, 130 139 Q 148 92, 168 46 Q 178 46, 195 96 Q 214 146, 240 165 Q 272 172, 315 154 L 400 154"
                      fill="none"
                      stroke="#6D28D9"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />

                    {/* Failed Sub-threshold trace */}
                    <path
                      d="M 105 154 Q 120 144, 140 154"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="1.6"
                      strokeDasharray="3 3"
                    />
                    <text x="86" y="182" fontSize="9.5" fill="#64748B">
                      Failed sub-threshold
                    </text>

                    {/* Active Phase Highlight Dot */}
                    <circle
                      cx={apMarker.x}
                      cy={apMarker.y}
                      r="7"
                      fill="#7C3AED"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />

                    {/* Axis labels */}
                    <text
                      x="200"
                      y="218"
                      fontSize="11"
                      fill="#475569"
                      textAnchor="middle"
                    >
                      Time (ms) · Resting → Peak → Recovery
                    </text>
                    <text
                      x="14"
                      y="24"
                      fontSize="11"
                      fill="#475569"
                      fontWeight="600"
                    >
                      mV
                    </text>
                  </svg>
                </div>

                {/* All-or-Nothing Frequency Bar */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      Stimulus Intensity Encoding (All-or-Nothing Rule)
                    </span>
                    <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-0.5">
                      {(
                        [
                          ['sub', 'Sub-threshold'],
                          ['moderate', 'Moderate'],
                          ['strong', 'Strong'],
                        ] as const
                      ).map(([k, lbl]) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setStimulusLevel(k)}
                          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                            stimulusLevel === k
                              ? 'bg-violet-700 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <svg
                    viewBox="0 0 400 44"
                    className="w-full h-11 rounded border border-slate-200 bg-white"
                    aria-label="Action potential frequency comparison"
                  >
                    <line
                      x1="10"
                      y1="34"
                      x2="390"
                      y2="34"
                      stroke="#CBD5E1"
                      strokeWidth="1"
                    />
                    {stimulusLevel === 'sub' && (
                      <path
                        d="M 10 34 L 55 34 Q 70 25, 85 34 L 390 34"
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth="2"
                      />
                    )}
                    {stimulusLevel === 'moderate' &&
                      [60, 170, 280].map((sx) => (
                        <path
                          key={sx}
                          d={`M ${sx - 25} 34 L ${sx} 34 L ${sx + 5} 8 L ${sx + 12} 34 L ${sx + 35} 34`}
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="2"
                        />
                      ))}
                    {stimulusLevel === 'strong' &&
                      [35, 85, 135, 185, 235, 285, 335].map((sx) => (
                        <path
                          key={sx}
                          d={`M ${sx - 18} 34 L ${sx} 34 L ${sx + 5} 8 L ${sx + 12} 34 L ${sx + 24} 34`}
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="2"
                        />
                      ))}
                  </svg>
                  <p className="text-xs text-slate-600">
                    {stimulusLevel === 'sub'
                      ? 'Below -55 mV: no action potential fires (sub-threshold receptor potential only).'
                      : stimulusLevel === 'moderate'
                        ? 'Moderate stimulus: spikes remain fixed at +35 mV, firing at moderate frequency.'
                        : 'Strong stimulus: spike height NEVER increases; instead, action potential FREQUENCY increases.'}
                  </p>
                </div>
              </div>

              {/* Right: Channel Dynamics + Phase Details */}
              <div className="lg:col-span-6 space-y-4">
                {/* Interactive Membrane Ion Channel SVG */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                  <svg
                    viewBox="0 0 430 165"
                    className="w-full h-auto"
                    role="img"
                    aria-label="Axon membrane ion channels"
                  >
                    <text
                      x="14"
                      y="18"
                      fontSize="11"
                      fontWeight="600"
                      fill="#475569"
                    >
                      OUTSIDE AXON (Tissue Fluid · High [Na+])
                    </text>

                    {/* Phospholipid bilayer */}
                    <rect
                      x="10"
                      y="52"
                      width="410"
                      height="52"
                      rx="6"
                      fill="#E2E8F0"
                      stroke="#94A3B8"
                      strokeWidth="1"
                    />

                    {/* 1. Na+/K+ Pump */}
                    <g>
                      <rect
                        x="38"
                        y="44"
                        width="76"
                        height="68"
                        rx="10"
                        fill="#0F766E"
                      />
                      <text
                        x="76"
                        y="74"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#FFFFFF"
                      >
                        Na+/K+ Pump
                      </text>
                      <text
                        x="76"
                        y="90"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#CCFBF1"
                      >
                        3 Na+↑ · 2 K+↓
                      </text>
                      <path
                        d="M 60 120 L 60 34"
                        stroke="#0D9488"
                        strokeWidth="2"
                        className="animate-flow-dash"
                      />
                      <path
                        d="M 92 34 L 92 120"
                        stroke="#0284C7"
                        strokeWidth="2"
                        className="animate-flow-dash"
                      />
                    </g>

                    {/* 2. Voltage-gated Na+ Channel */}
                    <g>
                      <rect
                        x="175"
                        y="44"
                        width="82"
                        height="68"
                        rx="10"
                        fill={
                          apPhase === 'depolarisation' || apPhase === 'threshold'
                            ? '#D97706'
                            : '#64748B'
                        }
                      />
                      <text
                        x="216"
                        y="73"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#FFFFFF"
                      >
                        V-Gated Na+
                      </text>
                      <text
                        x="216"
                        y="90"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#F8FAFC"
                      >
                        {apPhase === 'depolarisation'
                          ? 'OPEN (Influx)'
                          : apPhase === 'threshold'
                            ? 'Opening'
                            : apPhase === 'repolarisation'
                              ? 'Inactivated'
                              : 'Closed'}
                      </text>
                      {(apPhase === 'depolarisation' ||
                        apPhase === 'threshold') && (
                        <>
                          <path
                            d="M 216 28 L 216 132"
                            stroke="#F59E0B"
                            strokeWidth="3.5"
                            className="animate-flow-dash"
                          />
                          <polygon
                            points="210,126 222,126 216,136"
                            fill="#F59E0B"
                          />
                        </>
                      )}
                    </g>

                    {/* 3. Voltage-gated K+ Channel */}
                    <g>
                      <rect
                        x="312"
                        y="44"
                        width="84"
                        height="68"
                        rx="10"
                        fill={
                          apPhase === 'repolarisation' ||
                          apPhase === 'hyperpolarisation'
                            ? '#7C3AED'
                            : '#64748B'
                        }
                      />
                      <text
                        x="354"
                        y="73"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#FFFFFF"
                      >
                        V-Gated K+
                      </text>
                      <text
                        x="354"
                        y="90"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#F8FAFC"
                      >
                        {apPhase === 'repolarisation'
                          ? 'OPEN (Efflux)'
                          : apPhase === 'hyperpolarisation'
                            ? 'Closing Slowly'
                            : 'Closed'}
                      </text>
                      {(apPhase === 'repolarisation' ||
                        apPhase === 'hyperpolarisation') && (
                        <>
                          <path
                            d="M 354 132 L 354 28"
                            stroke="#8B5CF6"
                            strokeWidth="3.5"
                            className="animate-flow-dash"
                          />
                          <polygon
                            points="348,34 360,34 354,24"
                            fill="#8B5CF6"
                          />
                        </>
                      )}
                    </g>

                    <text
                      x="14"
                      y="153"
                      fontSize="11"
                      fontWeight="600"
                      fill="#475569"
                    >
                      INSIDE AXON (Axoplasm · High [K+] &amp; Organic Anions)
                    </text>
                  </svg>
                </div>

                {/* Phase Explanation Card */}
                <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {activePhase.label}
                    </h3>
                    <span className="font-mono text-base font-bold text-violet-700 tabular-nums">
                      {activePhase.mv > 0
                        ? `+${activePhase.mv}`
                        : activePhase.mv}{' '}
                      mV
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
                    <div className="rounded bg-slate-50 p-2.5">
                      <span className="font-semibold text-slate-900">
                        Na+ Gate:{' '}
                      </span>
                      <span className="text-slate-700">{activePhase.naGate}</span>
                    </div>
                    <div className="rounded bg-slate-50 p-2.5">
                      <span className="font-semibold text-slate-900">
                        K+ Gate:{' '}
                      </span>
                      <span className="text-slate-700">{activePhase.kGate}</span>
                    </div>
                  </div>

                  <p className="text-base leading-relaxed text-slate-700">
                    {activePhase.explanation}
                  </p>

                  <p className="rounded-md border border-violet-200 bg-violet-50/60 px-3.5 py-2.5 text-sm text-violet-950">
                    <span className="font-semibold">9700 Examiner Focus: </span>
                    {activePhase.examTip}
                  </p>
                </div>

                {/* Saltatory vs Continuous Conduction Box */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {isMyelinated
                      ? 'Myelinated Axon: Saltatory Conduction (~100 m s⁻¹)'
                      : 'Unmyelinated Axon: Continuous Conduction (~2 m s⁻¹)'}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {isMyelinated
                      ? 'Schwann cells wrap the axon in lipid-rich myelin, making internodes impermeable to Na+ and K+. Action potentials only occur at exposed nodes of Ranvier; local depolarising currents jump rapidly from node to node (saltatory conduction).'
                      : 'Without myelin insulation, voltage-gated Na+ and K+ channels must open along every adjacent patch of membrane sequentially, slowing impulse velocity. Increasing axon diameter lowers internal electrical resistance and increases speed.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cholinergic Synapse Simulator + High-Res Illustration */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-violet-700" />
                    15.1.5 Cholinergic Synapse Simulator
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Step through synaptic transmission and test neurotoxins (organophosphates vs curare).
                  </p>
                </div>
              </div>

              {/* Condition Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    ['normal', 'Normal Synapse'],
                    ['organophosphate', 'Organophosphate (AChE Blocked)'],
                    ['curare', 'Curare (Receptor Blocked)'],
                  ] as const
                ).map(([condKey, condLabel]) => (
                  <button
                    key={condKey}
                    type="button"
                    onClick={() => setSynapseCondition(condKey)}
                    className={`whitespace-nowrap shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      synapseCondition === condKey
                        ? condKey === 'normal'
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-amber-700 bg-amber-700 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {condLabel}
                  </button>
                ))}
              </div>

              {/* Step Buttons */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {([1, 2, 3, 4] as SynapseStepId[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSynapseStep(s)}
                    className={`rounded-md border px-3 py-2 text-left text-xs sm:text-sm font-medium transition-colors ${
                      synapseStep === s
                        ? 'border-violet-700 bg-violet-50 text-violet-950'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Step {s}:{' '}
                    {s === 1
                      ? 'Ca2+ Influx'
                      : s === 2
                        ? 'Exocytosis'
                        : s === 3
                          ? 'Na+ EPSP'
                          : 'AChE Reset'}
                  </button>
                ))}
              </div>

              {/* Active Step Card */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    {activeStep.title}
                  </h3>
                  <span className="font-mono text-xs font-semibold text-violet-700">
                    {activeStep.keyEvent}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-slate-700">
                  {activeStep.detail}
                </p>
              </div>

              {/* Toxin / Pharmacology Effect Alert */}
              {synapseCondition === 'normal' ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 flex items-start gap-2.5 text-sm text-emerald-950">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700 mt-0.5" />
                  <div>
                    <p className="font-semibold">Normal Unidirectional Transmission</p>
                    <p className="mt-0.5 leading-relaxed">
                      Because ACh vesicles exist only in the presynaptic knob and complementary receptors exist only on the postsynaptic membrane, impulses travel in ONE direction only. Synapses also allow spatial and temporal summation.
                    </p>
                  </div>
                </div>
              ) : synapseCondition === 'organophosphate' ? (
                <div className="rounded-lg border border-amber-300 bg-amber-50/80 p-4 flex items-start gap-2.5 text-sm text-amber-950">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      Organophosphate Inhibits Acetylcholinesterase (AChE)
                    </p>
                    <p className="mt-0.5 leading-relaxed">
                      ACh is NOT broken down into choline and ethanoic acid. ACh remains bound to postsynaptic receptor-linked Na+ channels, keeping them open and causing continuous depolarisation and tetanic muscle spasms.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-rose-300 bg-rose-50/80 p-4 flex items-start gap-2.5 text-sm text-rose-950">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-rose-700 mt-0.5" />
                  <div>
                    <p className="font-semibold">
                      Curare Competitively Blocks Postsynaptic ACh Receptors
                    </p>
                    <p className="mt-0.5 leading-relaxed">
                      Curare binds to ACh receptors without opening the Na+ channel gate. Even though Ca2+ influx and ACh exocytosis occur normally, Na+ cannot enter the postsynaptic membrane — causing flaccid paralysis.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <DiagramImageCard
                src="/src/assets/images/diagram_cholinergic_synapse_1795068672887.jpg"
                alt="Cross-section illustration of a cholinergic synapse showing presynaptic knob, mitochondria, synaptic vesicles, Ca2+ channels, synaptic cleft, and postsynaptic Na+ channels"
                title="Cholinergic Synapse Ultrastructure"
                syllabusTag="Cambridge 9700 · 15.1.5"
                caption="Abundant presynaptic mitochondria supply ATP for vesicle exocytosis and resynthesis of ACh from reabsorbed choline + acetyl CoA."
                keyStructures={[
                  'Presynaptic bulb: Voltage-gated Ca2+ channels & ACh vesicles',
                  'Synaptic cleft (~20 nm): ACh diffusion & AChE enzyme',
                  'Postsynaptic membrane: Receptor-linked Na+ channels',
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: STRIATED MUSCLE & SLIDING FILAMENT MODEL */}
      {subView === 'muscle' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-violet-700" />
                  15.1.6 Striated Muscle Sarcomere &amp; Sliding Filament Simulator
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Slide the sarcomere contraction state and observe how the A-band stays constant while I-band and H-zone shorten.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHasAtp(true);
                    setContractionPct(10);
                  }}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Relaxed
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasAtp(true);
                    setContractionPct(55);
                  }}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Contracting
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasAtp(true);
                    setContractionPct(95);
                  }}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Max Contracted
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasAtp(false);
                    setIsPlayingCycle(false);
                    setContractionPct(75);
                    setCrossBridgeStep(3);
                  }}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                    !hasAtp
                      ? 'border-rose-700 bg-rose-700 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  No ATP (Rigor)
                </button>
              </div>
            </div>

            {/* Contraction Slider + Live Band Readouts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-center">
              <div className="lg:col-span-5 rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <label
                    htmlFor="sarcomere-slider"
                    className="font-semibold text-slate-900"
                  >
                    Sarcomere Overlap / Contraction
                  </label>
                  <span className="font-mono font-semibold text-violet-700 tabular-nums">
                    {contractionPct}%
                  </span>
                </div>
                <input
                  id="sarcomere-slider"
                  type="range"
                  min={0}
                  max={100}
                  disabled={!hasAtp}
                  value={contractionPct}
                  onChange={(e) => setContractionPct(Number(e.target.value))}
                  className="w-full accent-violet-700"
                />
                <p className="text-xs text-slate-600">
                  {hasAtp
                    ? 'Actin and myosin filament lengths NEVER change; thin actin filaments slide over thick myosin.'
                    : 'Rigor state: Without ATP, myosin heads cannot detach from actin binding sites and Ca2+ stays outside SR.'}
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs text-slate-500">Sarcomere (Z–Z)</p>
                  <p className="mt-0.5 font-mono text-lg font-bold text-slate-900 tabular-nums">
                    {sarcomereMetrics.sarcomereLen} µm
                  </p>
                  <p className="text-xs text-violet-700">Shortens</p>
                </div>
                <div className="rounded-lg border border-violet-200 bg-violet-50/50 p-3">
                  <p className="text-xs text-violet-800 font-medium">
                    A-band (Myosin)
                  </p>
                  <p className="mt-0.5 font-mono text-lg font-bold text-violet-950 tabular-nums">
                    {sarcomereMetrics.aBand.toFixed(2)} µm
                  </p>
                  <p className="text-xs text-violet-800 font-semibold">
                    Constant!
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs text-slate-500">I-band (Actin only)</p>
                  <p className="mt-0.5 font-mono text-lg font-bold text-sky-700 tabular-nums">
                    {sarcomereMetrics.iBand} µm
                  </p>
                  <p className="text-xs text-sky-700">Narrows</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs text-slate-500">H-zone (Myosin only)</p>
                  <p className="mt-0.5 font-mono text-lg font-bold text-amber-700 tabular-nums">
                    {sarcomereMetrics.hZone} µm
                  </p>
                  <p className="text-xs text-amber-700">Narrows</p>
                </div>
              </div>
            </div>

            {/* Interactive SVG Sarcomere */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
              <svg
                viewBox="0 0 640 230"
                className="w-full h-auto"
                role="img"
                aria-label="Interactive sliding filament sarcomere diagram"
              >
                {/* M-line */}
                <line
                  x1="320"
                  y1="38"
                  x2="320"
                  y2="178"
                  stroke="#475569"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />
                <text
                  x="320"
                  y="28"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#334155"
                >
                  M-line
                </text>

                {/* Thick Myosin Filaments (Constant width: 170 to 470 = 300px) */}
                {[78, 114, 150].map((my) => (
                  <g key={my}>
                    <rect
                      x="170"
                      y={my - 5}
                      width="300"
                      height="10"
                      rx="4"
                      fill="#6D28D9"
                    />
                    {/* Myosin heads left & right */}
                    {[185, 205, 225, 245, 265].map((hx) => (
                      <g key={hx}>
                        <line
                          x1={hx}
                          y1={my - 5}
                          x2={hx - 4}
                          y2={my - 13}
                          stroke="#5B21B6"
                          strokeWidth="2.2"
                        />
                        <circle cx={hx - 4} cy={my - 14} r="3" fill="#7C3AED" />
                        <line
                          x1={hx}
                          y1={my + 5}
                          x2={hx - 4}
                          y2={my + 13}
                          stroke="#5B21B6"
                          strokeWidth="2.2"
                        />
                        <circle cx={hx - 4} cy={my + 14} r="3" fill="#7C3AED" />
                      </g>
                    ))}
                    {[375, 395, 415, 435, 455].map((hx) => (
                      <g key={hx}>
                        <line
                          x1={hx}
                          y1={my - 5}
                          x2={hx + 4}
                          y2={my - 13}
                          stroke="#5B21B6"
                          strokeWidth="2.2"
                        />
                        <circle cx={hx + 4} cy={my - 14} r="3" fill="#7C3AED" />
                        <line
                          x1={hx}
                          y1={my + 5}
                          x2={hx + 4}
                          y2={my + 13}
                          stroke="#5B21B6"
                          strokeWidth="2.2"
                        />
                        <circle cx={hx + 4} cy={my + 14} r="3" fill="#7C3AED" />
                      </g>
                    ))}
                  </g>
                ))}

                {/* Left Z-line + Thin Actin Filaments */}
                {(() => {
                  const leftZ = 55 + sarcomereMetrics.zOffset;
                  const rightZ = 585 - sarcomereMetrics.zOffset;
                  const actinLength = 195;
                  return (
                    <>
                      {/* Left Z-line */}
                      <line
                        x1={leftZ}
                        y1="42"
                        x2={leftZ}
                        y2="174"
                        stroke="#0F172A"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <text
                        x={leftZ}
                        y="30"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#0F172A"
                      >
                        Z-line
                      </text>

                      {/* Right Z-line */}
                      <line
                        x1={rightZ}
                        y1="42"
                        x2={rightZ}
                        y2="174"
                        stroke="#0F172A"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <text
                        x={rightZ}
                        y="30"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#0F172A"
                      >
                        Z-line
                      </text>

                      {/* Thin Actin filaments (blue) */}
                      {[60, 96, 132, 168].map((ay) => (
                        <g key={ay}>
                          <line
                            x1={leftZ}
                            y1={ay}
                            x2={leftZ + actinLength}
                            y2={ay}
                            stroke="#0284C7"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                          />
                          <line
                            x1={rightZ}
                            y1={ay}
                            x2={rightZ - actinLength}
                            y2={ay}
                            stroke="#0284C7"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                          />
                        </g>
                      ))}

                      {/* Dynamic Measurement Brackets */}
                      {/* A-band bracket (fixed 170..470) */}
                      <line
                        x1="170"
                        y1="194"
                        x2="470"
                        y2="194"
                        stroke="#6D28D9"
                        strokeWidth="2.5"
                      />
                      <text
                        x="320"
                        y="212"
                        textAnchor="middle"
                        fontSize="11.5"
                        fontWeight="700"
                        fill="#5B21B6"
                      >
                        A-band (Constant = full myosin length)
                      </text>

                      {/* Left I-band bracket (leftZ .. 170) */}
                      {170 - leftZ > 18 && (
                        <>
                          <line
                            x1={leftZ}
                            y1="194"
                            x2="168"
                            y2="194"
                            stroke="#0284C7"
                            strokeWidth="2.5"
                          />
                          <text
                            x={(leftZ + 168) / 2}
                            y="212"
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill="#0369A1"
                          >
                            I-band
                          </text>
                        </>
                      )}

                      {/* H-zone bracket (gap between left & right actin tips) */}
                      {rightZ - actinLength - (leftZ + actinLength) > 12 && (
                        <>
                          <line
                            x1={leftZ + actinLength}
                            y1="48"
                            x2={rightZ - actinLength}
                            y2="48"
                            stroke="#D97706"
                            strokeWidth="2.5"
                          />
                          <text
                            x="320"
                            y="43"
                            textAnchor="middle"
                            fontSize="10.5"
                            fontWeight="700"
                            fill="#B45309"
                          >
                            H-zone
                          </text>
                        </>
                      )}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* 5-Step Cross-Bridge Cycle + Muscle TEM Micrograph */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  Cross-Bridge Cycle &amp; Ca2+ / Troponin Regulation
                </h3>
                <button
                  type="button"
                  disabled={!hasAtp}
                  onClick={() => setIsPlayingCycle((p) => !p)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-violet-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-800 disabled:opacity-40"
                >
                  {isPlayingCycle ? (
                    <>
                      <Pause className="h-4 w-4" /> Pause Cycle
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> Animate Cycle
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {([1, 2, 3, 4, 5] as CrossBridgeStepId[]).map((stepId) => (
                  <button
                    key={stepId}
                    type="button"
                    onClick={() => {
                      setIsPlayingCycle(false);
                      setCrossBridgeStep(stepId);
                    }}
                    className={`rounded-md border px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                      crossBridgeStep === stepId
                        ? 'border-violet-700 bg-violet-700 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Step {stepId}
                  </button>
                ))}
              </div>

              {/* Molecular Inset SVG */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                <svg
                  viewBox="0 0 420 135"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Actin, troponin, tropomyosin, and myosin head cross-bridge interaction"
                >
                  {/* Actin strand */}
                  <rect
                    x="20"
                    y="24"
                    width="380"
                    height="22"
                    rx="11"
                    fill="#BAE6FD"
                    stroke="#0284C7"
                    strokeWidth="2"
                  />
                  {[70, 140, 210, 280, 350].map((bx) => (
                    <circle
                      key={bx}
                      cx={bx}
                      cy="42"
                      r="5"
                      fill="#0369A1"
                    />
                  ))}
                  {/* Tropomyosin filament (moves up out of way when Ca2+ bound) */}
                  <line
                    x1="25"
                    y1={activeBridge.caBound ? 28 : 44}
                    x2="395"
                    y2={activeBridge.caBound ? 28 : 44}
                    stroke="#0F766E"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  {/* Troponin + Ca2+ */}
                  <circle
                    cx="115"
                    cy={activeBridge.caBound ? 26 : 42}
                    r="8"
                    fill="#F59E0B"
                  />
                  {activeBridge.caBound && (
                    <circle cx="100" cy="14" r="5" fill="#EF4444" />
                  )}
                  <text x="26" y="16" fontSize="10" fill="#0F172A" fontWeight="600">
                    Actin + Tropomyosin (teal) + Troponin (amber){' '}
                    {activeBridge.caBound ? '+ Ca2+ (red)' : '· Binding sites COVERED'}
                  </text>

                  {/* Myosin backbone + pivoting head */}
                  <rect
                    x="20"
                    y="102"
                    width="380"
                    height="18"
                    rx="6"
                    fill="#6D28D9"
                  />
                  <g
                    transform={`translate(210, 102) rotate(${activeBridge.angleDeg})`}
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={activeBridge.attached ? -52 : -36}
                      stroke="#5B21B6"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <ellipse
                      cx="0"
                      cy={activeBridge.attached ? -56 : -40}
                      rx="13"
                      ry="9"
                      fill="#7C3AED"
                    />
                  </g>
                  <text x="228" y="88" fontSize="10.5" fill="#4C1D95" fontWeight="600">
                    {activeBridge.atpState}
                  </text>
                </svg>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-semibold text-slate-900">
                  {activeBridge.title}
                </h4>
                <p className="text-base leading-relaxed text-slate-700">
                  {activeBridge.detail}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <DiagramImageCard
                src="/src/assets/images/diagram_myofibril_tem_1795068688955.jpg"
                alt="Transmission electron micrograph of skeletal striated muscle myofibrils showing Z-discs, alternating light I-bands and dark A-bands, central H-zones, and abundant mitochondria"
                title="Striated Muscle Myofibril (TEM)"
                syllabusTag="Cambridge 9700 · 15.1.6"
                caption="Rows of mitochondria sit tightly packed between myofibrils to supply abundant ATP for cross-bridge detachment and active Ca2+ reuptake."
                keyStructures={[
                  'Dark vertical lines: Z-lines marking sarcomere boundaries',
                  'Light I-bands (actin only) & dark A-bands (myosin + overlap)',
                  'Central H-zone & M-line bisecting each A-band',
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: PLANT CONTROL & COORDINATION (15.2) */}
      {subView === 'plant' && (
        <div className="space-y-6">
          {/* Module A: Venus Flytrap */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-emerald-700" />
                  15.2.1 Venus Flytrap (Dionaea muscipula) Action Potential Closure
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Simulate deflections of the sensory trigger hairs on the modified leaf lobes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTouchHair}
                  className="rounded-md bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                >
                  Touch Sensory Hair ({hairTouches}/3)
                </button>
                <button
                  type="button"
                  onClick={handleDecayTimeout}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Wait &gt; 30 s (Decay)
                </button>
                <button
                  type="button"
                  onClick={handleResetTrap}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Trap
                </button>
              </div>

              {/* Trap State + Membrane Potential Trace SVG */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                  <svg
                    viewBox="0 0 220 150"
                    className="w-full h-auto"
                    role="img"
                    aria-label="Venus flytrap leaf lobe closure state"
                  >
                    {/* Petiole */}
                    <rect
                      x="98"
                      y="118"
                      width="24"
                      height="26"
                      rx="4"
                      fill="#15803D"
                    />
                    {hairTouches < 2 ? (
                      <>
                        {/* Open lobes */}
                        <path
                          d="M 110 120 Q 45 105, 32 45 Q 78 35, 110 75 Z"
                          fill="#DC2626"
                          stroke="#15803D"
                          strokeWidth="4"
                        />
                        <path
                          d="M 110 120 Q 175 105, 188 45 Q 142 35, 110 75 Z"
                          fill="#DC2626"
                          stroke="#15803D"
                          strokeWidth="4"
                        />
                        {/* 3 Trigger hairs on each lobe */}
                        <line x1="65" y1="78" x2="72" y2="62" stroke="#FEF08A" strokeWidth="2.5" />
                        <line x1="56" y1="64" x2="66" y2="50" stroke="#FEF08A" strokeWidth="2.5" />
                        <line x1="80" y1="86" x2="84" y2="70" stroke="#FEF08A" strokeWidth="2.5" />
                        <line x1="155" y1="78" x2="148" y2="62" stroke="#FEF08A" strokeWidth="2.5" />
                        <line x1="164" y1="64" x2="154" y2="50" stroke="#FEF08A" strokeWidth="2.5" />
                        <line x1="140" y1="86" x2="136" y2="70" stroke="#FEF08A" strokeWidth="2.5" />
                        <text x="110" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#166534">
                          TRAP OPEN (Outer cells curved inward)
                        </text>
                      </>
                    ) : (
                      <>
                        {/* Snapped shut lobes */}
                        <path
                          d="M 110 122 C 62 115, 62 42, 110 38 C 158 42, 158 115, 110 122 Z"
                          fill="#16A34A"
                          stroke="#14532D"
                          strokeWidth="3.5"
                        />
                        {/* Interlocking marginal spikes */}
                        {[50, 65, 80, 95].map((sy) => (
                          <line
                            key={sy}
                            x1="100"
                            y1={sy}
                            x2="120"
                            y2={sy - 6}
                            stroke="#14532D"
                            strokeWidth="2.2"
                          />
                        ))}
                        <text x="110" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#B91C1C">
                          {hairTouches >= 3
                            ? 'SEALED & SECRETING ENZYMES'
                            : 'SNAPPED SHUT (< 1 s)'}
                        </text>
                      </>
                    )}
                  </svg>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                  <svg
                    viewBox="0 0 220 150"
                    className="w-full h-auto"
                    role="img"
                    aria-label="Venus flytrap electrical depolarisation trace"
                  >
                    <line x1="28" y1="20" x2="28" y2="128" stroke="#64748B" strokeWidth="1.2" />
                    <line x1="28" y1="128" x2="205" y2="128" stroke="#64748B" strokeWidth="1.2" />
                    <line x1="28" y1="68" x2="205" y2="68" stroke="#D97706" strokeDasharray="4 3" />
                    <text x="34" y="63" fontSize="9.5" fill="#B45309" fontWeight="600">
                      Action potential threshold
                    </text>

                    {hairTouches === 0 && (
                      <line x1="28" y1="114" x2="200" y2="114" stroke="#059669" strokeWidth="2.5" />
                    )}
                    {hairTouches === 1 && (
                      <path
                        d="M 28 114 L 70 114 L 82 82 Q 112 96, 165 110 L 200 112"
                        fill="none"
                        stroke="#D97706"
                        strokeWidth="2.5"
                      />
                    )}
                    {hairTouches >= 2 && (
                      <path
                        d="M 28 114 L 60 114 L 70 84 Q 88 90, 102 88 L 116 32 L 130 114 L 200 114"
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="2.8"
                      />
                    )}
                    <text x="115" y="142" textAnchor="middle" fontSize="9.5" fill="#475569">
                      Time between hair touches
                    </text>
                  </svg>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 text-sm sm:text-base leading-relaxed text-slate-800">
                {trapMessage}
              </div>
            </div>

            <div className="lg:col-span-5">
              <DiagramImageCard
                src="/src/assets/images/diagram_venus_flytrap_1795068689794.jpg"
                alt="Macro close-up of an open Venus flytrap leaf trap showing the three sensory trigger hairs on each crimson inner lobe and interlocking marginal spines"
                title="Dionaea muscipula Trigger Hairs"
                syllabusTag="Cambridge 9700 · 15.2.1"
                caption="Modified bilobed leaves detect insect contact via three mechanosensory hairs on each lobe, using Ca2+-mediated action potentials and rapid turgor shifts."
                keyStructures={[
                  'Sensory trigger hairs: Deflection opens Ca2+ channels',
                  'Midrib hinge cells: H+ efflux loosens walls → rapid osmotic swelling',
                  'Marginal spikes: Interlock to cage prey before enzyme digestion',
                ]}
              />
            </div>
          </div>

          {/* Module B: Auxin (IAA Acid Growth) & Gibberellin (Barley Germination & DELLA) */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  15.2.2 Plant Growth Regulators: Auxin (IAA) &amp; Gibberellin (GA)
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Explore the acid growth hypothesis for cell elongation and gibberellin/DELLA gene activation in barley germination.
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setPlantRegulatorTab('auxin')}
                  className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    plantRegulatorTab === 'auxin'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Auxin (IAA) Acid Growth
                </button>
                <button
                  type="button"
                  onClick={() => setPlantRegulatorTab('gibberellin')}
                  className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    plantRegulatorTab === 'gibberellin'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Gibberellin &amp; DELLA (Seed / Le)
                </button>
              </div>
            </div>

            {plantRegulatorTab === 'auxin' ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAuxinActive(false)}
                      className={`rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                        !auxinActive
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      No IAA (Wall pH ~7.0 · Rigid)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuxinActive(true)}
                      className={`rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                        auxinActive
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      Active IAA (Wall pH ~4.8 · Elongates)
                    </button>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <svg
                      viewBox="0 0 420 190"
                      className="w-full h-auto"
                      role="img"
                      aria-label="Auxin acid growth hypothesis mechanism"
                    >
                      {/* Cell interior (left) vs Cell wall (right) */}
                      <rect
                        x="14"
                        y="18"
                        width="235"
                        height="154"
                        rx="8"
                        fill={auxinActive ? '#ECFDF5' : '#F8FAFC'}
                        stroke="#059669"
                        strokeWidth="2"
                      />
                      {/* Vacuole expanding */}
                      <ellipse
                        cx="120"
                        cy="98"
                        rx={auxinActive ? 88 : 56}
                        ry={auxinActive ? 54 : 38}
                        fill="#BAE6FD"
                        stroke="#0284C7"
                        strokeWidth="1.5"
                      />
                      <text
                        x="120"
                        y="98"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#0369A1"
                      >
                        {auxinActive
                          ? 'H2O enters → Turgor expands cell'
                          : 'Central Vacuole (Baseline turgor)'}
                      </text>

                      {/* Plasma membrane H+-ATPase pump */}
                      <rect
                        x="238"
                        y="64"
                        width="22"
                        height="48"
                        rx="6"
                        fill={auxinActive ? '#D97706' : '#64748B'}
                      />
                      <text
                        x="249"
                        y="92"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="700"
                        fill="#FFFFFF"
                      >
                        H+
                      </text>
                      {auxinActive && (
                        <>
                          <path
                            d="M 225 88 L 285 88"
                            stroke="#D97706"
                            strokeWidth="3"
                            className="animate-flow-dash"
                          />
                          <polygon points="280,82 280,94 292,88" fill="#D97706" />
                        </>
                      )}

                      {/* Cell wall matrix with cellulose microfibrils */}
                      <rect
                        x="266"
                        y="18"
                        width="140"
                        height="154"
                        rx="8"
                        fill={auxinActive ? '#FEF3C7' : '#E2E8F0'}
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                      />
                      <text
                        x="336"
                        y="36"
                        textAnchor="middle"
                        fontSize="10.5"
                        fontWeight="700"
                        fill="#334155"
                      >
                        Cell Wall ({auxinActive ? 'pH ~4.8' : 'pH ~7.0'})
                      </text>
                      {/* Microfibrils: tight vs loosened */}
                      <line
                        x1="285"
                        y1={auxinActive ? 58 : 74}
                        x2="388"
                        y2={auxinActive ? 58 : 74}
                        stroke="#78350F"
                        strokeWidth="4"
                      />
                      <line
                        x1="285"
                        y1={auxinActive ? 132 : 102}
                        x2="388"
                        y2={auxinActive ? 132 : 102}
                        stroke="#78350F"
                        strokeWidth="4"
                      />
                      {!auxinActive ? (
                        <line
                          x1="336"
                          y1="74"
                          x2="336"
                          y2="102"
                          stroke="#DC2626"
                          strokeWidth="2.5"
                          strokeDasharray="3 3"
                        />
                      ) : (
                        <text
                          x="336"
                          y="102"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="700"
                          fill="#B45309"
                        >
                          Expansins break H-bonds!
                        </text>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Acid Growth Hypothesis (9700 Mechanism)
                  </h3>
                  <ul className="space-y-2.5 text-base leading-relaxed text-slate-700">
                    <li>
                      <span className="font-semibold text-slate-900">1. Synthesis &amp; Transport:</span>{' '}
                      IAA is synthesised in growing shoot apical meristems and actively transported down the stem via PIN efflux carrier proteins.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">2. Proton Pumping:</span>{' '}
                      IAA stimulates proton pumps (H+-ATPase) in the cell surface membrane to actively pump H+ ions out of the cytoplasm into the cell wall using ATP.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">3. Expansin Activation:</span>{' '}
                      Lowering wall pH activates wall-loosening enzymes called <span className="font-semibold text-slate-900">expansins</span>, which disrupt hydrogen bonds between cellulose microfibrils and surrounding polysaccharides.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">4. Turgor Elongation:</span>{' '}
                      Water enters the cell by osmosis down a water potential gradient; turgor pressure stretches the loosened wall, causing irreversible cell elongation.
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {([1, 2, 3, 4] as SeedStageId[]).map((sid) => (
                      <button
                        key={sid}
                        type="button"
                        onClick={() => setSeedStage(sid)}
                        className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                          seedStage === sid
                            ? 'border-emerald-700 bg-emerald-700 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Stage {sid}
                      </button>
                    ))}
                  </div>

                  {/* Interactive Barley Seed SVG */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <svg
                      viewBox="0 0 460 195"
                      className="w-full h-auto"
                      role="img"
                      aria-label="Barley seed germination gibberellin and DELLA signalling"
                    >
                      {/* Seed coat & endosperm */}
                      <ellipse
                        cx="230"
                        cy="98"
                        rx="195"
                        ry="78"
                        fill="#FEF9C3"
                        stroke="#CA8A04"
                        strokeWidth="6"
                      />
                      {/* Aleurone layer */}
                      <ellipse
                        cx="230"
                        cy="98"
                        rx="186"
                        ry="69"
                        fill="none"
                        stroke="#D97706"
                        strokeWidth="8"
                        strokeDasharray={seedStage >= 3 ? '0' : '6 2'}
                      />
                      <text x="275" y="48" fontSize="11" fontWeight="700" fill="#92400E">
                        Aleurone Layer (Synthesises Amylase)
                      </text>

                      {/* Endosperm */}
                      <text x="285" y="102" fontSize="12" fontWeight="700" fill="#854D0E" textAnchor="middle">
                        Starchy Endosperm
                      </text>
                      {seedStage === 4 && (
                        <text x="285" y="122" fontSize="11" fontWeight="600" fill="#047857" textAnchor="middle">
                          Starch → Maltose (via Amylase)
                        </text>
                      )}

                      {/* Embryo */}
                      <path
                        d="M 65 98 Q 95 52, 138 66 Q 152 98, 138 130 Q 95 144, 65 98 Z"
                        fill="#BBF7D0"
                        stroke="#15803D"
                        strokeWidth="2.5"
                      />
                      <text x="105" y="102" fontSize="11.5" fontWeight="700" fill="#14532D" textAnchor="middle">
                        Embryo
                      </text>

                      {/* Flow arrows */}
                      {seedStage >= 2 && (
                        <>
                          <path
                            d="M 136 74 Q 170 42, 200 38"
                            fill="none"
                            stroke="#059669"
                            strokeWidth="3"
                            className="animate-flow-dash"
                          />
                          <text x="165" y="42" fontSize="10" fontWeight="700" fill="#047857">
                            GA
                          </text>
                        </>
                      )}
                      {seedStage >= 4 && (
                        <>
                          <path
                            d="M 260 40 L 260 80"
                            fill="none"
                            stroke="#7C3AED"
                            strokeWidth="3"
                            className="animate-flow-dash"
                          />
                          <path
                            d="M 215 112 L 146 112"
                            fill="none"
                            stroke="#0284C7"
                            strokeWidth="3"
                            className="animate-flow-dash"
                          />
                          <text x="178" y="130" fontSize="10" fontWeight="700" fill="#0369A1">
                            Maltose
                          </text>
                        </>
                      )}
                    </svg>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-semibold text-slate-900">
                        {activeSeed.title}
                      </h3>
                      <span className="font-mono text-xs font-semibold text-emerald-700">
                        {activeSeed.highlight}
                      </span>
                    </div>
                    <p className="text-base leading-relaxed text-slate-700">
                      {activeSeed.detail}
                    </p>
                  </div>
                </div>

                {/* Genetics & Stem Elongation Link (Le / le) */}
                <div className="lg:col-span-5 rounded-lg border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Gibberellin &amp; Stem Elongation (Le / le Pea Plants)
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700">
                    Cambridge 9700 connects gibberellin directly to gene expression and Mendel&apos;s tall/dwarf pea trait:
                  </p>
                  <div className="space-y-2.5 text-sm leading-relaxed text-slate-700">
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <span className="font-semibold text-slate-900">
                        Dominant allele (Le):
                      </span>{' '}
                      Encodes a functional enzyme catalysing conversion of inactive GA20 precursor into active gibberellin (GA1), promoting internode cell division and elongation (tall plant).
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <span className="font-semibold text-slate-900">
                        Recessive allele (le le):
                      </span>{' '}
                      Single base substitution produces a non-functional enzyme, so DELLA proteins remain intact, inhibiting transcription of growth genes (dwarf plant). Spraying exogenous GA1 restores tall growth!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
