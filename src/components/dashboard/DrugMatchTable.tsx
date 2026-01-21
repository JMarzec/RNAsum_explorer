import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { drugMatches } from '@/data/mockRNAsumData';
import { Check, ExternalLink, Pill, X } from 'lucide-react';

export function DrugMatchTable() {
  const getEvidenceLevelColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-success text-success-foreground';
      case 'B': return 'bg-info text-info-foreground';
      case 'C': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border animate-fade-in">
      <div className="p-4 border-b border-border">
        <h3 className="section-header mb-0">
          <Pill className="h-5 w-5 text-success" />
          Drug-Gene Associations
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {drugMatches.filter(d => d.evidenceLevel === 'A').length} Level A evidence matches
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="genomic-table">
          <thead>
            <tr>
              <th>Drug</th>
              <th>Gene</th>
              <th>Evidence</th>
              <th>Association</th>
              <th>Cancer Type</th>
              <th>Expression Support</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {drugMatches.map((match, idx) => (
              <tr key={idx} className="animate-slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <td className="font-medium">{match.drug}</td>
                <td className="font-mono">{match.gene}</td>
                <td>
                  <Badge className={cn('text-xs', getEvidenceLevelColor(match.evidenceLevel))}>
                    Level {match.evidenceLevel}
                  </Badge>
                </td>
                <td>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-xs',
                      match.association === 'sensitivity' 
                        ? 'border-success/50 text-success' 
                        : 'border-destructive/50 text-destructive'
                    )}
                  >
                    {match.association === 'sensitivity' ? 'Sensitive' : 'Resistant'}
                  </Badge>
                </td>
                <td className="text-sm">{match.cancerType}</td>
                <td>
                  {match.expressionSupport ? (
                    <div className="flex items-center gap-1 text-success">
                      <Check className="h-4 w-4" />
                      <span className="text-xs">Supported</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <X className="h-4 w-4" />
                      <span className="text-xs">No</span>
                    </div>
                  )}
                </td>
                <td>
                  <Badge variant="outline" className="text-xs">
                    {match.source}
                    <ExternalLink className="h-2.5 w-2.5 ml-1" />
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
