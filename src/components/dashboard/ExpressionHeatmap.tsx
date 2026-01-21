import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { heatmapData, heatmapGenes, cohortSamples } from '@/data/mockRNAsumData';

export function ExpressionHeatmap() {
  const getColorForZScore = (zScore: number): string => {
    if (zScore >= 2) return 'bg-expression-high';
    if (zScore >= 1) return 'bg-expression-high/60';
    if (zScore <= -2) return 'bg-expression-low';
    if (zScore <= -1) return 'bg-expression-low/60';
    return 'bg-expression-neutral';
  };

  const getTextColorForZScore = (zScore: number): string => {
    if (Math.abs(zScore) >= 1.5) return 'text-white';
    return 'text-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
      <h3 className="section-header">
        <span className="h-5 w-1 bg-primary rounded-full" />
        Expression Heatmap
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Z-scores relative to {cohortSamples.length - 1} reference cohort samples
      </p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-muted-foreground px-2 py-2 w-24">Gene</th>
              {cohortSamples.map((sample, i) => (
                <th 
                  key={sample} 
                  className={cn(
                    'text-center font-medium px-2 py-2 min-w-[60px]',
                    i === 0 ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {sample}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapGenes.map((gene, geneIdx) => (
              <tr key={gene}>
                <td className="font-mono text-xs font-medium px-2 py-1">{gene}</td>
                {heatmapData[geneIdx].map((zScore, sampleIdx) => (
                  <td key={sampleIdx} className="px-1 py-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'heatmap-cell h-8 w-full flex items-center justify-center text-xs font-medium',
                            getColorForZScore(zScore),
                            getTextColorForZScore(zScore),
                            sampleIdx === 0 && 'ring-2 ring-primary ring-offset-1'
                          )}
                        >
                          {zScore.toFixed(1)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{gene}</p>
                        <p className="text-xs text-muted-foreground">
                          {cohortSamples[sampleIdx]}: Z-score {zScore.toFixed(2)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-3 w-6 rounded bg-expression-low" />
          <span className="text-muted-foreground">Low (≤-2)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-6 rounded bg-expression-neutral" />
          <span className="text-muted-foreground">Normal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-6 rounded bg-expression-high" />
          <span className="text-muted-foreground">High (≥2)</span>
        </div>
      </div>
    </div>
  );
}
