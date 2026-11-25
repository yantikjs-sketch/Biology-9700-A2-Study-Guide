import React, { useEffect, useMemo, useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  Dna,
  FlaskConical,
  GitBranch,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Sliders,
} from 'lucide-react';
import { DiagramImageCard } from '../common/DiagramImageCard';

type InheritanceView = 'meiosis' | 'genetics' | 'gene-control';
type MeiosisStage = 1 | 2 | 3 | 4 | 5 | 6;
type AssortmentMode = 'parental' | 'flipped';
type CrossModeId = 'abo' | 'sex-linked' | 'dihybrid' | 'linkage' | 'epistasis';
type EpistasisMode = '9:3:4' | '12:3:1' | '9:7';
type GeneExampleId = 'TYR' | 'HBB' | 'F8' | 'HTT' | 'LE';
type OperonState = 'absent' | 'present';
type EukaryoteState = 'dormant' | 'gibberellin';

interface MeiosisStageInfo {
  id: MeiosisStage;
  title: string;
  phase: string;
  ploidy: string;
  keyEvent: string;
  variationLink: string;
}

const MEIOSIS_STAGES: Record<MeiosisStage, MeiosisStageInfo> = {
  1: {
    id: 1,
    title: '1. Prophase I (Synapsis & Chiasmata)',
    phase: 'Meiosis I · 2n = 4',
    ploidy: 'Diploid (2n)',
    keyEvent:
      'Homologous chromosomes condense and pair up as bivalents (synapsis). Non-sister chromatids cross over at chiasmata, breaking and rejoining to exchange equivalent DNA segments.',
    variationLink:
      'Crossing over swaps alleles (e.g. B and b) between maternal and paternal chromatids, generating new recombinant allele combinations on the same chromosome.',
  },
  2: {
    id: 2,
    title: '2. Metaphase I (Independent Assortment)',
    phase: 'Meiosis I · Equator Alignment',
    ploidy: 'Diploid (2n)',
    keyEvent:
      'Bivalents attach to spindle fibres at centromeres and line up randomly along the cell equator. The orientation of each homologous pair is completely independent of every other pair.',
    variationLink:
      'Random orientation (2^n combinations, where n = haploid number) determines which maternal/paternal homologues move to each pole.',
  },
  3: {
    id: 3,
    title: '3. Anaphase I (Reduction Division)',
    phase: 'Meiosis I · Homologues Separate',
    ploidy: '2n → n segregation',
    keyEvent:
      'Spindle fibres shorten and pull whole homologous chromosomes (each still consisting of two sister chromatids) to opposite poles. Centromeres do NOT divide.',
    variationLink:
      'Halves the chromosome number from diploid (2n) to haploid (n) — the true reduction division.',
  },
  4: {
    id: 4,
    title: '4. Telophase I & Cytokinesis',
    phase: 'End of Meiosis I · Two Cells',
    ploidy: 'Haploid (n) per daughter cell',
    keyEvent:
      'Two daughter cells form, each containing one chromosome from every homologous pair (still duplicated as sister chromatids). Brief nuclear envelope reformation may occur.',
    variationLink:
      'Each cell already carries a unique combination of maternal, paternal, and recombinant chromatids.',
  },
  5: {
    id: 5,
    title: '5. Anaphase II (Sister Chromatids Split)',
    phase: 'Meiosis II · Mitosis-like Division',
    ploidy: 'Haploid (n)',
    keyEvent:
      'After alignment on the equator at Metaphase II, centromeres divide and spindle fibres pull sister chromatids to opposite poles of both cells.',
    variationLink:
      'If crossing over occurred in Prophase I, the two sister chromatids separating here are genetically non-identical.',
  },
  6: {
    id: 6,
    title: '6. Four Genetically Distinct Gametes',
    phase: 'Telophase II & Cytokinesis',
    ploidy: '4 × Haploid (n)',
    keyEvent:
      'Nuclear envelopes reform around four haploid nuclei, followed by cytokinesis to produce four genetically distinct haploid gametes (e.g. AB, Ab, aB, ab).',
    variationLink:
      'Random fusion of any male gamete with any female gamete at fertilisation further multiplies genetic variation in offspring.',
  },
};

const GENE_EXAMPLES: Record<
  GeneExampleId,
  {
    gene: string;
    protein: string;
    locus: string;
    normalRole: string;
    mutantPhenotype: string;
    inheritance: string;
  }
> = {
  TYR: {
    gene: 'TYR (Tyrosinase)',
    protein: 'Tyrosinase enzyme',
    locus: 'Autosome (Chromosome 11)',
    normalRole:
      'Catalyses conversion of the amino acid tyrosine into DOPA and dopaquinone, leading to melanin pigment synthesis in melanocytes.',
    mutantPhenotype:
      'Albinism: mutated recessive allele produces non-functional/absent tyrosinase, preventing melanin synthesis in skin, hair, and iris.',
    inheritance: 'Autosomal recessive',
  },
  HBB: {
    gene: 'HBB (β-globin)',
    protein: 'β-globin polypeptide of haemoglobin',
    locus: 'Autosome (Chromosome 11)',
    normalRole:
      'Pairs with α-globin and haem groups to form soluble adult haemoglobin (HbA) that transports O2 inside flexible biconcave red blood cells.',
    mutantPhenotype:
      'Sickle cell anaemia (Hb^S): single base substitution (GAG → GTG) replaces hydrophilic Glu with hydrophobic Val, causing Hb to polymerise at low O2 and distort RBCs.',
    inheritance: 'Autosomal codominant (Hb^A Hb^S carriers show malaria resistance)',
  },
  F8: {
    gene: 'F8 (Factor VIII)',
    protein: 'Blood clotting protein Factor VIII',
    locus: 'X chromosome (non-homologous region)',
    normalRole:
      'Essential cofactor in the blood clotting cascade activating Factor X, ultimately converting soluble fibrinogen into an insoluble fibrin mesh.',
    mutantPhenotype:
      'Haemophilia A: lack of functional Factor VIII delays fibrin clot formation, leading to prolonged bleeding after minor injury.',
    inheritance: 'X-linked recessive (much more common in males, X^h Y)',
  },
  HTT: {
    gene: 'HTT (Huntingtin)',
    protein: 'Huntingtin protein',
    locus: 'Autosome (Chromosome 4)',
    normalRole:
      'Supports normal neurone survival, vesicle transport, and synaptic function in the brain.',
    mutantPhenotype:
      'Huntington’s disease: expanded CAG trinucleotide repeats produce misfolded huntingtin protein that forms toxic aggregates in neurones (late-onset neurodegeneration).',
    inheritance: 'Autosomal dominant (one mutant allele causes disease)',
  },
  LE: {
    gene: 'LE (Gibberellin 3β-hydroxylase)',
    protein: 'GA3-oxidase enzyme in pea plants',
    locus: 'Autosome in Pisum sativum',
    normalRole:
      'Converts inactive gibberellin precursor (GA20) into active gibberellin (GA1), stimulating stem internode cell elongation (tall stem, Le_).',
    mutantPhenotype:
      'Dwarf pea plants (le le): substitution alters active site so enzyme fails to synthesise active GA1, leaving stems short.',
    inheritance: 'Autosomal recessive',
  },
};

