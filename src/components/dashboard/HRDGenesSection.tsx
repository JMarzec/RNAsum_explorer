import { SectionContainer, SubSection, CollapsibleLegend } from './SectionContainer';
import { DataTableControls } from './DataTableControls';
import { ExpressionProfiles } from './ExpressionProfilePlot';
import { geneExpressions } from '@/data/mockRNAsumData';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function HRDGenesSection() {
  const [viewMode, setViewMode] = useState<'percentiles' | 'zscores'>('percentiles');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter HRD genes
  const hrdGenes = geneExpressions.filter(g => g.category === 'hrd');
  
  const filteredGenes = hrdGenes.filter(g =>
    g.gene.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'gene', label: 'Gene' },
    { key: 'ensemblId', label: 'ENSEMBL' },
    { key: 'zScore', label: 'Z-score' },
    { key: 'percentile', label: 'Percentile' },
  ];

  return (
    <SectionContainer id="hrd-genes" title="HRD genes">
      <p className="text-sm text-muted-foreground mb-4">
        Expression levels of Homologous Recombination Deficiency (HRD) related genes. 
        Alterations in these genes may indicate sensitivity to PARP inhibitors and platinum-based chemotherapy.
      </p>

      <SubSection title="Summary table">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList className="bg-muted mb-4">
            <TabsTrigger value="percentiles">Percentiles</TabsTrigger>
            <TabsTrigger value="zscores">Z-scores</TabsTrigger>
          </TabsList>
        </Tabs>

        <DataTableControls 
          columns={columns}
          onSearch={setSearchTerm}
          data={filteredGenes}
        />

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="genomic-table">
            <thead>
              <tr>
                <th>Gene</th>
                <th>ENSEMBL</th>
                <th>PCPG (TCGA)</th>
                <th>Patient</th>
                <th>Diff</th>
                <th>External resources</th>
              </tr>
            </thead>
            <tbody>
              {filteredGenes.map((gene, idx) => (
                <tr key={idx}>
                  <td>
                    <a 
                      href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene.gene}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-medium text-primary hover:underline"
                    >
                      {gene.gene}
                    </a>
                  </td>
                  <td className="font-mono text-xs text-muted-foreground">
                    {gene.ensemblId}
                  </td>
                  <td className="font-mono text-sm">
                    {viewMode === 'percentiles' ? '50%' : '0.0'}
                  </td>
                  <td className={cn(
                    'font-mono text-sm font-medium',
                    gene.zScore >= 2 && 'text-expression-high',
                    gene.zScore <= -2 && 'text-expression-low'
                  )}>
                    {viewMode === 'percentiles' ? `${gene.percentile}%` : gene.zScore.toFixed(1)}
                  </td>
                  <td className="font-mono text-sm">
                    {Math.abs(gene.percentile - 50)}
                  </td>
                  <td>
                    <a
                      href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene.gene}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      Link
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Showing 1 to {filteredGenes.length} of {hrdGenes.length} entries
        </p>
      </SubSection>

      <SubSection title="Expression profiles">
        <p className="text-sm text-muted-foreground mb-4">
          Expression profiles for HRD pathway genes.
        </p>
        
        <ExpressionProfiles genes={hrdGenes.slice(0, 5)} />

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
