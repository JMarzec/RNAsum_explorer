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

const STORAGE_KEY = 'rnasum-patient-data';

export function PatientDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PatientData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultData;
      }
    }
    return defaultData;
  });
  const [isCustomData, setIsCustomData] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  });

  const loadData = (jsonData: Partial<PatientData>) => {
    const newData = {
      sampleInfo: jsonData.sampleInfo || defaultData.sampleInfo,
      summaryStats: jsonData.summaryStats || defaultData.summaryStats,
      geneExpressions: jsonData.geneExpressions || defaultData.geneExpressions,
      geneFusions: jsonData.geneFusions || defaultData.geneFusions,
      mutatedGenes: jsonData.mutatedGenes || defaultData.mutatedGenes,
      cnvGenes: jsonData.cnvGenes || defaultData.cnvGenes,
      drugMatches: jsonData.drugMatches || defaultData.drugMatches,
      immuneMarkers: jsonData.immuneMarkers || defaultData.immuneMarkers,
    };
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setIsCustomData(true);
  };

  const resetToDefault = () => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
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
