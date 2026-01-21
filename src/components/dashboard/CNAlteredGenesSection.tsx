import { SectionContainer, SubSection, CollapsibleLegend } from './SectionContainer';
import { DataTableControls } from './DataTableControls';
import { Badge } from '@/components/ui/badge';
import { cnvGenes, geneExpressions } from '@/data/mockRNAsumData';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function CNAlteredGenesSection() {
  const [viewMode, setViewMode] = useState<'percentiles' | 'zscores'>('percentiles');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCNVs = cnvGenes.filter(cnv =>
    cnv.gene.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'gene', label: 'Gene' },
    { key: 'chromosome', label: 'Chromosome' },
    { key: 'copyNumber', label: 'Copy Number' },
    { key: 'type', label: 'Type' },
    { key: 'zScore', label: 'Z-score' },
  ];

  return (
    <SectionContainer id="cn-altered" title="CN altered genes">
      <p className="text-sm text-muted-foreground mb-4">
        Section overlaying the mRNA expression data with per-gene somatic copy-number (CN) data 
        (from <a href="https://github.com/hartwigmedical/hmftools/tree/master/purple" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PURPLE</a>), 
        as well as SNVs/indels and SV data, if available.
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
          data={filteredCNVs}
        />

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="genomic-table">
            <thead>
              <tr>
                <th>Gene</th>
                <th>Chromosome</th>
                <th>Copy Number</th>
                <th>Type</th>
                <th>Patient Expression</th>
                <th>Z-score</th>
              </tr>
            </thead>
            <tbody>
              {filteredCNVs.map((cnv, idx) => {
                const geneData = geneExpressions.find(g => g.gene === cnv.gene);
                return (
                  <tr key={idx}>
                    <td>
                      <a 
                        href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${cnv.gene}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-medium text-primary hover:underline"
                      >
                        {cnv.gene}
                      </a>
                    </td>
                    <td className="font-mono text-sm">{cnv.chromosome}</td>
                    <td className="font-mono font-medium">{cnv.copyNumber}</td>
                    <td>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'text-xs',
                          cnv.type === 'gain' ? 'bg-cnv-gain/10 text-cnv-gain border-cnv-gain/30' : 'bg-cnv-loss/10 text-cnv-loss border-cnv-loss/30'
                        )}
                      >
                        {cnv.type === 'gain' ? 'Amplification' : 'Deletion'}
                      </Badge>
                    </td>
                    <td className="font-mono text-sm">
                      {geneData ? `${geneData.percentile}%` : '—'}
                    </td>
                    <td className={cn(
                      'font-mono font-medium',
                      cnv.zScore && cnv.zScore >= 2 && 'text-expression-high',
                      cnv.zScore && cnv.zScore <= -2 && 'text-expression-low'
                    )}>
                      {cnv.zScore?.toFixed(1) ?? '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Showing 1 to {filteredCNVs.length} of {cnvGenes.length} entries
        </p>

        <CollapsibleLegend title="Table legend">
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>Copy Number:</strong> Estimated copy number from PURPLE</li>
            <li><strong>Type:</strong> Amplification (gain) or Deletion (loss)</li>
          </ul>
        </CollapsibleLegend>
      </SubSection>

      <SubSection title="Genomic view">
        <p className="text-sm text-muted-foreground mb-4">
          {cnvGenes.length} genes with available CN data (y-axis) are presented in the genomic context (x-axis). 
          <span className="text-destructive"> {cnvGenes.filter(g => g.type === 'gain').length}</span> of them 
          (indicated by <span className="text-destructive">red</span>) are Cancer genes and are gained or lost. 
          All other genes are marked in gray/black (alternating per chromosome).
        </p>
        
        <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground border border-dashed border-border">
          <p>Genome-wide copy number plot</p>
          <p className="text-xs mt-1">(Visualization available in full report)</p>
        </div>
      </SubSection>

      <SubSection title="Expression vs CN">
        <p className="text-sm text-muted-foreground mb-4">
          Scatterplot comparing the per-gene difference in mRNA expression of Cancer genes between 
          patient's sample and cancer individuals (y-axis), and CN values (x-axis, from PURPLE).
        </p>
        
        <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground border border-dashed border-border">
          <p>Expression vs Copy Number scatter plot</p>
          <p className="text-xs mt-1">(Visualization available in full report)</p>
        </div>
      </SubSection>
    </SectionContainer>
  );
}
