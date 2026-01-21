import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GeneExpression } from '@/data/mockRNAsumData';
import { ArrowDown, ArrowUp, Dna, Copy } from 'lucide-react';

interface GeneCardProps {
  gene: GeneExpression;
}

const categoryLabels = {
  oncogene: 'Oncogene',
  tumor_suppressor: 'TSG',
  drug_target: 'Drug Target',
  immune: 'Immune',
  hrd: 'HRD',
  other: 'Other',
};

const categoryColors = {
  oncogene: 'bg-genomic-mutation/10 text-genomic-mutation border-genomic-mutation/30',
  tumor_suppressor: 'bg-info/10 text-info border-info/30',
  drug_target: 'bg-success/10 text-success border-success/30',
  immune: 'bg-warning/10 text-warning border-warning/30',
  hrd: 'bg-genomic-fusion/10 text-genomic-fusion border-genomic-fusion/30',
  other: 'bg-muted text-muted-foreground border-border',
};

export function GeneCard({ gene }: GeneCardProps) {
  const isUpregulated = gene.zScore >= 2;
  const isDownregulated = gene.zScore <= -2;

  return (
    <div className="gene-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold font-mono text-lg">{gene.gene}</h4>
          <p className="text-xs text-muted-foreground font-mono">{gene.ensemblId}</p>
        </div>
        <Badge variant="outline" className={cn('text-xs', categoryColors[gene.category])}>
          {categoryLabels[gene.category]}
        </Badge>
      </div>

      {/* Z-score indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium',
            isUpregulated && 'bg-expression-high/10 text-expression-high',
            isDownregulated && 'bg-expression-low/10 text-expression-low',
            !isUpregulated && !isDownregulated && 'bg-muted text-muted-foreground'
          )}
        >
          {isUpregulated && <ArrowUp className="h-4 w-4" />}
          {isDownregulated && <ArrowDown className="h-4 w-4" />}
          <span>Z: {gene.zScore.toFixed(1)}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {gene.percentile}th percentile
        </span>
      </div>

      {/* Expression values */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-muted-foreground">TPM:</span>
          <span className="ml-1 font-medium">{gene.tpm.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Cohort:</span>
          <span className="ml-1 font-medium">{gene.cohortMedian.toFixed(1)}</span>
        </div>
      </div>

      {/* Alteration badges */}
      <div className="flex flex-wrap gap-1">
        {gene.hasMutation && (
          <Badge variant="secondary" className="badge-mutation text-xs">
            <Dna className="h-3 w-3 mr-1" />
            Mutated
          </Badge>
        )}
        {gene.hasCNV === 'gain' && (
          <Badge variant="secondary" className="badge-cnv-gain text-xs">
            <Copy className="h-3 w-3 mr-1" />
            Amplified
          </Badge>
        )}
        {gene.hasCNV === 'loss' && (
          <Badge variant="secondary" className="badge-cnv-loss text-xs">
            <Copy className="h-3 w-3 mr-1" />
            Deleted
          </Badge>
        )}
      </div>
    </div>
  );
}
