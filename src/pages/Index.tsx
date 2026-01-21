import { useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { SampleHeader } from '@/components/dashboard/SampleHeader';
import { NavigationTabs, TabId } from '@/components/dashboard/NavigationTabs';
import { ExpressionHeatmap } from '@/components/dashboard/ExpressionHeatmap';
import { GeneCard } from '@/components/dashboard/GeneCard';
import { FusionTable } from '@/components/dashboard/FusionTable';
import { MutationTable } from '@/components/dashboard/MutationTable';
import { DrugMatchTable } from '@/components/dashboard/DrugMatchTable';
import { ImmuneProfile } from '@/components/dashboard/ImmuneProfile';
import { CNVTable } from '@/components/dashboard/CNVTable';
import { 
  sampleInfo, 
  summaryStats, 
  geneExpressions,
} from '@/data/mockRNAsumData';
import { 
  AlertTriangle, 
  BarChart3, 
  Dna, 
  GitMerge, 
  Pill, 
  TrendingDown, 
  TrendingUp 
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Filter genes by category for display
  const topUpregulated = geneExpressions
    .filter(g => g.zScore >= 2)
    .sort((a, b) => b.zScore - a.zScore)
    .slice(0, 4);

  const topDownregulated = geneExpressions
    .filter(g => g.zScore <= -2)
    .sort((a, b) => a.zScore - b.zScore)
    .slice(0, 4);

  const drugTargets = geneExpressions
    .filter(g => g.category === 'drug_target')
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SampleHeader sample={sampleInfo} />
      
      {/* Navigation */}
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <StatCard
                title="Genes Analyzed"
                value={summaryStats.totalGenesAnalyzed.toLocaleString()}
                icon={BarChart3}
              />
              <StatCard
                title="Upregulated"
                value={summaryStats.upregulatedGenes}
                subtitle="Z ≥ 2"
                icon={TrendingUp}
                variant="destructive"
              />
              <StatCard
                title="Downregulated"
                value={summaryStats.downregulatedGenes}
                subtitle="Z ≤ -2"
                icon={TrendingDown}
                variant="primary"
              />
              <StatCard
                title="Tier I Variants"
                value={summaryStats.tierOneVariants}
                icon={AlertTriangle}
                variant="warning"
              />
              <StatCard
                title="Fusions"
                value={summaryStats.fusionsDetected}
                icon={GitMerge}
              />
              <StatCard
                title="CNV Genes"
                value={summaryStats.cnvAltered}
                icon={Dna}
              />
              <StatCard
                title="Drug Matches"
                value={summaryStats.drugMatches}
                icon={Pill}
                variant="success"
              />
            </div>

            {/* Key Findings Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <ExpressionHeatmap />
                <ImmuneProfile />
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Top Upregulated */}
                <div>
                  <h3 className="section-header">
                    <span className="h-5 w-1 bg-expression-high rounded-full" />
                    Top Upregulated Genes
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {topUpregulated.map(gene => (
                      <GeneCard key={gene.gene} gene={gene} />
                    ))}
                  </div>
                </div>

                {/* Top Downregulated */}
                <div>
                  <h3 className="section-header">
                    <span className="h-5 w-1 bg-expression-low rounded-full" />
                    Top Downregulated Genes
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {topDownregulated.map(gene => (
                      <GeneCard key={gene.gene} gene={gene} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Tables */}
            <div className="grid lg:grid-cols-2 gap-6">
              <FusionTable />
              <DrugMatchTable />
            </div>
          </div>
        )}

        {activeTab === 'expression' && (
          <div className="space-y-6">
            <ExpressionHeatmap />
            <div>
              <h3 className="section-header mb-4">
                <span className="h-5 w-1 bg-primary rounded-full" />
                All Analyzed Genes
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {geneExpressions.map(gene => (
                  <GeneCard key={gene.gene} gene={gene} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mutations' && (
          <div className="space-y-6">
            <MutationTable />
            <div>
              <h3 className="section-header mb-4">
                <span className="h-5 w-1 bg-genomic-mutation rounded-full" />
                Mutated Genes Expression
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {geneExpressions.filter(g => g.hasMutation).map(gene => (
                  <GeneCard key={gene.gene} gene={gene} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fusions' && (
          <div className="space-y-6">
            <FusionTable />
          </div>
        )}

        {activeTab === 'cnv' && (
          <div className="space-y-6">
            <CNVTable />
            <div>
              <h3 className="section-header mb-4">
                <span className="h-5 w-1 bg-primary rounded-full" />
                CNV-Altered Genes Expression
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {geneExpressions.filter(g => g.hasCNV !== null).map(gene => (
                  <GeneCard key={gene.gene} gene={gene} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drugs' && (
          <div className="space-y-6">
            <DrugMatchTable />
            <div>
              <h3 className="section-header mb-4">
                <span className="h-5 w-1 bg-success rounded-full" />
                Drug Target Genes Expression
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {drugTargets.map(gene => (
                  <GeneCard key={gene.gene} gene={gene} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'immune' && (
          <div className="max-w-2xl">
            <ImmuneProfile />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-4 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>
            Generated by <span className="font-medium text-foreground">RNAsum</span> • 
            Reference: {sampleInfo.referenceCohort}
          </p>
          <p className="font-mono text-xs">
            Analysis Date: {sampleInfo.analysisDate}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
