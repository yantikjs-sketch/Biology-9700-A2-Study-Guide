import { QuizQuestion, SyllabusModuleMeta } from '../types/syllabus';

export const A2_SYLLABUS_MODULES: SyllabusModuleMeta[] = [
  {
    id: 'respiration',
    code: '12',
    title: 'Energy and Respiration',
    shortLabel: '12. Respiration',
    status: 'active',
    summary:
      'ATP synthesis, glycolysis, link reaction, Krebs cycle, oxidative phosphorylation, anaerobic pathways, and respiratory quotients (RQ).',
    subtopics: [
      '12.1 Energy & ATP as universal currency',
      '12.2 Aerobic respiration stages & mitochondrion structure',
      '12.2 Chemiosmosis & oxidative phosphorylation',
      '12.2 Anaerobic respiration (lactate & ethanol) & rice adaptations',
      '12.2 Respiratory substrates, RQ values & respirometers',
    ],
    accentColor: '#1D4ED8',
  },
  {
    id: 'photosynthesis',
    code: '13',
    title: 'Photosynthesis',
    shortLabel: '13. Photosynthesis',
    status: 'active',
    summary:
      'Chloroplast ultrastructure, photosynthetic pigments, absorption & action spectra, cyclic & non-cyclic photophosphorylation, Calvin cycle, and limiting factors.',
    subtopics: [
      '13.1 Chloroplast structure, photosystems & pigment chromatography (Rf)',
      '13.1 Absorption vs action spectra & light-dependent Z-scheme',
      '13.1 Calvin cycle (RuBP, Rubisco, GP, TP & regeneration)',
      '13.2 Limiting factors & Hill reaction (DCPIP)',
    ],
    accentColor: '#059669',
  },
  {
    id: 'homeostasis',
    code: '14',
    title: 'Homeostasis',
    shortLabel: '14. Homeostasis',
    status: 'active',
    summary:
      'Negative feedback, liver deamination & urea formation, nephron ultrafiltration & PCT reabsorption, ADH osmoregulation, blood glucose & cAMP signalling, biosensors, and stomatal ABA control.',
    subtopics: [
      '14.1 Negative feedback, deamination & urea formation in liver',
      '14.1 Kidney ultrafiltration, PCT reabsorption, loop of Henle & ADH',
      '14.1 Blood glucose control (insulin, glucagon, cAMP) & biosensors',
      '14.2 Plant homeostasis: stomatal guard cells & abscisic acid (ABA)',
    ],
    accentColor: '#0F766E',
  },
  {
    id: 'control',
    code: '15',
    title: 'Control and Coordination',
    shortLabel: '15. Control',
    status: 'active',
    summary:
      'Nervous & endocrine communication, sensory/relay/motor neurones, taste chemoreceptors, resting and action potentials, cholinergic synapses, striated muscle sliding filament model, Venus flytrap closure, and auxin/gibberellin regulation.',
    subtopics: [
      '15.1 Neurone types & parts (sensory, relay, motor) + taste chemoreceptors',
      '15.1 Resting/action potentials, refractory period & saltatory conduction',
      '15.1 Cholinergic synapses & striated muscle sliding filament model',
      '15.2 Venus flytrap electrical closure, auxin acid growth & gibberellin (DELLA)',
    ],
    accentColor: '#7C3AED',
  },
  {
    id: 'inheritance',
    code: '16',
    title: 'Inheritance',
    shortLabel: '16. Inheritance',
    status: 'planned',
    summary:
      'Meiosis, crossing over, chi-squared genetic ratios, epistasis, autosomal linkage, lac operon gene control, and transcription factors.',
    subtopics: [
      '16.1 Passage of information from parents to offspring',
      '16.2 Roles of genes in determining phenotype & chi-squared',
      '16.3 Gene control in prokaryotes (lac operon) & eukaryotes',
    ],
    accentColor: '#B45309',
  },
  {
    id: 'selection',
    code: '17',
    title: 'Selection and Evolution',
    shortLabel: '17. Evolution',
    status: 'planned',
    summary:
      'Continuous vs discontinuous variation, t-test, natural & artificial selection, Hardy-Weinberg equilibrium, and allopatric/sympatric speciation.',
    subtopics: [
      '17.1 Variation & genetic drift',
      '17.2 Natural selection & Hardy-Weinberg equations',
      '17.3 Speciation & isolating mechanisms',
    ],
    accentColor: '#4338CA',
  },
  {
    id: 'biodiversity',
    code: '18',
    title: 'Classification, Biodiversity & Conservation',
    shortLabel: '18. Biodiversity',
    status: 'planned',
    summary:
      'Three-domain classification, Simpson’s Index of Diversity, Spearman’s rank & Pearson correlation, endangered species conservation, and alien species.',
    subtopics: [
      '18.1 Classification & taxonomic hierarchy',
      '18.2 Biodiversity indices & sampling methods',
      '18.3 Conservation (in situ / ex situ, CITES, IUCN)',
    ],
    accentColor: '#15803D',
  },
  {
    id: 'genetic-tech',
    code: '19',
    title: 'Genetic Technology',
    shortLabel: '19. Genetic Tech',
    status: 'planned',
    summary:
      'Recombinant DNA, PCR, gel electrophoresis, microarrays, bioinformatics, CRISPR/gene therapy, and ethical considerations in GM crops.',
    subtopics: [
      '19.1 Principles of genetic technology & PCR',
      '19.2 Genetic technology applied to medicine & microarrays',
      '19.3 Genetically modified organisms in agriculture',
    ],
    accentColor: '#0369A1',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // TOPIC 12: RESPIRATION
  {
    id: 'resp-1',
    topicId: 'respiration',
    syllabusRef: '12.2.1 Glycolysis',
    difficulty: 'Core Recall',
    prompt:
      'During glycolysis, why are two molecules of ATP hydrolysed per glucose molecule before any ATP is synthesised?',
    options: [
      'To reduce NAD to NADH in the cytoplasm before pyruvate enters the mitochondrion',
      'To phosphorylate glucose to hexose bisphosphate, raising its energy level and destabilising the ring so it splits into two triose phosphate molecules',
      'To actively transport glucose across the inner mitochondrial membrane via carrier proteins',
      'To directly convert triose phosphate into acetyl CoA in the mitochondrial matrix',
    ],
    correctIndex: 1,
    hint: 'Think about activation energy: glucose is chemically stable until phosphate groups are added.',
    markSchemeExplanation:
      'Phosphorylation adds two phosphate groups from 2 ATP to form fructose-1,6-bisphosphate (hexose bisphosphate). This lowers activation energy and makes the 6C sugar unstable enough to split into two 3C triose phosphate molecules, which then yield 4 ATP (net +2 ATP) by substrate-level phosphorylation.',
    keyTerms: ['Phosphorylation', 'Hexose bisphosphate', 'Triose phosphate', 'Substrate-level phosphorylation'],
  },
  {
    id: 'resp-2',
    topicId: 'respiration',
    syllabusRef: '12.2.4 Link Reaction & Krebs Cycle',
    difficulty: 'Core Recall',
    prompt:
      'For every single molecule of glucose that completes aerobic respiration through the Link Reaction and Krebs Cycle, how many molecules of CO2, reduced NAD, and reduced FAD are generated inside the mitochondrial matrix (excluding glycolysis)?',
    options: [
      '2 CO2, 4 reduced NAD, 1 reduced FAD',
      '4 CO2, 6 reduced NAD, 2 reduced FAD',
      '6 CO2, 8 reduced NAD, 2 reduced FAD',
      '6 CO2, 10 reduced NAD, 2 reduced FAD',
    ],
    correctIndex: 2,
    hint: 'One glucose yields TWO pyruvate molecules, so the Link Reaction and Krebs Cycle each run twice.',
    markSchemeExplanation:
      'Per pyruvate: Link reaction gives 1 CO2 and 1 reduced NAD; Krebs cycle gives 2 CO2, 3 reduced NAD, 1 reduced FAD, and 1 ATP. Doubling for two pyruvates per glucose gives 6 CO2, 8 reduced NAD, and 2 reduced FAD inside the matrix (plus 2 reduced NAD from glycolysis in the cytoplasm).',
    keyTerms: ['Decarboxylation', 'Dehydrogenation', 'Matrix', '2 turns per glucose'],
  },
  {
    id: 'resp-3',
    topicId: 'respiration',
    syllabusRef: '12.2.6 Oxidative Phosphorylation',
    difficulty: 'Application & Data',
    prompt:
      'Cyanide is a metabolic poison that irreversibly inhibits cytochrome c oxidase (Complex IV) in the inner mitochondrial membrane. What is the immediate consequence inside the mitochondrion?',
    options: [
      'Protons continue to be pumped at Complexes I–III at a normal rate, raising intermembrane pH',
      'NADH and FADH2 continue to be oxidised rapidly, increasing ATP synthesis via substrate-level phosphorylation',
      'Electron flow along the ETC halts, reduced NAD/FAD cannot be re-oxidised, proton pumping stops, and ATP synthase ceases ATP production',
      'Oxygen uptake increases dramatically as oxygen binds directly to Complex I instead',
    ],
    correctIndex: 2,
    hint: 'If the terminal enzyme cannot pass electrons to oxygen, every upstream electron carrier becomes stuck in its reduced state.',
    markSchemeExplanation:
      'Blocking Complex IV prevents oxygen acting as the final electron acceptor. Electrons back up along the ETC, so NADH and FADH2 cannot donate electrons/protons. Without electron transport, proton pumping across the cristae stops, the electrochemical proton gradient collapses, and oxidative phosphorylation halts—also starving the Krebs cycle of oxidised NAD+ and FAD.',
    keyTerms: ['Final electron acceptor', 'Cytochrome oxidase', 'Proton gradient', 'Chemiosmosis'],
  },
  {
    id: 'resp-4',
    topicId: 'respiration',
    syllabusRef: '12.2.6 Uncouplers (DNP)',
    difficulty: 'Application & Data',
    prompt:
      '2,4-Dinitrophenol (DNP) makes the inner mitochondrial membrane permeable to protons (H+). When DNP is added to actively respiring cells, oxygen consumption increases while ATP synthesis drops sharply. Why?',
    options: [
      'DNP blocks pyruvate transport into the matrix, forcing cells into ethanol fermentation',
      'Protons leak back into the matrix bypassing ATP synthase; energy from the ETC is released as heat, so electron transport and O2 reduction speed up without ATP yield',
      'DNP destroys haemoglobin, preventing oxygen delivery to Complex IV',
      'DNP directly inhibits hexokinase in glycolysis so no triose phosphate is made',
    ],
    correctIndex: 1,
    hint: 'Think about what happens to the proton motive force when H+ can cross the phospholipid bilayer freely instead of passing through ATP synthase.',
    markSchemeExplanation:
      'DNP acts as a protonophore (uncoupler). Protons flow back into the matrix down their concentration gradient without passing through the stalked particles (ATP synthase), dissipating energy as thermal heat. Because the proton gradient no longer resists proton pumping, the ETC runs even faster, consuming more O2 and NADH while producing almost no oxidative ATP.',
    keyTerms: ['Inner mitochondrial membrane', 'ATP synthase', 'Electrochemical gradient', 'Dissipated as heat'],
  },
  {
    id: 'resp-5',
    topicId: 'respiration',
    syllabusRef: '12.2.8 Anaerobic Respiration',
    difficulty: 'Core Recall',
    prompt:
      'Why is the conversion of pyruvate to lactate (in mammalian muscle) or ethanol (in yeast) essential for anaerobic respiration to continue?',
    options: [
      'It generates an extra 4 ATP molecules directly inside the cytoplasm',
      'It oxidises reduced NAD back to NAD+ so glycolysis can continue producing a net 2 ATP per glucose',
      'It transports oxygen across the cell surface membrane by facilitated diffusion',
      'It converts toxic acetyl CoA into harmless glycogen stores',
    ],
    correctIndex: 1,
    hint: 'Glycolysis requires a continuous supply of oxidised NAD+ to oxidise triose phosphate.',
    markSchemeExplanation:
      'In the absence of oxygen, the ETC cannot re-oxidise NADH. Reducing pyruvate (via pyruvate → lactate using lactate dehydrogenase, or pyruvate → ethanal + CO2 → ethanol using alcohol dehydrogenase) regenerates NAD+ from NADH, allowing triose phosphate oxidation and net 2 ATP synthesis in glycolysis to continue.',
    keyTerms: ['Regenerate NAD+', 'Lactate dehydrogenase', 'Alcohol dehydrogenase', 'Glycolysis'],
  },
  {
    id: 'resp-6',
    topicId: 'respiration',
    syllabusRef: '12.2.9 Rice Adaptations',
    difficulty: 'Application & Data',
    prompt:
      'Submerged rice plants (Oryza sativa) tolerate waterlogged, anoxic soils far better than wheat. Which combination of adaptations explains their survival?',
    options: [
      'Thick waxy root cuticles that block all gas entry and high rates of cyclic photophosphorylation in root cells',
      'Aerenchyma tissue conducting O2 from aerial shoots to roots, rapid stem elongation via ethene/gibberellin, and high alcohol dehydrogenase tolerance in roots',
      'Stomata permanently closed during daylight and conversion of lactate to sucrose inside root xylem',
      'Replacement of mitochondrial cristae with chloroplasts inside root cortex cells',
    ],
    correctIndex: 1,
    hint: 'Consider both how rice gets O2 down to submerged roots and how root cells survive temporary ethanol production.',
    markSchemeExplanation:
      'Rice develops hollow aerenchyma air spaces linking shoots to submerged roots for oxygen diffusion, grows fast upward to keep leaves above rising water, and expresses high levels of alcohol dehydrogenase (plus ethanol tolerance) when roots briefly respire anaerobically.',
    keyTerms: ['Aerenchyma', 'Ethanol tolerance', 'Alcohol dehydrogenase', 'Anoxic soil'],
  },
  {
    id: 'resp-7',
    topicId: 'respiration',
    syllabusRef: '12.2.10 Respiratory Quotient (RQ)',
    difficulty: 'Application & Data',
    contextNote: 'Balanced oxidation of oleic acid: C18H34O2 + 25.5 O2 → 18 CO2 + 17 H2O',
    prompt:
      'Using the balanced equation for oleic acid above, calculate its Respiratory Quotient (RQ) to two decimal places and explain why lipids have lower RQ values than carbohydrates.',
    options: [
      'RQ = 1.42; lipids contain more oxygen atoms per carbon than glucose',
      'RQ = 0.71; lipids have a much higher proportion of C–H bonds (hydrogen atoms), requiring far more O2 to form water relative to CO2 released',
      'RQ = 0.90; lipids are deaminated before entering the Krebs cycle',
      'RQ = 0.50; lipids cannot undergo glycolysis and bypass oxidative phosphorylation',
    ],
    correctIndex: 1,
    hint: 'RQ = moles of CO2 produced / moles of O2 consumed = 18 / 25.5.',
    markSchemeExplanation:
      'RQ = 18 / 25.5 = 0.706 ≈ 0.71. Fatty acids contain many C–H bonds and very little oxygen compared with carbohydrates (C6H12O6, RQ = 1.0). Oxidising all those hydrogen atoms via the ETC requires more O2 per carbon oxidised, giving ~2× more ATP per gram than carbohydrates.',
    keyTerms: ['RQ = CO2 / O2', '0.71', 'High C–H proportion', 'Energy density'],
  },
  {
    id: 'resp-8',
    topicId: 'respiration',
    syllabusRef: '12.2.11 Respirometer Practical',
    difficulty: 'Application & Data',
    prompt:
      'In a simple respirometer containing germinating seeds and potassium hydroxide (KOH) solution, the coloured manometer fluid moves 18 mm toward the seed tube over 10 minutes. What does this movement directly measure?',
    options: [
      'The volume of CO2 released by the seeds during anaerobic respiration',
      'The volume of O2 absorbed by the seeds, because KOH absorbs all CO2 produced',
      'The net difference between photosynthesis and respiration in the seeds',
      'The mass of water transpired from the seed coats into the manometer',
    ],
    correctIndex: 1,
    hint: 'KOH (or soda lime) reacts with and removes CO2 gas from the sealed tube.',
    markSchemeExplanation:
      'Because KOH absorbs any CO2 released by the seeds, the only gas change causing a pressure drop in the experimental tube is O2 uptake. Moving the meniscus toward the seeds therefore measures the rate of oxygen consumption. To measure RQ, a second run without KOH is compared.',
    keyTerms: ['Potassium hydroxide (KOH)', 'CO2 absorber', 'Oxygen uptake', 'Pressure drop'],
  },
  {
    id: 'resp-9',
    topicId: 'respiration',
    syllabusRef: '12.2.2 Mitochondrion Structure',
    difficulty: 'Core Recall',
    prompt:
      'Which structural feature of a mitochondrion directly enables a steep proton gradient to be maintained during oxidative phosphorylation?',
    options: [
      'Large pores in the inner membrane allowing free diffusion of H+ ions into the intermembrane space',
      'The narrow intermembrane space and an inner membrane (folded into cristae) that is impermeable to H+ ions except through ATP synthase',
      'Circular mitochondrial DNA encoding all glycolytic enzymes in the cytoplasm',
      '70S ribosomes embedded in the outer mitochondrial membrane',
    ],
    correctIndex: 1,
    hint: 'If protons could leak back freely, could a proton motive force build up? And why does volume matter?',
    markSchemeExplanation:
      'Cristae vastly increase the surface area for ETC complexes and ATP synthase. The small volume of the intermembrane space means pumping relatively few H+ ions quickly creates a steep pH/electrochemical gradient, while the phospholipid bilayer of the inner membrane is impermeable to H+ except through ATP synthase channels.',
    keyTerms: ['Cristae', 'Intermembrane space', 'Impermeable to H+', 'Surface area'],
  },
  {
    id: 'resp-10',
    topicId: 'respiration',
    syllabusRef: '12.2.10 RQ > 1 Interpretation',
    difficulty: 'Application & Data',
    prompt:
      'A respirometer experiment on soaked pea seeds at 25 °C yields an RQ of 1.35. Which physiological conclusion is most accurate?',
    options: [
      'The seeds are respiring pure triglyceride lipid reserves aerobically',
      'The seeds are performing both aerobic respiration and anaerobic respiration (ethanol fermentation), releasing extra CO2 without corresponding O2 uptake',
      'The seeds are photosynthesising faster than they are respiring',
      'The KOH solution has become saturated and is releasing O2 gas',
    ],
    correctIndex: 1,
    hint: 'In anaerobic yeast/plant fermentation, CO2 is still produced (pyruvate → ethanal + CO2) even though O2 uptake is zero.',
    markSchemeExplanation:
      'For aerobic carbohydrate respiration RQ = 1.0. When oxygen inside dense germinating seeds is insufficient, some cells switch to ethanol fermentation, producing CO2 without consuming O2. Total CO2 released exceeds O2 consumed, driving RQ above 1.0.',
    keyTerms: ['RQ > 1.0', 'Anaerobic + aerobic', 'Ethanol fermentation', 'Extra CO2'],
  },

  // TOPIC 13: PHOTOSYNTHESIS
  {
    id: 'photo-1',
    topicId: 'photosynthesis',
    syllabusRef: '13.1.2 Chloroplast Ultrastructure',
    difficulty: 'Core Recall',
    prompt:
      'Which pairing correctly matches a chloroplast compartment with the biochemical process taking place there?',
    options: [
      'Stroma — photolysis of water and cyclic photophosphorylation',
      'Thylakoid membranes — light-dependent reactions, photosystems I & II, and ATP synthase',
      'Thylakoid lumen — carbon fixation of CO2 with RuBP by Rubisco',
      'Outer chloroplast envelope — reduction of GP to TP using reduced NADP',
    ],
    correctIndex: 1,
    hint: 'Light-dependent electron carriers and chlorophylls are embedded in membranes; soluble Calvin cycle enzymes reside in the fluid matrix.',
    markSchemeExplanation:
      'Thylakoid membranes (grana) house Photosystems I & II, the electron transport chain, and ATP synthase for photophosphorylation. Protons accumulate inside the thylakoid lumen (space), while the stroma contains Rubisco and all Calvin cycle enzymes.',
    keyTerms: ['Thylakoid membrane', 'Grana', 'Stroma', 'Compartmentalisation'],
  },
  {
    id: 'photo-2',
    topicId: 'photosynthesis',
    syllabusRef: '13.1.3 Light-Dependent Stage',
    difficulty: 'Core Recall',
    prompt:
      'What is the exact role of water during non-cyclic photophosphorylation in Photosystem II?',
    options: [
      'It supplies oxygen atoms directly to RuBP during carbon fixation',
      'Photolysis splits water into protons (H+), electrons (e-) to replace those lost from P680 chlorophyll a, and O2 as a by-product',
      'It acts as the final electron acceptor at the end of Photosystem I',
      'It directly phosphorylates ADP to ATP inside the stroma',
    ],
    correctIndex: 1,
    hint: 'When light excites electrons out of PSII (P680), PSII becomes oxidised and needs replacement electrons.',
    markSchemeExplanation:
      'The oxygen-evolving complex associated with PSII catalyses photolysis: 2H2O → 4H+ + 4e- + O2. The electrons replace photoexcited electrons lost by P680; protons contribute to the thylakoid lumen gradient and reduce NADP; O2 diffuses out.',
    keyTerms: ['Photolysis', 'PSII (P680)', 'Replacement electrons', 'Proton pool'],
  },
  {
    id: 'photo-3',
    topicId: 'photosynthesis',
    syllabusRef: '13.1.4 Cyclic vs Non-Cyclic',
    difficulty: 'Application & Data',
    prompt:
      'How does cyclic photophosphorylation differ from non-cyclic photophosphorylation?',
    options: [
      'Cyclic involves only PSI (P700), produces ATP only, requires no photolysis of water, and generates neither reduced NADP nor O2',
      'Cyclic involves only PSII (P680) and produces reduced NADP without ATP',
      'Cyclic occurs in the stroma and fixes CO2 into triose phosphate directly',
      'Cyclic produces both O2 and ATP in equal molar ratios without electron carriers',
    ],
    correctIndex: 0,
    hint: 'The Calvin cycle consumes more ATP than reduced NADP (3 ATP : 2 NADPH per CO2), so chloroplasts need a top-up pathway.',
    markSchemeExplanation:
      'In cyclic photophosphorylation, photoexcited electrons from PSI pass through ferredoxin back into the cytochrome b6f complex, pumping H+ into the thylakoid lumen to generate extra ATP via chemiosmosis before returning to PSI. No water is split and no NADP is reduced.',
    keyTerms: ['PSI only', 'ATP only', 'No photolysis', 'No reduced NADP'],
  },
  {
    id: 'photo-4',
    topicId: 'photosynthesis',
    syllabusRef: '13.1.6 Calvin Cycle Perturbation',
    difficulty: 'Application & Data',
    prompt:
      'An illuminated algal suspension is supplied with ample CO2, and then the light is suddenly switched OFF. What happens immediately to the concentrations of GP (glycerate 3-phosphate) and RuBP in the stroma?',
    options: [
      'Both GP and RuBP increase rapidly because Rubisco accelerates in the dark',
      'GP rises initially while RuBP falls, because GP continues to form from CO2 + RuBP but cannot be reduced to TP or regenerate RuBP without ATP and reduced NADP',
      'GP falls immediately to zero while RuBP accumulates sharply',
      'Both GP and RuBP remain constant because the Calvin cycle is light-independent',
    ],
    correctIndex: 1,
    hint: 'Although the Calvin cycle has no direct light step, its reduction and regeneration steps depend on ATP and reduced NADP from the thylakoids.',
    markSchemeExplanation:
      'When light turns off, ATP and reduced NADP run out within seconds. GP cannot be reduced to TP, so GP accumulates temporarily; simultaneously, without TP to regenerate RuBP (which requires ATP), RuBP is consumed by ongoing carbon fixation until RuBP drops to a low level, which then halts further GP formation.',
    keyTerms: ['GP rises', 'RuBP falls', 'Lack of ATP & NADPH', 'Regeneration blocked'],
  },
  {
    id: 'photo-5',
    topicId: 'photosynthesis',
    syllabusRef: '13.1.6 Calvin Cycle CO2 Drop',
    difficulty: 'Application & Data',
    prompt:
      'If a photosynthesising plant stays in bright light but the CO2 supply is suddenly cut to zero, how do RuBP and GP levels change immediately?',
    options: [
      'RuBP rises and GP falls, because RuBP is still regenerated using light-stage ATP/NADPH while carbon fixation into GP stops',
      'RuBP falls and GP rises, because oxygen replaces CO2 on Rubisco to make extra GP',
      'Both RuBP and GP rise simultaneously',
      'Neither changes because light intensity is constant',
    ],
    correctIndex: 0,
    hint: 'If CO2 is missing, the input to Rubisco stops, while the rest of the cycle still has ATP and NADPH for a moment.',
    markSchemeExplanation:
      'Without CO2, RuBP cannot combine with CO2 to form GP, so GP concentration drops rapidly as existing GP is converted to TP. That TP continues regenerating RuBP using abundant ATP and reduced NADP from the illuminated thylakoids, causing RuBP concentration to accumulate.',
    keyTerms: ['RuBP accumulates', 'GP falls', 'Carbon fixation blocked', 'Rubisco'],
  },
  {
    id: 'photo-6',
    topicId: 'photosynthesis',
    syllabusRef: '13.1.7 Pigments & Chromatography',
    difficulty: 'Application & Data',
    contextNote: 'Solvent front moved 12.0 cm; yellow-orange band moved 11.4 cm; blue-green band moved 7.2 cm.',
    prompt:
      'Calculate the Rf value of the blue-green pigment and identify both pigments from their chromatographic behaviour.',
    options: [
      'Rf = 0.95 (chlorophyll a) and Rf = 0.60 (chlorophyll b)',
      'Rf = 0.60 (chlorophyll a, blue-green) and Rf = 0.95 (carotene, yellow-orange)',
      'Rf = 1.67 (chlorophyll a) and Rf = 1.05 (xanthophyll)',
      'Rf = 0.60 (carotene) and Rf = 0.95 (chlorophyll b)',
    ],
    correctIndex: 1,
    hint: 'Rf = distance travelled by pigment / distance travelled by solvent front. Remember carotene is non-polar and highly soluble in organic solvent.',
    markSchemeExplanation:
      'Blue-green pigment = chlorophyll a: Rf = 7.2 / 12.0 = 0.60. Yellow-orange pigment near the solvent front = beta-carotene: Rf = 11.4 / 12.0 = 0.95. Carotene has no polar side groups so it dissolves best in the non-polar mobile phase and travels farthest.',
    keyTerms: ['Rf = pigment / solvent front', 'Chlorophyll a (blue-green)', 'Carotene', 'Mobile phase solubility'],
  },
  {
    id: 'photo-7',
    topicId: 'photosynthesis',
    syllabusRef: '13.1.8 Absorption vs Action Spectrum',
    difficulty: 'Core Recall',
    prompt:
      'Why does the action spectrum of photosynthesis show high rates at ~450 nm and ~660 nm, and why is it broader around 480–500 nm than the absorption spectrum of chlorophyll a alone?',
    options: [
      'Green light at 550 nm is absorbed maximally by chlorophyll a and converted into heat',
      'Accessory pigments (chlorophyll b, xanthophyll, carotene) absorb wavelengths around 450–500 nm that chlorophyll a absorbs poorly and transfer excitation energy to the reaction centre',
      'Stomata only open under blue and red wavelengths',
      'RuBP absorbs 490 nm photons directly in the stroma',
    ],
    correctIndex: 1,
    hint: 'Think about the advantage of having multiple pigments arranged in a light-harvesting antenna complex.',
    markSchemeExplanation:
      'Chlorophyll a peaks around 430 nm and 662 nm. Accessory pigments (chlorophyll b, carotenoids) absorb additional blue-green wavelengths (~450–500 nm) and pass the harvested energy by resonance transfer to chlorophyll a at the P680/P700 reaction centres, widening the usable action spectrum.',
    keyTerms: ['Accessory pigments', 'Action spectrum', 'Absorption spectrum', 'Light-harvesting complex'],
  },
  {
    id: 'photo-8',
    topicId: 'photosynthesis',
    syllabusRef: '13.2 Limiting Factors',
    difficulty: 'Application & Data',
    prompt:
      'On a rate-of-photosynthesis vs light intensity graph, increasing temperature from 15 °C to 25 °C raises the plateau height ONLY when CO2 concentration is high (0.4%), not at low CO2 (0.04%). Why?',
    options: [
      'At 0.04% CO2, CO2 concentration is the limiting factor at high light intensity, so higher temperature cannot increase Calvin cycle throughput',
      'At 25 °C, chlorophyll molecules denature unless CO2 concentration exceeds 0.4%',
      'Light intensity becomes the limiting factor on the plateau',
      'Photosystem II stops working at 0.04% CO2 regardless of temperature',
    ],
    correctIndex: 0,
    hint: 'According to the Law of Limiting Factors, a process rate is limited by the factor closest to its minimum value.',
    markSchemeExplanation:
      'On the plateau, light intensity is no longer limiting. At 0.04% CO2, CO2 availability limits carbon fixation by Rubisco, so raising temperature (which increases kinetic energy and enzyme collision rate) cannot raise the rate until CO2 is also increased to 0.4%.',
    keyTerms: ['Law of limiting factors', 'Plateau phase', 'CO2 limiting', 'Enzyme kinetic energy'],
  },
  {
    id: 'photo-9',
    topicId: 'photosynthesis',
    syllabusRef: '13.2.3 Hill Reaction (DCPIP)',
    difficulty: 'Application & Data',
    prompt:
      'In a chloroplast isolation experiment, blue DCPIP dye is added to illuminated thylakoid suspensions and turns colourless. What does DCPIP replace in this assay?',
    options: [
      'CO2 in the Calvin cycle, turning colourless when carboxylated by Rubisco',
      'NADP, acting as an artificial electron/hydrogen acceptor reduced by electrons from the photosystems',
      'ATP synthase, hydrolysing ATP to release inorganic phosphate',
      'Chlorophyll b inside the light-harvesting complex',
    ],
    correctIndex: 1,
    hint: 'Oxidised DCPIP is blue; reduced DCPIP (DCPIPH2) is colourless.',
    markSchemeExplanation:
      'DCPIP is a redox indicator that intercepts electrons from the photosynthetic electron transport chain (replacing NADP). As photolysis and electron flow proceed in light, DCPIP is reduced to colourless DCPIPH2; the rate of colour loss (measured with a colorimeter) indicates the rate of the light-dependent stage.',
    keyTerms: ['DCPIP', 'Hill reaction', 'Artificial electron acceptor', 'Colorimeter'],
  },
  {
    id: 'photo-10',
    topicId: 'photosynthesis',
    syllabusRef: '13.1.5 Calvin Cycle Stoichiometry',
    difficulty: 'Application & Data',
    prompt:
      'How many turns of the Calvin cycle—and how many molecules of ATP and reduced NADP—are required to synthesise one net molecule of hexose sugar (glucose, C6H12O6) from CO2?',
    options: [
      '3 turns, consuming 9 ATP and 6 reduced NADP',
      '6 turns, consuming 18 ATP and 12 reduced NADP',
      '6 turns, consuming 12 ATP and 6 reduced NADP',
      '2 turns, consuming 6 ATP and 4 reduced NADP',
    ],
    correctIndex: 1,
    hint: 'Each turn fixes 1 CO2 (using 2 ATP + 2 NADPH for GP → TP reduction, plus 1 ATP for RuBP regeneration). A hexose has 6 carbons.',
    markSchemeExplanation:
      'Fixing 6 CO2 into 1 hexose (2 × TP exported) requires 6 turns of the Calvin cycle. Reducing 12 GP to 12 TP consumes 12 ATP and 12 reduced NADP; regenerating 6 RuBP from the remaining 10 TP consumes a further 6 ATP, giving a total of 18 ATP and 12 reduced NADP.',
    keyTerms: ['6 turns per hexose', '18 ATP', '12 reduced NADP', '5/6 TP regenerates RuBP'],
  },

  // TOPIC 15: CONTROL AND COORDINATION
  {
    id: 'ctrl-1',
    topicId: 'control',
    syllabusRef: '15.1.1 Nervous vs Endocrine Coordination',
    difficulty: 'Core Recall',
    prompt:
      'How do mammalian nervous coordination and endocrine (hormonal) coordination differ in signal transmission and target specificity?',
    options: [
      'Nervous signals travel as chemical messengers in blood plasma to all tissues; hormones travel along myelinated axons to one muscle fibre',
      'Nervous coordination uses rapid electrical impulses along neurones to specific effectors (short-lived response); endocrine coordination transports hormones in blood plasma to target cells possessing complementary receptors (longer-lasting response)',
      'Both systems rely exclusively on acetylcholine diffusing through tissue fluid',
      'Hormonal coordination only acts on exocrine glands and produces faster responses than reflex arcs',
    ],
    correctIndex: 1,
    hint: 'Compare the pathway (neurone axon vs blood plasma), speed, duration, and how target cells recognise a hormone.',
    markSchemeExplanation:
      'Nervous impulses travel rapidly as action potentials along neurones directly to specific effector cells, giving fast, localised, short-lived responses. Hormones are secreted by endocrine glands into blood plasma and only affect target cells carrying complementary receptor proteins (cell-surface or intracellular), producing slower, more widespread, longer-lasting effects.',
    keyTerms: ['Action potentials', 'Blood plasma', 'Target cell receptors', 'Speed vs duration'],
  },
  {
    id: 'ctrl-2',
    topicId: 'control',
    syllabusRef: '15.1.2 Sensory Receptors (Pacinian Corpuscle)',
    difficulty: 'Application & Data',
    prompt:
      'When firm pressure deforms the lamellae around the sensory neurone ending inside a Pacinian corpuscle, how is a receptor potential generated?',
    options: [
      'Voltage-gated Ca2+ channels open, releasing acetylcholine into the tissue fluid around the neurone',
      'Mechanical deformation stretches the neurone plasma membrane, opening stretch-mediated Na+ channels so Na+ ions diffuse inward and depolarise the membrane',
      'Na+/K+ pumps reverse direction to pump 3 K+ ions into the neurone per ATP hydrolysed',
      'Cl- ions rapidly diffuse out of the myelin sheath to hyperpolarise the axon',
    ],
    correctIndex: 1,
    hint: 'Sensory receptors act as biological transducers: mechanical pressure opens a specific type of gated ion channel.',
    markSchemeExplanation:
      'Pressure deforms the concentric lamellae and stretches the sensory neurone ending plasma membrane. Stretch-mediated Na+ channels widen, allowing Na+ influx down an electrochemical gradient to produce a graded depolarisation (receptor/generator potential). If it reaches threshold (~-55 mV), action potentials fire.',
    keyTerms: ['Transducer', 'Stretch-mediated Na+ channels', 'Receptor potential', 'Threshold'],
  },
  {
    id: 'ctrl-3',
    topicId: 'control',
    syllabusRef: '15.1.3 Resting & Action Potentials',
    difficulty: 'Core Recall',
    prompt:
      'During an action potential in a mammalian axon, what causes the membrane potential to return rapidly from +30 mV back down toward -70 mV (repolarisation)?',
    options: [
      'Voltage-gated Na+ channels close and voltage-gated K+ channels open, allowing rapid K+ efflux out of the axon',
      'Voltage-gated Na+ channels remain open while K+ ions are actively pumped inward by the Na+/K+ pump',
      'Negatively charged organic phosphate ions diffuse out through the phospholipid bilayer',
      'Calcium ions flood out of the axon via facilitated diffusion',
    ],
    correctIndex: 0,
    hint: 'Think about which cation is more concentrated INSIDE the resting axon and which voltage-gated channels open at +30 mV.',
    markSchemeExplanation:
      'At the peak (~+30 mV), voltage-gated Na+ channels inactivate/close, stopping Na+ influx. Simultaneously, voltage-gated K+ channels open, so K+ ions diffuse rapidly out of the axon down their electrochemical gradient, restoring a negative interior (repolarisation) and briefly overshooting to hyperpolarisation.',
    keyTerms: ['Voltage-gated Na+ close', 'Voltage-gated K+ open', 'K+ efflux', 'Repolarisation'],
  },
  {
    id: 'ctrl-4',
    topicId: 'control',
    syllabusRef: '15.1.4 Refractory Period & Saltatory Conduction',
    difficulty: 'Application & Data',
    prompt:
      'Why does a myelinated axon conduct action potentials much faster than an unmyelinated axon of the same diameter, and how does the brain distinguish a strong stimulus from a weak stimulus?',
    options: [
      'Myelin speeds up diffusion across synapses; stronger stimuli produce taller action potentials (+80 mV instead of +30 mV)',
      'Myelin acts as an electrical insulator so local circuits jump between nodes of Ranvier (saltatory conduction); stronger stimuli increase the FREQUENCY of action potentials, not their amplitude',
      'Schwann cells actively pump action potentials forward; stronger stimuli reverse the refractory period',
      'Action potentials travel continuously through the cytoplasm of Schwann cells without crossing membranes',
    ],
    correctIndex: 1,
    hint: 'Remember the all-or-nothing principle: action potential amplitude is constant (+30 to +40 mV).',
    markSchemeExplanation:
      'Lipid-rich myelin from Schwann cells insulates the axon so ion exchange only occurs at uncovered nodes of Ranvier; local currents jump from node to node (saltatory conduction). Because action potentials obey the all-or-nothing rule (constant amplitude), stimulus intensity is encoded by impulse frequency—limited only by the refractory period.',
    keyTerms: ['Saltatory conduction', 'Nodes of Ranvier', 'All-or-nothing', 'Impulse frequency'],
  },
  {
    id: 'ctrl-5',
    topicId: 'control',
    syllabusRef: '15.1.5 Cholinergic Synapses',
    difficulty: 'Application & Data',
    prompt:
      'An organophosphate insecticide irreversibly inhibits the enzyme acetylcholinesterase (AChE) inside cholinergic synaptic clefts. What is the immediate physiological consequence at the postsynaptic membrane?',
    options: [
      'Presynaptic vesicles cannot fuse with the membrane because Ca2+ channels remain blocked',
      'Acetylcholine is not hydrolysed, remains bound to postsynaptic receptor-linked Na+ channels, and causes continuous Na+ influx and repeated postsynaptic firing (tetanic spasm)',
      'Choline accumulates in the cleft and blocks Na+ entry into the postsynaptic neurone',
      'Impulse transmission reverses direction from the postsynaptic to the presynaptic neurone',
    ],
    correctIndex: 1,
    hint: 'Without AChE, what happens to ACh molecules already sitting on the postsynaptic receptor proteins?',
    markSchemeExplanation:
      'Normally, acetylcholinesterase rapidly hydrolyses ACh into choline and ethanoic acid (acetate) so Na+ channels close after one impulse. Inhibiting AChE leaves ACh bound to postsynaptic receptors, keeping Na+ channels open and triggering continuous depolarisation/muscle spasms.',
    keyTerms: ['Acetylcholinesterase (AChE)', 'Choline + ethanoic acid', 'Continuous depolarisation', 'Postsynaptic Na+ channels'],
  },
  {
    id: 'ctrl-6',
    topicId: 'control',
    syllabusRef: '15.1.6 Striated Muscle Sarcomere',
    difficulty: 'Core Recall',
    prompt:
      'During the contraction of a striated muscle sarcomere, how do the lengths of the A-band, I-band, H-zone, and distance between Z-lines change?',
    options: [
      'A-band shortens, I-band stays constant, H-zone widens',
      'A-band stays constant, while the I-band, H-zone, and distance between Z-lines all shorten',
      'Both A-band and I-band shorten equally as myosin filaments shrink',
      'H-zone widens because actin filaments are pushed outward away from the M-line',
    ],
    correctIndex: 1,
    hint: 'Neither actin nor myosin filaments actually shorten; they slide past one another. Which band equals the full length of myosin?',
    markSchemeExplanation:
      'Because actin filaments slide inward over myosin toward the M-line without changing filament length, the A-band (full length of thick myosin filaments) stays constant. The region of non-overlap (I-band) and the myosin-only gap (H-zone) both narrow/shorten, pulling adjacent Z-lines closer together.',
    keyTerms: ['A-band constant', 'I-band shortens', 'H-zone shortens', 'Z-lines closer'],
  },
  {
    id: 'ctrl-7',
    topicId: 'control',
    syllabusRef: '15.1.6 Sliding Filament & ATP Role',
    difficulty: 'Application & Data',
    prompt:
      'After death, ATP production stops and skeletal muscles enter rigor mortis (becoming stiff and locked in contraction). Which two ATP-dependent steps in the sliding filament mechanism explain why muscles cannot relax without ATP?',
    options: [
      'ATP is required to detach myosin heads from actin binding sites and to actively pump Ca2+ ions back into the sarcoplasmic reticulum',
      'ATP is required to hydrolyse acetylcholine in the neuromuscular cleft and to break peptide bonds in tropomyosin',
      'ATP is required only to form the initial cross-bridge power stroke; detachment is passive',
      'ATP is required for Na+ influx through T-tubules into the myofibril',
    ],
    correctIndex: 0,
    hint: 'Think about what happens to the myosin-actin cross-bridge at the end of a power stroke if no fresh ATP binds to the myosin head, and how Ca2+ returns to the SR.',
    markSchemeExplanation:
      'Fresh ATP must bind to the myosin head to break the actin-myosin cross-bridge (detachment) before myosin ATPase hydrolyses ATP to re-cock the head. Additionally, active transport pumps use ATP to return Ca2+ back into the sarcoplasmic reticulum so tropomyosin can re-cover actin binding sites. Without ATP, cross-bridges stay locked.',
    keyTerms: ['Myosin head detachment', 'Sarcoplasmic reticulum Ca2+ pump', 'Cross-bridges locked', 'Myosin ATPase'],
  },
  {
    id: 'ctrl-8',
    topicId: 'control',
    syllabusRef: '15.2.1 Venus Flytrap Closure',
    difficulty: 'Application & Data',
    prompt:
      'Why does a Venus flytrap (Dionaea muscipula) require two deflections of its sensory trigger hairs within about 20–30 seconds before snapping shut?',
    options: [
      'The first deflection synthesises auxin in the petiole, which takes 25 seconds to diffuse to the trap lobes',
      'One touch generates a sub-threshold depolarisation; a second deflection within ~20–30 s summates to reach threshold and fire an action potential across the lobe, preventing energy waste from false triggers like raindrops',
      'Two deflections are needed to open stomata on the lower epidermis so O2 can enter',
      'One touch triggers gibberellin release while the second touch closes xylem vessels',
    ],
    correctIndex: 1,
    hint: 'Consider how Ca2+ / receptor potentials build up over consecutive stimuli and why snapping shut on a single raindrop would be disadvantageous.',
    markSchemeExplanation:
      'Deflecting a sensory hair opens Ca2+ channels and causes a local depolarisation. A single touch (e.g. a raindrop or falling leaf) decays without firing; a second touch within ~20–30 s reaches threshold, propagating an action potential across the lobe that drives H+ wall acidification and rapid osmotic water uptake into outer cells, snapping the trap shut.',
    keyTerms: ['Sensory trigger hairs', 'Action potential', 'Two-touch threshold', 'Turgor change'],
  },
  {
    id: 'ctrl-9',
    topicId: 'control',
    syllabusRef: '15.2.2 Auxin & Acid Growth Hypothesis',
    difficulty: 'Core Recall',
    prompt:
      'According to the acid growth hypothesis, how does auxin (IAA) stimulate rapid cell elongation in plant shoots?',
    options: [
      'IAA stimulates proton pumps (H+-ATPase) to pump H+ into cell walls, lowering wall pH and activating expansins that break hydrogen bonds between cellulose microfibrils so turgor pressure stretches the cell',
      'IAA directly enters the nucleus to digest cellulose cell walls using amylase',
      'IAA closes aquaporins so water leaves the central vacuole, lengthening the cell wall',
      'IAA inhibits mitosis in the apical meristem while triggering gibberellin synthesis in roots',
    ],
    correctIndex: 0,
    hint: 'Focus on pH changes in the cell wall space, wall-loosening enzymes (expansins), and osmotic water uptake.',
    markSchemeExplanation:
      'IAA binds receptors and activates proton pumps in the cell surface membrane, pumping H+ ions into the cell wall. The acidic pH (~5) activates expansin proteins, which disrupt non-covalent hydrogen bonds linking cellulose microfibrils. As wall tension decreases, water enters osmotically and turgor pressure permanently elongates the cell.',
    keyTerms: ['IAA', 'Proton pumps (H+-ATPase)', 'Expansins', 'Cellulose microfibrils'],
  },
  {
    id: 'ctrl-10',
    topicId: 'control',
    syllabusRef: '15.2.2 Gibberellin & DELLA Proteins',
    difficulty: 'Application & Data',
    prompt:
      'In germinating barley seeds, how does gibberellin (GA) trigger the breakdown of starch stored in the endosperm?',
    options: [
      'Gibberellin diffuses directly into starch grains and acts as an enzyme hydrolysing alpha-1,4 glycosidic bonds',
      'The embryo synthesises gibberellin, which diffuses to the aleurone layer and causes breakdown of DELLA repressor proteins, allowing transcription factors to activate amylase gene transcription',
      'The aleurone layer secretes gibberellin into the soil to attract water into the testa',
      'Gibberellin stimulates ABA synthesis, which inhibits mitosis and converts maltose into cellulose',
    ],
    correctIndex: 1,
    hint: 'Remember the role of the embryo, the aleurone layer, DELLA repressor proteins, and the hydrolytic enzyme amylase.',
    markSchemeExplanation:
      'After water imbibition, the embryo synthesises gibberellin, which diffuses to the surrounding aleurone layer. Inside aleurone cells, gibberellin binds its receptor and triggers destruction of DELLA repressor proteins, freeing transcription factors to transcribe mRNA for amylase. Secreted amylase hydrolyses endosperm starch into maltose for embryo respiration and growth.',
    keyTerms: ['Aleurone layer', 'DELLA proteins', 'Amylase transcription', 'Endosperm starch'],
  },
  {
    id: 'ctrl-11',
    topicId: 'control',
    syllabusRef: '15.1.1 Types & Structure of Neurones',
    difficulty: 'Core Recall',
    prompt:
      'Which combination correctly describes the structure and location of a mammalian sensory neurone compared with a motor neurone?',
    options: [
      'Sensory neurone has its cell body inside CNS grey matter and many short dendrites; motor neurone has its cell body in a dorsal root ganglion',
      'Sensory neurone has a cell body in a ganglion outside the CNS with a long dendron carrying impulses toward the cell body and a shorter axon entering the CNS; motor neurone has its cell body inside CNS grey matter with a long myelinated axon to an effector',
      'Both sensory and motor neurones are unmyelinated and confined completely inside the spinal cord',
      'Relay neurones carry impulses from effectors back to sensory receptors via long myelinated dendrons',
    ],
    correctIndex: 1,
    hint: 'Think of the reflex arc anatomy: where is the sensory neurone soma located versus the motor neurone soma, and what is the long peripheral fibre of a sensory neurone called?',
    markSchemeExplanation:
      'A sensory neurone has a single long dendron carrying impulses from the receptor to a cell body positioned in a dorsal root ganglion just outside the CNS, plus a shorter axon entering the CNS. A motor neurone has its cell body (with many short dendrites) inside CNS grey matter and a long myelinated axon extending to the effector.',
    keyTerms: ['Sensory dendron', 'Dorsal root ganglion', 'Motor cell body in CNS', 'Relay neurone'],
  },
  {
    id: 'ctrl-12',
    topicId: 'control',
    syllabusRef: '15.1.2 Chemoreceptors for Taste (Tongue)',
    difficulty: 'Application & Data',
    prompt:
      'In human tongue taste buds, what is the correct sequence by which dissolved sodium ions (Na+, salt taste) trigger nerve impulses to the brain?',
    options: [
      'Na+ ions bind haemoglobin inside taste papillae, directly opening voltage-gated K+ channels in the brain',
      'Na+ ions diffuse through the taste pore into chemoreceptor microvilli via apical Na+ channels → depolarise the receptor cell (receptor potential) → open basal voltage-gated Ca2+ channels → neurotransmitter exocytosis → action potentials in sensory neurone',
      'Na+ ions are actively pumped out of microvilli by the Na+/K+ pump to hyperpolarise the sensory neurone',
      'Chemoreceptor cells secrete acetylcholinesterase into saliva to digest NaCl before swallowing',
    ],
    correctIndex: 1,
    hint: 'Trace the signal from saliva → microvilli Na+ channels → receptor potential → Ca2+ at the basal synapse → sensory neurone.',
    markSchemeExplanation:
      'Dissolved Na+ enters chemoreceptor microvilli down an electrochemical gradient through apical Na+ channels, causing depolarisation (a graded receptor potential). If threshold is reached, voltage-gated Ca2+ channels open at the basal membrane, triggering neurotransmitter release by exocytosis onto the sensory neurone, which fires action potentials if depolarised to threshold.',
    keyTerms: ['Chemoreceptor microvilli', 'Apical Na+ channels', 'Receptor potential', 'Ca2+ exocytosis'],
  },
  {
    id: 'ctrl-13',
    topicId: 'control',
    syllabusRef: '15.1.2 Transduction & Stimulus Strength',
    difficulty: 'Application & Data',
    prompt:
      'A volunteer tastes two NaCl solutions: Solution X (0.05 mol dm⁻³) and Solution Y (0.50 mol dm⁻³). How does the chemoreceptor-sensory neurone system signal the stronger salt taste of Solution Y?',
    options: [
      'Solution Y produces a larger graded receptor potential in the chemoreceptor cell, releasing more neurotransmitter and triggering a higher FREQUENCY of action potentials in the sensory neurone',
      'Solution Y makes each action potential in the sensory neurone reach +120 mV instead of +35 mV',
      'Solution Y switches conduction in the sensory neurone from saltatory to continuous',
      'Solution Y causes the sensory neurone to conduct impulses backward toward the taste pore',
    ],
    correctIndex: 0,
    hint: 'Distinguish between the graded receptor potential in the receptor cell and the all-or-nothing action potentials in the sensory neurone.',
    markSchemeExplanation:
      'Higher [Na+] causes greater Na+ influx and a larger graded receptor potential in the chemoreceptor cell, opening more voltage-gated Ca2+ channels and releasing more neurotransmitter. Because sensory neurone action potentials obey the all-or-nothing law (fixed amplitude), stronger taste is encoded by a higher frequency of action potentials.',
    keyTerms: ['Graded receptor potential', 'All-or-nothing', 'Action potential frequency', 'Transducer'],
  },

  // TOPIC 14: HOMEOSTASIS
  {
    id: 'homeo-1',
    topicId: 'homeostasis',
    syllabusRef: '14.1.1 Deamination & Urea Formation',
    difficulty: 'Core Recall',
    prompt:
      'Why must excess amino acids undergo deamination in mammalian liver hepatocytes before their nitrogen can be excreted by the kidneys?',
    options: [
      'Excess amino acids are stored directly inside Bowman’s capsule until urine forms',
      'Deamination removes the amino (-NH2) group as toxic ammonia, which is converted with CO2 via the urea cycle into soluble, less toxic urea CO(NH2)2, while the remaining keto acid is respired',
      'Deamination converts urea into glucose using amylase inside the proximal convoluted tubule',
      'Amino acids cannot pass through the glomerular basement membrane unless converted into haemoglobin',
    ],
    correctIndex: 1,
    hint: 'Ammonia (NH3) is highly soluble and toxic, so mammals convert it to a safer nitrogenous compound in the liver.',
    markSchemeExplanation:
      'Mammals cannot store excess amino acids. Hepatocytes remove the -NH2 group (deamination) forming ammonia, which rapidly combines with CO2 in the ornithine/urea cycle to form less toxic, soluble urea for safe blood transport to the kidneys. The remaining carbon skeleton (keto acid) enters respiration or gluconeogenesis.',
    keyTerms: ['Deamination', 'Hepatocytes', 'Urea CO(NH2)2', 'Keto acid'],
  },
  {
    id: 'homeo-2',
    topicId: 'homeostasis',
    syllabusRef: '14.1.2 Glomerular Ultrafiltration',
    difficulty: 'Core Recall',
    prompt:
      'Which combination explains how high hydrostatic pressure is generated in the glomerulus and which structure acts as the main molecular sieve preventing plasma proteins entering Bowman’s capsule?',
    options: [
      'Efferent arteriole is wider than afferent arteriole; podocyte cell nuclei block proteins',
      'Afferent arteriole is wider than efferent arteriole, raising glomerular hydrostatic pressure; the basement membrane acts as the main molecular filter blocking large plasma proteins (> ~69 kDa)',
      'Active transport pumps glucose and proteins into the capsule against pressure',
      'Loop of Henle contractions push plasma proteins backward into the renal vein',
    ],
    correctIndex: 1,
    hint: 'Compare the lumen diameter of the arteriole entering the glomerulus vs leaving it, and recall the 3 filtration layers.',
    markSchemeExplanation:
      'Because the afferent arteriole has a wider diameter than the efferent arteriole, blood enters faster than it leaves, building high hydrostatic pressure. Fluid and small solutes pass through capillary fenestrations, across the acellular collagen/glycoprotein basement membrane (which blocks large plasma proteins), and through filtration slits between podocyte pedicels.',
    keyTerms: ['Afferent vs efferent arteriole', 'Hydrostatic pressure', 'Basement membrane', 'Podocytes'],
  },
  {
    id: 'homeo-3',
    topicId: 'homeostasis',
    syllabusRef: '14.1.2 Selective Reabsorption in PCT',
    difficulty: 'Application & Data',
    prompt:
      'How are all glucose molecules reabsorbed back into blood along the proximal convoluted tubule (PCT)?',
    options: [
      'By simple diffusion straight through the phospholipid bilayer of PCT cells',
      'Na+/K+ pumps actively pump Na+ out of the basal PCT membrane into blood, maintaining a steep Na+ gradient that drives Na+-glucose co-transport across the luminal microvilli (secondary active transport)',
      'By endocytosis of glucose droplets into the loop of Henle',
      'Glucose is converted into glycogen inside the PCT lumen before diffusing into the glomerulus',
    ],
    correctIndex: 1,
    hint: 'Think about why PCT epithelial cells contain numerous mitochondria and luminal microvilli.',
    markSchemeExplanation:
      'ATP from abundant mitochondria drives Na+/K+ pumps on the basal membrane, lowering intracellular [Na+]. Na+ then diffuses down its gradient into the PCT cell through luminal co-transporter proteins, bringing glucose with it against glucose’s concentration gradient; glucose exits the basal membrane into capillaries via facilitated diffusion.',
    keyTerms: ['Na+/K+ pump', 'Co-transport', 'Microvilli', 'Mitochondria'],
  },
  {
    id: 'homeo-4',
    topicId: 'homeostasis',
    syllabusRef: '14.1.2 Loop of Henle',
    difficulty: 'Application & Data',
    prompt:
      'What is the primary physiological role of the ascending limb of the loop of Henle in producing concentrated urine?',
    options: [
      'It actively pumps Na+ and Cl- ions out into the surrounding medulla tissue fluid while remaining impermeable to water, lowering the medulla water potential (Ψ)',
      'It secretes ADH directly into Bowman’s capsule',
      'It is highly permeable to water, allowing water to flood into the tubule from the cortex',
      'It reabsorbs 100% of urea by active transport into the descending limb',
    ],
    correctIndex: 0,
    hint: 'Consider how the medulla tissue fluid becomes hypertonic (very negative water potential) so water can later leave the collecting duct.',
    markSchemeExplanation:
      'Cells of the thick ascending limb actively pump Na+ and Cl- ions out into the medullary interstitial fluid and are impermeable to water. This creates a steep water potential gradient (very negative Ψ) deep in the medulla, drawing water out of the descending limb and, when ADH is present, out of the collecting duct.',
    keyTerms: ['Ascending limb', 'Active Na+/Cl- transport', 'Impermeable to water', 'Medullary Ψ gradient'],
  },
  {
    id: 'homeo-5',
    topicId: 'homeostasis',
    syllabusRef: '14.1.2 ADH & Osmoregulation',
    difficulty: 'Application & Data',
    prompt:
      'Following heavy sweating without drinking water, blood water potential (Ψ) falls. What sequence of events restores blood water potential by negative feedback?',
    options: [
      'Osmoreceptors in the hypothalamus swell → anterior pituitary stops releasing ADH → aquaporins are removed from the collecting duct',
      'Osmoreceptors in the hypothalamus shrink → posterior pituitary secretes more ADH → collecting duct cells insert aquaporin vesicles into their luminal membrane → more water is reabsorbed by osmosis into the medulla',
      'Pancreas α-cells secrete ADH → loop of Henle pumps glucose into urine',
      'Podocytes close filtration slits completely so no glomerular filtrate is produced',
    ],
    correctIndex: 1,
    hint: 'Trace the signal from hypothalamus osmoreceptors → posterior pituitary → collecting duct aquaporin channels.',
    markSchemeExplanation:
      'Low blood Ψ causes water to leave hypothalamic osmoreceptor neurones by osmosis, so they shrink and trigger impulses to the posterior pituitary to release ADH. ADH binds collecting duct cell-surface receptors (via cAMP), causing aquaporin vesicles to fuse with the apical membrane, increasing water reabsorption by osmosis into the hypertonic medulla.',
    keyTerms: ['Hypothalamus osmoreceptors', 'Posterior pituitary', 'ADH', 'Aquaporins'],
  },
  {
    id: 'homeo-6',
    topicId: 'homeostasis',
    syllabusRef: '14.1.3 Insulin & Blood Glucose Control',
    difficulty: 'Core Recall',
    prompt:
      'After a carbohydrate-rich meal, how does insulin secreted by pancreatic β-cells lower blood glucose concentration?',
    options: [
      'Insulin binds α-cells to stimulate glycogenolysis in the pancreas',
      'Insulin binds receptors on liver and muscle cells, increasing GLUT4 glucose transporters in muscle membranes, increasing glucose respiration, and stimulating glycogenesis (glucose → glycogen)',
      'Insulin inhibits hexokinase in all cells so glucose stays in blood plasma',
      'Insulin stimulates active excretion of glucose into the collecting duct',
    ],
    correctIndex: 1,
    hint: 'Remember both membrane transport (GLUT4) and intracellular conversion (glycogenesis).',
    markSchemeExplanation:
      'High blood glucose stimulates β-cells in the islets of Langerhans to secrete insulin. Binding to liver, muscle, and adipose receptors causes GLUT4 transporter vesicles to fuse with muscle/adipose membranes (increasing uptake) and activates glycogen synthase to convert glucose to insoluble glycogen (glycogenesis).',
    keyTerms: ['β-cells', 'Insulin', 'GLUT4', 'Glycogenesis'],
  },
  {
    id: 'homeo-7',
    topicId: 'homeostasis',
    syllabusRef: '14.1.3 Glucagon & cAMP Signalling Cascade',
    difficulty: 'Application & Data',
    prompt:
      'Why does a tiny concentration of glucagon (or adrenaline) binding to hepatocyte receptors trigger a massive, rapid release of glucose from liver glycogen?',
    options: [
      'Glucagon crosses the nuclear envelope and directly hydrolyses glycogen molecules itself',
      'Receptor binding activates a G-protein and adenylyl cyclase to produce cyclic AMP (cAMP), initiating a multi-step enzyme kinase cascade where each step amplifies the number of activated molecules (glycogen phosphorylase)',
      'cAMP converts urea directly into glucose inside mitochondria',
      'Glucagon opens voltage-gated Ca2+ channels on the pancreas to pump glycogen into blood',
    ],
    correctIndex: 1,
    hint: 'Think about second messengers (cAMP) and signal amplification through an enzyme cascade.',
    markSchemeExplanation:
      'Glucagon binds its cell-surface receptor, activating a G-protein which activates adenylyl cyclase to convert ATP into many cAMP molecules. Each cAMP activates protein kinase A, triggering an enzyme cascade that activates thousands of glycogen phosphorylase enzymes—magnifying the signal to rapidly hydrolyse glycogen into glucose.',
    keyTerms: ['Adenylyl cyclase', 'Cyclic AMP (cAMP)', 'Enzyme cascade amplification', 'Glycogenolysis'],
  },
  {
    id: 'homeo-8',
    topicId: 'homeostasis',
    syllabusRef: '14.1.3 Glucose Biosensors & Dipsticks',
    difficulty: 'Core Recall',
    prompt:
      'In both blood glucose biosensors and urine glucose test strips (dipsticks), why is the immobilised enzyme glucose oxidase used instead of Benedict’s reagent?',
    options: [
      'Glucose oxidase reacts specifically with glucose (not other reducing sugars like lactose or fructose) and works rapidly at room temperature to yield an electrical signal or peroxidase colour change',
      'Glucose oxidase requires boiling in a water bath for 5 minutes to form a brick-red precipitate',
      'Glucose oxidase measures insulin concentration directly in urine',
      'Benedict’s reagent only detects sucrose and starch in blood plasma',
    ],
    correctIndex: 0,
    hint: 'Consider enzyme specificity toward β-D-glucose vs non-specific reducing-sugar reactions.',
    markSchemeExplanation:
      'Glucose oxidase has an active site complementary only to glucose, oxidising it to gluconic acid + H2O2. In a biosensor, current proportional to [glucose] gives a precise quantitative readout; in a dipstick, peroxidase + H2O2 oxidises a chromogen dye semi-quantitatively.',
    keyTerms: ['Glucose oxidase', 'Enzyme specificity', 'Biosensor current', 'Peroxidase'],
  },
  {
    id: 'homeo-9',
    topicId: 'homeostasis',
    syllabusRef: '14.2.1 Stomatal Opening in Light',
    difficulty: 'Core Recall',
    prompt:
      'Which sequence accurately explains how stomatal guard cells open in daylight?',
    options: [
      'Light inhibits proton pumps → K+ diffuses out → water potential rises → guard cells become flaccid',
      'Light activates H+-ATPase proton pumps pumping H+ out → K+ channels open and K+ ions enter guard cells → water potential (Ψ) drops → water enters by osmosis, making guard cells turgid so thickened inner walls bow apart',
      'Chloroplasts in guard cells pump starch directly into surrounding epidermal cells',
      'Abscisic acid accumulates in guard cells during daylight, triggering turgor swelling',
    ],
    correctIndex: 1,
    hint: 'Trace H+ pumping → K+ influx → water potential change → osmosis → unequal cell wall thickness.',
    markSchemeExplanation:
      'ATP-driven H+ pumping hyperpolarises the guard cell membrane, opening K+ channels so K+ enters (balanced by Cl-/malate). Lowering Ψ inside guard cells draws water in by osmosis. Because the inner wall next to the pore is thicker and microfibrils run radially, turgid guard cells curve outward to open the stoma.',
    keyTerms: ['H+-ATPase', 'K+ influx', 'Lower water potential (Ψ)', 'Uneven inner cell wall'],
  },
  {
    id: 'homeo-10',
    topicId: 'homeostasis',
    syllabusRef: '14.2.2 Stomatal Closure by Abscisic Acid (ABA)',
    difficulty: 'Application & Data',
    prompt:
      'During severe drought, how does abscisic acid (ABA) cause rapid stomatal closure to conserve plant water?',
    options: [
      'ABA stimulates H+ pumping into the epidermal cells to make guard cells turgid',
      'ABA binds guard cell receptors, inhibits H+ pumps and triggers Ca2+ influx, opening K+ efflux channels so K+ leaves; guard cell Ψ rises, water exits by osmosis, and guard cells become flaccid',
      'ABA digests cellulose microfibrils in the guard cell wall using expansins',
      'ABA closes xylem vessels in the stem by converting glucose to cellulose',
    ],
    correctIndex: 1,
    hint: 'Think of ABA acting as a stress hormone: Ca2+ acts as a second messenger causing K+ loss and osmotic water exit.',
    markSchemeExplanation:
      'Water stress stimulates ABA synthesis. ABA binds receptors on guard cell plasma membranes, inhibiting proton pumps and raising cytosolic [Ca2+]. This second messenger opens K+ (and Cl-) efflux channels; K+ exits, raising guard cell water potential (Ψ), so water moves out by osmosis and flaccid guard cells close the pore.',
    keyTerms: ['Abscisic acid (ABA)', 'Ca2+ second messenger', 'K+ efflux', 'Flaccid guard cells'],
  },
];
