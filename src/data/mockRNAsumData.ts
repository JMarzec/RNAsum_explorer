// Mock RNAsum data for demonstration
// Based on actual RNAsum output structure

export interface SampleInfo {
  sampleId: string;
  patientId: string;
  cancerType: string;
  referenceCohort: string;
  analysisDate: string;
  libraryId: string;
  purity: number;
  ploidy: number;
}

export interface GeneExpression {
  gene: string;
  ensemblId: string;
  zScore: number;
  percentile: number;
  tpm: number;
  cohortMedian: number;
  hasMutation: boolean;
  hasCNV: 'gain' | 'loss' | null;
  category: 'oncogene' | 'tumor_suppressor' | 'drug_target' | 'immune' | 'hrd' | 'other';
}

export interface GeneFusion {
  gene5: string;
  gene3: string;
  breakpoint5: string;
  breakpoint3: string;
  junctionReads: number;
  spanningFrags: number;
  ffpm: number;
  inFrame: boolean;
  cancerRelevant: boolean;
  database: string[];
}

export interface MutatedGene {
  gene: string;
  variant: string;
  consequence: string;
  vaf: number;
  tier: 1 | 2 | 3 | 4;
  zScore: number | null;
  expression: 'high' | 'normal' | 'low' | null;
}

export interface CNVGene {
  gene: string;
  chromosome: string;
  copyNumber: number;
  type: 'gain' | 'loss';
  zScore: number | null;
}

export interface DrugMatch {
  drug: string;
  gene: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  association: 'sensitivity' | 'resistance';
  source: string;
  cancerType: string;
  expressionSupport: boolean;
}

export interface ImmuneMarker {
  marker: string;
  value: number;
  percentile: number;
  interpretation: 'high' | 'normal' | 'low';
}

export interface SummaryStats {
  totalGenesAnalyzed: number;
  upregulatedGenes: number;
  downregulatedGenes: number;
  mutatedGenes: number;
  fusionsDetected: number;
  cnvAltered: number;
  drugMatches: number;
  tierOneVariants: number;
}

// Sample data
export const sampleInfo: SampleInfo = {
  sampleId: 'PRJ230001_L2300001',
  patientId: 'SBJ00456',
  cancerType: 'Pancreatic Adenocarcinoma',
  referenceCohort: 'TCGA-PAAD (n=178)',
  analysisDate: '2024-01-15',
  libraryId: 'L2300001',
  purity: 0.72,
  ploidy: 2.3,
};

export const summaryStats: SummaryStats = {
  totalGenesAnalyzed: 19847,
  upregulatedGenes: 1247,
  downregulatedGenes: 982,
  mutatedGenes: 156,
  fusionsDetected: 3,
  cnvAltered: 89,
  drugMatches: 12,
  tierOneVariants: 4,
};

