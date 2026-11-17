import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Flame,
  CheckCircle2,
  FlaskConical,
  Activity,
  Calculator,
} from 'lucide-react';
import { DiagramImageCard } from '../common/DiagramImageCard';

type RespirationView = 'pathway' | 'krebs' | 'respirometer';
type PathwayCondition = 'aerobic' | 'anaerobic' | 'cyanide' | 'dnp';
type RespirationStageId =
  | 'glycolysis'
  | 'link'
  | 'krebs'
  | 'oxphos'
  | 'anaerobic';
type KrebsStepId = 'step1' | 'step2' | 'step3' | 'step4';

interface StageDetail {
  id: RespirationStageId;
  title: string;
  location: string;
  inputs: string;
  outputs: string;
  mechanism: string;
  examTip: string;
}

const STAGE_DETAILS: Record<RespirationStageId, StageDetail> = {
  glycolysis: {
    id: 'glycolysis',
    title: '01. Glycolysis',
    location: 'Cytoplasm (cytosol)',
    inputs: '1 Glucose (6C) + 2 ATP + 2 NAD+',
    outputs: '2 Pyruvate (3C) + 4 ATP (net 2) + 2 NADH',
    mechanism:
      'Glucose is phosphorylated using 2 ATP to form hexose bisphosphate, then splits into two triose phosphate (3C) molecules. Dehydrogenase enzymes oxidise triose phosphate, reducing NAD+ to NADH and generating 4 ATP via substrate-level phosphorylation.',
    examTip:
      'Does NOT require oxygen and occurs inside the cytoplasm, not the mitochondrion.',
  },
  link: {
    id: 'link',
    title: '02. Link Reaction',
    location: 'Mitochondrial matrix',
    inputs: '2 Pyruvate (3C) + 2 CoA + 2 NAD+',
    outputs: '2 Acetyl CoA (2C) + 2 CO2 + 2 NADH',
    mechanism:
      'Pyruvate enters the matrix by active transport. Pyruvate undergoes oxidative decarboxylation: 1 CO2 is removed, hydrogen reduces NAD+ to NADH, and the remaining 2C acetyl group binds to Coenzyme A.',
    examTip:
      'Remember to multiply by 2 per glucose molecule! No ATP is formed in the link reaction.',
  },
  krebs: {
    id: 'krebs',
    title: '03. Krebs Cycle',
    location: 'Mitochondrial matrix',
    inputs: '2 Acetyl CoA (2C) + 6 NAD+ + 2 FAD + 2 ADP + Pi',
    outputs: '4 CO2 + 6 NADH + 2 FADH2 + 2 ATP',
    mechanism:
      'Acetyl CoA (2C) combines with oxaloacetate (4C) to form citrate (6C). Through sequential decarboxylation and dehydrogenation, citrate converts via a 5C intermediate back to 4C oxaloacetate, releasing CO2, 1 substrate-level ATP, 3 NADH, and 1 FADH2 per turn.',
    examTip:
      'Oxygen is not used directly in Krebs, yet Krebs halts without O2 because NAD+ and FAD cannot be regenerated.',
  },
  oxphos: {
    id: 'oxphos',
    title: '04. Oxidative Phosphorylation',
    location: 'Inner mitochondrial membrane (cristae)',
    inputs: '10 NADH + 2 FADH2 + 6 O2 + ~26–28 ADP + Pi',
    outputs: '~26–28 ATP + 12 H2O + 10 NAD+ + 2 FAD',
    mechanism:
      'NADH and FADH2 donate high-energy electrons to the electron transport chain. Energy released pumps H+ from the matrix into the narrow intermembrane space, building an electrochemical proton gradient. H+ diffuses back through ATP synthase (chemiosmosis), driving ATP synthesis. Oxygen acts as the final electron and proton acceptor, forming water.',
    examTip:
      'Each NADH yields ~2.5 ATP; each FADH2 enters at Complex II and yields ~1.5 ATP.',
  },
  anaerobic: {
    id: 'anaerobic',
    title: '05. Anaerobic Fermentation',
    location: 'Cytoplasm (no oxygen)',
    inputs: '2 Pyruvate (3C) + 2 NADH',
    outputs: '2 Lactate (mammals) OR 2 Ethanol + 2 CO2 (yeast/rice) + 2 NAD+',
    mechanism:
      'When O2 is absent, the ETC stops and NADH accumulates. Pyruvate acts as a hydrogen acceptor to re-oxidise NADH back to NAD+ (via lactate dehydrogenase in muscle or decarboxylase + alcohol dehydrogenase in yeast), allowing glycolysis to continue making net 2 ATP.',
    examTip:
      'Fermentation yields NO extra ATP itself; its sole purpose is regenerating NAD+ for glycolysis.',
  },
};

interface KrebsStepDetail {
  id: KrebsStepId;
  stepNumber: string;
  title: string;
  carbonChange: string;
  reactionType: string;
  coenzymesPerTurn: string;
  coenzymesPerGlucose: string;
  detail: string;
}

const KREBS_STEPS: Record<KrebsStepId, KrebsStepDetail> = {
  step1: {
    id: 'step1',
    stepNumber: 'Step 1',
    title: 'Condensation: Citrate (6C) Formation',
    carbonChange: 'Acetyl CoA (2C) + Oxaloacetate (4C) → Citrate (6C)',
    reactionType: 'Condensation (citrate synthase)',
    coenzymesPerTurn: 'CoA released to return to Link Reaction',
    coenzymesPerGlucose: '2 CoA recycled · 0 CO2 · 0 ATP',
    detail:
      'The 2-carbon acetyl group from acetyl CoA combines with the 4-carbon acceptor molecule oxaloacetate to form 6-carbon citrate. Coenzyme A is released and returns to the link reaction to pick up another acetyl group.',
  },
  step2: {
    id: 'step2',
    stepNumber: 'Step 2',
    title: 'First Decarboxylation & Dehydrogenation (6C → 5C)',
    carbonChange: 'Citrate (6C) → 5C Intermediate + 1 CO2',
    reactionType: 'Oxidative decarboxylation',
    coenzymesPerTurn: '1 CO2 released · 1 NAD+ → 1 NADH',
    coenzymesPerGlucose: '2 CO2 · 2 NADH',
    detail:
      'Citrate (6C) undergoes decarboxylation (losing 1 carbon as CO2) and dehydrogenation (releasing 2 hydrogen atoms to reduce NAD+ to reduced NAD), producing a 5-carbon intermediate compound.',
  },
  step3: {
    id: 'step3',
    stepNumber: 'Step 3',
    title: 'Second Decarboxylation & Substrate ATP (5C → 4C)',
    carbonChange: '5C Intermediate → 4C Compound + 1 CO2',
    reactionType: 'Decarboxylation + dehydrogenation + substrate-level phosphorylation',
    coenzymesPerTurn: '1 CO2 · 1 NADH · 1 ATP (substrate-level)',
    coenzymesPerGlucose: '2 CO2 · 2 NADH · 2 ATP',
    detail:
      'The 5C intermediate loses another CO2 (decarboxylation) and hydrogen (reducing NAD+ to NADH) to form a 4-carbon compound. Enough free energy is released to synthesise 1 ATP directly from ADP + Pi via substrate-level phosphorylation.',
  },
  step4: {
    id: 'step4',
    stepNumber: 'Step 4',
    title: 'Regeneration of Oxaloacetate (4C → 4C)',
    carbonChange: '4C Compound → Oxaloacetate (4C)',
    reactionType: 'Sequential dehydrogenations (FAD & NAD+)',
    coenzymesPerTurn: '1 FADH2 + 1 NADH regenerated',
    coenzymesPerGlucose: '2 FADH2 · 2 NADH · Oxaloacetate ready for next acetyl CoA',
    detail:
      'The 4C compound is further oxidised by two dehydrogenation steps back into oxaloacetate (4C) so the cycle can continue. One step reduces FAD to reduced FAD (FADH2), and the final step reduces NAD+ to reduced NAD (NADH).',
  },
};

