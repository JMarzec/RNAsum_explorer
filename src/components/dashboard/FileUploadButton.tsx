import { useRef, useState } from 'react';
import { Upload, FileJson, X, Check, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePatientData, PatientData } from '@/contexts/PatientDataContext';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationError {
  field: string;
  message: string;
}

const SAMPLE_JSON: PatientData = {
  sampleInfo: {
    sampleId: "PRJ230001_L2300001",
    patientId: "SBJ00456",
    cancerType: "Pancreatic Adenocarcinoma",
    referenceCohort: "TCGA-PAAD (n=178)",
    analysisDate: "2024-01-15",
    libraryId: "L2300001",
    purity: 0.72,
    ploidy: 2.3
  },
  summaryStats: {
    totalGenesAnalyzed: 19847,
    upregulatedGenes: 1247,
    downregulatedGenes: 982,
    mutatedGenes: 156,
    fusionsDetected: 3,
    cnvAltered: 89,
    drugMatches: 12,
    tierOneVariants: 4
  },
  geneExpressions: [
    {
      gene: "KRAS",
      ensemblId: "ENSG00000133703",
      zScore: 2.4,
      percentile: 92,
      tpm: 145.2,
      cohortMedian: 67.3,
      hasMutation: true,
      hasCNV: null,
      category: "oncogene"
    }
  ],
  geneFusions: [
    {
      gene5: "TMPRSS2",
      gene3: "ERG",
      breakpoint5: "chr21:41498117",
      breakpoint3: "chr21:38584929",
      junctionReads: 156,
      spanningFrags: 89,
      ffpm: 4.2,
      inFrame: true,
      cancerRelevant: true,
      database: ["COSMIC", "FusionGDB"]
    }
  ],
  mutatedGenes: [
    {
      gene: "KRAS",
      variant: "p.G12D",
      consequence: "missense_variant",
      vaf: 0.42,
      tier: 1,
      zScore: 2.4,
      expression: "high"
    }
  ],
  cnvGenes: [
    {
      gene: "EGFR",
      chromosome: "7p11.2",
      copyNumber: 6,
      type: "gain",
      zScore: 3.2
    }
  ],
  drugMatches: [
    {
      drug: "Olaparib",
      gene: "BRCA2",
      evidenceLevel: "A",
      association: "sensitivity",
      source: "OncoKB",
      cancerType: "Pancreatic Cancer",
      expressionSupport: true
    }
  ],
  immuneMarkers: [
    {
      marker: "PD-L1 Expression",
      value: 78.9,
      percentile: 82,
      interpretation: "high"
    }
  ]
};

