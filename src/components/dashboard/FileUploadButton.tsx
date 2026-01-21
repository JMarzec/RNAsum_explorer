import { useRef, useState } from 'react';
import { Upload, FileJson, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePatientData } from '@/contexts/PatientDataContext';
import { toast } from 'sonner';

export function FileUploadButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
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
    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      loadData(jsonData);
      setFileName(file.name);
      toast.success(`Loaded patient data from ${file.name}`);
      setIsOpen(false);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      toast.error('Failed to parse JSON file. Please check the file format.');
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
    toast.info('Reset to demo data');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          {isCustomData ? 'Change Data' : 'Load Patient Data'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs font-medium mb-2">Expected JSON structure:</p>
          <pre className="text-xs text-muted-foreground overflow-x-auto">
{`{
  "sampleInfo": { "sampleId": "...", ... },
  "geneExpressions": [...],
  "geneFusions": [...],
  "mutatedGenes": [...],
  "cnvGenes": [...],
  "drugMatches": [...],
  "immuneMarkers": [...]
}`}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