export const geneExpressions: GeneExpression[] = [
  { gene: 'KRAS', ensemblId: 'ENSG00000133703', zScore: 2.4, percentile: 92, tpm: 145.2, cohortMedian: 67.3, hasMutation: true, hasCNV: null, category: 'oncogene' },
  { gene: 'TP53', ensemblId: 'ENSG00000141510', zScore: -1.8, percentile: 8, tpm: 23.1, cohortMedian: 89.4, hasMutation: true, hasCNV: null, category: 'tumor_suppressor' },
  { gene: 'BRCA2', ensemblId: 'ENSG00000139618', zScore: -2.1, percentile: 4, tpm: 12.3, cohortMedian: 45.2, hasMutation: false, hasCNV: 'loss', category: 'hrd' },
  { gene: 'EGFR', ensemblId: 'ENSG00000146648', zScore: 3.2, percentile: 98, tpm: 234.5, cohortMedian: 56.7, hasMutation: false, hasCNV: 'gain', category: 'drug_target' },
  { gene: 'MYC', ensemblId: 'ENSG00000136997', zScore: 2.8, percentile: 96, tpm: 189.2, cohortMedian: 78.9, hasMutation: false, hasCNV: 'gain', category: 'oncogene' },
  { gene: 'CDKN2A', ensemblId: 'ENSG00000147889', zScore: -3.4, percentile: 1, tpm: 2.1, cohortMedian: 34.5, hasMutation: false, hasCNV: 'loss', category: 'tumor_suppressor' },
  { gene: 'SMAD4', ensemblId: 'ENSG00000141646', zScore: -2.3, percentile: 3, tpm: 18.9, cohortMedian: 67.8, hasMutation: true, hasCNV: null, category: 'tumor_suppressor' },
  { gene: 'ERBB2', ensemblId: 'ENSG00000141736', zScore: 1.9, percentile: 88, tpm: 112.3, cohortMedian: 54.2, hasMutation: false, hasCNV: null, category: 'drug_target' },
  { gene: 'PD1', ensemblId: 'ENSG00000188389', zScore: 0.8, percentile: 65, tpm: 45.6, cohortMedian: 34.2, hasMutation: false, hasCNV: null, category: 'immune' },
  { gene: 'PDL1', ensemblId: 'ENSG00000120217', zScore: 1.5, percentile: 82, tpm: 78.9, cohortMedian: 43.1, hasMutation: false, hasCNV: null, category: 'immune' },
  { gene: 'BRCA1', ensemblId: 'ENSG00000012048', zScore: -0.3, percentile: 42, tpm: 38.2, cohortMedian: 41.5, hasMutation: false, hasCNV: null, category: 'hrd' },
  { gene: 'ATM', ensemblId: 'ENSG00000149311', zScore: -1.2, percentile: 18, tpm: 28.4, cohortMedian: 52.3, hasMutation: false, hasCNV: null, category: 'hrd' },
  { gene: 'PALB2', ensemblId: 'ENSG00000083093', zScore: -0.7, percentile: 32, tpm: 21.3, cohortMedian: 28.9, hasMutation: true, hasCNV: null, category: 'hrd' },
  { gene: 'MET', ensemblId: 'ENSG00000105976', zScore: 2.1, percentile: 91, tpm: 167.8, cohortMedian: 72.4, hasMutation: false, hasCNV: null, category: 'drug_target' },
  { gene: 'FGFR2', ensemblId: 'ENSG00000066468', zScore: 1.7, percentile: 85, tpm: 89.4, cohortMedian: 45.6, hasMutation: false, hasCNV: null, category: 'drug_target' },
];

export const geneFusions: GeneFusion[] = [
  { gene5: 'TMPRSS2', gene3: 'ERG', breakpoint5: 'chr21:41498117', breakpoint3: 'chr21:38584929', junctionReads: 156, spanningFrags: 89, ffpm: 4.2, inFrame: true, cancerRelevant: true, database: ['COSMIC', 'FusionGDB'] },
  { gene5: 'EML4', gene3: 'ALK', breakpoint5: 'chr2:42472827', breakpoint3: 'chr2:29447431', junctionReads: 234, spanningFrags: 145, ffpm: 6.8, inFrame: true, cancerRelevant: true, database: ['COSMIC', 'OncoKB', 'FusionGDB'] },
  { gene5: 'FGFR3', gene3: 'TACC3', breakpoint5: 'chr4:1808661', breakpoint3: 'chr4:1737484', junctionReads: 67, spanningFrags: 34, ffpm: 1.9, inFrame: true, cancerRelevant: true, database: ['COSMIC'] },
];

export const mutatedGenes: MutatedGene[] = [
  { gene: 'KRAS', variant: 'p.G12D', consequence: 'missense_variant', vaf: 0.42, tier: 1, zScore: 2.4, expression: 'high' },
  { gene: 'TP53', variant: 'p.R175H', consequence: 'missense_variant', vaf: 0.38, tier: 1, zScore: -1.8, expression: 'low' },
  { gene: 'SMAD4', variant: 'p.R361C', consequence: 'missense_variant', vaf: 0.29, tier: 2, zScore: -2.3, expression: 'low' },
  { gene: 'PALB2', variant: 'c.3113G>A', consequence: 'splice_region_variant', vaf: 0.51, tier: 2, zScore: -0.7, expression: 'normal' },
  { gene: 'CDKN2A', variant: 'p.H83Y', consequence: 'missense_variant', vaf: 0.67, tier: 1, zScore: -3.4, expression: 'low' },
  { gene: 'ARID1A', variant: 'p.Q1334*', consequence: 'stop_gained', vaf: 0.23, tier: 2, zScore: null, expression: null },
];

