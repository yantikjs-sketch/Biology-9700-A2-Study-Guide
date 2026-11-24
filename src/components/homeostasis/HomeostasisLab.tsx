import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Droplets,
  FlaskConical,
  Leaf,
  Pause,
  Play,
} from 'lucide-react';
import { DiagramImageCard } from '../common/DiagramImageCard';

type HomeostasisView = 'kidney' | 'glucose' | 'stomata';
type NephronRegionId = 'glomerulus' | 'pct' | 'henle' | 'collecting-duct';
type HydrationState = 'dehydrated' | 'normal' | 'overhydrated';
type GlucoseState = 'high' | 'low' | 'adrenaline';
type GlucoseTestTab = 'biosensor' | 'dipstick';
type StomataCondition = 'open' | 'closed-aba';
type StomataStepId = 1 | 2 | 3 | 4;

interface NephronRegionDetail {
  id: NephronRegionId;
  label: string;
  location: string;
  mechanism: string;
  adaptations: string;
  filtrateChange: string;
}

const NEPHRON_REGIONS: Record<NephronRegionId, NephronRegionDetail> = {
  glomerulus: {
    id: 'glomerulus',
    label: '1. Glomerulus & Bowman’s Capsule',
    location: 'Renal Cortex',
    mechanism:
      'Ultrafiltration: The wider afferent arteriole and narrower efferent arteriole create high hydrostatic pressure inside glomerular capillaries. Small solutes (water, glucose, amino acids, urea, Na+, Cl-) are forced through three layers into Bowman’s capsule while RBCs and plasma proteins (> ~69 kDa) remain in blood.',
    adaptations:
      '1) Fenestrated capillary endothelium · 2) Basement membrane (collagen/glycoproteins — main molecular filter) · 3) Podocytes with foot processes (pedicels) and filtration slits.',
    filtrateChange: 'Forms glomerular filtrate (~125 cm³ min⁻¹)',
  },
  pct: {
    id: 'pct',
    label: '2. Proximal Convoluted Tubule (PCT)',
    location: 'Renal Cortex',
    mechanism:
      'Selective Reabsorption: 100% of glucose and amino acids, ~85% of water, and ~65% of Na+ are reabsorbed. Na+/K+ ATPase pumps Na+ out of the basal PCT membrane into blood, creating a steep Na+ gradient that drives Na+-glucose/amino acid co-transport across the luminal membrane (secondary active transport).',
    adaptations:
      'Microvilli (brush border) for huge surface area · Numerous mitochondria (ATP for Na+/K+ pumps) · Tight junctions · Infolded basal membranes.',
    filtrateChange: 'All glucose & amino acids reabsorbed into blood',
  },
  henle: {
    id: 'henle',
    label: '3. Loop of Henle (Countercurrent Multiplier)',
    location: 'Renal Medulla',
    mechanism:
      'Creates a steep osmotic gradient (low water potential Ψ) deep in the medulla. Ascending limb cells actively pump Na+ and Cl- out into medulla tissue fluid (impermeable to water). Descending limb is permeable to water, so water leaves by osmosis into the hypertonic medulla.',
    adaptations:
      'Thick ascending limb rich in mitochondria and impermeable to water · Thin descending limb permeable to water via aquaporins · Vasa recta preserves medullary gradient.',
    filtrateChange: 'Medulla tissue fluid reaches very low Ψ (~-1200 mOsm)',
  },
  'collecting-duct': {
    id: 'collecting-duct',
    label: '4. Collecting Duct & ADH Control',
    location: 'Cortex → Medulla → Pelvis',
    mechanism:
      'Passes down through the hypertonic medulla. ADH binds cell-surface receptors on collecting duct cells, activating cAMP so vesicles containing aquaporin water channels fuse with the luminal membrane. Water leaves by osmosis down the Ψ gradient into the medulla and vasa recta.',
    adaptations:
      'Variable aquaporin density controlled by posterior pituitary ADH · Tight junctions prevent paracellular water backflow.',
    filtrateChange: 'Concentrated or dilute urine exits to renal pelvis',
  },
};

const HYDRATION_DATA: Record<
  HydrationState,
  {
    label: string;
    bloodPsi: string;
    osmoreceptors: string;
    adhLevel: string;
    aquaporins: string;
    urineSummary: string;
    urineColor: string;
  }
> = {
  dehydrated: {
    label: 'Dehydrated (Low Blood Ψ)',
    bloodPsi: 'More negative (concentrated plasma)',
    osmoreceptors: 'Lose water by osmosis and shrink → send frequent impulses to posterior pituitary',
    adhLevel: 'HIGH ADH secreted into blood',
    aquaporins: 'Vesicles fuse with luminal membrane → many aquaporins inserted (high permeability)',
    urineSummary: 'Small volume of concentrated, dark-yellow urine; blood Ψ rises back to set point.',
    urineColor: '#D97706',
  },
  normal: {
    label: 'Normal Hydration (Set Point)',
    bloodPsi: 'Normal (~-700 kPa)',
    osmoreceptors: 'Normal cell volume; basal firing rate',
    adhLevel: 'Basal / moderate ADH',
    aquaporins: 'Moderate aquaporin density on collecting duct membrane',
    urineSummary: 'Balanced urine volume and concentration maintaining constant blood Ψ.',
    urineColor: '#EAB308',
  },
  overhydrated: {
    label: 'Overhydrated (High Blood Ψ)',
    bloodPsi: 'Less negative (dilute plasma)',
    osmoreceptors: 'Gain water by osmosis and swell → reduce impulses to posterior pituitary',
    adhLevel: 'LOW / NO ADH secreted',
    aquaporins: 'Aquaporins removed from luminal membrane by endocytosis (impermeable to water)',
    urineSummary: 'Large volume of very dilute, pale urine; blood Ψ falls back to set point.',
    urineColor: '#FEF08A',
  },
};

const STOMATA_STEPS: Record<
  StomataStepId,
  { title: string; openDetail: string; abaDetail: string }
