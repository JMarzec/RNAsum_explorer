import { SectionContainer, SubSection, CollapsibleLegend } from './SectionContainer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DataTableControls } from './DataTableControls';
import { ExternalLink } from 'lucide-react';
import { useState, useMemo } from 'react';
import { usePatientData } from '@/contexts/PatientDataContext';
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
  cn: 'hsl(200, 60%, 55%)',
  immune: 'hsl(25, 70%, 60%)',
  hrd: 'hsl(140, 50%, 45%)',
};

interface AlteredGene {
  gene: string;
  ensemblId: string;
  mutated: boolean;
  fusion: boolean;
  sv: boolean;
  cn: boolean;
  immune: boolean;
  hrd: boolean;
  count: number;
  resources: string[];
}

export function FindingsSummary() {
  const { data } = usePatientData();
  const [activeTab, setActiveTab] = useState('plot');
  const [searchTerm, setSearchTerm] = useState('');

  // Build consolidated altered genes list from all data sources
  const alteredGenes = useMemo(() => {
    const geneMap = new Map<string, AlteredGene>();

    const getOrCreateGene = (geneName: string, ensemblId?: string): AlteredGene => {
      if (!geneMap.has(geneName)) {
        geneMap.set(geneName, {
          gene: geneName,
          ensemblId: ensemblId || '',
          mutated: false,
          fusion: false,
          sv: false,
          cn: false,
          immune: false,
          hrd: false,
          count: 0,
          resources: [],
        });
      }
      const gene = geneMap.get(geneName)!;
      if (ensemblId && !gene.ensemblId) gene.ensemblId = ensemblId;
      return gene;
    };

    // Process mutated genes
    data.mutatedGenes.forEach(m => {
      const gene = getOrCreateGene(m.gene);
      if (!gene.mutated) {
        gene.mutated = true;
        gene.count++;
      }
    });

    // Process fusions (both 5' and 3' partners)
    data.geneFusions.forEach(f => {
      [f.gene5, f.gene3].forEach(geneName => {
        const gene = getOrCreateGene(geneName);
        if (!gene.fusion) {
          gene.fusion = true;
          gene.count++;
        }
        // Add database sources
        f.database.forEach(db => {
          if (!gene.resources.includes(db)) {
            gene.resources.push(db);
          }
        });
      });
    });

    // Process CNV genes
    data.cnvGenes.forEach(c => {
      const gene = getOrCreateGene(c.gene);
      if (!gene.cn) {
        gene.cn = true;
        gene.count++;
      }
    });

    // Process immune markers from gene expressions
    data.geneExpressions
      .filter(e => e.category === 'immune')
      .forEach(e => {
        const gene = getOrCreateGene(e.gene, e.ensemblId);
        if (!gene.immune) {
          gene.immune = true;
          gene.count++;
        }
      });

    // Process HRD genes from gene expressions
    data.geneExpressions
      .filter(e => e.category === 'hrd')
      .forEach(e => {
        const gene = getOrCreateGene(e.gene, e.ensemblId);
        if (!gene.hrd) {
          gene.hrd = true;
          gene.count++;
        }
      });

    // Add VICC as a resource for all genes (commonly used annotation)
    geneMap.forEach(gene => {
      if (!gene.resources.includes('VICC')) {
        gene.resources.push('VICC');
      }
    });

    // Sort by count (descending), then alphabetically
    return Array.from(geneMap.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.gene.localeCompare(b.gene);
    });
  }, [data]);

  // Filter by search term
  const filteredGenes = alteredGenes.filter(g =>
    g.gene.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sunburst data for multi-section genes
  const multiSectionGenes = alteredGenes.filter(g => g.count >= 2);
  
  const sunburstData = useMemo(() => {
    const sections = [
      { name: 'Mutated', key: 'mutated' as const, genes: multiSectionGenes.filter(g => g.mutated).map(g => g.gene) },
      { name: 'Fusion', key: 'fusion' as const, genes: multiSectionGenes.filter(g => g.fusion).map(g => g.gene) },
      { name: 'CN', key: 'cn' as const, genes: multiSectionGenes.filter(g => g.cn).map(g => g.gene) },
      { name: 'Immune', key: 'immune' as const, genes: multiSectionGenes.filter(g => g.immune).map(g => g.gene) },
      { name: 'HRD', key: 'hrd' as const, genes: multiSectionGenes.filter(g => g.hrd).map(g => g.gene) },
    ];
    return sections.filter(s => s.genes.length > 0).map(s => ({
      name: s.name,
      value: s.genes.length,
      genes: s.genes,
    }));
  }, [multiSectionGenes]);

  const columns = [
    { key: 'gene', label: 'Gene' },
    { key: 'mutated', label: 'Mutated' },
    { key: 'fusion', label: 'Fusion' },
    { key: 'sv', label: 'SV' },
    { key: 'cn', label: 'CN' },
    { key: 'immune', label: 'Immune' },
    { key: 'hrd', label: 'HRD' },
    { key: 'resources', label: 'Resources' },
    { key: 'count', label: 'Count' },
  ];

  const SectionIndicator = ({ active }: { active: boolean }) => (
    active ? (
      <span className="inline-flex items-center justify-center w-12 h-6 text-xs font-medium bg-foreground text-background rounded">
        Yes
      </span>
    ) : (
      <span className="text-muted-foreground text-xs">-</span>
    )
  );

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
            CN altered genes, Immune markers or HRD genes.
          </p>

          {sunburstData.length > 0 ? (
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
                        const chartData = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded p-2 shadow-lg">
                            <p className="font-medium">{chartData.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Genes: {chartData.genes.join(', ')}
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
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No genes appear in multiple sections.
            </div>
          )}

          <CollapsibleLegend title="Show all multi-section genes">
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
              Table summarising <span className="font-semibold text-foreground">all altered genes</span> listed across following report sections:{' '}
              <a href="#mutated-genes" className="text-primary hover:underline">Mutated genes</a>,{' '}
              <a href="#fusion-genes" className="text-primary hover:underline">Fusion genes</a>{' '}
              (supported by genomic data or reported in FusionGDB),{' '}
              <a href="#structural-variants" className="text-primary hover:underline">Structural variants</a>,{' '}
              <a href="#cn-altered" className="text-primary hover:underline">CN altered genes</a>{' '}
              (CN values =&lt; 2.01 or &gt;= 6.39 and reported as cancer genes){' '}
              <a href="#immune-markers" className="text-primary hover:underline">Immune markers</a> or{' '}
              <a href="#hrd-genes" className="text-primary hover:underline">HRD genes</a>.{' '}
              The <em>Resources</em> column contains links to databases that may provide additional source of evidence 
              for the altered genes' clinical significance. Genes ordered by the number of report sections they appear in 
              (<em>Count</em> column) and then alphabetically.
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
                    <th className="text-center">Mutated</th>
                    <th className="text-center">Fusion</th>
                    <th className="text-center">SV</th>
                    <th className="text-center">CN</th>
                    <th className="text-center">Immune</th>
                    <th className="text-center">HRD</th>
                    <th>Resources</th>
                    <th className="text-center">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGenes.slice(0, 15).map((gene, idx) => (
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
                      <td className="text-center"><SectionIndicator active={gene.mutated} /></td>
                      <td className="text-center"><SectionIndicator active={gene.fusion} /></td>
                      <td className="text-center"><SectionIndicator active={gene.sv} /></td>
                      <td className="text-center"><SectionIndicator active={gene.cn} /></td>
                      <td className="text-center"><SectionIndicator active={gene.immune} /></td>
                      <td className="text-center"><SectionIndicator active={gene.hrd} /></td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {gene.resources.slice(0, 3).map((resource, rIdx) => (
                            <a
                              key={rIdx}
                              href={
                                resource === 'VICC' ? 'https://search.cancervariants.org/' :
                                resource === 'OncoKB' ? `https://www.oncokb.org/gene/${gene.gene}` :
                                resource === 'CIViC' ? `https://civicdb.org/genes/${gene.gene}/summary` :
                                resource === 'COSMIC' ? `https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=${gene.gene}` :
                                resource === 'FusionGDB' ? 'https://ccsm.uth.edu/FusionGDB/' :
                                '#'
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              {resource}
                            </a>
                          ))}
                        </div>
                      </td>
                      <td className="text-center font-medium">{gene.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Showing 1 to {Math.min(15, filteredGenes.length)} of {filteredGenes.length} entries
            </p>

            <CollapsibleLegend title="Table legend">
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Gene:</strong> Gene symbol with link to GeneCards</li>
                <li><strong>Mutated/Fusion/SV/CN/Immune/HRD:</strong> "Yes" indicates gene is present in that report section</li>
                <li><strong>Resources:</strong> Links to external databases (VICC, OncoKB, CIViC, COSMIC, FusionGDB)</li>
                <li><strong>Count:</strong> Number of report sections the gene appears in</li>
              </ul>
            </CollapsibleLegend>
          </SubSection>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}
