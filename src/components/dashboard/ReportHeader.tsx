import { SampleInfo } from '@/data/mockRNAsumData';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { PdfExportButton } from './PdfExportButton';

interface ReportHeaderProps {
  sample: SampleInfo;
}

export function ReportHeader({ sample }: ReportHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card">
      <div className="px-8 py-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Patient Molecular Profiling
        </h1>
        <PdfExportButton contentId="report-content" />
      </div>
      
      <div className="px-8 pb-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            Input data summary
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-muted/50 rounded-lg p-4">
              <div>
                <span className="text-muted-foreground">Sample ID:</span>
                <span className="ml-2 font-mono font-medium">{sample.sampleId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cancer Type:</span>
                <span className="ml-2 font-medium">{sample.cancerType}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Reference:</span>
                <span className="ml-2 font-medium">{sample.referenceCohort}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Purity / Ploidy:</span>
                <span className="ml-2 font-medium">{(sample.purity * 100).toFixed(0)}% / {sample.ploidy.toFixed(1)}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </header>
  );
}
