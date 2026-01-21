import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mutatedGenes } from '@/data/mockRNAsumData';
import { AlertTriangle, Dna } from 'lucide-react';

export function MutationTable() {
  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-destructive text-destructive-foreground';
      case 2: return 'bg-warning text-warning-foreground';
      case 3: return 'bg-info text-info-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getExpressionBadge = (expression: 'high' | 'normal' | 'low' | null) => {
    if (!expression) return null;
    const colors = {
      high: 'bg-expression-high/10 text-expression-high border-expression-high/30',
      normal: 'bg-muted text-muted-foreground',
      low: 'bg-expression-low/10 text-expression-low border-expression-low/30',
    };
    return (
      <Badge variant="outline" className={cn('text-xs', colors[expression])}>
        {expression}
      </Badge>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border animate-fade-in">
      <div className="p-4 border-b border-border">
        <h3 className="section-header mb-0">
          <Dna className="h-5 w-5 text-genomic-mutation" />
          Somatic Mutations
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {mutatedGenes.filter(g => g.tier === 1).length} Tier I variants with expression data
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="genomic-table">
          <thead>
            <tr>
              <th>Gene</th>
              <th>Variant</th>
              <th>Consequence</th>
              <th>VAF</th>
              <th>Tier</th>
              <th>Z-Score</th>
              <th>Expression</th>
            </tr>
          </thead>
          <tbody>
            {mutatedGenes.map((gene, idx) => (
              <tr key={idx} className="animate-slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <td className="font-mono font-medium">{gene.gene}</td>
                <td className="font-mono text-sm">{gene.variant}</td>
                <td>
                  <span className="text-sm text-muted-foreground">
                    {gene.consequence.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{(gene.vaf * 100).toFixed(0)}%</span>
                    <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-genomic-mutation rounded-full"
                        style={{ width: `${gene.vaf * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <Badge className={cn('text-xs', getTierColor(gene.tier))}>
                    {gene.tier === 1 && <AlertTriangle className="h-3 w-3 mr-1" />}
                    Tier {gene.tier}
                  </Badge>
                </td>
                <td>
                  {gene.zScore !== null ? (
                    <span className={cn(
                      'font-medium',
                      gene.zScore >= 2 && 'zscore-high',
                      gene.zScore <= -2 && 'zscore-low'
                    )}>
                      {gene.zScore.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td>
                  {getExpressionBadge(gene.expression)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
