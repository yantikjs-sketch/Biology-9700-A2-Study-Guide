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
    status: 'planned',
    summary:
      'Osmoregulation in mammals, nephron ultrafiltration & selective reabsorption, ADH feedback, blood glucose regulation, and stomatal guard cells.',
    subtopics: [
      '14.1 Homeostasis in mammals & negative feedback',
      '14.1 Kidney structure, ultrafiltration & loop of Henle',
      '14.1 Blood glucose control (insulin, glucagon, second messengers)',
      '14.2 Homeostasis in plants & abscisic acid (ABA)',
    ],
    accentColor: '#0F766E',
  },
  {
    id: 'control',
    code: '15',
    title: 'Control and Coordination',
    shortLabel: '15. Coordination',
    status: 'planned',
    summary:
      'Nervous & endocrine communication, resting and action potentials, cholinergic synapses, striated muscle contraction, and auxin/gibberellin responses.',
    subtopics: [
      '15.1 Mammalian nervous system & action potentials',
      '15.1 Synaptic transmission & neuromuscular junctions',
      '15.1 Sliding filament model of muscle contraction',
      '15.2 Plant growth regulators (auxin, gibberellin)',
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
];
