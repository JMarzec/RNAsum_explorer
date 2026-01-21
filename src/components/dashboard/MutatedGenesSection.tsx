import { SectionContainer, SubSection, CollapsibleLegend } from './SectionContainer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DataTableControls } from './DataTableControls';
import { ExpressionProfiles } from './ExpressionProfilePlot';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { mutatedGenes, geneExpressions, summaryStats } from '@/data/mockRNAsumData';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function MutatedGenesSection() {
  const [viewMode, setViewMode] = useState<'percentiles' | 'zscores'>('percentiles');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMutations = mutatedGenes.filter(m =>
    m.gene.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.variant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get expression data for mutated genes
  const mutatedGeneExpressions = geneExpressions.filter(g => 
    mutatedGenes.some(m => m.gene === g.gene) && g.zScore !== null
  ).sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));

  const columns = [
    { key: 'gene', label: 'Gene' },
    { key: 'ensembl', label: 'ENSEMBL' },
    { key: 'pcpg', label: 'PCPG (TCGA)' },
    { key: 'patient', label: 'Patient' },
    { key: 'diff', label: 'Diff' },
    { key: 'tier', label: 'TIER' },
    { key: 'consequence', label: 'CON' },
  ];

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-destructive text-destructive-foreground';
      case 2: return 'bg-warning text-warning-foreground';
      case 3: return 'bg-info text-info-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <SectionContainer id="mutated-genes" title="Mutated genes">
      <p className="text-sm text-muted-foreground mb-4">
        mRNA expression levels of genes containing single nucleotide variants (SNVs) or 
        insertions/deletions (indels), obtained from the{' '}
        <a href="https://github.com/sigven/pcgr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          PCGR
        </a>{' '}
        report, in patient's sample and their average mRNA expression in samples from cancer cohorts.{' '}
        <strong>NOTE</strong>, only PCGR tiers 1-4 and non-coding splice region variants are reported.
      </p>

      <SubSection title="Summary table">
        <p className="text-sm text-muted-foreground mb-4">
          <strong>Findings summary:</strong> Out of the {summaryStats.mutatedGenes} mutated genes, {mutatedGenes.filter(m => m.tier <= 4).length} include 
          tier 1-4 variants and {mutatedGenes.filter(m => m.consequence.includes('splice')).length} non-coding splice region variant. 
          Of these, the expression of {mutatedGenes.filter(m => m.zScore !== null).length} was reliably measured in the patient's sample.
        </p>

        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList className="bg-muted mb-4">
            <TabsTrigger value="percentiles">Percentiles</TabsTrigger>
            <TabsTrigger value="zscores">Z-scores</TabsTrigger>
          </TabsList>
        </Tabs>

        <DataTableControls 
          columns={columns}
          onSearch={setSearchTerm}
          data={filteredMutations.map(m => ({
            gene: m.gene,
            variant: m.variant,
            tier: m.tier,
            consequence: m.consequence,
            zScore: m.zScore,
          }))}
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
                <th>TIER</th>
                <th>CON</th>
              </tr>
            </thead>
            <tbody>
              {filteredMutations.map((mutation, idx) => {
                const geneData = geneExpressions.find(g => g.gene === mutation.gene);
                return (
                  <tr key={idx}>
                    <td>
                      <a 
                        href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${mutation.gene}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-medium text-primary hover:underline"
                      >
                        {mutation.gene}
                      </a>
                    </td>
                    <td className="font-mono text-xs text-muted-foreground">
                      {geneData?.ensemblId || 'N/A'}
                    </td>
                    <td className="font-mono text-sm">
                      {viewMode === 'percentiles' 
                        ? (geneData ? `${50}%` : '—')
                        : (geneData ? '0.0' : '—')
                      }
                    </td>
                    <td className={cn(
                      'font-mono text-sm font-medium',
                      mutation.zScore && mutation.zScore >= 2 && 'text-expression-high',
                      mutation.zScore && mutation.zScore <= -2 && 'text-expression-low'
                    )}>
                      {viewMode === 'percentiles'
                        ? (geneData ? `${geneData.percentile}%` : '—')
                        : (mutation.zScore?.toFixed(1) || '—')
                      }
                    </td>
                    <td className="font-mono text-sm">
                      {geneData ? Math.abs(geneData.percentile - 50) : '—'}
                    </td>
                    <td>
                      <a
                        href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${mutation.gene}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        Link <ExternalLink className="h-3 w-3 inline ml-1" />
                      </a>
                    </td>
                    <td>
                      <Badge className={cn('text-xs', getTierColor(mutation.tier))}>
                        {mutation.tier === 1 && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {mutation.tier}
                      </Badge>
                    </td>
                    <td className="text-xs text-muted-foreground max-w-32 truncate">
                      {mutation.consequence.replace(/_/g, ' ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Showing 1 to {filteredMutations.length} of {mutatedGenes.length} entries
        </p>

        <CollapsibleLegend title="Table legend">
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>Gene:</strong> Gene symbol with link to GeneCards</li>
            <li><strong>ENSEMBL:</strong> Ensembl gene identifier</li>
            <li><strong>PCPG (TCGA):</strong> Median expression in TCGA cohort</li>
            <li><strong>Patient:</strong> Patient's expression level</li>
            <li><strong>Diff:</strong> Difference from cohort median</li>
            <li><strong>TIER:</strong> PCGR variant tier (1-4, lower = higher clinical significance)</li>
            <li><strong>CON:</strong> Consequence type</li>
          </ul>
        </CollapsibleLegend>
      </SubSection>

      <SubSection title="Expression profiles">
        <p className="text-sm text-muted-foreground mb-4">
          Expression profiles for {mutatedGeneExpressions.slice(0, 5).length} mutated genes with variants annotated 
          with the lowest tier and demonstrating the greatest difference in mRNA expression (percentile) 
          values between patient's sample and the average mRNA expression in samples from cancer patients.
        </p>
        
        <ExpressionProfiles 
          genes={mutatedGeneExpressions.slice(0, 5)}
        />

        <CollapsibleLegend title="Plot legend">
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>Black dot:</strong> Patient sample</li>
            <li><strong>Blue line/dots:</strong> Reference cohort distribution</li>
            <li><strong>Dashed lines:</strong> Z-score thresholds (±2)</li>
          </ul>
        </CollapsibleLegend>

        <CollapsibleLegend title="Read counts">
          <p className="text-muted-foreground">
            Read count normalization details and TPM/FPKM values available in detailed export.
          </p>
        </CollapsibleLegend>

        <CollapsibleLegend title="Expression distribution patterns">
          <p className="text-muted-foreground">
            Expression distribution across the reference cohort follows a normal distribution 
            centered around Z-score = 0.
          </p>
        </CollapsibleLegend>
      </SubSection>
    </SectionContainer>
  );
}
