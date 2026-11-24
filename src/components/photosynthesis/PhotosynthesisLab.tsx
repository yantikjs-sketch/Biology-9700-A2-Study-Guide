import React, { useEffect, useMemo, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sun,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { DiagramImageCard } from '../common/DiagramImageCard';

type PhotoView = 'light-stage' | 'calvin' | 'limiting-factors';
type PhotophosphorylationMode = 'non-cyclic' | 'cyclic';
type ThylakoidComplexId = 'ps2' | 'cyt' | 'ps1' | 'nadp' | 'atp-synthase';
type CalvinPerturbation = 'steady' | 'dark' | 'no-co2';
type CalvinStepId = 'fixation' | 'reduction' | 'synthesis' | 'regeneration';

interface ComplexDetail {
  id: ThylakoidComplexId;
  title: string;
  reaction: string;
  mechanism: string;
  examTip: string;
}

const COMPLEX_DETAILS: Record<ThylakoidComplexId, ComplexDetail> = {
  ps2: {
    id: 'ps2',
    title: 'Photosystem II (P680) & Photolysis',
    reaction: '2 H2O → 4 H+ + 4 e- + O2',
    mechanism:
      'Light energy absorbed by accessory pigments transfers by resonance to P680 chlorophyll a, exciting electrons to a higher energy level. The oxygen-evolving complex splits water to replace lost electrons, releasing O2 and protons into the thylakoid lumen.',
    examTip:
      'Active ONLY in non-cyclic photophosphorylation; source of all photosynthetic O2.',
  },
  cyt: {
    id: 'cyt',
    title: 'Cytochrome b6f Proton Pump',
    reaction: 'PQH2 → Cyt b6f + H+ (into lumen)',
    mechanism:
      'As high-energy electrons pass down the electron transport chain from plastoquinone through cytochrome b6f, energy released actively pumps H+ ions from the stroma across the thylakoid membrane into the thylakoid lumen.',
    examTip:
      'Creates a steep electrochemical H+ gradient (low lumen pH ~5, stroma pH ~8).',
  },
  ps1: {
    id: 'ps1',
    title: 'Photosystem I (P700)',
    reaction: 'P700 + photon → P700* → Ferredoxin',
    mechanism:
      'Electrons arriving from plastocyanin are re-energised by a second photon absorbed at P700. In non-cyclic flow they pass to ferredoxin and NADP reductase; in cyclic flow they return to cytochrome b6f to pump extra H+.',
    examTip:
      'Cyclic photophosphorylation uses PSI alone to top up ATP for the Calvin cycle.',
  },
  nadp: {
    id: 'nadp',
    title: 'NADP Reductase (Stroma side)',
    reaction: 'NADP+ + 2 H+ + 2 e- → NADPH + H+',
    mechanism:
      'Positioned on the stroma-facing surface of the thylakoid membrane, NADP reductase transfers electrons from ferredoxin and protons from the stroma to reduce NADP+ into reduced NADP (NADPH).',
    examTip:
      'Consuming H+ in the stroma also helps maintain the proton gradient across the thylakoid membrane.',
  },
  'atp-synthase': {
    id: 'atp-synthase',
    title: 'ATP Synthase (Chemiosmosis)',
    reaction: 'ADP + Pi → ATP (driven by H+ flow)',
    mechanism:
      'The thylakoid membrane is impermeable to protons except through ATP synthase channels. Protons diffuse down their electrochemical gradient from the lumen back into the stroma, rotating the enzyme to phosphorylate ADP into ATP.',
    examTip:
      'Notice the direction: H+ accumulates INSIDE the thylakoid lumen and flows OUT to the stroma (opposite to mitochondria intermembrane → matrix!).',
  },
};

interface CalvinStepDetail {
  id: CalvinStepId;
  label: string;
  title: string;
  equation: (mult: 1 | 3 | 6) => string;
  mechanism: string;
  examTip: string;
}

const CALVIN_STEPS: Record<CalvinStepId, CalvinStepDetail> = {
  fixation: {
    id: 'fixation',
    label: '1. Carbon Fixation',
    title: '1. Carbon Fixation (Rubisco)',
    equation: (m) =>
      `${m} CO2 + ${m} RuBP (5C) → [${m} × 6C unstable] → ${2 * m} GP (3C)`,
    mechanism:
      'Carbon dioxide diffuses into the chloroplast stroma and combines with the 5-carbon acceptor ribulose bisphosphate (RuBP), catalysed by the enzyme Rubisco. The resulting unstable 6-carbon intermediate immediately splits into two molecules of glycerate 3-phosphate (GP, 3C).',
    examTip:
      'Rubisco is the most abundant enzyme in leaf chloroplasts, yet it works slowly so high concentrations are kept in the stroma.',
  },
  reduction: {
    id: 'reduction',
    label: '2. Reduction',
    title: '2. Reduction of GP to Triose Phosphate (TP)',
    equation: (m) =>
      `${2 * m} GP (3C) + ${2 * m} ATP + ${2 * m} NADPH → ${2 * m} TP (3C)`,
    mechanism:
      'Each GP molecule is phosphorylated by ATP and reduced by reduced NADP (NADPH) supplied from the light-dependent stage on the thylakoids, forming triose phosphate (TP, 3C), ADP + Pi, and oxidised NADP+.',
    examTip:
      'Always state BOTH products from the light stage: ATP provides energy and reduced NADP provides hydrogen/electrons.',
  },
  synthesis: {
    id: 'synthesis',
    label: '3. Product Export',
    title: '3. Synthesis of Carbohydrates, Lipids & Amino Acids',
    equation: (m) =>
      m === 1
        ? '1/3 TP exported per CO2 (requires 3 CO2 per net 1 TP)'
        : m === 3
          ? '1 × TP (3C) exits cycle → ½ hexose phosphate'
          : '2 × TP (3C) exit cycle → 1 × Hexose (6C, e.g. glucose)',
    mechanism:
      'Only one-sixth of the TP formed leaves the Calvin cycle. Pairs of TP molecules condense to form hexose phosphates (glucose, fructose) used to make sucrose, starch, and cellulose. TP can also form glycerol and fatty acids for lipids, or combine with absorbed nitrates to make amino acids.',
    examTip:
      'Fixing 6 CO2 (6 turns) exports 2 TP molecules = 1 six-carbon glucose molecule.',
  },
  regeneration: {
    id: 'regeneration',
    label: '4. RuBP Regeneration',
    title: '4. Regeneration of RuBP (5/6 of TP)',
    equation: (m) =>
      `${m === 1 ? '5/3' : (5 * m) / 3} TP (3C) + ${m} ATP → ${m} RuBP (5C)`,
    mechanism:
      'Five-sixths of all triose phosphate molecules remain inside the stroma and undergo a series of enzyme-catalysed sugar rearrangements requiring ATP from the light-dependent stage to regenerate RuBP (5C), keeping carbon fixation running continuously.',
    examTip:
      'For 3 turns (3 CO2): 5 TP (15 carbons) rearrange into 3 RuBP (15 carbons) using 3 ATP.',
  },
};

const getPigmentAbsorbance = (nm: number) => {
  const gauss = (center: number, width: number, peak: number) =>
    peak * Math.exp(-Math.pow(nm - center, 2) / (2 * width * width));
  const chlA = Math.min(95, Math.round(gauss(430, 20, 92) + gauss(662, 16, 86)));
  const chlB = Math.min(95, Math.round(gauss(455, 20, 88) + gauss(642, 16, 65)));
  const carot = Math.min(85, Math.round(gauss(445, 22, 66) + gauss(478, 20, 74)));
  const action = Math.min(
    98,
    Math.round(Math.max(chlA, chlB * 0.92, carot * 0.85) + 5)
  );
  return { chlA, chlB, carot, action };
};

export const PhotosynthesisLab: React.FC = () => {
  const [subView, setSubView] = useState<PhotoView>('light-stage');
  const [mode, setMode] = useState<PhotophosphorylationMode>('non-cyclic');
  const [dcpipActive, setDcpipActive] = useState(false);
  const [selectedComplex, setSelectedComplex] =
    useState<ThylakoidComplexId>('ps2');
  const [isPlaying, setIsPlaying] = useState(true);

  // Calvin Cycle state
  const [perturbation, setPerturbation] = useState<CalvinPerturbation>('steady');
  const [selectedCalvinStep, setSelectedCalvinStep] =
    useState<CalvinStepId>('fixation');
  const [calvinMult, setCalvinMult] = useState<1 | 3 | 6>(6);
  const [isPlayingCalvin, setIsPlayingCalvin] = useState(true);

  // Limiting factors & spectra state
  const [lightKlx, setLightKlx] = useState(65);
  const [co2Pct, setCo2Pct] = useState(0.08);
  const [tempC, setTempC] = useState(25);
  const [wavelengthNm, setWavelengthNm] = useState(660);
  const [isSweepingSpectrum, setIsSweepingSpectrum] = useState(false);

  useEffect(() => {
    if (!isPlayingCalvin || subView !== 'calvin' || perturbation !== 'steady')
      return;
    const order: CalvinStepId[] = [
      'fixation',
      'reduction',
      'synthesis',
      'regeneration',
    ];
    const timer = window.setInterval(() => {
      setSelectedCalvinStep((prev) => {
        const idx = order.indexOf(prev);
        return order[(idx + 1) % order.length];
      });
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isPlayingCalvin, subView, perturbation]);

  useEffect(() => {
    if (!isSweepingSpectrum || subView !== 'limiting-factors') return;
    const timer = window.setInterval(() => {
      setWavelengthNm((prev) => (prev >= 700 ? 400 : prev + 5));
    }, 130);
    return () => window.clearInterval(timer);
  }, [isSweepingSpectrum, subView]);

  const activeComplex = COMPLEX_DETAILS[selectedComplex];
  const activeCalvin = CALVIN_STEPS[selectedCalvinStep];
  const isCyclic = mode === 'cyclic';

  const calcRate = (light: number, co2: number, temp: number) => {
    const lightCap = (light / (light + 22)) * 125;
    const co2Cap = (co2 / 0.1) * 105;
    const tempMultiplier =
      temp <= 32
        ? 0.25 + (temp / 32) * 0.85
        : Math.max(0.08, 1.1 - (temp - 32) * 0.085);
    const enzymeCap = tempMultiplier * 100;
    const rawRate = Math.min(lightCap, co2Cap, enzymeCap);
    return Math.round(Math.max(0, Math.min(100, rawRate)));
  };

  const currentRate = calcRate(lightKlx, co2Pct, tempC);

  const getLimitingFactor = () => {
    const lightCap = (lightKlx / (lightKlx + 22)) * 125;
    const co2Cap = (co2Pct / 0.1) * 105;
    const tempMultiplier =
      tempC <= 32
        ? 0.25 + (tempC / 32) * 0.85
        : Math.max(0.08, 1.1 - (tempC - 32) * 0.085);
    const enzymeCap = tempMultiplier * 100;

    if (tempC > 37) {
      return {
        label: 'ENZYME DENATURATION (>37 °C)',
        tone: 'text-rose-700 bg-rose-50 border-rose-200',
        note: 'High kinetic energy breaks hydrogen/ionic bonds in Rubisco and ATP synthase, distorting active sites.',
      };
    }
    const minVal = Math.min(lightCap, co2Cap, enzymeCap);
    if (minVal === lightCap) {
      return {
        label: 'LIMITING: LIGHT INTENSITY',
        tone: 'text-amber-800 bg-amber-50 border-amber-200',
        note: 'On the rising slope: ATP and reduced NADP supply from the thylakoids limits GP → TP reduction.',
      };
    }
    if (minVal === co2Cap) {
      return {
        label: 'LIMITING: CO2 CONCENTRATION',
        tone: 'text-sky-800 bg-sky-50 border-sky-200',
        note: 'Rate has plateaued relative to light. Carbon fixation by Rubisco is limited by CO2 availability.',
      };
    }
    return {
      label: 'LIMITING: TEMPERATURE (ENZYMES)',
      tone: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      note: 'Calvin cycle enzyme collision frequency (Rubisco) sets the ceiling; raising temperature increases rate up to ~32 °C.',
    };
  };

  const limitingInfo = getLimitingFactor();
  const spectral = getPigmentAbsorbance(wavelengthNm);

  // Precompute SVG polyline points for Absorption & Action Spectra (400–700 nm)
  const spectrumPolylines = useMemo(() => {
    const wavelengths = Array.from({ length: 61 }, (_, i) => 400 + i * 5);
    const toPoint = (nm: number, val: number) => {
      const x = 52 + ((nm - 400) / 300) * 520;
      const y = 212 - (val / 100) * 168;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    };

    const chlA = wavelengths
      .map((nm) => toPoint(nm, getPigmentAbsorbance(nm).chlA))
      .join(' ');
    const chlB = wavelengths
      .map((nm) => toPoint(nm, getPigmentAbsorbance(nm).chlB))
      .join(' ');
    const carot = wavelengths
      .map((nm) => toPoint(nm, getPigmentAbsorbance(nm).carot))
      .join(' ');
    const action = wavelengths
      .map((nm) => toPoint(nm, getPigmentAbsorbance(nm).action))
      .join(' ');

    return { chlA, chlB, carot, action };
  }, []);

  const scrubberX = 52 + ((wavelengthNm - 400) / 300) * 520;

  return (
    <div className="space-y-6">
      {/* Sub-module Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300/70 pb-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-emerald-700">
            Topic 13 · Photosynthesis
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl text-balance">
            Chloroplast Z-Scheme, Calvin Cycle &amp; Limiting Factors
          </h1>
        </div>

        <div
          className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
          role="tablist"
          aria-label="Photosynthesis lab views"
        >
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'light-stage'}
            onClick={() => setSubView('light-stage')}
            className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              subView === 'light-stage'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            01. Light Stage &amp; Photosystems
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'calvin'}
            onClick={() => setSubView('calvin')}
            className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              subView === 'calvin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            02. Calvin Cycle (9700)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'limiting-factors'}
            onClick={() => setSubView('limiting-factors')}
            className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              subView === 'limiting-factors'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            03. Limiting Factors &amp; Spectra
          </button>
        </div>
      </div>

      {/* VIEW 01: THYLAKOID LIGHT-DEPENDENT STAGE + CHLOROPLAST & PHOTOSYSTEM DIAGRAMS */}
      {subView === 'light-stage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-8 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('non-cyclic')}
                    className={`whitespace-nowrap shrink-0 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                      !isCyclic
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Non-Cyclic Photophosphorylation
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('cyclic');
                      setSelectedComplex('ps1');
                    }}
                    className={`whitespace-nowrap shrink-0 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                      isCyclic
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Cyclic (PSI Only)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDcpipActive((v) => !v)}
                    className={`whitespace-nowrap shrink-0 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                      dcpipActive
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {dcpipActive ? 'Hill Assay: DCPIP Added' : 'Add DCPIP (Hill Reaction)'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> Play
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] overflow-hidden">
                <svg
                  viewBox="0 0 820 420"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Interactive thylakoid membrane diagram showing Photosystem II, Cytochrome b6f, Photosystem I, NADP reductase, and ATP synthase"
                >
                  <defs>
                    <marker
                      id="p-arrow-gold"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#CA8A04" />
                    </marker>
                    <marker
                      id="p-arrow-sky"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284C7" />
                    </marker>
                    <marker
                      id="p-arrow-emerald"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                    </marker>
                  </defs>

                  <rect x="0" y="0" width="820" height="165" fill="#F8FAFC" />
                  <text x="20" y="28" className="fill-slate-700 text-[12px] font-semibold">
                    STROMA (pH ~8.0 · Site of Calvin Cycle)
                  </text>

                  <rect
                    x="0"
                    y="165"
                    width="820"
                    height="88"
                    fill="#DCFCE7"
                    stroke="#86EFAC"
                    strokeWidth="2"
                  />
                  <text x="20" y="244" className="fill-emerald-900 text-[10px] font-medium">
                    Thylakoid Membrane (Phospholipid Bilayer)
                  </text>

                  <rect x="0" y="253" width="820" height="167" fill="#ECFEFF" />
                  <text x="20" y="398" className="fill-sky-900 text-[12px] font-semibold">
                    THYLAKOID LUMEN (pH ~5.0 · High [H+] Proton Reservoir)
                  </text>

                  {!isCyclic && (
                    <g>
                      <path
                        d="M 88 52 L 122 146"
                        stroke="#EAB308"
                        strokeWidth="3"
                        className={isPlaying ? 'animate-flow-dash' : ''}
                        markerEnd="url(#p-arrow-gold)"
                      />
                      {isPlaying && (
                        <circle r="4" fill="#FACC15" stroke="#B45309" strokeWidth="1" className="bio-particle-motion">
                          <animateMotion dur="1.0s" repeatCount="indefinite" path="M 88 52 L 122 146" />
                        </circle>
                      )}
                      <text x="68" y="44" className="fill-amber-700 text-[11px] font-semibold">
                        Light (hν)
                      </text>
                    </g>
                  )}

                  <path
                    d="M 412 52 L 444 146"
                    stroke="#EAB308"
                    strokeWidth="3"
                    className={isPlaying ? 'animate-flow-dash' : ''}
                    markerEnd="url(#p-arrow-gold)"
                  />
                  {isPlaying && (
                    <circle r="4" fill="#FACC15" stroke="#B45309" strokeWidth="1" className="bio-particle-motion">
                      <animateMotion dur="1.0s" begin="0.4s" repeatCount="indefinite" path="M 412 52 L 444 146" />
                    </circle>
                  )}
                  <text x="394" y="44" className="fill-amber-700 text-[11px] font-semibold">
                    Light (hν)
                  </text>

                  {/* PSII */}
                  <g
                    onClick={() => setSelectedComplex('ps2')}
                    className="cursor-pointer"
                    opacity={isCyclic ? 0.35 : 1}
                  >
                    <rect
                      x="92"
                      y="148"
                      width="88"
                      height="122"
                      rx="16"
                      fill="#059669"
                      stroke={selectedComplex === 'ps2' ? '#0F172A' : '#047857'}
                      strokeWidth={selectedComplex === 'ps2' ? '3' : '1.5'}
                    />
                    <text x="116" y="196" className="fill-white text-[13px] font-bold">
                      PS II
                    </text>
                    <text x="116" y="214" className="fill-emerald-100 text-[11px] font-mono">
                      P680
                    </text>

                    {!isCyclic && (
                      <g>
                        <text x="36" y="314" className="fill-sky-900 text-[12px] font-mono font-semibold">
                          2 H2O → 4 H+ + 4 e- + O2↑
                        </text>
                        <path
                          d="M 136 296 L 136 274"
                          stroke="#0284C7"
                          strokeWidth="2.5"
                          className={isPlaying ? 'animate-flow-dash' : ''}
                          markerEnd="url(#p-arrow-sky)"
                        />
                        {isPlaying && (
                          <g className="bio-particle-motion">
                            <circle cx="192" cy="306" r="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" className="animate-bubble" />
                            <circle cx="204" cy="298" r="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" className="animate-bubble" style={{ animationDelay: '0.7s' }} />
                          </g>
                        )}
                      </g>
                    )}
                  </g>

                  {/* Cyt b6f */}
                  <g onClick={() => setSelectedComplex('cyt')} className="cursor-pointer">
                    <rect
                      x="266"
                      y="152"
                      width="90"
                      height="114"
                      rx="14"
                      fill="#0284C7"
                      stroke={selectedComplex === 'cyt' ? '#0F172A' : '#0369A1'}
                      strokeWidth={selectedComplex === 'cyt' ? '3' : '1.5'}
                    />
                    <text x="278" y="204" className="fill-white text-[12px] font-semibold">
                      Cyt b6f
                    </text>
                    <text x="280" y="222" className="fill-sky-100 text-[10px]">
                      H+ Pump
                    </text>

                    <path
                      d="M 311 110 L 311 312"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                      className={isPlaying ? 'animate-flow-dash' : ''}
                      markerEnd="url(#p-arrow-sky)"
                    />
                    {isPlaying && (
                      <circle r="3.8" fill="#0284C7" className="bio-particle-motion">
                        <animateMotion dur="1.3s" repeatCount="indefinite" path="M 311 110 L 311 312" />
                      </circle>
                    )}
                    <text x="298" y="98" className="fill-sky-800 text-[11px] font-mono font-semibold">
                      H+
                    </text>
                  </g>

                  {/* PSI */}
                  <g onClick={() => setSelectedComplex('ps1')} className="cursor-pointer">
                    <rect
                      x="418"
                      y="148"
                      width="88"
                      height="122"
                      rx="16"
                      fill="#10B981"
                      stroke={selectedComplex === 'ps1' ? '#0F172A' : '#059669'}
                      strokeWidth={selectedComplex === 'ps1' ? '3' : '1.5'}
                    />
                    <text x="444" y="196" className="fill-white text-[13px] font-bold">
                      PS I
                    </text>
                    <text x="443" y="214" className="fill-emerald-50 text-[11px] font-mono">
                      P700
                    </text>
                  </g>

                  {!isCyclic && (
                    <>
                      <path
                        d="M 180 185 L 262 195"
                        fill="none"
                        stroke="#EAB308"
                        strokeWidth="3"
                        className={isPlaying ? 'animate-flow-dash' : ''}
                        markerEnd="url(#p-arrow-gold)"
                      />
                      {isPlaying && (
                        <circle r="4" fill="#FACC15" stroke="#854D0E" strokeWidth="1" className="bio-particle-motion">
                          <animateMotion dur="1.1s" repeatCount="indefinite" path="M 180 185 L 262 195" />
                        </circle>
                      )}
                    </>
                  )}
                  <path
                    d="M 356 205 L 414 205"
                    fill="none"
                    stroke="#EAB308"
                    strokeWidth="3"
                    className={isPlaying ? 'animate-flow-dash' : ''}
                    markerEnd="url(#p-arrow-gold)"
                  />
                  {isPlaying && (
                    <circle r="4" fill="#FACC15" stroke="#854D0E" strokeWidth="1" className="bio-particle-motion">
                      <animateMotion dur="1.1s" begin="0.35s" repeatCount="indefinite" path="M 356 205 L 414 205" />
                    </circle>
                  )}

                  {isCyclic && (
                    <g>
                      <path
                        d="M 462 146 C 462 96, 336 96, 336 148"
                        fill="none"
                        stroke="#CA8A04"
                        strokeWidth="3"
                        className={isPlaying ? 'animate-flow-dash' : ''}
                        markerEnd="url(#p-arrow-gold)"
                      />
                      {isPlaying && (
                        <circle r="4.2" fill="#FACC15" stroke="#854D0E" strokeWidth="1" className="bio-particle-motion">
                          <animateMotion dur="1.4s" repeatCount="indefinite" path="M 462 146 C 462 96, 336 96, 336 148" />
                        </circle>
                      )}
                      <text x="342" y="98" className="fill-amber-800 text-[11px] font-semibold">
                        Cyclic e- return via Ferredoxin
                      </text>
                    </g>
                  )}

                  {/* NADP Reductase */}
                  <g
                    onClick={() => setSelectedComplex('nadp')}
                    className="cursor-pointer"
                    opacity={isCyclic ? 0.3 : 1}
                  >
                    <rect
                      x="548"
                      y="138"
                      width="88"
                      height="76"
                      rx="12"
                      fill="#334155"
                      stroke={selectedComplex === 'nadp' ? '#0F172A' : '#1E293B'}
                      strokeWidth={selectedComplex === 'nadp' ? '3' : '1.5'}
                    />
                    <text x="560" y="172" className="fill-white text-[11px] font-semibold">
                      NADP
                    </text>
                    <text x="560" y="188" className="fill-slate-300 text-[10px]">
                      Reductase
                    </text>

                    {!isCyclic && (
                      <>
                        <path
                          d="M 506 180 L 544 172"
                          fill="none"
                          stroke="#EAB308"
                          strokeWidth="3"
                          className={isPlaying ? 'animate-flow-dash' : ''}
                          markerEnd="url(#p-arrow-gold)"
                        />
                        {isPlaying && (
                          <circle r="4" fill="#FACC15" stroke="#854D0E" strokeWidth="1" className="bio-particle-motion">
                            <animateMotion dur="1.0s" begin="0.5s" repeatCount="indefinite" path="M 506 180 L 544 172" />
                          </circle>
                        )}
                        {dcpipActive ? (
                          <g>
                            <rect
                              x="536"
                              y="66"
                              width="126"
                              height="44"
                              rx="8"
                              fill="#E0F2FE"
                              stroke="#0284C7"
                            >
                              {isPlaying && (
                                <animate
                                  attributeName="fill"
                                  values="#BAE6FD;#F1F5F9;#BAE6FD"
                                  dur="2.4s"
                                  repeatCount="indefinite"
                                />
                              )}
                            </rect>
                            <text x="546" y="86" className="fill-sky-900 text-[10px] font-mono font-semibold">
                              DCPIP (Blue) + 2e-
                            </text>
                            <text x="546" y="100" className="fill-slate-600 text-[10px] font-mono">
                              → DCPIPH2 (Colourless)
                            </text>
                          </g>
                        ) : (
                          <text x="540" y="108" className="fill-emerald-800 text-[11px] font-mono font-semibold">
                            NADP+ → NADPH
                          </text>
                        )}
                      </>
                    )}
                  </g>

                  {/* ATP Synthase */}
                  <g
                    onClick={() => setSelectedComplex('atp-synthase')}
                    className="cursor-pointer"
                  >
                    <rect
                      x="690"
                      y="148"
                      width="58"
                      height="122"
                      rx="12"
                      fill="#D97706"
                      stroke={selectedComplex === 'atp-synthase' ? '#0F172A' : '#B45309'}
                      strokeWidth={selectedComplex === 'atp-synthase' ? '3' : '1.5'}
                    />
                    <circle
                      cx="719"
                      cy="132"
                      r="22"
                      fill="#F59E0B"
                      stroke="#B45309"
                      strokeWidth="2"
                      className={isPlaying ? 'animate-rotor' : ''}
                    />
                    <line
                      x1="719"
                      y1="114"
                      x2="719"
                      y2="150"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className={isPlaying ? 'animate-rotor' : ''}
                    />
                    <line
                      x1="701"
                      y1="132"
                      x2="737"
                      y2="132"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className={isPlaying ? 'animate-rotor' : ''}
                    />
                    <text x="682" y="292" className="fill-amber-900 text-[11px] font-semibold">
                      ATP Synthase
                    </text>

                    <path
                      d="M 719 348 L 719 162"
                      stroke="#059669"
                      strokeWidth="3"
                      className={isPlaying ? 'animate-flow-dash' : ''}
                      markerEnd="url(#p-arrow-emerald)"
                    />
                    {isPlaying && (
                      <g className="bio-particle-motion">
                        <circle r="3.8" fill="#059669">
                          <animateMotion dur="1.2s" repeatCount="indefinite" path="M 719 348 L 719 162" />
                        </circle>
                        <circle r="3.8" fill="#34D399">
                          <animateMotion dur="1.2s" begin="0.6s" repeatCount="indefinite" path="M 719 348 L 719 162" />
                        </circle>
                      </g>
                    )}
                    <text x="674" y="88" className="fill-amber-800 text-[12px] font-mono font-semibold">
                      ADP + Pi → ATP
                    </text>
                  </g>
                </svg>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm text-slate-600">ATP Generated</p>
                  <p className="mt-0.5 font-mono text-base font-semibold text-slate-900">
                    YES (Chemiosmosis)
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm text-slate-600">Reduced NADP (NADPH)</p>
                  <p className="mt-0.5 font-mono text-base font-semibold text-slate-900">
                    {isCyclic
                      ? 'NO (Cyclic PSI only)'
                      : dcpipActive
                        ? 'Intercepted by DCPIP'
                        : 'YES (Stroma side)'}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm text-slate-600">Photolysis &amp; O2</p>
                  <p className="mt-0.5 font-mono text-base font-semibold text-slate-900">
                    {isCyclic ? 'NO (PSII inactive)' : 'YES (2H2O → 4H+ + O2)'}
                  </p>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-4">
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <p className="text-sm font-medium text-slate-500">
                  Click Protein Complex to Inspect
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(Object.keys(COMPLEX_DETAILS) as ThylakoidComplexId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedComplex(id)}
                      className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedComplex === id
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {id === 'ps2'
                        ? 'PSII (P680)'
                        : id === 'cyt'
                          ? 'Cyt b6f'
                          : id === 'ps1'
                            ? 'PSI (P700)'
                            : id === 'nadp'
                              ? 'NADP Reductase'
                              : 'ATP Synthase'}
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {activeComplex.title}
                  </h2>
                  <p className="rounded-md bg-slate-50 p-3 font-mono text-sm text-emerald-800">
                    {activeComplex.reaction}
                  </p>
                  <p className="text-base leading-relaxed text-slate-700">
                    {activeComplex.mechanism}
                  </p>
                  <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-sm leading-relaxed text-amber-950">
                    <span className="font-semibold">9700 Examiner Note: </span>
                    {activeComplex.examTip}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* 9700 Structural Diagrams: Chloroplast Cross Section & Photosystems */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              9700 Structural Diagrams: Chloroplast Ultrastructure &amp; Photosystems
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <DiagramImageCard
                src="/src/assets/images/diagram_chloroplast_1794877364463.jpg"
                alt="3D cutaway cross-section of a plant chloroplast showing outer and inner membranes, grana stacks, intergranal lamellae, stroma, starch grains, lipid droplets, circular DNA, and 70S ribosomes"
                title="Chloroplast Cross-Section (Ultrastructure)"
                syllabusTag="13.1.2 · Chloroplast Structure & Compartmentalisation"
                caption="Biconvex double-envelope organelle housing photosynthetic membranes (grana) for light-dependent ATP/NADPH synthesis and a dense enzyme-rich stroma for the Calvin cycle."
                keyStructures={[
                  'Thylakoid grana & lamellae: Large membrane surface area holding Photosystems I & II, ETC, and ATP synthase.',
                  'Stroma: Contains Rubisco & Calvin cycle enzymes, 70S ribosomes, circular DNA, starch grains, and lipid droplets.',
                  'Thylakoid lumen: Narrow internal space allowing rapid accumulation of H+ ions for chemiosmosis.',
                ]}
              />

              <DiagramImageCard
                src="/src/assets/images/diagram_photosystems_1794877356824.jpg"
                alt="Molecular illustration of Photosystem II and Photosystem I antenna complexes in the thylakoid phospholipid bilayer showing chlorophyll a, chlorophyll b, carotenoids, and P680/P700 reaction centres"
                title="Photosystems I & II (Antenna Complexes & Reaction Centres)"
                syllabusTag="13.1.3 · Photosynthetic Pigments & Energy Transfer"
                caption="Light-harvesting clusters of accessory pigments (chlorophyll b, carotenoids) absorb photons across multiple wavelengths and funnel excitation energy to primary chlorophyll a reaction centres (P680 & P700)."
                keyStructures={[
                  'Primary pigment (Chlorophyll a): Forms P680 (PSII) and P700 (PSI) reaction centres that emit excited electrons.',
                  'Accessory pigments (Chlorophyll b, xanthophyll, carotene): Absorb blue-green light and pass energy to chlorophyll a.',
                  'Electron carriers (PQ, Cyt b6f, PC, Fd): Channel photoexcited electrons down energy levels to pump H+ and reduce NADP+.',
                ]}
              />
            </div>
          </section>
        </div>
      )}

      {/* VIEW 02: CALVIN CYCLE DEEP DIVE & PERTURBATION LAB */}
      {subView === 'calvin' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'steady', label: 'Normal Steady State' },
                    { id: 'dark', label: 'Switch Light OFF' },
                    { id: 'no-co2', label: 'Drop CO2 to 0%' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPerturbation(item.id)}
                    className={`whitespace-nowrap shrink-0 rounded-md border px-3.5 py-2 text-sm font-medium transition-colors ${
                      perturbation === item.id
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={perturbation !== 'steady'}
                  onClick={() => setIsPlayingCalvin((p) => !p)}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-45"
                >
                  {isPlayingCalvin && perturbation === 'steady' ? (
                    <>
                      <Pause className="h-3.5 w-3.5 text-emerald-700" /> Pause Cycle
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-emerald-700" /> Animate Cycle
                    </>
                  )}
                </button>
                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
                  {([1, 3, 6] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setCalvinMult(m)}
                      className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        calvinMult === m
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {m === 1 ? '1 CO2' : m === 3 ? '3 CO2 (1 TP)' : '6 CO2 (1 Glucose)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Interactive 4-Step Calvin Cycle SVG */}
              <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-3">
                <svg
                  viewBox="0 0 380 380"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Interactive Calvin Cycle in the chloroplast stroma"
                >
                  <text x="16" y="24" className="fill-slate-700 text-[12px] font-semibold">
                    CALVIN CYCLE ({calvinMult} × CO2 fixed)
                  </text>

                  <circle
                    cx="190"
                    cy="195"
                    r="105"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray="8 5"
                    className={perturbation === 'steady' && isPlayingCalvin ? 'animate-flow-dash-slow' : ''}
                  />
                  {perturbation === 'steady' && isPlayingCalvin && (
                    <circle r="5.5" fill="#059669" stroke="#FFFFFF" strokeWidth="1.8" className="bio-particle-motion">
                      <animateMotion
                        dur="7.2s"
                        repeatCount="indefinite"
                        path="M 190 90 A 105 105 0 1 1 189.9 90 Z"
                      />
                    </circle>
                  )}

                  {/* CO2 Input */}
                  <rect
                    x="130"
                    y="38"
                    width="120"
                    height="34"
                    rx="8"
                    fill={perturbation === 'no-co2' ? '#FEE2E2' : '#E0F2FE'}
                    stroke={perturbation === 'no-co2' ? '#DC2626' : '#0284C7'}
                    className="svg-morph"
                  />
                  <text x="148" y="60" className="fill-slate-900 text-[11px] font-mono font-semibold">
                    {perturbation === 'no-co2' ? 'CO2 = 0%' : `${calvinMult} × CO2 (1C) +`}
                  </text>
                  {perturbation !== 'no-co2' && isPlayingCalvin && (
                    <circle r="4" fill="#0284C7" className="bio-particle-motion">
                      <animateMotion dur="1.5s" repeatCount="indefinite" path="M 190 72 L 190 100" />
                    </circle>
                  )}

                  {/* 1. RuBP / Carbon Fixation */}
                  <g onClick={() => setSelectedCalvinStep('fixation')} className="cursor-pointer">
                    <rect
                      x="38"
                      y="102"
                      width="124"
                      height="52"
                      rx="10"
                      fill={selectedCalvinStep === 'fixation' ? '#ECFDF5' : '#FFFFFF'}
                      stroke={selectedCalvinStep === 'fixation' ? '#047857' : '#059669'}
                      strokeWidth={selectedCalvinStep === 'fixation' ? '3' : '1.5'}
                      className="svg-morph"
                    />
                    <text x="50" y="124" className="fill-slate-900 text-[12px] font-semibold">
                      {calvinMult} × RuBP (5C)
                    </text>
                    <text x="50" y="142" className="fill-emerald-700 text-[10px]">
                      1. Rubisco fixation
                    </text>
                  </g>

                  {/* 2. GP -> TP Reduction */}
                  <g onClick={() => setSelectedCalvinStep('reduction')} className="cursor-pointer">
                    <rect
                      x="220"
                      y="102"
                      width="134"
                      height="52"
                      rx="10"
                      fill={selectedCalvinStep === 'reduction' ? '#F0F9FF' : '#FFFFFF'}
                      stroke={selectedCalvinStep === 'reduction' ? '#0369A1' : '#0284C7'}
                      strokeWidth={selectedCalvinStep === 'reduction' ? '3' : '1.5'}
                      className="svg-morph"
                    />
                    <text x="234" y="124" className="fill-slate-900 text-[12px] font-semibold">
                      {2 * calvinMult} × GP (3C)
                    </text>
                    <text x="234" y="142" className="fill-sky-700 text-[10px] font-mono">
                      2. -{2 * calvinMult} ATP · -{2 * calvinMult} NADPH
                    </text>
                  </g>

                  {/* 3. TP & Export */}
                  <g onClick={() => setSelectedCalvinStep('synthesis')} className="cursor-pointer">
                    <rect
                      x="120"
                      y="264"
                      width="140"
                      height="54"
                      rx="10"
                      fill={selectedCalvinStep === 'synthesis' ? '#FFFBEB' : '#FFFFFF'}
                      stroke={selectedCalvinStep === 'synthesis' ? '#B45309' : '#D97706'}
                      strokeWidth={selectedCalvinStep === 'synthesis' ? '3' : '1.5'}
                      className="svg-morph"
                    />
                    <text x="136" y="286" className="fill-slate-900 text-[12px] font-semibold">
                      {2 * calvinMult} × TP (3C)
                    </text>
                    <text x="136" y="304" className="fill-amber-800 text-[10px]">
                      3. Triose Phosphate
                    </text>
                  </g>

                  {/* 4. Regeneration label */}
                  <g onClick={() => setSelectedCalvinStep('regeneration')} className="cursor-pointer">
                    <rect
                      x="14"
                      y="192"
                      width="116"
                      height="44"
                      rx="8"
                      fill={selectedCalvinStep === 'regeneration' ? '#F1F5F9' : '#FFFFFF'}
                      stroke={selectedCalvinStep === 'regeneration' ? '#0F172A' : '#CBD5E1'}
                      strokeWidth={selectedCalvinStep === 'regeneration' ? '2.5' : '1.5'}
                      className="svg-morph"
                    />
                    <text x="24" y="211" className="fill-slate-800 text-[10px] font-semibold">
                      4. 5/6 TP → RuBP
                    </text>
                    <text
                      x="24"
                      y="226"
                      className={`text-[10px] font-mono font-semibold ${
                        perturbation === 'dark' ? 'fill-rose-600' : 'fill-amber-700'
                      }`}
                    >
                      {perturbation === 'dark' ? 'NO ATP!' : `Uses ${calvinMult} ATP`}
                    </text>
                  </g>

                  <text
                    x="278"
                    y="214"
                    className={`text-[10px] font-mono font-semibold ${
                      perturbation === 'dark' ? 'fill-rose-600' : 'fill-sky-700'
                    }`}
                  >
                    {perturbation === 'dark' ? 'NO ATP/NADPH!' : 'GP → TP'}
                  </text>

                  <text x="66" y="346" className="fill-emerald-800 text-[11px] font-semibold">
                    {calvinMult === 6
                      ? '1/6 Export (2 TP) → 1 Hexose (Glucose, C6H12O6)'
                      : calvinMult === 3
                        ? '1/6 Export (1 TP) → ½ Hexose / Starch / Lipids'
                        : '1/6 Export (1/3 TP) → Hexose, Starch, Amino Acids'}
                  </text>
                  <text x="86" y="365" className="fill-slate-500 text-[10px] font-mono">
                    Total input: {3 * calvinMult} ATP + {2 * calvinMult} reduced NADP
                  </text>
                </svg>
              </div>

              {/* Concentration Time-Course Chart */}
              <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-3">
                <svg
                  viewBox="0 0 380 380"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Relative concentration of GP and RuBP after light or CO2 perturbation"
                >
                  <text x="16" y="24" className="fill-slate-700 text-[12px] font-semibold">
                    PERTURBATION CONCENTRATION RESPONSE
                  </text>

                  <line x1="48" y1="52" x2="48" y2="292" stroke="#475569" strokeWidth="2" />
                  <line x1="48" y1="292" x2="352" y2="292" stroke="#475569" strokeWidth="2" />
                  <text
                    x="14"
                    y="175"
                    transform="rotate(-90 14 175)"
                    className="fill-slate-600 text-[11px]"
                  >
                    Concentration
                  </text>
                  <text x="175" y="316" className="fill-slate-600 text-[11px]">
                    Time (seconds)
                  </text>

                  <line
                    x1="145"
                    y1="58"
                    x2="145"
                    y2="292"
                    stroke="#94A3B8"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />
                  <text x="150" y="72" className="fill-slate-600 text-[11px] font-mono">
                    {perturbation === 'steady'
                      ? 'Steady illumination'
                      : perturbation === 'dark'
                        ? 'Light switched OFF'
                        : 'CO2 dropped to 0%'}
                  </text>

                  {/* GP Curve */}
                  <path
                    d={
                      perturbation === 'steady'
                        ? 'M 48 168 L 344 168'
                        : perturbation === 'dark'
                          ? 'M 48 168 L 145 168 C 175 110, 225 104, 344 104'
                          : 'M 48 168 L 145 168 C 175 235, 225 258, 344 262'
                    }
                    fill="none"
                    stroke="#1D4ED8"
                    strokeWidth="3"
                    className="svg-morph"
                  />

                  {/* RuBP Curve */}
                  <path
                    d={
                      perturbation === 'steady'
                        ? 'M 48 202 L 344 202'
                        : perturbation === 'dark'
                          ? 'M 48 202 L 145 202 C 175 252, 225 268, 344 272'
                          : 'M 48 202 L 145 202 C 175 128, 225 114, 344 114'
                    }
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    className="svg-morph"
                  />

                  {/* Animated curve tracer beads */}
                  <g className="bio-particle-motion">
                    <circle r="4.5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.5">
                      <animateMotion
                        dur="3.4s"
                        repeatCount="indefinite"
                        path={
                          perturbation === 'steady'
                            ? 'M 48 168 L 344 168'
                            : perturbation === 'dark'
                              ? 'M 48 168 L 145 168 C 175 110, 225 104, 344 104'
                              : 'M 48 168 L 145 168 C 175 235, 225 258, 344 262'
                        }
                      />
                    </circle>
                    <circle r="4.5" fill="#059669" stroke="#FFFFFF" strokeWidth="1.5">
                      <animateMotion
                        dur="3.4s"
                        repeatCount="indefinite"
                        path={
                          perturbation === 'steady'
                            ? 'M 48 202 L 344 202'
                            : perturbation === 'dark'
                              ? 'M 48 202 L 145 202 C 175 252, 225 268, 344 272'
                              : 'M 48 202 L 145 202 C 175 128, 225 114, 344 114'
                        }
                      />
                    </circle>
                  </g>

                  <line x1="60" y1="346" x2="86" y2="346" stroke="#1D4ED8" strokeWidth="3" />
                  <text x="92" y="350" className="fill-slate-800 text-[12px] font-semibold">
                    GP (3C)
                  </text>

                  <line x1="172" y1="346" x2="198" y2="346" stroke="#059669" strokeWidth="3" />
                  <text x="204" y="350" className="fill-slate-800 text-[12px] font-semibold">
                    RuBP (5C)
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-4">
            {/* Step-by-Step Calvin Cycle Inspector */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
              <p className="text-sm font-medium text-slate-500">
                Calvin Cycle Stage Inspector (9700)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(CALVIN_STEPS) as CalvinStepId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedCalvinStep(id)}
                    className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedCalvinStep === id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {CALVIN_STEPS[id].label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {activeCalvin.title}
                </h2>
                <p className="rounded-md bg-slate-50 p-3 font-mono text-sm text-emerald-900">
                  {activeCalvin.equation(calvinMult)}
                </p>
                <p className="text-base leading-relaxed text-slate-700">
                  {activeCalvin.mechanism}
                </p>
                <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-sm leading-relaxed text-amber-950">
                  <span className="font-semibold">Examiner Focus: </span>
                  {activeCalvin.examTip}
                </div>
              </div>
            </div>

            {/* Perturbation Explanation */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-2.5 shadow-xs">
              <p className="text-sm font-medium text-slate-500">
                Active Perturbation Diagnosis
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                {perturbation === 'steady'
                  ? 'Steady-State Equilibrium'
                  : perturbation === 'dark'
                    ? 'Light OFF: GP Rises, RuBP Falls'
                    : 'CO2 Dropped: RuBP Rises, GP Falls'}
              </h3>
              <p className="text-base leading-relaxed text-slate-700">
                {perturbation === 'steady'
                  ? 'Under constant light and CO2, GP synthesis from RuBP + CO2 matches its reduction to TP using ATP and reduced NADP.'
                  : perturbation === 'dark'
                    ? 'Without light, ATP and reduced NADP run out. GP cannot reduce to TP, so GP accumulates; meanwhile RuBP is used up combining with CO2 and cannot be regenerated.'
                    : 'Without CO2, Rubisco cannot form GP, so GP falls as it converts to TP. Because light-stage ATP & NADPH are still available, TP continues regenerating RuBP, so RuBP accumulates.'}
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* VIEW 03: LIMITING FACTORS + ACTION & ABSORPTION SPECTRA CHARTS */}
      {subView === 'limiting-factors' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 rounded-xl border border-slate-200/90 bg-white p-5 space-y-5 shadow-xs">
            {/* Top row: Limiting Factors Curve + Elodea Bubble Column */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
              <div className="md:col-span-8 rounded-lg border border-slate-200 bg-[#F8FAFC] p-3">
                <svg
                  viewBox="0 0 480 260"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Rate of photosynthesis versus light intensity curve"
                >
                  <text x="14" y="22" className="fill-slate-800 text-[12px] font-semibold">
                    Rate of Photosynthesis vs Light Intensity
                  </text>
                  <line x1="48" y1="38" x2="48" y2="220" stroke="#475569" strokeWidth="2" />
                  <line x1="48" y1="220" x2="452" y2="220" stroke="#475569" strokeWidth="2" />
                  <text
                    x="16"
                    y="142"
                    transform="rotate(-90 16 142)"
                    className="fill-slate-600 text-[10px]"
                  >
                    Rate (% max)
                  </text>
                  <text x="210" y="246" className="fill-slate-600 text-[10px]">
                    Light Intensity (klx)
                  </text>

                  <polyline
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                    points={Array.from({ length: 21 }, (_, idx) => {
                      const lx = idx * 5;
                      const r = calcRate(lx, co2Pct, tempC);
                      const px = 48 + (lx / 100) * 390;
                      const py = 220 - (r / 100) * 165;
                      return `${px.toFixed(1)},${py.toFixed(1)}`;
                    }).join(' ')}
                  />

                  <circle
                    cx={48 + (lightKlx / 100) * 390}
                    cy={220 - (currentRate / 100) * 165}
                    r="6"
                    fill="#D97706"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={Math.min(340, 56 + (lightKlx / 100) * 390)}
                    y={Math.max(46, 212 - (currentRate / 100) * 165)}
                    className="fill-slate-900 text-[11px] font-mono font-semibold"
                  >
                    {currentRate}%
                  </text>
                </svg>
              </div>

              <div className="md:col-span-4 rounded-lg border border-slate-200 bg-[#F8FAFC] p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700">
                  <span>Pondweed O2 Output</span>
                  <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                    {Math.round(currentRate * 0.6)} /min
                  </span>
                </div>
                <svg
                  viewBox="0 0 160 190"
                  className="w-full h-40 mx-auto select-none"
                  role="img"
                  aria-label="Aquatic pondweed producing oxygen bubbles"
                >
                  <rect
                    x="44"
                    y="16"
                    width="72"
                    height="160"
                    rx="18"
                    fill="#E0F2FE"
                    stroke="#64748B"
                    strokeWidth="2"
                  />
                  <path d="M 80 164 L 80 98" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
                  <ellipse cx="68" cy="144" rx="10" ry="4" fill="#16A34A" />
                  <ellipse cx="92" cy="134" rx="10" ry="4" fill="#16A34A" />
                  <ellipse cx="68" cy="122" rx="10" ry="4" fill="#22C55E" />
                  <ellipse cx="92" cy="112" rx="10" ry="4" fill="#22C55E" />

                  {currentRate > 5 && (
                    <circle
                      cx="80"
                      cy="90"
                      r="4"
                      fill="#FFFFFF"
                      stroke="#0284C7"
                      strokeWidth="1.5"
                      className="animate-bubble"
                      style={{
                        animationDuration: `${Math.max(0.65, 2.5 - currentRate * 0.017).toFixed(2)}s`,
                      }}
                    />
                  )}
                  {currentRate > 25 && (
                    <circle
                      cx="74"
                      cy="82"
                      r="3.5"
                      fill="#FFFFFF"
                      stroke="#0284C7"
                      strokeWidth="1.5"
                      className="animate-bubble"
                      style={{
                        animationDelay: '0.35s',
                        animationDuration: `${Math.max(0.65, 2.5 - currentRate * 0.017).toFixed(2)}s`,
                      }}
                    />
                  )}
                  {currentRate > 48 && (
                    <circle
                      cx="86"
                      cy="74"
                      r="4.2"
                      fill="#FFFFFF"
                      stroke="#0284C7"
                      strokeWidth="1.5"
                      className="animate-bubble"
                      style={{
                        animationDelay: '0.7s',
                        animationDuration: `${Math.max(0.65, 2.5 - currentRate * 0.017).toFixed(2)}s`,
                      }}
                    />
                  )}
                  {currentRate > 70 && (
                    <circle
                      cx="77"
                      cy="62"
                      r="3.8"
                      fill="#FFFFFF"
                      stroke="#0284C7"
                      strokeWidth="1.5"
                      className="animate-bubble"
                      style={{
                        animationDelay: '1.05s',
                        animationDuration: `${Math.max(0.65, 2.5 - currentRate * 0.017).toFixed(2)}s`,
                      }}
                    />
                  )}
                  {currentRate > 86 && (
                    <circle
                      cx="83"
                      cy="54"
                      r="3.2"
                      fill="#FFFFFF"
                      stroke="#0284C7"
                      strokeWidth="1.5"
                      className="animate-bubble"
                      style={{
                        animationDelay: '1.35s',
                        animationDuration: `${Math.max(0.65, 2.5 - currentRate * 0.017).toFixed(2)}s`,
                      }}
                    />
                  )}
                </svg>
                <p className="text-xs text-slate-600 text-center">
                  NaHCO3 supplies excess dissolved CO2 when testing light
                </p>
              </div>
            </div>

            {/* Bottom row: Plotted Absorption Spectrum & Action Spectrum Chart */}
            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Absorption Spectrum &amp; Action Spectrum Charts (400–700 nm)
                  </h3>
                  <p className="text-sm text-slate-600">
                    Compare light absorption by Chlorophyll a, Chlorophyll b &amp; Carotenoids against the Action Spectrum (photosynthesis rate)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                    λ = {wavelengthNm} nm · Action: {spectral.action}%
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSweepingSpectrum((p) => !p)}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {isSweepingSpectrum ? (
                      <>
                        <Pause className="h-3.5 w-3.5 text-emerald-700" /> Stop Sweep
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 text-emerald-700" /> Sweep λ
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dual Plotted SVG Chart */}
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <svg
                  viewBox="0 0 600 250"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Absorption spectrum of chlorophyll a, chlorophyll b, carotenoids and action spectrum of photosynthesis from 400 to 700 nm"
                >
                  {/* Grid lines */}
                  {[25, 50, 75, 100].map((pct) => {
                    const y = 212 - (pct / 100) * 168;
                    return (
                      <g key={pct}>
                        <line x1="52" y1={y} x2="572" y2={y} stroke="#F1F5F9" strokeWidth="1" />
                        <text x="18" y={y + 4} className="fill-slate-400 text-[10px] font-mono">
                          {pct}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Axes */}
                  <line x1="52" y1="36" x2="52" y2="212" stroke="#475569" strokeWidth="2" />
                  <line x1="52" y1="212" x2="572" y2="212" stroke="#475569" strokeWidth="2" />

                  <text
                    x="12"
                    y="150"
                    transform="rotate(-90 12 150)"
                    className="fill-slate-600 text-[10px]"
                  >
                    Absorbance / Rate (%)
                  </text>

                  {/* X-axis ticks */}
                  {[400, 450, 500, 550, 600, 650, 700].map((nm) => {
                    const x = 52 + ((nm - 400) / 300) * 520;
                    return (
                      <g key={nm}>
                        <line x1={x} y1="212" x2={x} y2="217" stroke="#475569" strokeWidth="1.5" />
                        <text x={x - 10} y="232" className="fill-slate-600 text-[10px] font-mono">
                          {nm}
                        </text>
                      </g>
                    );
                  })}

                  {/* Green reflection trough callout */}
                  <rect x="260" y="42" width="110" height="168" fill="#F0FDF4" fillOpacity="0.6" />
                  <text x="272" y="60" className="fill-emerald-800 text-[10px] font-medium">
                    Green reflected
                  </text>

                  {/* Carotenoids Curve (Amber) */}
                  <polyline
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="2.2"
                    points={spectrumPolylines.carot}
                  />

                  {/* Chlorophyll b Curve (Lime/Teal) */}
                  <polyline
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="2.2"
                    points={spectrumPolylines.chlB}
                  />

                  {/* Chlorophyll a Curve (Emerald) */}
                  <polyline
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    points={spectrumPolylines.chlA}
                  />

                  {/* Action Spectrum Curve (Dashed Dark Slate) */}
                  <polyline
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    points={spectrumPolylines.action}
                  />

                  {/* Interactive Vertical Scrubber Line */}
                  <line
                    x1={scrubberX}
                    y1="38"
                    x2={scrubberX}
                    y2="212"
                    stroke="#DC2626"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={scrubberX}
                    cy={212 - (spectral.action / 100) * 168}
                    r="4.5"
                    fill="#0F172A"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Chart Legend */}
                <div className="mt-2 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-2.5 text-xs text-slate-700">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-0.5 w-5 bg-slate-900 border-b-2 border-dashed border-slate-900 inline-block" />
                    Action Spectrum (Rate)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1 w-5 rounded bg-emerald-600 inline-block" />
                    Chlorophyll a (430 &amp; 662 nm)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1 w-5 rounded bg-sky-600 inline-block" />
                    Chlorophyll b (455 &amp; 642 nm)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1 w-5 rounded bg-amber-600 inline-block" />
                    Carotenoids (445–480 nm)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                <div className="rounded-md border border-slate-200 bg-white p-3">
                  <p className="text-slate-600">Chlorophyll a</p>
                  <p className="mt-0.5 font-mono text-base font-semibold text-emerald-700 tabular-nums">
                    {spectral.chlA}% abs
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-3">
                  <p className="text-slate-600">Chlorophyll b</p>
                  <p className="mt-0.5 font-mono text-base font-semibold text-sky-700 tabular-nums">
                    {spectral.chlB}% abs
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-3">
                  <p className="text-slate-600">Carotenoids</p>
                  <p className="mt-0.5 font-mono text-base font-semibold text-amber-700 tabular-nums">
                    {spectral.carot}% abs
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-white p-3">
                  <p className="text-slate-600">Action Rate</p>
                  <p className="mt-0.5 font-mono text-base font-semibold text-slate-900 tabular-nums">
                    {spectral.action}% max
                  </p>
                </div>
              </div>

              <div>
                <input
                  type="range"
                  aria-label="Wavelength in nanometres"
                  min={400}
                  max={700}
                  step={5}
                  value={wavelengthNm}
                  onChange={(e) => setWavelengthNm(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div
                  className="mt-1 h-2.5 w-full rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #6D28D9 0%, #2563EB 20%, #10B981 48%, #EAB308 68%, #DC2626 100%)',
                  }}
                />
                <div className="mt-1.5 flex justify-between font-mono text-xs text-slate-500">
                  <span>400 nm (Violet)</span>
                  <span>550 nm (Green)</span>
                  <span>700 nm (Far Red)</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <SlidersHorizontal className="h-4 w-4 text-emerald-700" />
                  Environmental Controls
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLightKlx(65);
                    setCo2Pct(0.08);
                    setTempC(25);
                  }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label htmlFor="photo-light" className="font-medium text-slate-700">
                    Light Intensity
                  </label>
                  <span className="font-mono font-semibold text-amber-700 tabular-nums">
                    {lightKlx} klx
                  </span>
                </div>
                <input
                  id="photo-light"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={lightKlx}
                  onChange={(e) => setLightKlx(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label htmlFor="photo-co2" className="font-medium text-slate-700">
                    CO2 Concentration
                  </label>
                  <span className="font-mono font-semibold text-sky-700 tabular-nums">
                    {co2Pct.toFixed(2)}%
                  </span>
                </div>
                <input
                  id="photo-co2"
                  type="range"
                  min={0.01}
                  max={0.12}
                  step={0.01}
                  value={co2Pct}
                  onChange={(e) => setCo2Pct(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label htmlFor="photo-temp" className="font-medium text-slate-700">
                    Temperature
                  </label>
                  <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                    {tempC} °C
                  </span>
                </div>
                <input
                  id="photo-temp"
                  type="range"
                  min={5}
                  max={45}
                  step={1}
                  value={tempC}
                  onChange={(e) => setTempC(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-500">
                  Blackman Diagnosis
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-xs font-medium ${limitingInfo.tone}`}
                >
                  {tempC > 37 ? (
                    <AlertCircle className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {limitingInfo.label}
                </span>
              </div>
              <p className="text-base leading-relaxed text-slate-700">
                {limitingInfo.note}
              </p>
              <div className="rounded-lg bg-slate-50 p-3.5 text-sm text-slate-700 flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  Current Photosynthesis Rate:{' '}
                  <strong className="font-mono text-slate-900 tabular-nums">
                    {currentRate}%
                  </strong>
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
