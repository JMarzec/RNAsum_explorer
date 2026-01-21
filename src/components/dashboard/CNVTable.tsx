import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { cnvGenes } from '@/data/mockRNAsumData';
import { ArrowDown, ArrowUp, Copy } from 'lucide-react';

export function CNVTable() {
  return (
    <div className="bg-card rounded-lg border border-border animate-fade-in">
      <div className="p-4 border-b border-border">
        <h3 className="section-header mb-0">
          <Copy className="h-5 w-5 text-primary" />
          Copy Number Alterations
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Key genes with CNV and expression data
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="genomic-table">
          <thead>
            <tr>
              <th>Gene</th>
              <th>Chromosome</th>
              <th>Copy Number</th>
              <th>Type</th>
              <th>Expression Z-Score</th>
            </tr>
          </thead>
          <tbody>
            {cnvGenes.map((gene, idx) => (
              <tr key={idx} className="animate-slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <td className="font-mono font-medium">{gene.gene}</td>
                <td className="font-mono text-sm text-muted-foreground">{gene.chromosome}</td>
                <td>
                  <span className="font-semibold">{gene.copyNumber}</span>
                </td>
                <td>
                  <Badge 
                    className={cn(
                      'text-xs',
                      gene.type === 'gain' ? 'badge-cnv-gain' : 'badge-cnv-loss'
                    )}
                  >
                    {gene.type === 'gain' ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {gene.type === 'gain' ? 'Amplification' : 'Deletion'}
                  </Badge>
                </td>
                <td>
                  {gene.zScore !== null ? (
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'font-medium',
                        gene.zScore >= 2 && 'zscore-high',
                        gene.zScore <= -2 && 'zscore-low'
                      )}>
                        {gene.zScore.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {gene.type === 'gain' && gene.zScore !== null && gene.zScore > 0 && '(concordant)'}
                        {gene.type === 'loss' && gene.zScore !== null && gene.zScore < 0 && '(concordant)'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