export const cnvGenes: CNVGene[] = [
  { gene: 'EGFR', chromosome: '7p11.2', copyNumber: 6, type: 'gain', zScore: 3.2 },
  { gene: 'MYC', chromosome: '8q24.21', copyNumber: 8, type: 'gain', zScore: 2.8 },
  { gene: 'CDKN2A', chromosome: '9p21.3', copyNumber: 0, type: 'loss', zScore: -3.4 },
  { gene: 'BRCA2', chromosome: '13q13.1', copyNumber: 1, type: 'loss', zScore: -2.1 },
  { gene: 'ERBB2', chromosome: '17q12', copyNumber: 5, type: 'gain', zScore: 1.9 },
];

export const drugMatches: DrugMatch[] = [
  { drug: 'Olaparib', gene: 'BRCA2', evidenceLevel: 'A', association: 'sensitivity', source: 'OncoKB', cancerType: 'Pancreatic Cancer', expressionSupport: true },
  { drug: 'Erlotinib', gene: 'EGFR', evidenceLevel: 'B', association: 'sensitivity', source: 'CIViC', cancerType: 'Pan-cancer', expressionSupport: true },
  { drug: 'Cetuximab', gene: 'KRAS', evidenceLevel: 'A', association: 'resistance', source: 'OncoKB', cancerType: 'Colorectal Cancer', expressionSupport: false },
  { drug: 'Pembrolizumab', gene: 'PDL1', evidenceLevel: 'B', association: 'sensitivity', source: 'OncoKB', cancerType: 'Pan-cancer', expressionSupport: true },
  { drug: 'Trastuzumab', gene: 'ERBB2', evidenceLevel: 'B', association: 'sensitivity', source: 'CIViC', cancerType: 'Breast Cancer', expressionSupport: true },
  { drug: 'Crizotinib', gene: 'ALK', evidenceLevel: 'A', association: 'sensitivity', source: 'OncoKB', cancerType: 'NSCLC', expressionSupport: true },
];

export const immuneMarkers: ImmuneMarker[] = [
  { marker: 'PD-L1 Expression', value: 78.9, percentile: 82, interpretation: 'high' },
  { marker: 'CD8+ T-cells', value: 45.2, percentile: 56, interpretation: 'normal' },
  { marker: 'Tumor Mutational Burden', value: 8.2, percentile: 71, interpretation: 'normal' },
  { marker: 'Cytolytic Activity', value: 12.4, percentile: 34, interpretation: 'low' },
  { marker: 'IFN-γ Signature', value: 5.8, percentile: 62, interpretation: 'normal' },
];

// Heatmap data for top variable genes
export const heatmapGenes = [
  'KRAS', 'TP53', 'EGFR', 'MYC', 'CDKN2A', 'SMAD4', 'ERBB2', 'BRCA2', 'MET', 'FGFR2'
];

export const cohortSamples = ['Sample', 'TCGA-1', 'TCGA-2', 'TCGA-3', 'TCGA-4', 'TCGA-5'];

// Z-scores matrix for heatmap (sample vs cohort samples)
export const heatmapData: number[][] = [
  [2.4, 0.3, -0.8, 1.2, 0.1, -0.4],    // KRAS
  [-1.8, 0.2, 0.5, -0.3, 0.8, 0.1],    // TP53
  [3.2, 1.1, 0.4, 0.8, -0.2, 0.6],     // EGFR
  [2.8, 0.6, -0.1, 1.4, 0.3, 0.9],     // MYC
  [-3.4, 0.1, 0.3, -0.5, 0.2, -0.1],   // CDKN2A
  [-2.3, -0.2, 0.4, 0.1, -0.3, 0.2],   // SMAD4
  [1.9, 0.4, 0.2, 0.7, 0.1, 0.5],      // ERBB2
  [-2.1, 0.1, -0.2, 0.3, -0.1, 0.4],   // BRCA2
  [2.1, 0.8, 0.3, 0.5, 0.2, 0.6],      // MET
  [1.7, 0.3, 0.1, 0.4, 0.5, 0.2],      // FGFR2
];
