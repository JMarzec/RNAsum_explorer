import { SectionContainer, SubSection, CollapsibleLegend } from './SectionContainer';
import { DataTableControls } from './DataTableControls';
import { ExpressionProfiles } from './ExpressionProfilePlot';
import { geneExpressions } from '@/data/mockRNAsumData';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function CancerGenesSection() {
  const [viewMode, setViewMode] = useState<'percentiles' | 'zscores'>('percentiles');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter cancer-related genes (oncogenes and tumor suppressors)
  const cancerGenes = geneExpressions.filter(g => 
    g.category === 'oncogene' || g.category === 'tumor_suppressor'
  );
  
  const filteredGenes = cancerGenes.filter(g =>
    g.gene.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'gene', label: 'Gene' },
    { key: 'ensemblId', label: 'ENSEMBL' },
    { key: 'category', label: 'Category' },
    { key: 'zScore', label: 'Z-score' },
    { key: 'percentile', label: 'Percentile' },
  ];

  return (
    <SectionContainer id="cancer-genes" title="Cancer genes">
      <p className="text-sm text-muted-foreground mb-4">
        Expression levels of known oncogenes and tumor suppressor genes. These genes are 
        commonly altered in cancer and may be relevant for understanding tumor biology.
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
                <th>Category</th>
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
                  <td>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs',
                        gene.category === 'oncogene' 
                          ? 'bg-destructive/10 text-destructive border-destructive/30' 
                          : 'bg-info/10 text-info border-info/30'
                      )}
                    >
                      {gene.category === 'oncogene' ? 'Oncogene' : 'TSG'}
                    </Badge>
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
          Showing 1 to {filteredGenes.length} of {cancerGenes.length} entries
        </p>
      </SubSection>

      <SubSection title="Expression profiles">
        <p className="text-sm text-muted-foreground mb-4">
          Expression profiles for key cancer genes.
        </p>
        
        <ExpressionProfiles genes={cancerGenes.slice(0, 5)} />

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
