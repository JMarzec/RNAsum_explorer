import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SampleInfo } from '@/data/mockRNAsumData';
import { Calendar, Download, FileText, FlaskConical, Share2 } from 'lucide-react';

interface SampleHeaderProps {
  sample: SampleInfo;
}

export function SampleHeader({ sample }: SampleHeaderProps) {
  return (
    <header className="border-b border-border bg-card px-6 py-4 animate-fade-in">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {sample.sampleId}
            </h1>
            <Badge variant="outline" className="font-mono text-xs">
              {sample.patientId}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FlaskConical className="h-4 w-4" />
              {sample.cancerType}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {sample.referenceCohort}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {sample.analysisDate}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Full Report
          </Button>
        </div>
      </div>

      {/* Quality metrics bar */}
      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Purity:</span>
          <span className="font-medium">{(sample.purity * 100).toFixed(0)}%</span>
          <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${sample.purity * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Ploidy:</span>
          <span className="font-medium">{sample.ploidy.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Library:</span>
          <span className="font-mono text-xs">{sample.libraryId}</span>
        </div>
      </div>
    </header>
  );
}