interface SubstratePreset {
  id: string;
  label: string;
  formula: string;
  equation: string;
  rq: number;
  o2Moles: number;
  co2Moles: number;
  note: string;
}

const SUBSTRATES: SubstratePreset[] = [
  {
    id: 'carb',
    label: 'Glucose (Carbohydrate)',
    formula: 'C6H12O6',
    equation: 'C6H12O6 + 6 O2 → 6 CO2 + 6 H2O',
    rq: 1.0,
    o2Moles: 6,
    co2Moles: 6,
    note: 'Equal moles of CO2 produced and O2 consumed; RQ = 6 / 6 = 1.00.',
  },
  {
    id: 'lipid',
    label: 'Oleic Acid (Lipid)',
    formula: 'C18H34O2',
    equation: 'C18H34O2 + 25.5 O2 → 18 CO2 + 17 H2O',
    rq: 0.71,
    o2Moles: 25.5,
    co2Moles: 18,
    note: 'Lipids have many C–H bonds and few O atoms, requiring far more O2 to oxidise hydrogen to water (RQ ≈ 0.7).',
  },
  {
    id: 'protein',
    label: 'Amino Acid (Protein)',
    formula: 'Deaminated keto acid',
    equation: '2 C3H7O2N + 6 O2 → CO(NH2)2 + 5 CO2 + 5 H2O',
    rq: 0.83,
    o2Moles: 6,
    co2Moles: 5,
    note: 'Proteins are only respired during starvation after deamination; typical RQ ≈ 0.8–0.9.',
  },
  {
    id: 'mixed-anaerobic',
    label: 'Soaked Pea Seeds (Low O2)',
    formula: 'Aerobic + Ethanol',
    equation: 'C6H12O6 + 4 O2 → 5.4 CO2 + ...',
    rq: 1.35,
    o2Moles: 4,
    co2Moles: 5.4,
    note: 'When anaerobic ethanol fermentation supplements aerobic respiration, extra CO2 is released with zero O2 uptake, pushing RQ > 1.0.',
  },
];