> = {
  1: {
    title: '1. Stimulus & Membrane Signal',
    openDetail:
      'Daylight (blue light) stimulates guard cell H+-ATPase proton pumps using ATP from guard cell chloroplasts/mitochondria, actively pumping H+ ions out of the guard cells.',
    abaDetail:
      'During soil water stress, roots/leaves synthesise abscisic acid (ABA). ABA binds cell-surface receptors on guard cells, inhibiting H+-ATPase proton pumps and stimulating Ca2+ influx into the cytoplasm.',
  },
  2: {
    title: '2. K+ Ion Movement Across Membrane',
    openDetail:
      'Proton efflux makes the inside of guard cells more electrically negative (hyperpolarised), opening voltage-gated K+ channels so K+ ions diffuse INWARD (balanced by Cl- and malate²⁻).',
    abaDetail:
      'Cytosolic Ca2+ acts as a second messenger, opening K+ (and Cl-) efflux channels so K+ ions rapidly diffuse OUT of the guard cells into surrounding epidermal cells.',
  },
  3: {
    title: '3. Water Potential (Ψ) & Osmosis',
    openDetail:
      'Accumulation of K+, Cl-, and malate lowers the solute potential and water potential (Ψ) inside guard cells below adjacent epidermal cells, so water enters guard cells by osmosis.',
    abaDetail:
      'Loss of K+ ions raises the water potential (Ψ) inside guard cells above surrounding epidermal cells, causing water to leave the guard cells by osmosis.',
  },
  4: {
    title: '4. Guard Cell Wall Mechanics & Pore',
    openDetail:
      'Turgor pressure increases. Because the inner wall next to the pore is thicker and inelastic and cellulose microfibrils are arranged radially, guard cells bow outward and the stomatal pore OPENS for CO2 entry.',
    abaDetail:
      'Guard cells lose turgor and become flaccid; the thick inner walls straighten and press together, CLOSING the stomatal pore to prevent further water vapour loss by transpiration.',
  },
};

