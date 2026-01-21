import { SectionContainer, SubSection, CollapsibleLegend } from './SectionContainer';
import { DataTableControls } from './DataTableControls';
import { ExpressionProfiles } from './ExpressionProfilePlot';
import { CircosPlot } from './CircosPlot';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { geneFusions, geneExpressions } from '@/data/mockRNAsumData';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export function FusionGenesSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPrioritisationOpen, setIsPrioritisationOpen] = useState(false);
  const [isFilteringOpen, setIsFilteringOpen] = useState(false);

  const filteredFusions = geneFusions.filter(f =>
    f.gene5.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.gene3.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get expression data for fusion genes
  const fusionGeneNames = [...new Set(geneFusions.flatMap(f => [f.gene5, f.gene3]))];
  const fusionGeneExpressions = geneExpressions.filter(g => 
    fusionGeneNames.includes(g.gene)
  );

  const columns = [
    { key: 'geneA', label: 'Gene A' },
    { key: 'geneB', label: 'Gene B' },
    { key: 'splitTotal', label: 'Split reads (Total)' },
    { key: 'splitA', label: 'Split reads (A)' },
    { key: 'splitB', label: 'Split reads (B)' },
    { key: 'pairReads', label: 'Pair reads' },
  ];

  return (
    <SectionContainer id="fusion-genes" title="Fusion genes">
      <Collapsible open={isPrioritisationOpen} onOpenChange={setIsPrioritisationOpen} className="mb-4">
        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ChevronDown className={`h-4 w-4 transition-transform ${isPrioritisationOpen ? '' : '-rotate-90'}`} />
          Fusion genes prioritisation
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
          Fusion genes are prioritised based on: (1) DNA support from structural variants, 
          (2) presence in FusionGDB database, (3) involvement of known cancer genes.
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={isFilteringOpen} onOpenChange={setIsFilteringOpen} className="mb-4">
        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ChevronDown className={`h-4 w-4 transition-transform ${isFilteringOpen ? '' : '-rotate-90'}`} />
          Fusion genes filtering
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
          Fusions are filtered to remove common false positives and read-through transcripts.
        </CollapsibleContent>
      </Collapsible>

      <SubSection title="Summary">
        <p className="text-sm text-muted-foreground mb-4">
          Out of the <strong>{geneFusions.length}</strong> fusion event(s){' '}
          <strong>{geneFusions.filter(f => f.cancerRelevant).length}</strong> involve DNA-supported fusion genes 
          (see Structural variants section),{' '}
          <strong>{geneFusions.filter(f => f.database.includes('FusionGDB')).length}</strong> are reported in{' '}
          <a href="https://ccsm.uth.edu/FusionGDB" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            FusionGDB
          </a>{' '}
          and <strong>{geneFusions.filter(f => f.cancerRelevant).length}</strong> involve Cancer genes.
        </p>

        <DataTableControls 
          columns={columns}
          onSearch={setSearchTerm}
          data={filteredFusions.map(f => ({
            geneA: f.gene5,
            geneB: f.gene3,
            splitTotal: f.junctionReads,
            splitA: Math.floor(f.junctionReads * 0.6),
            splitB: Math.floor(f.junctionReads * 0.4),
            pairReads: f.spanningFrags,
          }))}
        />

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="genomic-table">
            <thead>
              <tr>
                <th>Gene A</th>
                <th>Gene B</th>
                <th>Split reads (Total)</th>
                <th>Split reads (A)</th>
                <th>Split reads (B)</th>
                <th>Pair reads</th>
                <th>FFPM</th>
                <th>In-Frame</th>
                <th>Databases</th>
              </tr>
            </thead>
            <tbody>
              {filteredFusions.map((fusion, idx) => (
                <tr key={idx}>
                  <td>
                    <a 
                      href={`https://ccsm.uth.edu/FusionGDB/gene_search_result.cgi?page=page&type=quick_search&quick_search=${fusion.gene5}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-medium text-primary hover:underline"
                    >
                      {fusion.gene5}
                    </a>
                  </td>
                  <td>
                    <a 
                      href={`https://ccsm.uth.edu/FusionGDB/gene_search_result.cgi?page=page&type=quick_search&quick_search=${fusion.gene3}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-medium text-primary hover:underline"
                    >
                      {fusion.gene3}
                    </a>
                  </td>
                  <td className="font-mono">{fusion.junctionReads}</td>
                  <td className="font-mono">{Math.floor(fusion.junctionReads * 0.6)}</td>
                  <td className="font-mono">{Math.floor(fusion.junctionReads * 0.4)}</td>
                  <td className="font-mono">{fusion.spanningFrags}</td>
                  <td className="font-mono">{fusion.ffpm.toFixed(1)}</td>
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
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Showing 1 to {filteredFusions.length} of {geneFusions.length} entries
        </p>

        <CollapsibleLegend title="Table legend">
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>Gene A/B:</strong> 5' and 3' fusion partner genes</li>
            <li><strong>Split reads:</strong> Reads spanning the fusion junction</li>
            <li><strong>Pair reads:</strong> Discordant read pairs supporting the fusion</li>
            <li><strong>FFPM:</strong> Fusion Fragments Per Million mapped reads</li>
            <li><strong>In-Frame:</strong> Whether the fusion preserves the reading frame</li>
          </ul>
        </CollapsibleLegend>
      </SubSection>

      <SubSection title="Genomic view">
        <p className="text-sm text-muted-foreground mb-4">
          {geneFusions.filter(f => f.cancerRelevant).length} DNA-supported fusion genes 
          (see Structural variants section) and{' '}
          {geneFusions.filter(f => f.database.includes('FusionGDB')).length} fusions events reported in{' '}
          <a href="https://ccsm.uth.edu/FusionGDB" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            FusionGDB
          </a>{' '}
          are presented in the genomic context. <span className="text-destructive">Red</span> is used for links 
          between positions of same chromosomes and <span className="text-primary">blue</span> for links 
          between different chromosomes.
        </p>
        
        <CircosPlot width={450} height={450} />
      </SubSection>

      <SubSection title="Fusion genes expression">
        <p className="text-sm text-muted-foreground mb-4">
          mRNA expression levels of fusion genes detected in patient's sample and their average mRNA expression (Z-score) 
          in samples from cancer cohorts.
        </p>
        
        {fusionGeneExpressions.length > 0 ? (
          <ExpressionProfiles 
            genes={fusionGeneExpressions.slice(0, 5)}
          />
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No expression data available for detected fusion genes.
          </p>
        )}

        <CollapsibleLegend title="Plot legend">
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>Black dot:</strong> Patient sample</li>
            <li><strong>Blue line/dots:</strong> Reference cohort distribution</li>
          </ul>
        </CollapsibleLegend>
      </SubSection>
    </SectionContainer>
  );
}