export const RespirationLab: React.FC = () => {
  const [subView, setSubView] = useState<RespirationView>('pathway');
  const [condition, setCondition] = useState<PathwayCondition>('aerobic');
  const [selectedStage, setSelectedStage] = useState<RespirationStageId>('oxphos');
  const [isPlaying, setIsPlaying] = useState(true);

  // Krebs detailed view state
  const [selectedKrebsStep, setSelectedKrebsStep] = useState<KrebsStepId>('step1');
  const [krebsMultiplier, setKrebsMultiplier] = useState<1 | 2>(2);

  // Respirometer state
  const [substrateId, setSubstrateId] = useState<string>('carb');
  const [kohPresent, setKohPresent] = useState<boolean>(true);
  const [tempC, setTempC] = useState<number>(25);

  // Capillary RQ Calculator state (Paper 4 / 5)
  const [capillaryRadiusMm, setCapillaryRadiusMm] = useState<number>(0.5);
  const [distanceWithKohMm, setDistanceWithKohMm] = useState<number>(24);
  const [distanceNoKohMm, setDistanceNoKohMm] = useState<number>(0);

  const activeStage = STAGE_DETAILS[selectedStage];
  const activeKrebs = KREBS_STEPS[selectedKrebsStep];
  const activeSubstrate = SUBSTRATES.find((s) => s.id === substrateId) ?? SUBSTRATES[0];

  const isEtcActive = condition === 'aerobic' || condition === 'dnp';
  const isAtpSynthaseActive = condition === 'aerobic';
  const isAnaerobicActive = condition === 'anaerobic';
  const isCyanideBlocked = condition === 'cyanide';
  const isDnpUncoupled = condition === 'dnp';

  const getAtpMetrics = () => {
    switch (condition) {
      case 'aerobic':
        return {
          glycolysis: 2,
          krebs: 2,
          oxphos: 28,
          total: '30–32 ATP',
          statusLabel: 'NOMINAL AEROBIC',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          summary:
            'Full oxidative phosphorylation active. Oxygen accepts electrons at Complex IV; H+ flows through ATP synthase.',
        };
      case 'anaerobic':
        return {
          glycolysis: 2,
          krebs: 0,
          oxphos: 0,
          total: '2 ATP',
          statusLabel: 'ANOXIC FERMENTATION',
          statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
          summary:
            'No oxygen at Complex IV. Link, Krebs, and ETC halt; pyruvate reduces to lactate or ethanol to regenerate NAD+.',
        };
      case 'cyanide':
        return {
          glycolysis: 2,
          krebs: 0,
          oxphos: 0,
          total: '2 ATP (Inhibited)',
          statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
          statusLabel: 'COMPLEX IV BLOCKED',
          summary:
            'Cyanide binds cytochrome c oxidase (Complex IV). Electron flow stops, proton gradient collapses, and NADH cannot re-oxidise.',
        };
      case 'dnp':
        return {
          glycolysis: 2,
          krebs: 2,
          oxphos: 0,
          total: '4 ATP + High Heat',
          statusLabel: 'PROTON LEAK (UNCOUPLED)',
          statusColor: 'text-orange-700 bg-orange-50 border-orange-200',
          summary:
            'DNP permeabilises the inner membrane to H+. ETC runs fast and consumes O2, but H+ bypasses ATP synthase—energy dissipates as heat.',
        };
    }
  };

  const metrics = getAtpMetrics();

  // Respirometer meniscus displacement calculation (in mm)
  const tempFactor =
    tempC <= 35
      ? Math.pow(2, (tempC - 20) / 10)
      : Math.max(0.4, Math.pow(2, 1.5) - (tempC - 35) * 0.28);
  const netGasChange = kohPresent
    ? -activeSubstrate.o2Moles
    : activeSubstrate.co2Moles - activeSubstrate.o2Moles;
  const scaledShiftMm = Math.round(netGasChange * 2.4 * tempFactor * 10) / 10;
  const leftManometerOffset = Math.max(-28, Math.min(28, -scaledShiftMm));

  // Capillary Calculator math: V (mm3) = pi * r^2 * d
  const areaMm2 = Math.PI * capillaryRadiusMm * capillaryRadiusMm;
  const o2VolumeMm3 = areaMm2 * distanceWithKohMm;
  // Without KOH: positive distanceNoKohMm toward seeds = net decrease (O2 > CO2), negative = net increase (CO2 > O2)
  const netDecreaseNoKohMm3 = areaMm2 * distanceNoKohMm;
  const co2VolumeMm3 = Math.max(0, o2VolumeMm3 - netDecreaseNoKohMm3);
  const calculatedRq = o2VolumeMm3 > 0 ? co2VolumeMm3 / o2VolumeMm3 : 0;

  const getRqInterpretation = (rq: number) => {
    if (rq > 1.05) return 'Anaerobic + aerobic respiration (excess CO2 released)';
    if (rq >= 0.95) return 'Carbohydrate (Glucose) aerobic respiration';
    if (rq >= 0.78) return 'Protein (deaminated amino acids) or mixed substrate';
    return 'Lipid / fatty acid oxidation (high C–H bond proportion)';
  };

  return (
    <div className="space-y-6">
      {/* Sub-module Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300/70 pb-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-blue-700">
            Topic 12 · Energy and Respiration
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl text-balance">
            Cellular Respiration, Krebs Cycle &amp; Respirometry
          </h1>
        </div>

        <div
          className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
          role="tablist"
          aria-label="Respiration lab views"
        >
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'pathway'}
            onClick={() => setSubView('pathway')}
            className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
              subView === 'pathway'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            01. Pathway &amp; Structures
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'krebs'}
            onClick={() => setSubView('krebs')}
            className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
              subView === 'krebs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            02. Krebs Cycle (9700)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'respirometer'}
            onClick={() => setSubView('respirometer')}
            className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${
              subView === 'respirometer'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            03. Respirometer &amp; RQ
          </button>
        </div>
      </div>

      {/* VIEW 01: PATHWAY + MITOCHONDRIA & RICE AERENCHYMA DIAGRAMS */}
      {subView === 'pathway' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            {/* LEFT / TOP ZONE: Interactive Stage (8 cols) */}
            <div className="lg:col-span-8 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
              {/* Condition & Playback Bar */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'aerobic', label: 'Normal O2' },
                      { id: 'anaerobic', label: 'No O2 (Anaerobic)' },
                      { id: 'cyanide', label: 'Cyanide (Complex IV)' },
                      { id: 'dnp', label: 'DNP Uncoupler' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setCondition(item.id);
                        if (item.id === 'anaerobic') setSelectedStage('anaerobic');
                        else if (item.id === 'cyanide' || item.id === 'dnp')
                          setSelectedStage('oxphos');
                      }}
                      className={`whitespace-nowrap shrink-0 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                        condition === item.id
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4" /> Pause Flow
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Play Flow
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCondition('aerobic');
                      setSelectedStage('oxphos');
                      setIsPlaying(true);
                    }}
                    aria-label="Reset respiration simulation"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-4 w-4" /> Reset
                  </button>
                </div>
              </div>

              {/* Interactive SVG Cell & Mitochondrion Diagram */}
              <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-[#F8FAFC]">
                <svg
                  viewBox="0 0 820 460"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Interactive diagram of cellular respiration across cytoplasm and mitochondrion"
                >
                  <defs>
                    <marker
                      id="arrow-blue"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#1D4ED8" />
                    </marker>
                    <marker
                      id="arrow-amber"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#D97706" />
                    </marker>
                    <marker
                      id="arrow-emerald"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                    </marker>
                    <marker
                      id="arrow-rose"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#DC2626" />
                    </marker>
                  </defs>

                  <rect x="0" y="0" width="235" height="460" fill="#F1F5F9" />
                  <text
                    x="20"
                    y="28"
                    className="fill-slate-600 text-[12px] font-semibold"
                  >
                    CYTOPLASM (CYTOSOL)
                  </text>

                  {/* Mitochondrion Outer Membrane */}
                  <rect
                    x="248"
                    y="24"
                    width="552"
                    height="412"
                    rx="48"
                    fill="#FEF3C7"
                    fillOpacity="0.35"
                    stroke="#94A3B8"
                    strokeWidth="2.5"
                  />
                  <text
                    x="276"
                    y="48"
                    className="fill-slate-600 text-[11px] font-medium"
                  >
                    Intermembrane Space (High [H+] during ETC)
                  </text>

                  {/* Mitochondrion Inner Membrane (Cristae) & Matrix */}
                  <rect
                    x="270"
                    y="62"
                    width="508"
                    height="352"
                    rx="36"
                    fill="#FFFFFF"
                    stroke="#D97706"
                    strokeWidth="3"
                  />
                  <text
                    x="292"
                    y="86"
                    className="fill-amber-800 text-[12px] font-semibold"
                  >
                    MITOCHONDRIAL MATRIX
                  </text>

                  {/* Stage 1: Glycolysis Box */}
                  <g
                    onClick={() => setSelectedStage('glycolysis')}
                    className="cursor-pointer"
                  >
                    <rect
                      x="22"
                      y="62"
                      width="190"
                      height="168"
                      rx="12"
                      fill="#FFFFFF"
                      stroke={
                        selectedStage === 'glycolysis' ? '#1D4ED8' : '#CBD5E1'
                      }
                      strokeWidth={selectedStage === 'glycolysis' ? '2.5' : '1.5'}
                    />
                    <text
                      x="36"
                      y="86"
                      className="fill-slate-900 text-[13px] font-semibold"
                    >
                      1. Glycolysis
                    </text>
                    <text x="36" y="108" className="fill-slate-600 text-[11px]">
                      Glucose (6C)
                    </text>
                    <line
                      x1="115"
                      y1="114"
                      x2="115"
                      y2="136"
                      stroke="#1D4ED8"
                      strokeWidth="2"
                      markerEnd="url(#arrow-blue)"
                    />
                    <text
                      x="126"
                      y="129"
                      className="fill-rose-600 text-[10px] font-mono"
                    >
                      -2 ATP
                    </text>
                    <text
                      x="36"
                      y="150"
                      className="fill-slate-700 text-[11px] font-medium"
                    >
                      2 × Triose Phosphate (3C)
                    </text>
                    <line
                      x1="115"
                      y1="156"
                      x2="115"
                      y2="182"
                      stroke="#1D4ED8"
                      strokeWidth="2"
                      markerEnd="url(#arrow-blue)"
                    />
                    <text
                      x="124"
                      y="173"
                      className="fill-emerald-700 text-[10px] font-mono"
                    >
                      +4 ATP, 2 NADH
                    </text>
                    <text
                      x="36"
                      y="200"
                      className="fill-blue-700 text-[12px] font-semibold"
                    >
                      2 × Pyruvate (3C)
                    </text>
                    <text
                      x="36"
                      y="218"
                      className="fill-slate-500 text-[10px] font-mono"
                    >
                      Net: +2 ATP (substrate)
                    </text>
                  </g>

                  {/* Anaerobic Fermentation Box */}
                  <g
                    onClick={() => setSelectedStage('anaerobic')}
                    className="cursor-pointer"
                  >
                    <rect
                      x="22"
                      y="274"
                      width="190"
                      height="150"
                      rx="12"
                      fill={isAnaerobicActive ? '#FFFBEB' : '#FFFFFF'}
                      stroke={
                        selectedStage === 'anaerobic' || isAnaerobicActive
                          ? '#D97706'
                          : '#CBD5E1'
                      }
                      strokeWidth={
                        selectedStage === 'anaerobic' || isAnaerobicActive
                          ? '2.5'
                          : '1.5'
                      }
                    />
                    <text
                      x="36"
                      y="298"
                      className="fill-slate-900 text-[12px] font-semibold"
                    >
                      Anaerobic Fermentation
                    </text>
                    <text x="36" y="318" className="fill-slate-600 text-[11px]">
                      Lactate (Mammals)
                    </text>
                    <text x="36" y="336" className="fill-slate-600 text-[11px]">
                      Ethanol + CO2 (Yeast)
                    </text>
                    <text
                      x="36"
                      y="366"
                      className="fill-amber-800 text-[11px] font-medium"
                    >
                      Re-oxidises NADH → NAD+
                    </text>
                    <text x="36" y="386" className="fill-slate-500 text-[10px]">
                      Allows glycolysis to continue
                    </text>
                    <text
                      x="36"
                      y="408"
                      className="fill-amber-700 text-[10px] font-mono"
                    >
                      {isAnaerobicActive ? 'ACTIVE PATHWAY' : 'Standby (O2 present)'}
                    </text>
                  </g>

                  <path
                    d="M 115 230 L 115 268"
                    fill="none"
                    stroke={isAnaerobicActive ? '#D97706' : '#CBD5E1'}
                    strokeWidth={isAnaerobicActive ? '3' : '1.5'}
                    className={
                      isPlaying && isAnaerobicActive ? 'animate-flow-dash' : ''
                    }
                    markerEnd="url(#arrow-amber)"
                  />

                  <path
                    d="M 212 195 L 296 195"
                    fill="none"
                    stroke={!isAnaerobicActive ? '#1D4ED8' : '#CBD5E1'}
                    strokeWidth={!isAnaerobicActive ? '3' : '1.5'}
                    className={
                      isPlaying && !isAnaerobicActive ? 'animate-flow-dash' : ''
                    }
                    markerEnd="url(#arrow-blue)"
                  />

                  {/* Stage 2: Link Reaction */}
                  <g
                    onClick={() => setSelectedStage('link')}
                    className="cursor-pointer"
                  >
                    <rect
                      x="302"
                      y="116"
                      width="158"
                      height="122"
                      rx="12"
                      fill={!isAnaerobicActive ? '#F8FAFC' : '#F1F5F9'}
                      stroke={selectedStage === 'link' ? '#1D4ED8' : '#CBD5E1'}
                      strokeWidth={selectedStage === 'link' ? '2.5' : '1.5'}
                      opacity={isAnaerobicActive || isCyanideBlocked ? 0.45 : 1}
                    />
                    <text
                      x="316"
                      y="140"
                      className="fill-slate-900 text-[12px] font-semibold"
                    >
                      2. Link Reaction
                    </text>
                    <text x="316" y="162" className="fill-slate-600 text-[11px]">
                      Pyruvate (3C) + CoA
                    </text>
                    <text
                      x="316"
                      y="182"
                      className="fill-rose-600 text-[10px] font-mono"
                    >
                      → 2 CO2 released
                    </text>
                    <text
                      x="316"
                      y="200"
                      className="fill-blue-700 text-[10px] font-mono"
                    >
                      → 2 NADH formed
                    </text>
                    <text
                      x="316"
                      y="222"
                      className="fill-slate-900 text-[11px] font-semibold"
                    >
                      2 × Acetyl CoA (2C)
                    </text>
                  </g>

                  <path
                    d="M 381 238 L 381 264"
                    fill="none"
                    stroke={
                      !isAnaerobicActive && !isCyanideBlocked
                        ? '#1D4ED8'
                        : '#CBD5E1'
                    }
                    strokeWidth="2.5"
                    className={
                      isPlaying && !isAnaerobicActive && !isCyanideBlocked
                        ? 'animate-flow-dash'
                        : ''
                    }
                    markerEnd="url(#arrow-blue)"
                  />

                  {/* Stage 3: Krebs Cycle */}
                  <g
                    onClick={() => setSelectedStage('krebs')}
                    className="cursor-pointer"
                    opacity={isAnaerobicActive || isCyanideBlocked ? 0.45 : 1}
                  >
                    <rect
                      x="294"
                      y="268"
                      width="174"
                      height="130"
                      rx="12"
                      fill="#F8FAFC"
                      stroke={selectedStage === 'krebs' ? '#1D4ED8' : '#CBD5E1'}
                      strokeWidth={selectedStage === 'krebs' ? '2.5' : '1.5'}
                    />
                    <circle
                      cx="381"
                      cy="340"
                      r="38"
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                      strokeDasharray="8 4"
                      className={
                        isPlaying && !isAnaerobicActive && !isCyanideBlocked
                          ? 'animate-flow-dash-slow'
                          : ''
                      }
                    />
                    <text
                      x="308"
                      y="290"
                      className="fill-slate-900 text-[12px] font-semibold"
                    >
                      3. Krebs Cycle (×2)
                    </text>
                    <text
                      x="351"
                      y="336"
                      className="fill-slate-800 text-[10px] font-semibold"
                    >
                      Citrate 6C
                    </text>
                    <text x="348" y="352" className="fill-slate-600 text-[10px]">
                      → Oxalo. 4C
                    </text>
                    <text
                      x="308"
                      y="390"
                      className="fill-emerald-700 text-[10px] font-mono"
                    >
                      6 NADH · 2 FADH2 · 2 ATP · 4 CO2
                    </text>
                  </g>

                  <path
                    d="M 468 330 C 500 330, 495 200, 526 200"
                    fill="none"
                    stroke={isEtcActive ? '#059669' : '#CBD5E1'}
                    strokeWidth="2.5"
                    className={isPlaying && isEtcActive ? 'animate-flow-dash' : ''}
                    markerEnd="url(#arrow-emerald)"
                  />
                  <text
                    x="472"
                    y="256"
                    className="fill-emerald-700 text-[10px] font-mono"
                  >
                    NADH/FADH2
                  </text>

                  {/* Stage 4: Oxidative Phosphorylation */}
                  <g
                    onClick={() => setSelectedStage('oxphos')}
                    className="cursor-pointer"
                  >
                    <rect
                      x="530"
                      y="102"
                      width="232"
                      height="296"
                      rx="14"
                      fill="#F8FAFC"
                      stroke={selectedStage === 'oxphos' ? '#1D4ED8' : '#CBD5E1'}
                      strokeWidth={selectedStage === 'oxphos' ? '2.5' : '1.5'}
                    />
                    <text
                      x="546"
                      y="124"
                      className="fill-slate-900 text-[12px] font-semibold"
                    >
                      4. Oxidative Phosphorylation
                    </text>

                    <rect
                      x="544"
                      y="168"
                      width="204"
                      height="36"
                      rx="8"
                      fill="#FEF3C7"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                    />
                    <text
                      x="554"
                      y="156"
                      className="fill-amber-900 text-[10px] font-medium"
                    >
                      Intermembrane Space (H+ Pool)
                    </text>

                    <rect x="556" y="162" width="34" height="48" rx="6" fill="#1D4ED8" />
                    <text x="566" y="190" className="fill-white text-[10px] font-mono font-semibold">
                      I
                    </text>

                    <rect x="602" y="162" width="34" height="48" rx="6" fill="#2563EB" />
                    <text x="610" y="190" className="fill-white text-[10px] font-mono font-semibold">
                      III
                    </text>

                    <rect
                      x="648"
                      y="162"
                      width="34"
                      height="48"
                      rx="6"
                      fill={isCyanideBlocked ? '#DC2626' : '#3B82F6'}
                    />
                    <text x="657" y="190" className="fill-white text-[10px] font-mono font-semibold">
                      IV
                    </text>

                    {isCyanideBlocked && (
                      <g>
                        <circle cx="665" cy="186" r="14" fill="#DC2626" fillOpacity="0.9" />
                        <text x="659" y="191" className="fill-white text-[13px] font-bold">
                          ✕
                        </text>
                        <text x="554" y="232" className="fill-rose-700 text-[10px] font-semibold">
                          CN- inhibits Complex IV!
                        </text>
                      </g>
                    )}

                    <path
                      d="M 564 186 L 664 186"
                      fill="none"
                      stroke="#FDE047"
                      strokeWidth="2.5"
                      className={isPlaying && isEtcActive ? 'animate-flow-dash' : ''}
                    />

                    <path
                      d="M 573 216 L 573 142"
                      fill="none"
                      stroke={isEtcActive ? '#D97706' : '#CBD5E1'}
                      strokeWidth="2"
                      className={isPlaying && isEtcActive ? 'animate-flow-dash' : ''}
                      markerEnd="url(#arrow-amber)"
                    />
                    <path
                      d="M 619 216 L 619 142"
                      fill="none"
                      stroke={isEtcActive ? '#D97706' : '#CBD5E1'}
                      strokeWidth="2"
                      className={isPlaying && isEtcActive ? 'animate-flow-dash' : ''}
                      markerEnd="url(#arrow-amber)"
                    />

                    <rect x="700" y="162" width="38" height="56" rx="8" fill="#059669" />
                    <circle
                      cx="719"
                      cy="226"
                      r="16"
                      fill="#10B981"
                      stroke="#047857"
                      strokeWidth="2"
                      className={isPlaying && isAtpSynthaseActive ? 'animate-rotor' : ''}
                    />
                    <line
                      x1="719"
                      y1="214"
                      x2="719"
                      y2="238"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className={isPlaying && isAtpSynthaseActive ? 'animate-rotor' : ''}
                    />
                    <line
                      x1="707"
                      y1="226"
                      x2="731"
                      y2="226"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className={isPlaying && isAtpSynthaseActive ? 'animate-rotor' : ''}
                    />
                    <text x="696" y="256" className="fill-emerald-800 text-[10px] font-semibold">
                      ATP Synthase
                    </text>

                    <path
                      d="M 719 142 L 719 210"
                      fill="none"
                      stroke={isAtpSynthaseActive ? '#059669' : '#CBD5E1'}
                      strokeWidth="2.5"
                      className={isPlaying && isAtpSynthaseActive ? 'animate-flow-dash' : ''}
                      markerEnd="url(#arrow-emerald)"
                    />

                    {isDnpUncoupled && (
                      <g>
                        <path
                          d="M 686 144 L 686 244"
                          fill="none"
                          stroke="#EA580C"
                          strokeWidth="2.5"
                          className={isPlaying ? 'animate-flow-dash' : ''}
                          markerEnd="url(#arrow-rose)"
                        />
                        <text x="546" y="272" className="fill-orange-700 text-[10px] font-semibold">
                          DNP Leak: H+ bypasses ATP Synthase → HEAT
                        </text>
                      </g>
                    )}

                    <rect x="546" y="290" width="200" height="92" rx="10" fill="#FFFFFF" stroke="#E2E8F0" />
                    <text x="558" y="310" className="fill-slate-800 text-[11px] font-semibold">
                      Final Electron Acceptor:
                    </text>
                    <text x="558" y="328" className="fill-blue-700 text-[11px] font-mono">
                      ½ O2 + 2 H+ + 2 e- → H2O
                    </text>
                    <text x="558" y="350" className="fill-slate-600 text-[10px]">
                      {isAtpSynthaseActive
                        ? 'Chemiosmosis: ~26–28 ATP'
                        : isDnpUncoupled
                          ? 'O2 used rapidly · 0 oxidative ATP'
                          : 'No O2 reduction · ETC stalled'}
                    </text>
                    <text x="558" y="368" className="fill-emerald-700 text-[10px] font-mono">
                      Click any stage box to inspect
                    </text>
                  </g>
                </svg>
              </div>

              {/* Live ATP Stoichiometry Strip */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm text-slate-600">Glycolysis</p>
                  <p className="mt-0.5 font-mono text-lg font-semibold text-slate-900 tabular-nums">
                    +{metrics.glycolysis} ATP
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm text-slate-600">Krebs Substrate</p>
                  <p className="mt-0.5 font-mono text-lg font-semibold text-slate-900 tabular-nums">
                    +{metrics.krebs} ATP
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm text-slate-600">Oxidative Phos.</p>
                  <p className="mt-0.5 font-mono text-lg font-semibold text-slate-900 tabular-nums">
                    {metrics.oxphos > 0 ? `~${metrics.oxphos} ATP` : '0 ATP'}
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-3">
                  <p className="text-sm text-blue-800">Total Yield / Glucose</p>
                  <p className="mt-0.5 font-mono text-lg font-semibold text-blue-950 tabular-nums">
                    {metrics.total}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT / BOTTOM ZONE: Concept & Inspection Deck */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-500">
                    Simulated Metabolic State
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium ${metrics.statusColor}`}
                  >
                    {condition === 'aerobic' && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {condition === 'dnp' && <Flame className="h-3.5 w-3.5" />}
                    {(condition === 'anaerobic' || condition === 'cyanide') && (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    )}
                    {metrics.statusLabel}
                  </span>
                </div>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {metrics.summary}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <p className="text-sm font-medium text-slate-500">
                  Stage Inspector (9700 Syllabus)
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(Object.keys(STAGE_DETAILS) as RespirationStageId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedStage(id)}
                      className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedStage === id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {STAGE_DETAILS[id].title}
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {activeStage.title}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Location: {activeStage.location}
                    </p>
                  </div>

                  <div className="space-y-2 rounded-lg bg-slate-50 p-3.5 text-sm">
                    <div>
                      <span className="font-semibold text-slate-700">Inputs: </span>
                      <span className="font-mono text-slate-800">{activeStage.inputs}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Outputs: </span>
                      <span className="font-mono text-blue-800">{activeStage.outputs}</span>
                    </div>
                  </div>

                  <p className="text-base leading-relaxed text-slate-700">
                    {activeStage.mechanism}
                  </p>

                  <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-sm leading-relaxed text-amber-950">
                    <span className="font-semibold">Examiner Focus: </span>
                    {activeStage.examTip}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* 9700 Structural Diagrams: Mitochondrion & Rice Root Aerenchyma */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              9700 Structural Diagrams: Mitochondrion &amp; Rice Root Aerenchyma
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <DiagramImageCard
                src="/src/assets/images/diagram_mitochondrion_1794877355450.jpg"
                alt="Cross-section diagram of a mitochondrion showing outer membrane, intermembrane space, cristae, matrix, circular DNA, and 70S ribosomes"
                title="Mitochondrion Ultrastructure (TEM / 3D Cutaway)"
                syllabusTag="12.2.2 · Structure & Function of Mitochondria"
                caption="Double-membrane organelle adapted for aerobic ATP synthesis: deeply folded inner membrane cristae house electron transport chains and stalked ATP synthase particles."
                keyStructures={[
                  'Cristae: Folded inner membrane increases surface area for ETC complexes & ATP synthase; impermeable to H+.',
                  'Intermembrane space: Narrow volume allows rapid build-up of steep H+ electrochemical gradient.',
                  'Mitochondrial matrix: Contains link reaction & Krebs cycle enzymes, circular DNA, and 70S ribosomes.',
                ]}
              />

              <DiagramImageCard
                src="/src/assets/images/diagram_rice_aerenchyma_1794877356861.jpg"
                alt="Cross-section of a flooded rice root showing large hollow aerenchyma air channels in the cortex surrounding the central vascular cylinder"
                title="Aerenchyma in Flooded Rice Root (Oryza sativa)"
                syllabusTag="12.2.9 · Adaptations of Rice to Submerged Growth"
                caption="Submerged rice develops extensive hollow aerenchyma channels formed by programmed cell death in the root cortex, conducting oxygen from aerial shoots down to hypoxic roots."
                keyStructures={[
                  'Aerenchyma air spaces: Continuous low-resistance gas pathway for O2 diffusion to root cells.',
                  'Suberised exodermis/endodermis barrier: Prevents radial oxygen loss into surrounding anoxic paddy water.',
                  'High alcohol dehydrogenase activity: Allows temporary ethanol fermentation & tolerance when O2 is scarce.',
                ]}
              />
            </div>
          </section>
        </div>
      )}

      {/* VIEW 02: KREBS CYCLE DEEP DIVE (9700) */}
      {subView === 'krebs' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Krebs Cycle Interactive Matrix Diagram
                </h2>
                <p className="text-sm text-slate-600">
                  Click any step in the cycle to inspect carbon counts, decarboxylation, and dehydrogenation
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setKrebsMultiplier(1)}
                  className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    krebsMultiplier === 1
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Per 1 Acetyl CoA (1 turn)
                </button>
                <button
                  type="button"
                  onClick={() => setKrebsMultiplier(2)}
                  className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    krebsMultiplier === 2
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Per Glucose (2 turns)
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-3">
              <svg
                viewBox="0 0 760 440"
                className="w-full h-auto select-none"
                role="img"
                aria-label="Interactive Cambridge 9700 Krebs Cycle diagram showing 6C, 5C, and 4C compounds"
              >
                <defs>
                  <marker
                    id="k-arrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#1D4ED8" />
                  </marker>
                </defs>

                {/* Link Entry Input */}
                <rect x="275" y="14" width="210" height="44" rx="10" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.5" />
                <text x="292" y="34" className="fill-blue-950 text-[12px] font-semibold">
                  {krebsMultiplier} × Acetyl CoA (2C)
                </text>
                <text x="292" y="49" className="fill-blue-700 text-[10px] font-mono">
                  from Link Reaction · CoA recycled
                </text>

                <line x1="380" y1="58" x2="380" y2="90" stroke="#1D4ED8" strokeWidth="2.5" markerEnd="url(#k-arrow)" />

                {/* Main Cycle Ring */}
                <circle
                  cx="380"
                  cy="245"
                  r="138"
                  fill="none"
                  stroke="#93C5FD"
                  strokeWidth="3"
                  strokeDasharray="8 5"
                  className="animate-flow-dash-slow"
                />

                {/* Step 1 Node: Citrate (6C) */}
                <g onClick={() => setSelectedKrebsStep('step1')} className="cursor-pointer">
                  <rect
                    x="295"
                    y="92"
                    width="170"
                    height="56"
                    rx="12"
                    fill="#FFFFFF"
                    stroke={selectedKrebsStep === 'step1' ? '#1D4ED8' : '#CBD5E1'}
                    strokeWidth={selectedKrebsStep === 'step1' ? '3' : '1.5'}
                  />
                  <text x="312" y="116" className="fill-slate-900 text-[13px] font-semibold">
                    1. Citrate (6C)
                  </text>
                  <text x="312" y="135" className="fill-slate-600 text-[11px] font-mono">
                    2C + 4C → 6C (-CoA)
                  </text>
                </g>

                {/* Step 2 Node: 5C Intermediate */}
                <g onClick={() => setSelectedKrebsStep('step2')} className="cursor-pointer">
                  <rect
                    x="512"
                    y="214"
                    width="206"
                    height="68"
                    rx="12"
                    fill="#FFFFFF"
                    stroke={selectedKrebsStep === 'step2' ? '#1D4ED8' : '#CBD5E1'}
                    strokeWidth={selectedKrebsStep === 'step2' ? '3' : '1.5'}
                  />
                  <text x="528" y="238" className="fill-slate-900 text-[13px] font-semibold">
                    2. 5C Intermediate
                  </text>
                  <text x="528" y="256" className="fill-rose-700 text-[11px] font-mono">
                    -{krebsMultiplier} CO2 (Decarboxylation)
                  </text>
                  <text x="528" y="272" className="fill-blue-700 text-[11px] font-mono">
                    +{krebsMultiplier} NADH (Dehydrogenation)
                  </text>
                </g>

                {/* Step 3 Node: 4C Compound */}
                <g onClick={() => setSelectedKrebsStep('step3')} className="cursor-pointer">
                  <rect
                    x="275"
                    y="348"
                    width="210"
                    height="76"
                    rx="12"
                    fill="#FFFFFF"
                    stroke={selectedKrebsStep === 'step3' ? '#1D4ED8' : '#CBD5E1'}
                    strokeWidth={selectedKrebsStep === 'step3' ? '3' : '1.5'}
                  />
                  <text x="292" y="372" className="fill-slate-900 text-[13px] font-semibold">
                    3. 4C Compound
                  </text>
                  <text x="292" y="390" className="fill-rose-700 text-[11px] font-mono">
                    -{krebsMultiplier} CO2 · +{krebsMultiplier} NADH
                  </text>
                  <text x="292" y="408" className="fill-emerald-700 text-[11px] font-mono font-semibold">
                    +{krebsMultiplier} ATP (Substrate-level)
                  </text>
                </g>

                {/* Step 4 Node: Oxaloacetate (4C) */}
                <g onClick={() => setSelectedKrebsStep('step4')} className="cursor-pointer">
                  <rect
                    x="42"
                    y="214"
                    width="208"
                    height="68"
                    rx="12"
                    fill="#FFFFFF"
                    stroke={selectedKrebsStep === 'step4' ? '#1D4ED8' : '#CBD5E1'}
                    strokeWidth={selectedKrebsStep === 'step4' ? '3' : '1.5'}
                  />
                  <text x="58" y="238" className="fill-slate-900 text-[13px] font-semibold">
                    4. Oxaloacetate (4C)
                  </text>
                  <text x="58" y="256" className="fill-amber-700 text-[11px] font-mono">
                    +{krebsMultiplier} FADH2 (FAD reduced)
                  </text>
                  <text x="58" y="272" className="fill-blue-700 text-[11px] font-mono">
                    +{krebsMultiplier} NADH (NAD+ reduced)
                  </text>
                </g>

                {/* Center Summary */}
                <text x="322" y="236" className="fill-slate-800 text-[12px] font-semibold">
                  Matrix Totals ({krebsMultiplier === 2 ? 'Per Glucose' : 'Per Turn'}):
                </text>
                <text x="314" y="256" className="fill-blue-700 text-[11px] font-mono">
                  {3 * krebsMultiplier} NADH · {1 * krebsMultiplier} FADH2
                </text>
                <text x="322" y="274" className="fill-emerald-700 text-[11px] font-mono">
                  {1 * krebsMultiplier} ATP · {2 * krebsMultiplier} CO2
                </text>
              </svg>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
              <p className="text-sm font-medium text-slate-500">
                Krebs Cycle Step Inspector
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(KREBS_STEPS) as KrebsStepId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedKrebsStep(id)}
                    className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedKrebsStep === id
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {KREBS_STEPS[id].stepNumber}
                  </button>
                ))}
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {activeKrebs.title}
                </h3>
                <p className="rounded-md bg-slate-50 p-3 font-mono text-sm text-blue-900">
                  {activeKrebs.carbonChange}
                </p>
                <div className="space-y-1.5 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">Reaction: </span>
                    {activeKrebs.reactionType}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Per Turn: </span>
                    <span className="font-mono">{activeKrebs.coenzymesPerTurn}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Per Glucose: </span>
                    <span className="font-mono">{activeKrebs.coenzymesPerGlucose}</span>
                  </p>
                </div>
                <p className="text-base leading-relaxed text-slate-700">
                  {activeKrebs.detail}
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* VIEW 03: RESPIROMETER & INTERACTIVE RQ CALCULATOR */}
      {subView === 'respirometer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-8 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <FlaskConical className="h-4 w-4 text-blue-700" />
                  Virtual U-Tube Respirometer &amp; RQ Lab
                </div>
                <div className="font-mono text-sm text-slate-600 tabular-nums">
                  Temperature: {tempC} °C · KOH Absorber:{' '}
                  {kohPresent ? 'PRESENT' : 'ABSENT'}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4">
                <svg
                  viewBox="0 0 760 360"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Interactive respirometer apparatus showing manometer fluid movement"
                >
                  <rect
                    x="20"
                    y="75"
                    width="720"
                    height="265"
                    rx="14"
                    fill="#E0F2FE"
                    fillOpacity="0.4"
                    stroke="#93C5FD"
                    strokeWidth="1.5"
                  />
                  <text x="36" y="324" className="fill-sky-800 text-[11px] font-medium">
                    Thermostatically Controlled Water Bath ({tempC} °C)
                  </text>

                  <rect
                    x="65"
                    y="110"
                    width="130"
                    height="185"
                    rx="16"
                    fill="#FFFFFF"
                    stroke="#475569"
                    strokeWidth="2.5"
                  />
                  <text x="76" y="98" className="fill-slate-800 text-[12px] font-semibold">
                    Experimental Tube
                  </text>

                  <rect
                    x="71"
                    y="246"
                    width="118"
                    height="43"
                    rx="10"
                    fill={kohPresent ? '#DBEAFE' : '#F1F5F9'}
                  />
                  <text x="86" y="272" className="fill-slate-800 text-[11px] font-medium">
                    {kohPresent ? 'KOH Solution' : 'Distilled Water'}
                  </text>

                  <line
                    x1="71"
                    y1="218"
                    x2="189"
                    y2="218"
                    stroke="#64748B"
                    strokeDasharray="4 3"
                    strokeWidth="2"
                  />
                  <ellipse cx="104" cy="202" rx="14" ry="10" fill="#84CC16" />
                  <ellipse cx="132" cy="199" rx="15" ry="11" fill="#65A30D" />
                  <ellipse cx="158" cy="203" rx="13" ry="10" fill="#84CC16" />
                  <text x="82" y="180" className="fill-slate-700 text-[10px] font-medium">
                    Respiring Tissue
                  </text>

                  <text x="84" y="142" className="fill-blue-700 text-[10px] font-mono">
                    O2 in: {activeSubstrate.o2Moles} mol
                  </text>
                  <text x="84" y="158" className="fill-rose-700 text-[10px] font-mono">
                    CO2 out: {activeSubstrate.co2Moles} mol
                  </text>

                  <rect
                    x="565"
                    y="110"
                    width="130"
                    height="185"
                    rx="16"
                    fill="#FFFFFF"
                    stroke="#475569"
                    strokeWidth="2.5"
                  />
                  <text x="576" y="98" className="fill-slate-800 text-[12px] font-semibold">
                    Thermobarometer Control
                  </text>
                  <circle cx="605" cy="202" r="9" fill="#CBD5E1" />
                  <circle cx="630" cy="204" r="9" fill="#94A3B8" />
                  <circle cx="654" cy="200" r="9" fill="#CBD5E1" />
                  <text x="588" y="180" className="fill-slate-600 text-[10px] font-medium">
                    Inert Glass Beads
                  </text>

                  <path d="M 130 110 L 130 46 L 320 46 L 320 120" fill="none" stroke="#475569" strokeWidth="4" />
                  <path d="M 630 110 L 630 46 L 440 46 L 440 120" fill="none" stroke="#475569" strokeWidth="4" />

                  <path
                    d="M 320 120 L 320 260 A 60 60 0 0 0 440 260 L 440 120"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M 320 ${190 - leftManometerOffset} L 320 260 A 60 60 0 0 0 440 260 L 440 ${190 + leftManometerOffset}`}
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="12"
                    strokeLinecap="butt"
                  />
                  <line x1="302" y1="145" x2="302" y2="235" stroke="#64748B" strokeWidth="1.5" />
                  <line x1="296" y1="190" x2="308" y2="190" stroke="#0F172A" strokeWidth="1.5" />
                  <text x="266" y="194" className="fill-slate-600 text-[10px] font-mono">
                    0 mm
                  </text>
                  <text x="338" y="144" className="fill-slate-800 text-[11px] font-mono font-semibold">
                    Meniscus: {scaledShiftMm > 0 ? `+${scaledShiftMm}` : scaledShiftMm} mm
                  </text>
                  <text x="336" y="162" className="fill-slate-600 text-[10px]">
                    {scaledShiftMm < 0
                      ? '← Moves toward seeds (net drop)'
                      : scaledShiftMm > 0
                        ? '→ Moves away (net gas rise)'
                        : 'No net gas volume change'}
                  </text>
                </svg>
              </div>

              {/* Paper 4 / 5 Step-by-Step Capillary Volume & RQ Calculator */}
              <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    <Calculator className="h-4 w-4 text-blue-700" />
                    Respirometer Capillary Volume &amp; RQ Calculator (Paper 4 / 5)
                  </div>
                  <span className="font-mono text-sm font-semibold text-blue-800 tabular-nums">
                    RQ = {calculatedRq.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <label htmlFor="cap-radius" className="font-medium text-slate-700">
                        Capillary radius (r)
                      </label>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        {capillaryRadiusMm.toFixed(1)} mm
                      </span>
                    </div>
                    <input
                      id="cap-radius"
                      type="range"
                      min={0.3}
                      max={1.2}
                      step={0.1}
                      value={capillaryRadiusMm}
                      onChange={(e) => setCapillaryRadiusMm(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <label htmlFor="dist-koh" className="font-medium text-slate-700">
                        Shift WITH KOH (d₁)
                      </label>
                      <span className="font-mono font-semibold text-blue-700 tabular-nums">
                        {distanceWithKohMm} mm
                      </span>
                    </div>
                    <input
                      id="dist-koh"
                      type="range"
                      min={10}
                      max={50}
                      step={1}
                      value={distanceWithKohMm}
                      onChange={(e) => setDistanceWithKohMm(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <label htmlFor="dist-nokoh" className="font-medium text-slate-700">
                        Shift NO KOH (d₂)
                      </label>
                      <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                        {distanceNoKohMm > 0 ? `+${distanceNoKohMm}` : distanceNoKohMm} mm
                      </span>
                    </div>
                    <input
                      id="dist-nokoh"
                      type="range"
                      min={-15}
                      max={20}
                      step={1}
                      value={distanceNoKohMm}
                      onChange={(e) => setDistanceNoKohMm(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                  <div className="rounded-md border border-slate-200 bg-white p-3">
                    <p className="text-slate-500">1. O2 Absorbed (πr²d₁)</p>
                    <p className="mt-0.5 font-mono text-base font-semibold text-blue-800 tabular-nums">
                      {o2VolumeMm3.toFixed(1)} mm³
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white p-3">
                    <p className="text-slate-500">2. CO2 Evolved (V(O2) − πr²d₂)</p>
                    <p className="mt-0.5 font-mono text-base font-semibold text-emerald-800 tabular-nums">
                      {co2VolumeMm3.toFixed(1)} mm³
                    </p>
                  </div>
                  <div className="rounded-md border border-blue-200 bg-blue-50/70 p-3">
                    <p className="text-blue-800">3. RQ = V(CO2) / V(O2)</p>
                    <p className="mt-0.5 font-mono text-base font-semibold text-blue-950 tabular-nums">
                      {calculatedRq.toFixed(2)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Diagnosis: </span>
                  {getRqInterpretation(calculatedRq)}
                </p>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-4">
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <Activity className="h-4 w-4 text-blue-700" />
                  Experiment Controls
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Respiratory Substrate
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {SUBSTRATES.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSubstrateId(sub.id)}
                        className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
                          substrateId === sub.id
                            ? 'border-blue-600 bg-blue-50 text-blue-950 font-medium'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{sub.label}</span>
                        <span className="font-mono tabular-nums text-slate-500">
                          RQ {sub.rq.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Potassium Hydroxide (KOH)
                    </p>
                    <p className="text-xs text-slate-500">
                      Absorbs all evolved CO2 gas
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setKohPresent((v) => !v)}
                    className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                      kohPresent
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 bg-slate-100 text-slate-700'
                    }`}
                  >
                    {kohPresent ? 'KOH Active' : 'KOH Removed'}
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <label htmlFor="resp-temp" className="font-medium text-slate-800">
                      Water Bath Temperature
                    </label>
                    <span className="font-mono font-semibold text-blue-700 tabular-nums">
                      {tempC} °C
                    </span>
                  </div>
                  <input
                    id="resp-temp"
                    type="range"
                    min={10}
                    max={45}
                    step={5}
                    value={tempC}
                    onChange={(e) => setTempC(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="mt-1 flex justify-between text-xs font-mono text-slate-500">
                    <span>10 °C</span>
                    <span>25 °C</span>
                    <span>45 °C (Denatures)</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-3 shadow-xs">
                <p className="text-sm font-medium text-slate-500">
                  Stoichiometry &amp; RQ Calculation
                </p>
                <p className="rounded-md bg-slate-50 p-3 font-mono text-sm text-slate-800">
                  {activeSubstrate.equation}
                </p>
                <p className="font-mono text-sm text-blue-800 tabular-nums">
                  RQ = CO2 produced / O2 consumed = {activeSubstrate.co2Moles} /{' '}
                  {activeSubstrate.o2Moles} = {activeSubstrate.rq.toFixed(2)}
                </p>
                <p className="text-sm leading-relaxed text-slate-700">
                  {activeSubstrate.note}
                </p>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};