function validatePatientData(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push({ field: 'root', message: 'Data must be a valid JSON object' });
    return errors;
  }

  const obj = data as Record<string, unknown>;

  // Validate sampleInfo
  if (!obj.sampleInfo) {
    errors.push({ field: 'sampleInfo', message: 'Missing required field: sampleInfo' });
  } else if (typeof obj.sampleInfo !== 'object') {
    errors.push({ field: 'sampleInfo', message: 'sampleInfo must be an object' });
  } else {
    const sample = obj.sampleInfo as Record<string, unknown>;
    const requiredSampleFields = ['sampleId', 'patientId', 'cancerType', 'referenceCohort', 'analysisDate'];
    requiredSampleFields.forEach(field => {
      if (!sample[field]) {
        errors.push({ field: `sampleInfo.${field}`, message: `Missing required field: sampleInfo.${field}` });
      }
    });
    if (sample.purity !== undefined && (typeof sample.purity !== 'number' || sample.purity < 0 || sample.purity > 1)) {
      errors.push({ field: 'sampleInfo.purity', message: 'purity must be a number between 0 and 1' });
    }
    if (sample.ploidy !== undefined && typeof sample.ploidy !== 'number') {
      errors.push({ field: 'sampleInfo.ploidy', message: 'ploidy must be a number' });
    }
  }

  // Validate arrays
  const arrayFields = ['geneExpressions', 'geneFusions', 'mutatedGenes', 'cnvGenes', 'drugMatches', 'immuneMarkers'];
  arrayFields.forEach(field => {
    if (obj[field] !== undefined && !Array.isArray(obj[field])) {
      errors.push({ field, message: `${field} must be an array` });
    }
  });

  // Validate geneExpressions items
  if (Array.isArray(obj.geneExpressions)) {
    (obj.geneExpressions as unknown[]).forEach((item, idx) => {
      if (typeof item !== 'object' || item === null) {
        errors.push({ field: `geneExpressions[${idx}]`, message: 'Each gene expression must be an object' });
      } else {
        const gene = item as Record<string, unknown>;
        if (!gene.gene || typeof gene.gene !== 'string') {
          errors.push({ field: `geneExpressions[${idx}].gene`, message: 'gene name is required and must be a string' });
        }
        if (gene.zScore !== undefined && typeof gene.zScore !== 'number') {
          errors.push({ field: `geneExpressions[${idx}].zScore`, message: 'zScore must be a number' });
        }
        if (gene.category && !['oncogene', 'tumor_suppressor', 'drug_target', 'immune', 'hrd', 'other'].includes(gene.category as string)) {
          errors.push({ field: `geneExpressions[${idx}].category`, message: 'Invalid category. Must be: oncogene, tumor_suppressor, drug_target, immune, hrd, or other' });
        }
      }
    });
  }

  // Validate mutatedGenes items
  if (Array.isArray(obj.mutatedGenes)) {
    (obj.mutatedGenes as unknown[]).forEach((item, idx) => {
      if (typeof item !== 'object' || item === null) {
        errors.push({ field: `mutatedGenes[${idx}]`, message: 'Each mutated gene must be an object' });
      } else {
        const gene = item as Record<string, unknown>;
        if (!gene.gene || typeof gene.gene !== 'string') {
          errors.push({ field: `mutatedGenes[${idx}].gene`, message: 'gene name is required' });
        }
        if (gene.tier !== undefined && ![1, 2, 3, 4].includes(gene.tier as number)) {
          errors.push({ field: `mutatedGenes[${idx}].tier`, message: 'tier must be 1, 2, 3, or 4' });
        }
        if (gene.vaf !== undefined && (typeof gene.vaf !== 'number' || gene.vaf < 0 || gene.vaf > 1)) {
          errors.push({ field: `mutatedGenes[${idx}].vaf`, message: 'vaf must be a number between 0 and 1' });
        }
      }
    });
  }

  // Validate cnvGenes items
  if (Array.isArray(obj.cnvGenes)) {
    (obj.cnvGenes as unknown[]).forEach((item, idx) => {
      if (typeof item !== 'object' || item === null) {
        errors.push({ field: `cnvGenes[${idx}]`, message: 'Each CNV gene must be an object' });
      } else {
        const gene = item as Record<string, unknown>;
        if (!gene.gene || typeof gene.gene !== 'string') {
          errors.push({ field: `cnvGenes[${idx}].gene`, message: 'gene name is required' });
        }
        if (gene.type && !['gain', 'loss'].includes(gene.type as string)) {
          errors.push({ field: `cnvGenes[${idx}].type`, message: 'type must be "gain" or "loss"' });
        }
      }
    });
  }

  // Validate drugMatches items
  if (Array.isArray(obj.drugMatches)) {
    (obj.drugMatches as unknown[]).forEach((item, idx) => {
      if (typeof item !== 'object' || item === null) {
        errors.push({ field: `drugMatches[${idx}]`, message: 'Each drug match must be an object' });
      } else {
        const drug = item as Record<string, unknown>;
        if (!drug.drug || typeof drug.drug !== 'string') {
          errors.push({ field: `drugMatches[${idx}].drug`, message: 'drug name is required' });
        }
        if (drug.evidenceLevel && !['A', 'B', 'C', 'D'].includes(drug.evidenceLevel as string)) {
          errors.push({ field: `drugMatches[${idx}].evidenceLevel`, message: 'evidenceLevel must be A, B, C, or D' });
        }
        if (drug.association && !['sensitivity', 'resistance'].includes(drug.association as string)) {
          errors.push({ field: `drugMatches[${idx}].association`, message: 'association must be "sensitivity" or "resistance"' });
        }
      }
    });
  }

  return errors;
}

export function FileUploadButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loadData, resetToDefault, isCustomData } = usePatientData();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    setValidationErrors([]);
    
    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      const errors = validatePatientData(jsonData);
      if (errors.length > 0) {
        setValidationErrors(errors);
        toast.error(`Validation failed: ${errors.length} error(s) found`);
        return;
      }
      
      loadData(jsonData);
      setFileName(file.name);
      toast.success(`Loaded patient data from ${file.name}`);
      setIsOpen(false);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      toast.error('Failed to parse JSON file. Please check the file format.');
      setValidationErrors([{ field: 'parse', message: 'Invalid JSON syntax. Please check your file.' }]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    resetToDefault();
    setFileName(null);
    setValidationErrors([]);
    toast.info('Reset to demo data');
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([JSON.stringify(SAMPLE_JSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patient_data_template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setValidationErrors([]); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          {isCustomData ? 'Change Data' : 'Load Patient Data'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Load Patient Results</DialogTitle>
          <DialogDescription>
            Upload a JSON file containing patient molecular profiling data.
          </DialogDescription>
        </DialogHeader>
        
        <div
          className={`
            mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <FileJson className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop your JSON file here, or
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>
        </div>

        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">Validation errors ({validationErrors.length}):</p>
              <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                {validationErrors.slice(0, 5).map((error, idx) => (
                  <li key={idx}>
                    <code className="bg-destructive/20 px-1 rounded">{error.field}</code>: {error.message}
                  </li>
                ))}
                {validationErrors.length > 5 && (
                  <li className="text-muted-foreground">...and {validationErrors.length - 5} more errors</li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {isCustomData && (
          <div className="flex items-center justify-between mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600" />
              <span className="font-medium">{fileName || 'Custom data loaded'}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
              <X className="h-3 w-3" />
              Reset
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs font-medium mb-2">Expected JSON structure:</p>
          <pre className="text-xs text-muted-foreground overflow-x-auto">
{`{
  "sampleInfo": { "sampleId", "patientId", "cancerType", ... },
  "geneExpressions": [{ "gene", "zScore", "category", ... }],
  "geneFusions": [{ "gene5", "gene3", "inFrame", ... }],
  "mutatedGenes": [{ "gene", "variant", "tier", ... }],
  "cnvGenes": [{ "gene", "type", "copyNumber", ... }],
  "drugMatches": [{ "drug", "gene", "evidenceLevel", ... }],
  "immuneMarkers": [{ "marker", "value", "percentile", ... }]
}`}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