interface ChiPreset {
  id: string;
  label: string;
  expectedRatioText: string;
  rows: { label: string; observed: number; ratioWeight: number }[];
}

const CHI_PRESETS: ChiPreset[] = [
  {
    id: 'dihybrid-accept',
    label: '9:3:3:1 Dihybrid F2 (Good Fit)',
    expectedRatioText: '9 : 3 : 3 : 1',
    rows: [
      { label: 'Round Yellow (R_Y_)', observed: 98, ratioWeight: 9 },
      { label: 'Round Green (R_yy)', observed: 28, ratioWeight: 3 },
      { label: 'Wrinkled Yellow (rrY_)', observed: 26, ratioWeight: 3 },
      { label: 'Wrinkled Green (rryy)', observed: 8, ratioWeight: 1 },
    ],
  },
  {
    id: 'epistasis-accept',
    label: '9:3:4 Recessive Epistasis (Good Fit)',
    expectedRatioText: '9 : 3 : 4',
    rows: [
      { label: 'Agouti (A_B_)', observed: 112, ratioWeight: 9 },
      { label: 'Black (A_bb)', observed: 34, ratioWeight: 3 },
      { label: 'Albino (aaB_ + aabb)', observed: 54, ratioWeight: 4 },
    ],
  },
  {
    id: 'linkage-reject',
    label: 'Test Cross 1:1:1:1 vs Linkage (Reject H0)',
    expectedRatioText: '1 : 1 : 1 : 1',
    rows: [
      { label: 'Parental AaBb', observed: 96, ratioWeight: 1 },
      { label: 'Parental aabb', observed: 94, ratioWeight: 1 },
      { label: 'Recombinant Aabb', observed: 6, ratioWeight: 1 },
      { label: 'Recombinant aaBb', observed: 4, ratioWeight: 1 },
    ],
  },
];

// Critical values for p = 0.05 (Cambridge 9700 standard table)
const CRITICAL_P05: Record<number, number> = {
  1: 3.841,
  2: 5.991,
  3: 7.815,
  4: 9.488,
  5: 11.07,
};

