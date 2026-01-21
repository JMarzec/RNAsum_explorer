import { SectionContainer, SubSection, CollapsibleLegend } from './SectionContainer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { geneExpressions, summaryStats } from '@/data/mockRNAsumData';
import { DataTableControls } from './DataTableControls';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

// Colors for the sunburst/pie chart - matching the original report
const CATEGORY_COLORS = {
  mutated: 'hsl(35, 85%, 55%)',
  fusion: 'hsl(35, 70%, 65%)',
  sv: 'hsl(35, 55%, 70%)',
  immune: 'hsl(25, 70%, 60%)',
  hrd: 'hsl(200, 60%, 55%)',
};

// Genes that appear in multiple sections
const multiSectionGenes = [
  { gene: 'TGFB1', sections: ['Mutated', 'Immune'], count: 2 },
  { gene: 'MAP4K1', sections: ['SV', 'Fusion'], count: 2 },
  { gene: 'AHCYL2', sections: ['Fusion', 'SV'], count: 2 },
  { gene: 'ATRX', sections: ['Mutated', 'HRD'], count: 2 },
];

const sunburstData = [
  { name: 'Mutated', value: 40, genes: ['TGFB1', 'ATRX'] },
  { name: 'Fusion', value: 25, genes: ['MAP4K1', 'AHCYL2'] },
  { name: 'SV', value: 20, genes: ['MAP4K1', 'AHCYL2'] },
  { name: 'Immune', value: 15, genes: ['TGFB1'] },
  { name: 'HRD', value: 15, genes: ['ATRX'] },
];

export function FindingsSummary() {
  const [activeTab, setActiveTab] = useState('plot');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter genes that appear in multiple categories
  const filteredGenes = geneExpressions.filter(g => 
    g.gene.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'gene', label: 'Gene' },
    { key: 'ensemblId', label: 'ENSEMBL' },
    { key: 'zScore', label: 'Z-score' },
    { key: 'percentile', label: 'Percentile' },
    { key: 'category', label: 'Category' },
  ];

  return (
    <SectionContainer id="findings-summary" title="Findings summary">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted mb-4">
          <TabsTrigger value="plot">Per-alteration plot</TabsTrigger>
          <TabsTrigger value="table">Per-gene table</TabsTrigger>
        </TabsList>

        <TabsContent value="plot">
          <p className="text-sm text-muted-foreground mb-4">
            <span className="font-semibold text-foreground">Genes</span> listed in at least two sections 
            of this report are summarised in the plot below. These genes may be of particular interest 
            given that the evidence for their alteration is derived from multiple sources. The number 
            next to each gene indicates the number of times it appears across the following report sections: 
            Mutated genes, Fusion genes (supported by genomic data or reported in FusionGDB), 
            Structural variants, Immune markers or HRD genes.
          </p>

          <div className="flex justify-center py-8">
            <ResponsiveContainer width={400} height={400}>
              <PieChart>
                <Pie
                  data={sunburstData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={160}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {sunburstData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={Object.values(CATEGORY_COLORS)[index % Object.keys(CATEGORY_COLORS).length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ payload }) => {
                    if (payload?.[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded p-2 shadow-lg">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Genes: {data.genes.join(', ')}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <CollapsibleLegend title="Show all altered genes">
            <div className="grid grid-cols-4 gap-2">
              {multiSectionGenes.map(g => (
                <div key={g.gene} className="font-mono text-xs">
                  {g.gene} <span className="text-muted-foreground">({g.count})</span>
                </div>
              ))}
            </div>
          </CollapsibleLegend>
        </TabsContent>

        <TabsContent value="table">
          <SubSection title="Summary table">
            <p className="text-sm text-muted-foreground mb-4">
              Overview of all genes with alterations detected in this sample.
            </p>
            
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
                    <th>Z-score</th>
                    <th>Patient Percentile</th>
                    <th>Category</th>
                    <th>External resources</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGenes.slice(0, 10).map((gene, idx) => (
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
                      <td>
                        <a
                          href={`http://ensembl.org/Homo_sapiens/Gene/Summary?g=${gene.ensemblId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-muted-foreground hover:text-foreground"
                        >
                          {gene.ensemblId}
                        </a>
                      </td>
                      <td className={`font-medium ${gene.zScore >= 2 ? 'text-expression-high' : gene.zScore <= -2 ? 'text-expression-low' : ''}`}>
                        {gene.zScore.toFixed(1)}
                      </td>
                      <td>{gene.percentile}</td>
                      <td>
                        <Badge variant="outline" className="text-xs capitalize">
                          {gene.category.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <a
                            href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene.gene}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Showing 1 to {Math.min(10, filteredGenes.length)} of {filteredGenes.length} entries
            </p>

            <CollapsibleLegend title="Table legend">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Gene:</strong> Gene symbol with link to GeneCards</li>
                <li><strong>ENSEMBL:</strong> Ensembl gene identifier</li>
                <li><strong>Z-score:</strong> Expression Z-score relative to reference cohort</li>
                <li><strong>Patient Percentile:</strong> Expression percentile in cohort</li>
              </ul>
            </CollapsibleLegend>
          </SubSection>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}
