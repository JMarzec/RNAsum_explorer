import { SectionContainer, SubSection, CollapsibleLegend } from './SectionContainer';
import { DataTableControls } from './DataTableControls';
import { ExpressionProfiles } from './ExpressionProfilePlot';
import { Badge } from '@/components/ui/badge';
import { geneExpressions } from '@/data/mockRNAsumData';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock SV data based on the report structure
const structuralVariants = [
  { gene: 'STIP1', ensemblId: 'ENSG00000168439', tier: 2, event: 'DUP', effect: 'intron' },
  { gene: 'NRXN2', ensemblId: 'ENSG00000110076', tier: 3, event: 'DEL', effect: 'upstream' },
  { gene: 'MAP4K1', ensemblId: 'ENSG00000104814', tier: 2, event: 'INV', effect: 'intron' },
  { gene: 'CCDC146', ensemblId: 'ENSG00000163207', tier: 4, event: 'BND', effect: 'downstream' },
  { gene: 'FHIT', ensemblId: 'ENSG00000189283', tier: 3, event: 'DEL', effect: 'exon' },
];

export function StructuralVariantsSection() {
  const [viewMode, setViewMode] = useState<'percentiles' | 'zscores'>('percentiles');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSVs = structuralVariants.filter(sv =>
    sv.gene.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get expression data for SV-affected genes
  const svGeneExpressions = geneExpressions.filter(g => 
    structuralVariants.some(sv => sv.gene === g.gene) || 
    ['STIP1', 'NRXN2', 'MAP4K1'].includes(g.gene)
  ).slice(0, 5);

  // Use some available genes if we don't have matches
  const displayGenes = svGeneExpressions.length > 0 
    ? svGeneExpressions 
    : geneExpressions.slice(0, 5);

  const columns = [
    { key: 'gene', label: 'Gene' },
    { key: 'ensembl', label: 'ENSEMBL' },
    { key: 'pcpg', label: 'PCPG (TCGA)' },
    { key: 'patient', label: 'Patient' },
    { key: 'diff', label: 'Diff' },
    { key: 'tier', label: 'Tier' },
    { key: 'event', label: 'Event' },
    { key: 'effect', label: 'Effect' },
  ];

  return (
    <SectionContainer id="structural-variants" title="Structural variants">
      <p className="text-sm text-muted-foreground mb-4">
        mRNA expression levels of genes located within detected structural variants (SVs), 
        obtained from the{' '}
        <a href="https://github.com/Illumina/manta" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Manta
        </a>{' '}
        SV caller, in the patient's sample and their average mRNA expression in samples from cancer cohorts.
      </p>

      <SubSection title="Summary table">
        <p className="text-sm text-muted-foreground mb-4">
          Out of the 681 genes affected by 76 SVs, the expression of <strong>425</strong> was reliably 
          measured in the patient's sample. The remaining 256 genes are either not expressed or their 
          expression level is too low to be detected (indicated in BLANK cells with missing values).
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
          data={filteredSVs}
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
                <th>Tier</th>
                <th>Event</th>
                <th>Effect</th>
              </tr>
            </thead>
            <tbody>
              {filteredSVs.map((sv, idx) => {
                const geneData = geneExpressions.find(g => g.gene === sv.gene);
                const patientPercentile = geneData?.percentile ?? Math.floor(Math.random() * 100);
                const patientZScore = geneData?.zScore ?? (Math.random() - 0.5) * 4;
                
                return (
                  <tr key={idx}>
                    <td>
                      <a 
                        href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${sv.gene}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-medium text-primary hover:underline"
                      >
                        {sv.gene}
                      </a>
                    </td>
                    <td className="font-mono text-xs text-muted-foreground">
                      {sv.ensemblId}
                    </td>
                    <td className="font-mono text-sm">
                      {viewMode === 'percentiles' ? '50%' : '0.0'}
                    </td>
                    <td className={`font-mono text-sm font-medium ${
                      patientZScore >= 2 ? 'text-expression-high' : 
                      patientZScore <= -2 ? 'text-expression-low' : ''
                    }`}>
                      {viewMode === 'percentiles' ? `${patientPercentile}%` : patientZScore.toFixed(1)}
                    </td>
                    <td className="font-mono text-sm">
                      {Math.abs(patientPercentile - 50)}
                    </td>
                    <td>
                      <a
                        href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${sv.gene}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        Link
                      </a>
                    </td>
                    <td>
                      <Badge variant="outline" className="text-xs">
                        {sv.tier}
                      </Badge>
                    </td>
                    <td className="font-mono text-xs">{sv.event}</td>
                    <td className="text-xs text-muted-foreground">{sv.effect}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Showing 1 to {filteredSVs.length} of 1,683 entries
        </p>

        <CollapsibleLegend title="Table legend">
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>Event:</strong> Type of structural variant (DUP, DEL, INV, BND)</li>
            <li><strong>Effect:</strong> Location relative to gene (intron, exon, upstream, downstream)</li>
          </ul>
        </CollapsibleLegend>
      </SubSection>

      <SubSection title="Expression profiles">
        <p className="text-sm text-muted-foreground mb-4">
          Expression profiles for 5 SVs-affected genes with the highest priority (low tier) and 
          demonstrating the greatest difference in mRNA expression (percentile) values between 
          patient's sample and the average mRNA expression in samples from cancer patients.
        </p>
        
        <ExpressionProfiles genes={displayGenes} />

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
