import { Badge } from '@/components/ui/badge';
import { geneFusions } from '@/data/mockRNAsumData';
import { Check, ExternalLink, GitMerge, X } from 'lucide-react';

export function FusionTable() {
  return (
    <div className="bg-card rounded-lg border border-border animate-fade-in">
      <div className="p-4 border-b border-border">
        <h3 className="section-header mb-0">
          <GitMerge className="h-5 w-5 text-genomic-fusion" />
          Gene Fusions
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {geneFusions.length} cancer-relevant fusions detected
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="genomic-table">
          <thead>
            <tr>
              <th>Fusion</th>
              <th>5' Breakpoint</th>
              <th>3' Breakpoint</th>
              <th>Junction Reads</th>
              <th>FFPM</th>
              <th>In-Frame</th>
              <th>Databases</th>
            </tr>
          </thead>
          <tbody>
            {geneFusions.map((fusion, idx) => (
              <tr key={idx} className="animate-slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-genomic-fusion">
                      {fusion.gene5}
                    </span>
                    <GitMerge className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono font-medium text-genomic-fusion">
                      {fusion.gene3}
                    </span>
                  </div>
                </td>
                <td className="font-mono text-xs">{fusion.breakpoint5}</td>
                <td className="font-mono text-xs">{fusion.breakpoint3}</td>
                <td>
                  <span className="font-medium">{fusion.junctionReads}</span>
                  <span className="text-muted-foreground text-xs ml-1">
                    ({fusion.spanningFrags} spanning)
                  </span>
                </td>
                <td className="font-medium">{fusion.ffpm.toFixed(1)}</td>
                <td>
                  {fusion.inFrame ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {fusion.database.map((db) => (
                      <Badge key={db} variant="outline" className="text-xs">
                        {db}
                        <ExternalLink className="h-2.5 w-2.5 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