export const InheritanceLab: React.FC = () => {
  const [activeView, setActiveView] = useState<InheritanceView>('meiosis');

  // View 1: Meiosis state
  const [meiosisStage, setMeiosisStage] = useState<MeiosisStage>(1);
  const [isPlayingMeiosis, setIsPlayingMeiosis] = useState(true);
  const [crossingOver, setCrossingOver] = useState(true);
  const [assortment, setAssortment] = useState<AssortmentMode>('parental');

  // View 2: Genetics & Chi-squared state
  const [crossMode, setCrossMode] = useState<CrossModeId>('abo');
  const [epistasisMode, setEpistasisMode] = useState<EpistasisMode>('9:3:4');
  const [selectedGene, setSelectedGene] = useState<GeneExampleId>('TYR');
  const [presetId, setPresetId] = useState<string>('dihybrid-accept');
  const [chiRows, setChiRows] = useState(CHI_PRESETS[0].rows);

  // View 3: Gene control state
  const [operonState, setOperonState] = useState<OperonState>('absent');
  const [isPlayingOperon, setIsPlayingOperon] = useState(true);
  const [eukaryoteState, setEukaryoteState] =
    useState<EukaryoteState>('dormant');

  useEffect(() => {
    if (activeView !== 'meiosis' || !isPlayingMeiosis) return;
    const timer = window.setInterval(() => {
      setMeiosisStage((prev) => ((prev % 6) + 1) as MeiosisStage);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [activeView, isPlayingMeiosis]);

  const currentStageInfo = MEIOSIS_STAGES[meiosisStage];

  // Derived gamete labels based on crossingOver + assortment toggles
  const gameteAlleles = useMemo(() => {
    if (assortment === 'parental') {
      return crossingOver
        ? ['AB (Parental)', 'Ab (Recombinant)', 'aB (Recombinant)', 'ab (Parental)']
        : ['AB (Parental)', 'AB (Parental)', 'ab (Parental)', 'ab (Parental)'];
    }
    return crossingOver
      ? ['Ab (Assorted)', 'AB (Recombinant)', 'ab (Recombinant)', 'aB (Assorted)']
      : ['Ab (Assorted)', 'Ab (Assorted)', 'aB (Assorted)', 'aB (Assorted)'];
  }, [assortment, crossingOver]);

  const chiCalculation = useMemo(() => {
    const totalObserved = chiRows.reduce((sum, r) => sum + r.observed, 0);
    const totalWeight = chiRows.reduce((sum, r) => sum + r.ratioWeight, 0);
    const computedRows = chiRows.map((row) => {
      const expected =
        totalWeight > 0 ? (totalObserved * row.ratioWeight) / totalWeight : 0;
      const diff = row.observed - expected;
      const term = expected > 0 ? (diff * diff) / expected : 0;
      return {
        ...row,
        expected,
        diff,
        term,
      };
    });
    const chiSquared = computedRows.reduce((sum, r) => sum + r.term, 0);
    const df = Math.max(1, chiRows.length - 1);
    const critical = CRITICAL_P05[df] ?? 7.815;
    const significant = chiSquared >= critical;
    return {
      totalObserved,
      computedRows,
      chiSquared,
      df,
      critical,
      significant,
    };
  }, [chiRows]);

  const handleSelectChiPreset = (nextId: string) => {
    setPresetId(nextId);
    const found = CHI_PRESETS.find((p) => p.id === nextId);
    if (found) {
      setChiRows(found.rows.map((r) => ({ ...r })));
    }
  };

  const handleUpdateObserved = (index: number, raw: string) => {
    const num = Math.max(0, Math.min(9999, Number.parseInt(raw || '0', 10) || 0));
    setChiRows((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, observed: num } : row)),
    );
  };

  const currentGene = GENE_EXAMPLES[selectedGene];

  return (
    <div className="space-y-6">
      {/* Topic Header */}
      <div className="flex flex-col gap-4 border-b border-slate-300/70 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium tracking-wide text-amber-700">
            Topic 16 · Cambridge International A Level Biology (9700)
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl text-balance">
            Inherited Change, Epistasis &amp; Gene Control
          </h1>
          <p className="mt-1.5 max-w-3xl text-base leading-relaxed text-slate-700">
            Explore meiosis I &amp; II with chiasmata crossing over, model dihybrid,
            sex-linked, autosomal linkage, and epistatic crosses with live{' '}
            <span className="font-mono font-semibold">χ²</span> calculations, and
            switch on the prokaryotic <span className="italic">lac</span> operon.
          </p>
        </div>

        <div
          className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-200/75 p-1 shrink-0"
          role="tablist"
          aria-label="Inherited Change interactive views"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'meiosis'}
            onClick={() => setActiveView('meiosis')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeView === 'meiosis'
                ? 'bg-white text-amber-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shuffle className="h-4 w-4" />
            16.1 Meiosis
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'genetics'}
            onClick={() => setActiveView('genetics')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeView === 'genetics'
                ? 'bg-white text-amber-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="h-4 w-4" />
            16.2 Crosses &amp; χ²
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'gene-control'}
            onClick={() => setActiveView('gene-control')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeView === 'gene-control'
                ? 'bg-white text-amber-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="h-4 w-4" />
            16.3 Gene Control
          </button>
        </div>
      </div>

      {/* VIEW 1: 16.1 MEIOSIS & CROSSING OVER */}
      {activeView === 'meiosis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Animated Meiosis Canvas */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    {currentStageInfo.phase}
                  </span>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {currentStageInfo.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlayingMeiosis((p) => !p)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    {isPlayingMeiosis ? (
                      <>
                        <Pause className="h-4 w-4" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Play Stages
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive Controls for Crossing Over & Independent Assortment */}
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                <button
                  type="button"
                  onClick={() => setCrossingOver((c) => !c)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-medium transition-colors ${
                    crossingOver
                      ? 'border-amber-600 bg-amber-600 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <GitBranch className="h-4 w-4" />
                  Crossing Over (Chiasma): {crossingOver ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAssortment((a) => (a === 'parental' ? 'flipped' : 'parental'))
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <Shuffle className="h-4 w-4 text-amber-700" />
                  Metaphase I Orientation:{' '}
                  <span className="font-mono font-semibold text-amber-800">
                    {assortment === 'parental' ? 'A/a · B/b' : 'A/a · b/B'}
                  </span>
                </button>
              </div>

              {/* Interactive SVG Meiosis Visualizer */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 p-2">
                <svg
                  viewBox="0 0 720 380"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Interactive animation of Meiosis I and II showing crossing over and independent assortment"
                >
                  <defs>
                    <marker
                      id="meiosis-arrow"
                      markerWidth="8"
                      markerHeight="8"
                      refX="6"
                      refY="4"
                      orient="auto"
                    >
                      <path d="M0,1 L7,4 L0,7 Z" fill="#B45309" />
                    </marker>
                  </defs>

                  {/* Stage 1-3: Single Parent Cell (2n = 4) */}
                  {meiosisStage <= 3 && (
                    <g className="svg-morph">
                      <ellipse
                        cx="360"
                        cy="190"
                        rx={meiosisStage === 3 ? 255 : 215}
                        ry="152"
                        fill="#FFFFFF"
                        stroke="#94A3B8"
                        strokeWidth="2.5"
                      />
                      {/* Spindle fibres */}
                      {meiosisStage >= 2 && (
                        <g stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4">
                          <line x1="95" y1="190" x2="290" y2="125" />
                          <line x1="95" y1="190" x2="290" y2="255" />
                          <line x1="625" y1="190" x2="430" y2="125" />
                          <line x1="625" y1="190" x2="430" y2="255" />
                          <circle cx="95" cy="190" r="7" fill="#F59E0B" stroke="none" />
                          <circle cx="625" cy="190" r="7" fill="#F59E0B" stroke="none" />
                        </g>
                      )}
                      {meiosisStage === 2 && (
                        <line
                          x1="360"
                          y1="52"
                          x2="360"
                          y2="328"
                          stroke="#94A3B8"
                          strokeDasharray="6 4"
                          strokeWidth="1.5"
                        />
                      )}

                      {/* Bivalent 1: Long Pair (Alleles A / a) */}
                      <g
                        transform={
                          meiosisStage === 1
                            ? 'translate(360,120)'
                            : meiosisStage === 2
                              ? 'translate(360,120)'
                              : 'translate(360,120)'
                        }
                      >
                        {/* Maternal Homologue (Blue, A) */}
                        <g
                          transform={`translate(${meiosisStage === 3 ? -125 : meiosisStage === 1 ? -22 : -36}, 0)`}
                          className="svg-morph"
                        >
                          <path
                            d="M-12,-42 Q-4,0 -12,42"
                            stroke="#1D4ED8"
                            strokeWidth="8"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d={
                              meiosisStage === 1 && crossingOver
                                ? 'M12,-42 Q12,-8 22,12 Q26,28 12,42'
                                : 'M12,-42 Q4,0 12,42'
                            }
                            stroke="#1D4ED8"
                            strokeWidth="8"
                            strokeLinecap="round"
                            fill="none"
                          />
                          {crossingOver && meiosisStage >= 2 && (
                            <path
                              d="M10,16 L12,42"
                              stroke="#DC2626"
                              strokeWidth="8"
                              strokeLinecap="round"
                            />
                          )}
                          <circle cx="0" cy="0" r="6" fill="#0F172A" />
                          <text
                            x="-28"
                            y="-28"
                            fontSize="13"
                            fontWeight="700"
                            fill="#1E3A8A"
                          >
                            A
                          </text>
                        </g>

                        {/* Paternal Homologue (Red, a) */}
                        <g
                          transform={`translate(${meiosisStage === 3 ? 125 : meiosisStage === 1 ? 22 : 36}, 0)`}
                          className="svg-morph"
                        >
                          <path
                            d={
                              meiosisStage === 1 && crossingOver
                                ? 'M-12,-42 Q-12,-8 -22,12 Q-26,28 -12,42'
                                : 'M-12,-42 Q-4,0 -12,42'
                            }
                            stroke="#DC2626"
                            strokeWidth="8"
                            strokeLinecap="round"
                            fill="none"
                          />
                          {crossingOver && meiosisStage >= 2 && (
                            <path
                              d="M-10,16 L-12,42"
                              stroke="#1D4ED8"
                              strokeWidth="8"
                              strokeLinecap="round"
                            />
                          )}
                          <path
                            d="M12,-42 Q4,0 12,42"
                            stroke="#DC2626"
                            strokeWidth="8"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <circle cx="0" cy="0" r="6" fill="#0F172A" />
                          <text
                            x="18"
                            y="-28"
                            fontSize="13"
                            fontWeight="700"
                            fill="#991B1B"
                          >
                            a
                          </text>
                        </g>

                        {/* Chiasma highlight in Prophase I */}
                        {meiosisStage === 1 && crossingOver && (
                          <g>
                            <circle
                              cx="0"
                              cy="14"
                              r="12"
                              fill="#FEF3C7"
                              fillOpacity="0.6"
                              stroke="#D97706"
                              strokeWidth="2"
                            />
                            <text
                              x="44"
                              y="18"
                              fontSize="12"
                              fontWeight="600"
                              fill="#B45309"
                            >
                              Chiasma (crossing over)
                            </text>
                          </g>
                        )}
                      </g>

                      {/* Bivalent 2: Short Pair (Alleles B / b, flips with assortment) */}
                      <g transform="translate(360,258)">
                        {/* Left-facing Homologue */}
                        <g
                          transform={`translate(${meiosisStage === 3 ? -125 : meiosisStage === 1 ? -22 : -36}, 0)`}
                          className="svg-morph"
                        >
                          <path
                            d="M-9,-30 Q-3,0 -9,30"
                            stroke={assortment === 'parental' ? '#1D4ED8' : '#DC2626'}
                            strokeWidth="7"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M9,-30 Q3,0 9,30"
                            stroke={assortment === 'parental' ? '#1D4ED8' : '#DC2626'}
                            strokeWidth="7"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <circle cx="0" cy="0" r="5" fill="#0F172A" />
                          <text
                            x="-26"
                            y="-18"
                            fontSize="13"
                            fontWeight="700"
                            fill={assortment === 'parental' ? '#1E3A8A' : '#991B1B'}
                          >
                            {assortment === 'parental' ? 'B' : 'b'}
                          </text>
                        </g>

                        {/* Right-facing Homologue */}
                        <g
                          transform={`translate(${meiosisStage === 3 ? 125 : meiosisStage === 1 ? 22 : 36}, 0)`}
                          className="svg-morph"
                        >
                          <path
                            d="M-9,-30 Q-3,0 -9,30"
                            stroke={assortment === 'parental' ? '#DC2626' : '#1D4ED8'}
                            strokeWidth="7"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M9,-30 Q3,0 9,30"
                            stroke={assortment === 'parental' ? '#DC2626' : '#1D4ED8'}
                            strokeWidth="7"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <circle cx="0" cy="0" r="5" fill="#0F172A" />
                          <text
                            x="16"
                            y="-18"
                            fontSize="13"
                            fontWeight="700"
                            fill={assortment === 'parental' ? '#991B1B' : '#1E3A8A'}
                          >
                            {assortment === 'parental' ? 'b' : 'B'}
                          </text>
                        </g>
                      </g>

                      {meiosisStage === 3 && (
                        <g>
                          <line
                            x1="280"
                            y1="120"
                            x2="245"
                            y2="120"
                            stroke="#B45309"
                            strokeWidth="2.5"
                            markerEnd="url(#meiosis-arrow)"
                          />
                          <line
                            x1="440"
                            y1="120"
                            x2="475"
                            y2="120"
                            stroke="#B45309"
                            strokeWidth="2.5"
                            markerEnd="url(#meiosis-arrow)"
                          />
                        </g>
                      )}
                    </g>
                  )}

                  {/* Stage 4-5: Two Haploid Daughter Cells (n = 2 duplicated chromosomes) */}
                  {(meiosisStage === 4 || meiosisStage === 5) && (
                    <g className="svg-morph">
                      {[
                        {
                          cx: 195,
                          longColor: '#1D4ED8',
                          longAllele: 'A',
                          shortColor: assortment === 'parental' ? '#1D4ED8' : '#DC2626',
                          shortAllele: assortment === 'parental' ? 'B' : 'b',
                          recombTip: crossingOver ? '#DC2626' : '#1D4ED8',
                        },
                        {
                          cx: 525,
                          longColor: '#DC2626',
                          longAllele: 'a',
                          shortColor: assortment === 'parental' ? '#DC2626' : '#1D4ED8',
                          shortAllele: assortment === 'parental' ? 'b' : 'B',
                          recombTip: crossingOver ? '#1D4ED8' : '#DC2626',
                        },
                      ].map((cell, idx) => (
                        <g key={idx}>
                          <ellipse
                            cx={cell.cx}
                            cy="190"
                            rx="145"
                            ry="135"
                            fill="#FFFFFF"
                            stroke="#94A3B8"
                            strokeWidth="2.5"
                          />
                          <text
                            x={cell.cx}
                            y="40"
                            textAnchor="middle"
                            fontSize="13"
                            fontWeight="600"
                            fill="#334155"
                          >
                            Cell {idx + 1} (n = 2)
                          </text>

                          {/* Long chromosome (separating sister chromatids in stage 5) */}
                          <g transform={`translate(${cell.cx}, 135)`}>
                            <path
                              d={`M${meiosisStage === 5 ? -44 : -10},-32 L${meiosisStage === 5 ? -44 : -8},32`}
                              stroke={cell.longColor}
                              strokeWidth="8"
                              strokeLinecap="round"
                            />
                            <path
                              d={`M${meiosisStage === 5 ? 44 : 10},-32 L${meiosisStage === 5 ? 44 : 8},32`}
                              stroke={cell.longColor}
                              strokeWidth="8"
                              strokeLinecap="round"
                            />
                            <path
                              d={`M${meiosisStage === 5 ? 44 : 9},8 L${meiosisStage === 5 ? 44 : 8},32`}
                              stroke={cell.recombTip}
                              strokeWidth="8"
                              strokeLinecap="round"
                            />
                            <text
                              x={meiosisStage === 5 ? -62 : -28}
                              y="-18"
                              fontSize="12"
                              fontWeight="700"
                              fill="#0F172A"
                            >
                              {cell.longAllele}
                            </text>
                          </g>

                          {/* Short chromosome */}
                          <g transform={`translate(${cell.cx}, 250)`}>
                            <path
                              d={`M${meiosisStage === 5 ? -44 : -9},-24 L${meiosisStage === 5 ? -44 : -7},24`}
                              stroke={cell.shortColor}
                              strokeWidth="7"
                              strokeLinecap="round"
                            />
                            <path
                              d={`M${meiosisStage === 5 ? 44 : 9},-24 L${meiosisStage === 5 ? 44 : 7},24`}
                              stroke={cell.shortColor}
                              strokeWidth="7"
                              strokeLinecap="round"
                            />
                            <text
                              x={meiosisStage === 5 ? -62 : -26}
                              y="-12"
                              fontSize="12"
                              fontWeight="700"
                              fill="#0F172A"
                            >
                              {cell.shortAllele}
                            </text>
                          </g>
                        </g>
                      ))}
                    </g>
                  )}

                  {/* Stage 6: Four Haploid Gametes */}
                  {meiosisStage === 6 && (
                    <g className="svg-morph">
                      {gameteAlleles.map((label, idx) => {
                        const x = 105 + idx * 170;
                        const isRecombinant = label.includes('Recombinant');
                        const hasUpperA = label.startsWith('A');
                        const hasUpperB = label[1] === 'B';
                        return (
                          <g key={label + idx} transform={`translate(${x}, 185)`}>
                            <circle
                              cx="0"
                              cy="0"
                              r="68"
                              fill="#FFFFFF"
                              stroke={isRecombinant ? '#D97706' : '#64748B'}
                              strokeWidth={isRecombinant ? '3' : '2'}
                            />
                            {/* Single chromatid A/a */}
                            <line
                              x1="-16"
                              y1="-32"
                              x2="-16"
                              y2="24"
                              stroke={hasUpperA ? '#1D4ED8' : '#DC2626'}
                              strokeWidth="8"
                              strokeLinecap="round"
                            />
                            {isRecombinant && (
                              <line
                                x1="-16"
                                y1="4"
                                x2="-16"
                                y2="24"
                                stroke={hasUpperA ? '#DC2626' : '#1D4ED8'}
                                strokeWidth="8"
                                strokeLinecap="round"
                              />
                            )}
                            {/* Single chromatid B/b */}
                            <line
                              x1="16"
                              y1="-22"
                              x2="16"
                              y2="20"
                              stroke={hasUpperB ? '#1D4ED8' : '#DC2626'}
                              strokeWidth="7"
                              strokeLinecap="round"
                            />
                            <text
                              x="0"
                              y="95"
                              textAnchor="middle"
                              fontSize="12"
                              fontWeight="700"
                              fill={isRecombinant ? '#B45309' : '#0F172A'}
                            >
                              {label}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  )}
                </svg>
              </div>

              {/* Stage Selector Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {([1, 2, 3, 4, 5, 6] as MeiosisStage[]).map((stageNum) => (
                  <button
                    key={stageNum}
                    type="button"
                    onClick={() => {
                      setIsPlayingMeiosis(false);
                      setMeiosisStage(stageNum);
                    }}
                    className={`rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors ${
                      meiosisStage === stageNum
                        ? 'border-amber-700 bg-amber-700 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Stage {stageNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Explanation & Reference Image */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                    {currentStageInfo.ploidy}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Syllabus 16.1.1 – 16.1.4
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Cytological Mechanism
                  </h3>
                  <p className="mt-1.5 text-base leading-relaxed text-slate-800">
                    {currentStageInfo.keyEvent}
                  </p>
                </div>

                <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-4">
                  <h3 className="text-sm font-semibold text-amber-900">
                    Contribution to Genetic Variation
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-amber-950/90">
                    {currentStageInfo.variationLink}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Current Gamete Output ({gameteAlleles.length} haploid gametes)
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {gameteAlleles.map((g, idx) => (
                      <div
                        key={g + idx}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-mono font-semibold ${
                          g.includes('Recombinant')
                            ? 'border-amber-300 bg-amber-50 text-amber-900'
                            : 'border-slate-200 bg-slate-50 text-slate-800'
                        }`}
                      >
                        {g}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DiagramImageCard
                src="/src/assets/images/diagram_meiosis_crossing_over_1795580123280.jpg"
                alt="Labeled diagram of Meiosis I and II showing homologous chromosomes, chiasmata crossing over, independent assortment, and four haploid gametes"
                title="Meiosis I & II Reference Diagram (9700 · 16.1)"
                syllabusTag="Syllabus 16.1.2 – 16.1.4 · Reduction Division & Variation"
                caption="Bivalents exchange alleles at chiasmata in prophase I before reduction division (2n → n) in anaphase I and sister chromatid separation in anaphase II."
                keyStructures={[
                  'Prophase I: Homologous bivalents form chiasmata (crossing over)',
                  'Metaphase I: Random alignment (independent assortment)',
                  'Anaphase I: Homologues separate (2n → n); Anaphase II: Sister chromatids split',
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 16.2 GENETIC CROSSES, EPISTASIS, CHI-SQUARED & GENES */}
      {activeView === 'genetics' && (
        <div className="space-y-6">
          {/* Interactive Cross Pattern Explorer */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Syllabus 16.2.1 – 16.2.2 · Inheritance Models
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  9700 Genetic Cross &amp; Ratio Explorer
                </h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'abo', label: 'ABO Codominance' },
                    { id: 'sex-linked', label: 'X-Linked Haemophilia' },
                    { id: 'dihybrid', label: 'Dihybrid 9:3:3:1' },
                    { id: 'linkage', label: 'Autosomal Linkage' },
                    { id: 'epistasis', label: 'Epistasis' },
                  ] as { id: CrossModeId; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCrossMode(item.id)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      crossMode === item.id
                        ? 'border-amber-700 bg-amber-700 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {crossMode === 'abo' && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2.5 text-sm sm:text-base text-slate-700">
                  <h3 className="font-semibold text-slate-900">
                    Multiple Alleles &amp; Codominance: Cross I^A I^O × I^B I^O
                  </h3>
                  <p>
                    Three alleles exist at the <span className="font-mono font-semibold">I</span> locus:{' '}
                    <span className="font-mono">I^A</span> and <span className="font-mono">I^B</span> are{' '}
                    <strong className="text-slate-900">codominant</strong>, and both are completely dominant
                    over <span className="font-mono">I^O</span>.
                  </p>
                  <p className="rounded-lg bg-slate-50 border border-slate-200 p-3 font-mono text-sm">
                    Expected Offspring Ratio: <strong>1 AB : 1 A : 1 B : 1 O</strong>
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-center text-sm border border-slate-200 rounded-lg">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-2.5 border border-slate-200">Gametes</th>
                        <th className="p-2.5 border border-slate-200 font-mono">I^B</th>
                        <th className="p-2.5 border border-slate-200 font-mono">I^O</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="p-2.5 border border-slate-200 bg-slate-50 font-mono">I^A</th>
                        <td className="p-2.5 border border-slate-200 bg-amber-50 font-medium">
                          I^A I^B (Group AB)
                        </td>
                        <td className="p-2.5 border border-slate-200">I^A I^O (Group A)</td>
                      </tr>
                      <tr>
                        <th className="p-2.5 border border-slate-200 bg-slate-50 font-mono">I^O</th>
                        <td className="p-2.5 border border-slate-200">I^B I^O (Group B)</td>
                        <td className="p-2.5 border border-slate-200 bg-slate-50">I^O I^O (Group O)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {crossMode === 'sex-linked' && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2.5 text-sm sm:text-base text-slate-700">
                  <h3 className="font-semibold text-slate-900">
                    X-Linked Recessive Inheritance: Carrier X^H X^h × Unaffected Male X^H Y
                  </h3>
                  <p>
                    The <span className="font-mono font-semibold">F8</span> clotting factor gene lies on the
                    non-homologous region of the X chromosome. Males only inherit one X chromosome (from
                    their mother), so a single <span className="font-mono">X^h</span> allele expresses haemophilia.
                  </p>
                  <p className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-950">
                    Key 9700 point: A father passes his Y chromosome to sons, so{' '}
                    <strong>father-to-son transmission cannot occur</strong>.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-center text-sm border border-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-2.5 border border-slate-200">Gametes</th>
                        <th className="p-2.5 border border-slate-200 font-mono">X^H (Male)</th>
                        <th className="p-2.5 border border-slate-200 font-mono">Y (Male)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="p-2.5 border border-slate-200 bg-slate-50 font-mono">X^H</th>
                        <td className="p-2.5 border border-slate-200">X^H X^H · Unaffected female</td>
                        <td className="p-2.5 border border-slate-200">X^H Y · Unaffected male</td>
                      </tr>
                      <tr>
                        <th className="p-2.5 border border-slate-200 bg-slate-50 font-mono">X^h</th>
                        <td className="p-2.5 border border-slate-200 bg-amber-50">
                          X^H X^h · Carrier female
                        </td>
                        <td className="p-2.5 border border-slate-200 bg-rose-50 font-semibold text-rose-900">
                          X^h Y · Haemophiliac male (25%)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {crossMode === 'dihybrid' && (
              <div className="space-y-3 text-sm sm:text-base text-slate-700">
                <h3 className="font-semibold text-slate-900">
                  Unlinked Dihybrid F1 × F1 Cross: RrYy × RrYy → 9 : 3 : 3 : 1
                </h3>
                <p>
                  Because gene loci <span className="font-mono">R/r</span> and{' '}
                  <span className="font-mono">Y/y</span> are on different chromosomes, each F1 parent forms
                  four equal gametes (<span className="font-mono">RY, Ry, rY, ry</span> in a 1:1:1:1 ratio)
                  via independent assortment in Metaphase I.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {[
                    { ratio: '9 / 16', geno: 'R_ Y_', pheno: 'Both dominant (e.g. Round Yellow)' },
                    { ratio: '3 / 16', geno: 'R_ yy', pheno: 'Dominant 1, recessive 2 (Round Green)' },
                    { ratio: '3 / 16', geno: 'rr Y_', pheno: 'Recessive 1, dominant 2 (Wrinkled Yellow)' },
                    { ratio: '1 / 16', geno: 'rr yy', pheno: 'Double recessive (Wrinkled Green)' },
                  ].map((box) => (
                    <div
                      key={box.geno}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1"
                    >
                      <p className="text-lg font-mono font-bold text-amber-800">{box.ratio}</p>
                      <p className="font-mono text-xs font-semibold text-slate-900">{box.geno}</p>
                      <p className="text-xs text-slate-600">{box.pheno}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {crossMode === 'linkage' && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 text-sm sm:text-base text-slate-700">
                <div className="space-y-2.5">
                  <h3 className="font-semibold text-slate-900">
                    Autosomal Linkage Test Cross: (AB)/(ab) × (ab)/(ab)
                  </h3>
                  <p>
                    When loci <span className="font-mono">A/a</span> and <span className="font-mono">B/b</span>{' '}
                    lie on the <strong>same autosome</strong>, they are inherited together rather than assorting
                    independently. A test cross deviates sharply from 1:1:1:1.
                  </p>
                  <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                    Small numbers of <strong>recombinant phenotypes</strong> (Aabb and aaBb) still appear
                    because crossing over at chiasmata in Prophase I occasionally separates linked loci.
                  </p>
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Parental Phenotypes: AaBb &amp; aabb</span>
                      <span className="font-mono text-amber-800">~90–95%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full w-[92%] bg-amber-600 rounded-full" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Recombinant Phenotypes: Aabb &amp; aaBb (via chiasmata)</span>
                      <span className="font-mono text-slate-700">~5–10%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full w-[8%] bg-slate-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {crossMode === 'epistasis' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm sm:text-base text-slate-700">
                    Epistasis occurs when alleles at one locus mask or modify expression at a second locus:
                  </p>
                  <div className="flex gap-1.5">
                    {(['9:3:4', '12:3:1', '9:7'] as EpistasisMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setEpistasisMode(mode)}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-mono font-semibold transition-colors ${
                          epistasisMode === mode
                            ? 'border-amber-700 bg-amber-700 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {epistasisMode === '9:3:4' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:text-base text-slate-700 space-y-2">
                    <p className="font-semibold text-slate-900">
                      Recessive Epistasis (9 : 3 : 4) — e.g. Mouse Coat Colour
                    </p>
                    <p>
                      Locus A enables melanin synthesis (A_ = pigment made, aa = albino, pathway blocked).
                      Locus B determines pigment distribution (B_ = agouti, bb = black). Because{' '}
                      <span className="font-mono font-semibold">aa</span> stops the pathway upstream, both{' '}
                      <span className="font-mono">aaB_</span> (3/16) and <span className="font-mono">aabb</span>{' '}
                      (1/16) are albino → <strong>9 Agouti : 3 Black : 4 Albino</strong>.
                    </p>
                  </div>
                )}

                {epistasisMode === '12:3:1' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:text-base text-slate-700 space-y-2">
                    <p className="font-semibold text-slate-900">
                      Dominant Epistasis (12 : 3 : 1) — e.g. Squash Fruit Colour
                    </p>
                    <p>
                      A dominant allele <span className="font-mono font-semibold">W</span> inhibits pigment
                      production regardless of locus Y (<span className="font-mono">W_Y_</span> +{' '}
                      <span className="font-mono">W_yy</span> = 9 + 3 = 12 white). Only homozygous recessive{' '}
                      <span className="font-mono">ww</span> allows pigment expression:{' '}
                      <strong>12 White : 3 Yellow (wwY_) : 1 Green (wwyy)</strong>.
                    </p>
                  </div>
                )}

                {epistasisMode === '9:7' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:text-base text-slate-700 space-y-2">
                    <p className="font-semibold text-slate-900">
                      Complementary Gene Interaction (9 : 7) — e.g. Sweet Pea Flower Colour
                    </p>
                    <p>
                      Precursor → (Enzyme C) → Intermediate → (Enzyme P) → Purple anthocyanin. Both at
                      least one dominant <span className="font-mono">C</span> and one dominant{' '}
                      <span className="font-mono">P</span> (<span className="font-mono">C_P_</span> = 9/16) are
                      needed for purple flowers; <span className="font-mono">C_pp</span> (3) +{' '}
                      <span className="font-mono">ccP_</span> (3) + <span className="font-mono">ccpp</span> (1)
                      all remain white → <strong>9 Purple : 7 White</strong>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Chi-Squared Calculator + Genes-to-Protein */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Syllabus 16.2.3 · Statistical Test
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Interactive Chi-Squared (χ²) Calculator
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectChiPreset(presetId)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset Preset
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CHI_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectChiPreset(preset.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      presetId === preset.id
                        ? 'border-amber-700 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600">
                      <th className="py-2.5 pr-3 font-medium">Phenotype Class</th>
                      <th className="py-2.5 px-2 font-medium">Ratio</th>
                      <th className="py-2.5 px-2 font-medium">Observed (O)</th>
                      <th className="py-2.5 px-2 font-medium">Expected (E)</th>
                      <th className="py-2.5 pl-2 text-right font-medium">(O−E)²/E</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {chiCalculation.computedRows.map((row, idx) => (
                      <tr key={row.label}>
                        <td className="py-2.5 pr-3 font-medium text-slate-800">
                          {row.label}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-slate-600">
                          {row.ratioWeight}
                        </td>
                        <td className="py-2.5 px-2">
                          <input
                            type="number"
                            min={0}
                            max={9999}
                            aria-label={`Observed count for ${row.label}`}
                            value={row.observed}
                            onChange={(e) => handleUpdateObserved(idx, e.target.value)}
                            className="w-20 rounded-md border border-slate-300 bg-white px-2 py-1 font-mono text-sm text-slate-900 focus:border-amber-600 focus:outline-none"
                          />
                        </td>
                        <td className="py-2.5 px-2 font-mono tabular-nums text-slate-700">
                          {row.expected.toFixed(1)}
                        </td>
                        <td className="py-2.5 pl-2 text-right font-mono font-semibold tabular-nums text-amber-800">
                          {row.term.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className={`rounded-xl border p-4 text-sm space-y-1.5 ${
                  chiCalculation.significant
                    ? 'border-rose-200 bg-rose-50 text-rose-950'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-950'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono font-semibold">
                  <span>
                    Total N = {chiCalculation.totalObserved} · df = {chiCalculation.df} · Critical
                    (p=0.05) = {chiCalculation.critical.toFixed(3)}
                  </span>
                  <span className="text-base">
                    χ² = {chiCalculation.chiSquared.toFixed(2)}
                  </span>
                </div>
                <p className="leading-relaxed">
                  {chiCalculation.significant ? (
                    <>
                      <strong>Reject Null Hypothesis (H0):</strong> Since χ² (
                      {chiCalculation.chiSquared.toFixed(2)}) ≥{' '}
                      {chiCalculation.critical.toFixed(3)} (p &lt; 0.05), there is a{' '}
                      <strong>statistically significant difference</strong> between observed
                      and expected numbers (not due to chance alone — e.g. autosomal linkage or
                      selection).
                    </>
                  ) : (
                    <>
                      <strong>Accept Null Hypothesis (H0):</strong> Since χ² (
                      {chiCalculation.chiSquared.toFixed(2)}) &lt;{' '}
                      {chiCalculation.critical.toFixed(3)} (p &gt; 0.05), there is{' '}
                      <strong>no statistically significant difference</strong> between observed
                      and expected ratios; deviations are due to chance alone.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 16.2.4 Genes, Proteins & Phenotype */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Syllabus 16.2.4 · Genes → Proteins → Phenotype
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Named 9700 Gene Loci Inspector
                </h2>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(['TYR', 'HBB', 'F8', 'HTT', 'LE'] as GeneExampleId[]).map((geneId) => (
                  <button
                    key={geneId}
                    type="button"
                    onClick={() => setSelectedGene(geneId)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-mono font-semibold transition-colors ${
                      selectedGene === geneId
                        ? 'border-amber-700 bg-amber-700 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {geneId}
                  </button>
                ))}
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <Dna className="h-4 w-4 text-amber-700" />
                      {currentGene.gene}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {currentGene.locus} · {currentGene.inheritance}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Encoded Polypeptide &amp; Normal Function
                  </p>
                  <p className="mt-1 text-slate-800 leading-relaxed">
                    <strong>{currentGene.protein}:</strong> {currentGene.normalRole}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                    Mutant Allele Effect on Phenotype
                  </p>
                  <p className="mt-1 text-slate-800 leading-relaxed">
                    {currentGene.mutantPhenotype}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 16.3 GENE CONTROL (LAC OPERON & TRANSCRIPTION FACTORS) */}
      {activeView === 'gene-control' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Interactive lac Operon Animation */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Syllabus 16.3.1 – 16.3.2 · Prokaryotic Inducible Operon
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    The <span className="italic">lac</span> Operon in <span className="italic">E. coli</span>
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPlayingOperon((p) => !p)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors"
                >
                  {isPlayingOperon ? (
                    <>
                      <Pause className="h-4 w-4" /> Pause Motion
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> Play Motion
                    </>
                  )}
                </button>
              </div>

              {/* Condition Switch */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setOperonState('absent')}
                  className={`flex-1 min-w-[190px] rounded-xl border px-4 py-2.5 text-left transition-colors ${
                    operonState === 'absent'
                      ? 'border-rose-600 bg-rose-50 text-rose-950'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-sm font-semibold">1. Lactose Absent (Operon OFF)</p>
                  <p className="text-xs opacity-80">
                    Active repressor binds operator (O); RNA polymerase blocked
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setOperonState('present')}
                  className={`flex-1 min-w-[190px] rounded-xl border px-4 py-2.5 text-left transition-colors ${
                    operonState === 'present'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-sm font-semibold">2. Lactose Present (Operon ON)</p>
                  <p className="text-xs opacity-80">
                    Allolactose inducer inactivates repressor; structural genes transcribed
                  </p>
                </button>
              </div>

              {/* Animated lac Operon SVG */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 p-2">
                <svg
                  viewBox="0 0 720 330"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Interactive diagram of E. coli lac operon regulation with lactose absent or present"
                >
                  {/* DNA Backbone */}
                  <line x1="25" y1="210" x2="695" y2="210" stroke="#334155" strokeWidth="6" />

                  {/* lacI Regulatory Gene */}
                  <rect x="40" y="190" width="90" height="40" rx="6" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="2" />
                  <text x="85" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1E3A8A">
                    lacI
                  </text>
                  <text x="85" y="248" textAnchor="middle" fontSize="11" fill="#475569">
                    Regulatory gene
                  </text>

                  {/* Promoter P */}
                  <rect x="175" y="190" width="80" height="40" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                  <text x="215" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400E">
                    P
                  </text>
                  <text x="215" y="248" textAnchor="middle" fontSize="11" fill="#475569">
                    Promoter
                  </text>

                  {/* Operator O */}
                  <rect x="265" y="190" width="75" height="40" rx="6" fill="#FCE7F3" stroke="#BE185D" strokeWidth="2" />
                  <text x="302" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="#831843">
                    O
                  </text>
                  <text x="302" y="248" textAnchor="middle" fontSize="11" fill="#475569">
                    Operator
                  </text>

                  {/* Structural Genes lacZ, lacY, lacA */}
                  <rect x="355" y="190" width="110" height="40" rx="6" fill="#D1FAE5" stroke="#047857" strokeWidth="2" />
                  <text x="410" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="#065F46">
                    lacZ
                  </text>

                  <rect x="475" y="190" width="100" height="40" rx="6" fill="#A7F3D0" stroke="#047857" strokeWidth="2" />
                  <text x="525" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="#065F46">
                    lacY
                  </text>

                  <rect x="585" y="190" width="95" height="40" rx="6" fill="#6EE7B7" stroke="#047857" strokeWidth="2" />
                  <text x="632" y="215" textAnchor="middle" fontSize="14" fontWeight="700" fill="#065F46">
                    lacA
                  </text>

                  <text x="518" y="248" textAnchor="middle" fontSize="11" fill="#065F46" fontWeight="600">
                    Structural genes (β-galactosidase, permease, transacetylase)
                  </text>

                  {/* Repressor Protein mRNA arrow from lacI */}
                  <path
                    d="M85,188 C85,135 120,115 160,115"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className={isPlayingOperon ? 'animate-flow-dash' : ''}
                  />

                  {/* Repressor Protein */}
                  <g
                    transform={
                      operonState === 'absent' ? 'translate(302, 162)' : 'translate(185, 80)'
                    }
                    className="svg-morph"
                  >
                    <path
                      d="M-24,-20 C-24,-34 24,-34 24,-20 L24,18 L10,18 L6,6 L-6,6 L-10,18 L-24,18 Z"
                      fill={operonState === 'absent' ? '#EF4444' : '#94A3B8'}
                      stroke={operonState === 'absent' ? '#991B1B' : '#475569'}
                      strokeWidth="2"
                    />
                    <text x="0" y="-4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
                      Repressor
                    </text>

                    {/* Allolactose Inducer Bound */}
                    {operonState === 'present' && (
                      <g>
                        <circle cx="-18" cy="14" r="9" fill="#F59E0B" stroke="#92400E" strokeWidth="1.5" />
                        <text x="20" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#B45309">
                          + Allolactose (shape changed!)
                        </text>
                      </g>
                    )}
                  </g>

                  {/* RNA Polymerase */}
                  {operonState === 'absent' ? (
                    <g transform="translate(215, 165)">
                      <ellipse cx="0" cy="0" rx="34" ry="20" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
                        RNA Pol (Blocked)
                      </text>
                    </g>
                  ) : (
                    <g>
                      <g transform="translate(465, 165)">
                        <ellipse cx="0" cy="0" rx="36" ry="20" fill="#059669" stroke="#065F46" strokeWidth="2" />
                        <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
                          RNA Pol
                        </text>
                        {isPlayingOperon && (
                          <animateTransform
                            attributeName="transform"
                            type="translate"
                            values="215,165; 650,165"
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        )}
                      </g>

                      {/* mRNA Transcription Stream */}
                      <path
                        d="M355,135 Q435,105 515,135 T670,125"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="4"
                        strokeDasharray="6 4"
                        className={isPlayingOperon ? 'animate-flow-dash' : ''}
                      />
                      <text x="515" y="95" textAnchor="middle" fontSize="12" fontWeight="700" fill="#065F46">
                        Polycistronic mRNA → β-galactosidase + Lactose permease
                      </text>

                      {isPlayingOperon && (
                        <circle r="5" fill="#10B981" className="bio-particle-motion">
                          <animateMotion
                            dur="2.4s"
                            repeatCount="indefinite"
                            path="M355,135 Q435,105 515,135 T670,125"
                          />
                        </circle>
                      )}
                    </g>
                  )}
                </svg>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {operonState === 'absent' ? (
                  <p>
                    <strong className="text-rose-900">Lactose Absent:</strong> The regulatory gene{' '}
                    <span className="font-mono font-semibold">lacI</span> continuously expresses an active
                    repressor protein that binds specifically to the operator (<span className="font-mono">O</span>).
                    RNA polymerase cannot move past <span className="font-mono">O</span> to transcribe{' '}
                    <span className="font-mono">lacZ, lacY, lacA</span>, conserving ATP and amino acids.
                  </p>
                ) : (
                  <p>
                    <strong className="text-emerald-900">Lactose Present (Inducible Enzyme):</strong>{' '}
                    Allolactose binds the repressor as an <strong>inducer</strong>, altering its tertiary
                    structure so it detaches from <span className="font-mono">O</span>. RNA polymerase binds the
                    promoter (<span className="font-mono">P</span>) and transcribes mRNA for{' '}
                    <strong>β-galactosidase</strong> (hydrolyses lactose → glucose + galactose) and{' '}
                    <strong>lactose permease</strong> (imports lactose across the cell membrane).
                  </p>
                )}
              </div>
            </div>

            {/* Eukaryotic Transcription Factors + Bespoke Diagram */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Syllabus 16.3.3 – 16.3.4 · Eukaryotic Gene Control
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Transcription Factors &amp; Gibberellin–DELLA
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEukaryoteState('dormant')}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      eukaryoteState === 'dormant'
                        ? 'border-slate-800 bg-slate-800 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    No GA (DELLA Bound)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEukaryoteState('gibberellin')}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      eukaryoteState === 'gibberellin'
                        ? 'border-emerald-700 bg-emerald-700 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    + Gibberellin (DELLA Destroyed)
                  </button>
                </div>

                {eukaryoteState === 'dormant' ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
                    <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <FlaskConical className="h-4 w-4 text-slate-600" />
                      Transcription Blocked by DELLA Repressor
                    </p>
                    <p className="leading-relaxed">
                      In dry seeds or dwarf shoots lacking GA, <strong>DELLA proteins</strong> bind to
                      transcription factors (such as PIF), preventing them from binding the promoter of
                      growth / <span className="font-mono">amylase</span> genes.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 space-y-2">
                    <p className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      Transcription Factor Released → Amylase Synthesised
                    </p>
                    <p className="leading-relaxed">
                      Gibberellin (GA) binds its intracellular receptor and stimulates ubiquitin-mediated
                      breakdown of <strong>DELLA proteins</strong>. Freed transcription factors bind the
                      promoter region so RNA polymerase transcribes <strong>amylase mRNA</strong>.
                    </p>
                  </div>
                )}
              </div>

              <DiagramImageCard
                src="/src/assets/images/diagram_lac_operon_1795580122788.jpg"
                alt="Labeled diagram of the E. coli lac operon showing lacI, promoter, operator, lacZ/Y/A, allolactose inducer, and RNA polymerase"
                title="E. coli lac Operon Reference Diagram (9700 · 16.3)"
                syllabusTag="Syllabus 16.3.1 – 16.3.2 · Inducible Operon Control"
                caption="Allolactose binds the lacI repressor protein, releasing it from the operator (O) so RNA polymerase can transcribe lacZ, lacY, and lacA."
                keyStructures={[
                  'lacI (regulatory gene) → synthesises active repressor protein',
                  'Promoter (P) + Operator (O) → control RNA polymerase access',
                  'lacZ (β-galactosidase), lacY (lactose permease), lacA (transacetylase)',
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