export const HomeostasisLab: React.FC = () => {
  const [subView, setSubView] = useState<HomeostasisView>('kidney');

  // Kidney & ADH state
  const [nephronRegion, setNephronRegion] =
    useState<NephronRegionId>('collecting-duct');
  const [hydration, setHydration] = useState<HydrationState>('dehydrated');
  const [isKidneyPlaying, setIsKidneyPlaying] = useState<boolean>(true);

  // Blood Glucose state
  const [glucoseState, setGlucoseState] = useState<GlucoseState>('low');
  const [glucoseTestTab, setGlucoseTestTab] =
    useState<GlucoseTestTab>('biosensor');
  const [isGlucosePlaying, setIsGlucosePlaying] = useState<boolean>(true);

  // Plant Stomata / ABA state
  const [stomataCond, setStomataCond] = useState<StomataCondition>('open');
  const [stomataStep, setStomataStep] = useState<StomataStepId>(2);
  const [isPlayingStomata, setIsPlayingStomata] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlayingStomata || subView !== 'stomata') return;
    const timer = window.setInterval(() => {
      setStomataStep((prev) => (prev === 4 ? 1 : ((prev + 1) as StomataStepId)));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isPlayingStomata, subView]);

  const activeRegion = NEPHRON_REGIONS[nephronRegion];
  const activeHydration = HYDRATION_DATA[hydration];
  const activeStomataStep = STOMATA_STEPS[stomataStep];

  return (
    <div className="space-y-6">
      {/* Topic Header & Sub-Navigation */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-300/70 pb-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-teal-800">
            Cambridge 9700 · Topic 14
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl text-balance">
            Homeostasis Interactive Lab
          </h1>
        </div>

        <div
          className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white/90 p-1 shadow-xs"
          role="tablist"
          aria-label="Homeostasis interactive modules"
        >
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'kidney'}
            onClick={() => setSubView('kidney')}
            className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
              subView === 'kidney'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kidney, Nephron &amp; ADH
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'glucose'}
            onClick={() => setSubView('glucose')}
            className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
              subView === 'glucose'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blood Glucose &amp; cAMP
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subView === 'stomata'}
            onClick={() => setSubView('stomata')}
            className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
              subView === 'stomata'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Plant Stomata &amp; ABA (14.2)
          </button>
        </div>
      </div>

      {/* VIEW 1: KIDNEY, NEPHRON & OSMOREGULATION (ADH) */}
      {subView === 'kidney' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-teal-700" />
                  14.1.2 Nephron Structure, Ultrafiltration &amp; Osmoregulation
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Click any region of the nephron to inspect filtration/reabsorption, and toggle hydration state to simulate ADH and aquaporins.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsKidneyPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {isKidneyPlaying ? (
                  <>
                    <Pause className="h-4 w-4 text-teal-700" /> Pause Flow
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 text-teal-700" /> Animate Flow
                  </>
                )}
              </button>
            </div>

            {/* Nephron Region Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(NEPHRON_REGIONS) as NephronRegionId[]).map(
                (rid) => (
                  <button
                    key={rid}
                    type="button"
                    onClick={() => setNephronRegion(rid)}
                    className={`whitespace-nowrap shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      nephronRegion === rid
                        ? 'border-teal-700 bg-teal-700 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {NEPHRON_REGIONS[rid].label}
                  </button>
                )
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              {/* Interactive Nephron SVG */}
              <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <svg
                  viewBox="0 0 600 290"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Interactive mammalian nephron diagram showing glomerulus, PCT, loop of Henle, and collecting duct"
                >
                  {/* Cortex vs Medulla Background */}
                  <rect
                    x="10"
                    y="10"
                    width="580"
                    height="120"
                    rx="8"
                    fill="#FEF3C7"
                    opacity="0.45"
                  />
                  <rect
                    x="10"
                    y="130"
                    width="580"
                    height="150"
                    rx="8"
                    fill="#E0F2FE"
                    opacity="0.55"
                  />
                  <line
                    x1="10"
                    y1="130"
                    x2="590"
                    y2="130"
                    stroke="#94A3B8"
                    strokeDasharray="5 4"
                    strokeWidth="1.5"
                  />
                  <text x="24" y="30" fontSize="11" fontWeight="700" fill="#92400E">
                    RENAL CORTEX (~-300 mOsm)
                  </text>
                  <text x="24" y="150" fontSize="11" fontWeight="700" fill="#0369A1">
                    RENAL MEDULLA (Low Water Potential Ψ · down to -1200 mOsm)
                  </text>

                  {/* Bowman's Capsule + Glomerulus */}
                  <g
                    onClick={() => setNephronRegion('glomerulus')}
                    className="cursor-pointer"
                  >
                    {/* Afferent (wider) & Efferent (narrower) arterioles */}
                    <path
                      d="M 28 64 L 78 64"
                      stroke="#DC2626"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 102 82 L 102 104"
                      stroke="#DC2626"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="96"
                      cy="68"
                      r="18"
                      fill="#FCA5A5"
                      stroke="#B91C1C"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 116 44 C 76 40, 70 98, 118 94"
                      fill="none"
                      stroke={nephronRegion === 'glomerulus' ? '#0F766E' : '#475569'}
                      strokeWidth={nephronRegion === 'glomerulus' ? '6' : '4'}
                    />
                    <text x="86" y="118" fontSize="10.5" fontWeight="700" fill="#0F172A" textAnchor="middle">
                      Glomerulus
                    </text>
                  </g>

                  {/* Proximal Convoluted Tubule (PCT) */}
                  <g
                    onClick={() => setNephronRegion('pct')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M 118 68 Q 145 38, 175 68 T 235 68 Q 258 68, 258 96 L 258 130"
                      fill="none"
                      stroke={nephronRegion === 'pct' ? '#0F766E' : '#F59E0B'}
                      strokeWidth={nephronRegion === 'pct' ? '12' : '9'}
                      strokeLinecap="round"
                    />
                    <text x="190" y="45" fontSize="11" fontWeight="700" fill="#92400E" textAnchor="middle">
                      PCT (Selective Reabsorption)
                    </text>
                  </g>

                  {/* Loop of Henle */}
                  <g
                    onClick={() => setNephronRegion('henle')}
                    className="cursor-pointer"
                  >
                    <path
                      d="M 258 130 L 258 242 Q 258 262, 286 262 Q 314 262, 314 242 L 314 130"
                      fill="none"
                      stroke={nephronRegion === 'henle' ? '#0F766E' : '#0284C7'}
                      strokeWidth={nephronRegion === 'henle' ? '11' : '8'}
                      strokeLinecap="round"
                    />
                    {/* Water out descending, Na+/Cl- out ascending */}
                    <path
                      d="M 252 185 L 220 185"
                      stroke="#0EA5E9"
                      strokeWidth="2.5"
                      className={isKidneyPlaying ? 'animate-flow-dash' : ''}
                    />
                    {isKidneyPlaying && (
                      <circle r="3.5" fill="#0EA5E9" className="bio-particle-motion">
                        <animateMotion dur="1.3s" repeatCount="indefinite" path="M 252 185 L 220 185" />
                      </circle>
                    )}
                    <text x="195" y="189" fontSize="10" fontWeight="700" fill="#0369A1" textAnchor="end">
                      H2O out
                    </text>
                    <path
                      d="M 320 198 L 358 198"
                      stroke="#D97706"
                      strokeWidth="2.5"
                      className={isKidneyPlaying ? 'animate-flow-dash' : ''}
                    />
                    {isKidneyPlaying && (
                      <circle r="3.5" fill="#D97706" className="bio-particle-motion">
                        <animateMotion dur="1.3s" begin="0.4s" repeatCount="indefinite" path="M 320 198 L 358 198" />
                      </circle>
                    )}
                    <text x="364" y="202" fontSize="10" fontWeight="700" fill="#B45309">
                      Na+ / Cl- pumped out
                    </text>
                    <text x="286" y="278" fontSize="10.5" fontWeight="700" fill="#0369A1" textAnchor="middle">
                      Loop of Henle
                    </text>
                  </g>

                  {/* DCT + Collecting Duct */}
                  <path
                    d="M 314 130 L 314 82 Q 338 56, 372 80 T 445 78 L 465 78"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <text x="392" y="54" fontSize="10.5" fontWeight="600" fill="#78350F" textAnchor="middle">
                    DCT
                  </text>

                  {/* Continuous Filtrate Stream Particles along Nephron */}
                  {isKidneyPlaying && (
                    <g className="bio-particle-motion">
                      <circle r="4" fill="#FEF08A" stroke="#0F172A" strokeWidth="1">
                        <animateMotion
                          dur="5.5s"
                          repeatCount="indefinite"
                          path="M 118 68 Q 145 38, 175 68 T 235 68 Q 258 68, 258 96 L 258 242 Q 258 262, 286 262 Q 314 262, 314 242 L 314 82 Q 338 56, 372 80 T 445 78 L 465 78 L 465 256"
                        />
                      </circle>
                      <circle r="3.5" fill="#BAE6FD" stroke="#0369A1" strokeWidth="1">
                        <animateMotion
                          dur="5.5s"
                          begin="2.75s"
                          repeatCount="indefinite"
                          path="M 118 68 Q 145 38, 175 68 T 235 68 Q 258 68, 258 96 L 258 242 Q 258 262, 286 262 Q 314 262, 314 242 L 314 82 Q 338 56, 372 80 T 445 78 L 465 78 L 465 256"
                        />
                      </circle>
                    </g>
                  )}

                  <g
                    onClick={() => setNephronRegion('collecting-duct')}
                    className="cursor-pointer"
                  >
                    <line
                      x1="465"
                      y1="62"
                      x2="465"
                      y2="258"
                      stroke={nephronRegion === 'collecting-duct' ? '#0F766E' : '#64748B'}
                      strokeWidth={nephronRegion === 'collecting-duct' ? '16' : '13'}
                      strokeLinecap="round"
                    />
                    <text x="485" y="88" fontSize="11" fontWeight="700" fill="#0F172A">
                      Collecting Duct
                    </text>
                    <text x="485" y="103" fontSize="10" fill="#475569">
                      (ADH target)
                    </text>

                    {/* Water reabsorption arrows proportional to ADH */}
                    {hydration !== 'overhydrated' && (
                      <>
                        <path
                          d="M 455 155 L 408 155"
                          stroke="#0EA5E9"
                          strokeWidth={hydration === 'dehydrated' ? '3.5' : '2'}
                          className={isKidneyPlaying ? 'animate-flow-dash' : ''}
                        />
                        <path
                          d="M 455 210 L 408 210"
                          stroke="#0EA5E9"
                          strokeWidth={hydration === 'dehydrated' ? '3.5' : '2'}
                          className={isKidneyPlaying ? 'animate-flow-dash' : ''}
                        />
                        {isKidneyPlaying && (
                          <g className="bio-particle-motion">
                            <circle r="3.6" fill="#0284C7">
                              <animateMotion
                                dur={hydration === 'dehydrated' ? '0.9s' : '1.8s'}
                                repeatCount="indefinite"
                                path="M 455 155 L 408 155"
                              />
                            </circle>
                            <circle r="3.6" fill="#0284C7">
                              <animateMotion
                                dur={hydration === 'dehydrated' ? '0.9s' : '1.8s'}
                                begin="0.45s"
                                repeatCount="indefinite"
                                path="M 455 210 L 408 210"
                              />
                            </circle>
                          </g>
                        )}
                        <text x="403" y="186" fontSize="10" fontWeight="700" fill="#0284C7" textAnchor="end">
                          H2O via aquaporins
                        </text>
                      </>
                    )}

                    {/* Urine drop */}
                    <circle
                      cx="465"
                      cy="272"
                      r="7"
                      fill={activeHydration.urineColor}
                      stroke="#475569"
                      strokeWidth="1.2"
                      className={isKidneyPlaying ? 'animate-drop-fall svg-morph' : 'svg-morph'}
                    />
                    <text x="482" y="275" fontSize="10.5" fontWeight="700" fill="#0F172A">
                      To Renal Pelvis
                    </text>
                  </g>
                </svg>

                {/* Active Region Detail Box */}
                <div className="rounded-lg border border-teal-200 bg-white p-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {activeRegion.label}
                    </h3>
                    <span className="font-mono text-xs font-semibold text-teal-800">
                      {activeRegion.location}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                    {activeRegion.mechanism}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">Key Adaptations: </span>
                    {activeRegion.adaptations}
                  </p>
                </div>
              </div>

              {/* Right: ADH Negative Feedback Simulator + Kidney Image */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    ADH Negative Feedback Simulator
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        ['dehydrated', 'Dehydrated (Low Ψ)'],
                        ['normal', 'Normal Ψ'],
                        ['overhydrated', 'Overhydrated (High Ψ)'],
                      ] as const
                    ).map(([hKey, hLbl]) => (
                      <button
                        key={hKey}
                        type="button"
                        onClick={() => {
                          setHydration(hKey);
                          setNephronRegion('collecting-duct');
                        }}
                        className={`rounded-md border px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                          hydration === hKey
                            ? 'border-teal-700 bg-teal-700 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {hLbl}
                      </button>
                    ))}
                  </div>

                  {/* Live Osmoreceptor & Aquaporin Vesicle Mini-Visualizer */}
                  <div className="rounded border border-slate-200 bg-white p-2.5">
                    <svg
                      viewBox="0 0 340 74"
                      className="w-full h-auto"
                      aria-label="Hypothalamus osmoreceptor size and collecting duct aquaporin membrane insertion"
                    >
                      {/* Osmoreceptor Cell */}
                      <circle
                        cx="52"
                        cy="36"
                        r={hydration === 'dehydrated' ? 14 : hydration === 'normal' ? 19 : 24}
                        fill="#CCFBF1"
                        stroke="#0F766E"
                        strokeWidth="2"
                        className="svg-morph"
                      />
                      <circle cx="52" cy="36" r="5" fill="#0F766E" />
                      <text x="52" y="69" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#334155">
                        Osmoreceptor
                      </text>

                      {/* Arrow to Collecting Duct Membrane */}
                      <path
                        d="M 86 36 L 146 36"
                        stroke={hydration === 'overhydrated' ? '#94A3B8' : '#0F766E'}
                        strokeWidth="2.2"
                        className={isKidneyPlaying && hydration !== 'overhydrated' ? 'animate-flow-dash' : ''}
                      />
                      <text x="116" y="28" textAnchor="middle" fontSize="9" fontWeight="700" fill="#0F766E">
                        {hydration === 'dehydrated'
                          ? 'High ADH'
                          : hydration === 'normal'
                            ? 'Basal ADH'
                            : 'No ADH'}
                      </text>

                      {/* Collecting duct cell luminal membrane + aquaporin vesicles */}
                      <rect x="158" y="14" width="166" height="44" rx="6" fill="#F0F9FF" stroke="#0284C7" strokeWidth="1.5" />
                      <line x1="158" y1="24" x2="324" y2="24" stroke="#0369A1" strokeWidth="3" />
                      {[192, 240, 288].map((ax, i) => {
                        const inserted =
                          hydration === 'dehydrated' || (hydration === 'normal' && i === 1);
                        return (
                          <g key={ax} className="svg-morph">
                            <rect
                              x={ax - 7}
                              y={inserted ? 17 : 37}
                              width="14"
                              height="13"
                              rx="4"
                              fill={inserted ? '#0EA5E9' : '#CBD5E1'}
                              stroke="#0369A1"
                              strokeWidth="1.2"
                              className="svg-morph"
                            />
                            {inserted && isKidneyPlaying && (
                              <circle r="2.5" fill="#0284C7" className="bio-particle-motion">
                                <animateMotion dur="1.1s" repeatCount="indefinite" path={`M ${ax} 10 L ${ax} 44`} />
                              </circle>
                            )}
                          </g>
                        );
                      })}
                      <text x="241" y="69" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#334155">
                        Aquaporin Channels ({hydration === 'dehydrated' ? 'Inserted' : hydration === 'normal' ? 'Moderate' : 'Endocytosed'})
                      </text>
                    </svg>
                  </div>

                  <div className="space-y-2 text-sm leading-relaxed text-slate-700">
                    <div className="rounded bg-white p-2.5 border border-slate-200">
                      <span className="font-semibold text-slate-900">Hypothalamus Osmoreceptors: </span>
                      {activeHydration.osmoreceptors}
                    </div>
                    <div className="rounded bg-white p-2.5 border border-slate-200">
                      <span className="font-semibold text-slate-900">Posterior Pituitary: </span>
                      {activeHydration.adhLevel}
                    </div>
                    <div className="rounded bg-white p-2.5 border border-slate-200">
                      <span className="font-semibold text-slate-900">Aquaporin Channels: </span>
                      {activeHydration.aquaporins}
                    </div>
                    <div className="rounded bg-teal-50/70 p-2.5 border border-teal-200 text-teal-950 font-medium">
                      {activeHydration.urineSummary}
                    </div>
                  </div>
                </div>

                <DiagramImageCard
                  src="/src/assets/images/diagram_kidney_nephron_1795488476637.jpg"
                  alt="Sagittal cross-section of a mammalian kidney showing the outer renal cortex, inner medullary pyramids, renal pelvis, ureter, and branching renal artery and vein"
                  title="Mammalian Kidney Cross-Section"
                  syllabusTag="Cambridge 9700 · 14.1.2"
                  caption="Nephrons span the outer cortex (glomeruli, PCT, DCT) and dip into the inner medullary pyramids (loops of Henle & collecting ducts)."
                  keyStructures={[
                    'Renal cortex: Glomeruli, Bowman’s capsules, PCT & DCT',
                    'Renal medulla: Loops of Henle & collecting ducts',
                    'Renal pelvis & ureter: Drains urine to bladder',
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: BLOOD GLUCOSE CONTROL, cAMP CASCADE & BIOSENSORS */}
      {subView === 'glucose' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-teal-700" />
                  14.1.3 Control of Blood Glucose &amp; Second Messenger Signalling
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Compare insulin vs glucagon/adrenaline hormone signalling, cAMP enzyme amplification, and GLUT4 glucose uptake.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsGlucosePlaying((p) => !p)}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {isGlucosePlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5 text-teal-700" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-teal-700" /> Animate
                    </>
                  )}
                </button>
                <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
                  {(
                    [
                      ['high', 'High Glucose (Insulin)'],
                      ['low', 'Low Glucose (Glucagon)'],
                      ['adrenaline', 'Exercise / Stress (Adrenaline)'],
                    ] as const
                  ).map(([gKey, gLbl]) => (
                    <button
                      key={gKey}
                      type="button"
                      onClick={() => setGlucoseState(gKey)}
                      className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                        glucoseState === gKey
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {gLbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
              {/* Hepatocyte / Target Cell Signalling SVG */}
              <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <svg
                  viewBox="0 0 560 255"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Blood glucose hormone receptor signalling cascade in liver and muscle cells"
                >
                  {/* Blood capillary at top */}
                  <rect
                    x="15"
                    y="14"
                    width="530"
                    height="46"
                    rx="8"
                    fill="#FEE2E2"
                    stroke="#DC2626"
                    strokeWidth="1.5"
                  />
                  <text x="30" y="34" fontSize="11.5" fontWeight="700" fill="#991B1B">
                    Blood Plasma:{' '}
                    {glucoseState === 'high'
                      ? 'High Glucose (> 7 mmol dm⁻³) · β-cells secrete INSULIN'
                      : glucoseState === 'low'
                        ? 'Low Glucose (< 4 mmol dm⁻³) · α-cells secrete GLUCAGON'
                        : 'Fight-or-Flight · Adrenal glands secrete ADRENALINE'}
                  </text>
                  <text x="30" y="50" fontSize="10" fill="#7F1D1D">
                    {glucoseState === 'high'
                      ? 'Glucose enters hepatocytes & muscle cells; blood glucose falls back to ~5 mmol dm⁻³'
                      : 'Liver releases glucose into blood plasma; blood glucose rises back to ~5 mmol dm⁻³'}
                  </text>

                  {/* Target Cell Membrane & Cytoplasm */}
                  <rect
                    x="15"
                    y="82"
                    width="530"
                    height="160"
                    rx="10"
                    fill="#F8FAFC"
                    stroke="#0F766E"
                    strokeWidth="2.5"
                  />
                  <text x="30" y="102" fontSize="11" fontWeight="700" fill="#0F766E">
                    {glucoseState === 'high'
                      ? 'TARGET CELL: Liver Hepatocyte & Skeletal Muscle Cell'
                      : 'TARGET CELL: Liver Hepatocyte (Glucagon) / Liver & Muscle (Adrenaline)'}
                  </text>

                  {glucoseState === 'high' ? (
                    <g>
                      {/* Insulin receptor + GLUT4 */}
                      <rect x="65" y="72" width="40" height="22" rx="5" fill="#0284C7" />
                      <text x="85" y="114" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0369A1">
                        Insulin Receptor
                      </text>
                      {isGlucosePlaying && (
                        <circle r="4" fill="#0284C7" className="bio-particle-motion">
                          <animateMotion dur="1.4s" repeatCount="indefinite" path="M 85 45 L 85 75" />
                        </circle>
                      )}

                      <rect x="195" y="72" width="44" height="22" rx="5" fill="#059669" />
                      <text x="217" y="114" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">
                        GLUT4 Channel
                      </text>
                      <path
                        d="M 217 48 L 217 135"
                        stroke="#059669"
                        strokeWidth="3.5"
                        className={isGlucosePlaying ? 'animate-flow-dash' : ''}
                      />
                      <polygon points="211,130 223,130 217,142" fill="#059669" />
                      {isGlucosePlaying && (
                        <g className="bio-particle-motion">
                          <circle r="4.5" fill="#10B981" stroke="#064E3B" strokeWidth="1">
                            <animateMotion dur="1.2s" repeatCount="indefinite" path="M 217 48 L 217 140" />
                          </circle>
                          <circle r="4.5" fill="#34D399" stroke="#064E3B" strokeWidth="1">
                            <animateMotion dur="1.2s" begin="0.6s" repeatCount="indefinite" path="M 217 48 L 217 140" />
                          </circle>
                        </g>
                      )}

                      <rect x="145" y="146" width="160" height="44" rx="8" fill="#ECFDF5" stroke="#059669" />
                      <text x="225" y="166" textAnchor="middle" fontSize="11" fontWeight="700" fill="#065F46">
                        Glucose Influx Increases
                      </text>
                      <text x="225" y="181" textAnchor="middle" fontSize="10" fill="#047857">
                        (GLUT4 vesicles fuse in muscle)
                      </text>

                      <path d="M 305 168 L 350 168" stroke="#0F766E" strokeWidth="2.5" />
                      <polygon points="346,163 346,173 356,168" fill="#0F766E" />
                      {isGlucosePlaying && (
                        <circle r="3.8" fill="#0F766E" className="bio-particle-motion">
                          <animateMotion dur="1.1s" repeatCount="indefinite" path="M 305 168 L 354 168" />
                        </circle>
                      )}

                      <rect x="358" y="138" width="168" height="62" rx="8" fill="#DBEAFE" stroke="#1D4ED8" />
                      <text x="442" y="160" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E3A8A">
                        Glycogenesis Activated
                      </text>
                      <text x="442" y="176" textAnchor="middle" fontSize="10" fill="#1E40AF">
                        Glucose → Glycogen
                      </text>
                      <text x="442" y="190" textAnchor="middle" fontSize="9.5" fill="#1E40AF">
                        + Faster glucose respiration
                      </text>
                    </g>
                  ) : (
                    <g>
                      {/* Receptor -> G-protein -> Adenylyl cyclase -> cAMP -> Enzyme cascade */}
                      <rect x="52" y="72" width="44" height="22" rx="5" fill="#7C3AED" />
                      <text x="74" y="114" textAnchor="middle" fontSize="10" fontWeight="700" fill="#5B21B6">
                        {glucoseState === 'low' ? 'Glucagon Receptor' : 'Adrenaline Receptor'}
                      </text>
                      {isGlucosePlaying && (
                        <g className="bio-particle-motion">
                          <circle r="4" fill="#7C3AED">
                            <animateMotion dur="1.3s" repeatCount="indefinite" path="M 74 44 L 74 75" />
                          </circle>
                          <circle r="3.5" fill="#D97706">
                            <animateMotion dur="1.2s" repeatCount="indefinite" path="M 96 84 L 215 84" />
                          </circle>
                        </g>
                      )}

                      <rect x="132" y="74" width="60" height="20" rx="4" fill="#D97706" />
                      <text x="162" y="88" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FFFFFF">
                        G-protein
                      </text>

                      <rect x="215" y="72" width="90" height="22" rx="4" fill="#0F766E" />
                      <text x="260" y="87" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#FFFFFF">
                        Adenylyl Cyclase
                      </text>

                      <path d="M 260 94 L 260 124" stroke="#0F766E" strokeWidth="2.5" className={isGlucosePlaying ? 'animate-flow-dash' : ''} />
                      {isGlucosePlaying && (
                        <circle r="3.8" fill="#D97706" className="bio-particle-motion">
                          <animateMotion dur="1.0s" repeatCount="indefinite" path="M 260 94 L 260 124" />
                        </circle>
                      )}
                      <rect x="195" y="126" width="130" height="36" rx="7" fill="#FEF3C7" stroke="#D97706" />
                      <text x="260" y="143" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#92400E">
                        ATP → cAMP
                      </text>
                      <text x="260" y="156" textAnchor="middle" fontSize="9.5" fill="#B45309">
                        (2nd Messenger)
                      </text>

                      <path d="M 325 144 L 360 144" stroke="#B45309" strokeWidth="2.5" />
                      <polygon points="356,139 356,149 366,144" fill="#B45309" />
                      {isGlucosePlaying && (
                        <circle r="3.8" fill="#B45309" className="bio-particle-motion">
                          <animateMotion dur="1.0s" begin="0.3s" repeatCount="indefinite" path="M 325 144 L 362 144" />
                        </circle>
                      )}

                      <rect x="368" y="116" width="160" height="72" rx="8" fill="#EDE9FE" stroke="#6D28D9" />
                      <text x="448" y="136" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#4C1D95">
                        Enzyme Cascade
                      </text>
                      <text x="448" y="152" textAnchor="middle" fontSize="10" fill="#5B21B6">
                        Protein kinase A →
                      </text>
                      <text x="448" y="166" textAnchor="middle" fontSize="10" fill="#5B21B6">
                        Glycogen phosphorylase
                      </text>
                      <text x="448" y="180" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#047857">
                        Glycogen → Glucose!
                      </text>

                      {/* Glucose exit arrow */}
                      <path
                        d="M 448 114 L 448 48"
                        stroke="#059669"
                        strokeWidth="3.5"
                        className={isGlucosePlaying ? 'animate-flow-dash' : ''}
                      />
                      <polygon points="442,54 454,54 448,42" fill="#059669" />
                      {isGlucosePlaying && (
                        <g className="bio-particle-motion">
                          <circle r="4.5" fill="#10B981" stroke="#064E3B" strokeWidth="1">
                            <animateMotion dur="1.1s" repeatCount="indefinite" path="M 448 114 L 448 46" />
                          </circle>
                          <circle r="4.5" fill="#34D399" stroke="#064E3B" strokeWidth="1">
                            <animateMotion dur="1.1s" begin="0.55s" repeatCount="indefinite" path="M 448 114 L 448 46" />
                          </circle>
                        </g>
                      )}
                    </g>
                  )}
                </svg>
              </div>

              {/* Right Explanation + Enzyme Amplification */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-5 space-y-2.5">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {glucoseState === 'high'
                      ? 'Insulin Action (Islets β-cells)'
                      : glucoseState === 'low'
                        ? 'Glucagon Second Messenger Cascade (α-cells)'
                        : 'Adrenaline Rapid Glucose Mobilisation'}
                  </h3>
                  <p className="text-base leading-relaxed text-slate-700">
                    {glucoseState === 'high'
                      ? 'β-cells detect high blood glucose and secrete insulin. Insulin binds liver and muscle receptors, increasing GLUT4 glucose transporter proteins in muscle cell membranes and activating glycogenesis (glucose → glycogen) and respiration.'
                      : glucoseState === 'low'
                        ? 'α-cells secrete glucagon. Binding to hepatocyte receptors activates a G-protein and adenylyl cyclase, converting ATP into cyclic AMP (cAMP). One hormone molecule activates many enzyme molecules (cascade amplification), rapidly converting glycogen into glucose (glycogenolysis) plus gluconeogenesis.'
                        : 'Adrenaline uses the same G-protein → adenylyl cyclase → cAMP second messenger cascade in both liver and skeletal muscle cells, rapidly releasing glucose for burst ATP production.'}
                  </p>
                </div>

                {/* Deamination & Urea link */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-slate-900">
                    14.1.1 Liver Deamination &amp; Urea Formation
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-700">
                    Excess amino acids cannot be stored. Hepatocytes remove the amino group (<span className="font-mono">-NH2</span>) to form toxic ammonia (<span className="font-mono">NH3</span>), which enters the ornithine/urea cycle with <span className="font-mono">CO2</span> to form soluble, low-toxicity <span className="font-semibold text-slate-900">urea CO(NH2)2</span> for kidney excretion. The remaining keto acid enters respiration or gluconeogenesis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Glucose Testing: Biosensor vs Dipstick */}
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-teal-700" />
                  14.1.3 Measuring Blood &amp; Urine Glucose (9700 Practical)
                </h2>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setGlucoseTestTab('biosensor')}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    glucoseTestTab === 'biosensor'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Blood Glucose Biosensor
                </button>
                <button
                  type="button"
                  onClick={() => setGlucoseTestTab('dipstick')}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    glucoseTestTab === 'dipstick'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Urine Test Dipstick
                </button>
              </div>
            </div>

            {glucoseTestTab === 'biosensor' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base leading-relaxed text-slate-700">
                <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                  <p className="font-semibold text-slate-900">
                    How an Electronic Blood Glucose Biosensor Works
                  </p>
                  <p className="text-sm sm:text-base">
                    A test strip carries <span className="font-semibold text-slate-900">immobilised glucose oxidase</span> enzyme over an electrode. Glucose in a blood drop is oxidised to gluconic acid + <span className="font-mono">H2O2</span>, generating electrons / current proportional to blood glucose concentration.
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 flex items-start gap-2.5 text-sm sm:text-base text-emerald-950">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700 mt-0.5" />
                  <p>
                    <span className="font-semibold">Quantitative &amp; Specific: </span>
                    Glucose oxidase is specific ONLY to β-D-glucose (unlike Benedict’s test which detects all reducing sugars), giving an immediate digital reading in <span className="font-mono">mmol dm⁻³</span>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base leading-relaxed text-slate-700">
                <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                  <p className="font-semibold text-slate-900">
                    How a Glucose Urine Dipstick Works
                  </p>
                  <p className="text-sm sm:text-base">
                    The cellulose pad contains immobilised <span className="font-semibold">glucose oxidase</span>, <span className="font-semibold">peroxidase</span>, and a chromogen dye. Glucose oxidase forms <span className="font-mono">H2O2</span>; peroxidase uses <span className="font-mono">H2O2</span> to oxidise the chromogen, shifting colour from yellow/green to dark brown.
                  </p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 flex items-start gap-2.5 text-sm sm:text-base text-amber-950">
                  <AlertCircle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
                  <p>
                    <span className="font-semibold">Renal Threshold Limit: </span>
                    Semi-quantitative only, and only detects diabetes when blood glucose exceeds the PCT co-transporter maximum (~<span className="font-mono">10 mmol dm⁻³</span>), spilling glucose into urine.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: PLANT HOMEOSTASIS — STOMATAL GUARD CELLS & ABA */}
      {subView === 'stomata' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-emerald-700" />
                    14.2 Guard Cell Osmoregulation &amp; Abscisic Acid (ABA)
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Compare light-induced stomatal opening with ABA-mediated drought closure.
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setStomataCond('open')}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      stomataCond === 'open'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Daylight (Open)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStomataCond('closed-aba')}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      stomataCond === 'closed-aba'
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Water Stress (ABA Closed)
                  </button>
                </div>
              </div>

              {/* 4-Step Selector + Play/Pause */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {([1, 2, 3, 4] as StomataStepId[]).map((stepId) => (
                    <button
                      key={stepId}
                      type="button"
                      onClick={() => {
                        setIsPlayingStomata(false);
                        setStomataStep(stepId);
                      }}
                      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                        stomataStep === stepId
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Step {stepId}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayingStomata((p) => !p)}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {isPlayingStomata ? (
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

              {/* Guard Cell SVG */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                <svg
                  viewBox="0 0 460 220"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Stomatal guard cells opening and closing via K+ ion and water flux"
                >
                  {/* Epidermal background */}
                  <rect
                    x="10"
                    y="12"
                    width="440"
                    height="196"
                    rx="10"
                    fill="#F1F5F9"
                    stroke="#CBD5E1"
                  />
                  <text x="24" y="34" fontSize="11" fontWeight="700" fill="#475569">
                    Surrounding Epidermal Cells
                  </text>

                  {/* Morphing Left & Right Guard Cells */}
                  <path
                    d={
                      stomataCond === 'open'
                        ? 'M 226 44 C 138 46, 132 174, 226 176 C 202 140, 202 80, 226 44 Z'
                        : 'M 228 46 C 172 48, 172 172, 228 174 C 228 138, 228 82, 228 46 Z'
                    }
                    fill={stomataCond === 'open' ? '#BBF7D0' : '#FEF3C7'}
                    stroke={stomataCond === 'open' ? '#15803D' : '#B45309'}
                    strokeWidth="3"
                    className="svg-morph"
                  />
                  <path
                    d={
                      stomataCond === 'open'
                        ? 'M 234 44 C 322 46, 328 174, 234 176 C 258 140, 258 80, 234 44 Z'
                        : 'M 232 46 C 288 48, 288 172, 232 174 C 232 138, 232 82, 232 46 Z'
                    }
                    fill={stomataCond === 'open' ? '#BBF7D0' : '#FEF3C7'}
                    stroke={stomataCond === 'open' ? '#15803D' : '#B45309'}
                    strokeWidth="3"
                    className="svg-morph"
                  />
                  {/* Thicker inner walls */}
                  <path
                    d={
                      stomataCond === 'open'
                        ? 'M 226 44 C 202 80, 202 140, 226 176'
                        : 'M 228 46 C 228 82, 228 138, 228 174'
                    }
                    fill="none"
                    stroke={stomataCond === 'open' ? '#14532D' : '#78350F'}
                    strokeWidth="5.5"
                    className="svg-morph"
                  />
                  <path
                    d={
                      stomataCond === 'open'
                        ? 'M 234 44 C 258 80, 258 140, 234 176'
                        : 'M 232 46 C 232 82, 232 138, 232 174'
                    }
                    fill="none"
                    stroke={stomataCond === 'open' ? '#14532D' : '#78350F'}
                    strokeWidth="5.5"
                    className="svg-morph"
                  />

                  {stomataCond === 'open' ? (
                    <g>
                      {/* Radial microfibrils */}
                      {[68, 92, 112, 134, 154].map((ry) => (
                        <g key={ry}>
                          <line x1="166" y1={ry} x2="206" y2={ry} stroke="#166534" strokeWidth="1.4" strokeDasharray="3 2" />
                          <line x1="254" y1={ry} x2="294" y2={ry} stroke="#166534" strokeWidth="1.4" strokeDasharray="3 2" />
                        </g>
                      ))}
                      {/* K+ & H2O Influx */}
                      <path d="M 90 95 L 154 95" stroke="#D97706" strokeWidth="3" className="animate-flow-dash" />
                      {isPlayingStomata && (
                        <circle r="4" fill="#D97706" className="bio-particle-motion">
                          <animateMotion dur="1.1s" repeatCount="indefinite" path="M 90 95 L 154 95" />
                        </circle>
                      )}
                      <text x="84" y="88" fontSize="10.5" fontWeight="700" fill="#B45309">
                        K+ enters
                      </text>
                      <path d="M 90 132 L 154 132" stroke="#0284C7" strokeWidth="3" className="animate-flow-dash" />
                      {isPlayingStomata && (
                        <circle r="4" fill="#0284C7" className="bio-particle-motion">
                          <animateMotion dur="1.1s" begin="0.45s" repeatCount="indefinite" path="M 90 132 L 154 132" />
                        </circle>
                      )}
                      <text x="84" y="150" fontSize="10.5" fontWeight="700" fill="#0369A1">
                        H2O osmosis in
                      </text>
                      <text x="230" y="114" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0F172A">
                        OPEN
                      </text>
                      <text x="230" y="196" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">
                        Turgid guard cells · Low Ψ inside · CO2 enters for Calvin cycle
                      </text>
                    </g>
                  ) : (
                    <g>
                      {/* K+ & H2O Efflux */}
                      <path d="M 186 95 L 116 95" stroke="#DC2626" strokeWidth="3" className="animate-flow-dash" />
                      {isPlayingStomata && (
                        <circle r="4" fill="#DC2626" className="bio-particle-motion">
                          <animateMotion dur="1.1s" repeatCount="indefinite" path="M 186 95 L 116 95" />
                        </circle>
                      )}
                      <text x="112" y="88" fontSize="10.5" fontWeight="700" fill="#B91C1C">
                        K+ exits (Ca2+ signal)
                      </text>
                      <path d="M 186 132 L 116 132" stroke="#0284C7" strokeWidth="3" className="animate-flow-dash" />
                      {isPlayingStomata && (
                        <circle r="4" fill="#0284C7" className="bio-particle-motion">
                          <animateMotion dur="1.1s" begin="0.45s" repeatCount="indefinite" path="M 186 132 L 116 132" />
                        </circle>
                      )}
                      <text x="112" y="150" fontSize="10.5" fontWeight="700" fill="#0369A1">
                        H2O osmosis out
                      </text>
                      {isPlayingStomata && (
                        <circle r="4.5" fill="#DC2626" className="bio-particle-motion">
                          <animateMotion dur="1.4s" repeatCount="indefinite" path="M 332 104 L 272 104" />
                        </circle>
                      )}
                      <text x="355" y="102" fontSize="10.5" fontWeight="700" fill="#92400E" textAnchor="middle">
                        ABA binds receptor
                      </text>
                      <text x="355" y="118" fontSize="10" fill="#B45309" textAnchor="middle">
                        H+ pump inhibited
                      </text>
                      <text x="230" y="196" textAnchor="middle" fontSize="11" fontWeight="700" fill="#B45309">
                        Flaccid guard cells · Higher Ψ inside · Pore CLOSED to save water
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Active Step Card */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                <h3 className="text-base font-semibold text-slate-900">
                  {activeStomataStep.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-700">
                  {stomataCond === 'open'
                    ? activeStomataStep.openDetail
                    : activeStomataStep.abaDetail}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <DiagramImageCard
                src="/src/assets/images/diagram_stomata_guard_cells_1795488477772.jpg"
                alt="Light micrograph of leaf lower epidermis showing paired kidney-shaped green guard cells containing chloroplasts around a stomatal pore"
                title="Stomatal Guard Cells (Light Micrograph)"
                syllabusTag="Cambridge 9700 · 14.2"
                caption="Guard cells contain chloroplasts (providing ATP for H+-ATPase proton pumps) and unevenly thickened inner walls with radial cellulose microfibrils."
                keyStructures={[
                  'Thickened inner stomatal wall: Bows outward when turgid',
                  'Chloroplasts: Supply ATP for active H+ pumping',
                  'ABA receptors: Trigger Ca2+ influx & K+ efflux during drought',
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
