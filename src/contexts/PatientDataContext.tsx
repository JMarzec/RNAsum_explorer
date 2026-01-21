import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  SampleInfo,
  GeneExpression,
  GeneFusion,
  MutatedGene,
  CNVGene,
  DrugMatch,
  ImmuneMarker,
  SummaryStats,
  sampleInfo as defaultSampleInfo,
  summaryStats as defaultSummaryStats,
  geneExpressions as defaultGeneExpressions,
  geneFusions as defaultGeneFusions,
  mutatedGenes as defaultMutatedGenes,
  cnvGenes as defaultCnvGenes,
  drugMatches as defaultDrugMatches,
  immuneMarkers as defaultImmuneMarkers,
} from '@/data/mockRNAsumData';

export interface PatientData {
  sampleInfo: SampleInfo;
  summaryStats: SummaryStats;
  geneExpressions: GeneExpression[];
  geneFusions: GeneFusion[];
  mutatedGenes: MutatedGene[];
  cnvGenes: CNVGene[];
  drugMatches: DrugMatch[];
  immuneMarkers: ImmuneMarker[];
}

interface PatientDataContextType {
  data: PatientData;
  isCustomData: boolean;
  loadData: (jsonData: Partial<PatientData>) => void;
  resetToDefault: () => void;
}

const defaultData: PatientData = {
  sampleInfo: defaultSampleInfo,
  summaryStats: defaultSummaryStats,
  geneExpressions: defaultGeneExpressions,
  geneFusions: defaultGeneFusions,
  mutatedGenes: defaultMutatedGenes,
  cnvGenes: defaultCnvGenes,
  drugMatches: defaultDrugMatches,
  immuneMarkers: defaultImmuneMarkers,
};

const PatientDataContext = createContext<PatientDataContextType | undefined>(undefined);

export function PatientDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PatientData>(defaultData);
  const [isCustomData, setIsCustomData] = useState(false);

  const loadData = (jsonData: Partial<PatientData>) => {
    setData({
      sampleInfo: jsonData.sampleInfo || defaultData.sampleInfo,
      summaryStats: jsonData.summaryStats || defaultData.summaryStats,
      geneExpressions: jsonData.geneExpressions || defaultData.geneExpressions,
      geneFusions: jsonData.geneFusions || defaultData.geneFusions,
      mutatedGenes: jsonData.mutatedGenes || defaultData.mutatedGenes,
      cnvGenes: jsonData.cnvGenes || defaultData.cnvGenes,
      drugMatches: jsonData.drugMatches || defaultData.drugMatches,
      immuneMarkers: jsonData.immuneMarkers || defaultData.immuneMarkers,
    });
    setIsCustomData(true);
  };

  const resetToDefault = () => {
    setData(defaultData);
    setIsCustomData(false);
  };

  return (
    <PatientDataContext.Provider value={{ data, isCustomData, loadData, resetToDefault }}>
      {children}
    </PatientDataContext.Provider>
  );
}

export function usePatientData() {
  const context = useContext(PatientDataContext);
  if (context === undefined) {
    throw new Error('usePatientData must be used within a PatientDataProvider');
  }
  return context;
}
