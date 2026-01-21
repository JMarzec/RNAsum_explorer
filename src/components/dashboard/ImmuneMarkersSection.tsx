import { SectionContainer, SubSection, CollapsibleLegend } from './SectionContainer';
import { immuneMarkers, geneExpressions } from '@/data/mockRNAsumData';
import { ExpressionProfiles } from './ExpressionProfilePlot';
import { cn } from '@/lib/utils';

export function ImmuneMarkersSection() {
  // Filter immune-related genes for expression profiles
  const immuneGenes = geneExpressions.filter(g => g.category === 'immune');

  return (
    <SectionContainer id="immune-markers" title="Immune markers">
      <p className="text-sm text-muted-foreground mb-4">
        Expression levels of immune-related genes and markers in the patient's sample compared 
        to the reference cohort. These markers may be relevant for immunotherapy considerations.
      </p>

      <SubSection title="Immune signature scores">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {immuneMarkers.map((marker, idx) => (
            <div 
              key={idx}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{marker.marker}</h4>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  marker.interpretation === 'high' && 'bg-expression-high/10 text-expression-high',
                  marker.interpretation === 'low' && 'bg-expression-low/10 text-expression-low',
                  marker.interpretation === 'normal' && 'bg-muted text-muted-foreground'
                )}>
                  {marker.interpretation}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="font-mono font-medium">{marker.value.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Percentile:</span>
                  <span className="font-mono font-medium">{marker.percentile}th</span>
                </div>
                
                {/* Percentile bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      'h-full rounded-full transition-all',
                      marker.interpretation === 'high' && 'bg-expression-high',
                      marker.interpretation === 'low' && 'bg-expression-low',
                      marker.interpretation === 'normal' && 'bg-primary'
                    )}
                    style={{ width: `${marker.percentile}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <CollapsibleLegend title="Marker descriptions">
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>PD-L1 Expression:</strong> Programmed death-ligand 1 expression level</li>
            <li><strong>CD8+ T-cells:</strong> Cytotoxic T lymphocyte infiltration score</li>
            <li><strong>Tumor Mutational Burden:</strong> Number of mutations per megabase</li>
            <li><strong>Cytolytic Activity:</strong> Geometric mean of GZMA and PRF1 expression</li>
            <li><strong>IFN-γ Signature:</strong> Interferon gamma response signature score</li>
          </ul>
        </CollapsibleLegend>
      </SubSection>

      {immuneGenes.length > 0 && (
        <SubSection title="Immune gene expression profiles">
          <p className="text-sm text-muted-foreground mb-4">
            Expression profiles for key immune-related genes in the patient's sample.
          </p>
          
          <ExpressionProfiles genes={immuneGenes} />

          <CollapsibleLegend title="Plot legend">
            <ul className="space-y-1 text-muted-foreground">
              <li><strong>Black dot:</strong> Patient sample</li>
              <li><strong>Blue line/dots:</strong> Reference cohort distribution</li>
            </ul>
          </CollapsibleLegend>
        </SubSection>
      )}
    </SectionContainer>
  );
}
