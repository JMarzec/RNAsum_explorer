import { GeneExpression } from '@/data/mockRNAsumData';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ReferenceLine,
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

interface ExpressionProfilePlotProps {
  gene: GeneExpression;
  cohortName?: string;
}

// Generate mock cohort distribution data for the gene
function generateCohortDistribution(gene: GeneExpression) {
  const points: { zScore: number; percentile: number; type: 'cohort' }[] = [];
  
  // Generate ~50 cohort data points following a roughly normal distribution
  for (let i = 0; i < 50; i++) {
    const zScore = (Math.random() - 0.5) * 6; // Range roughly -3 to 3
    const percentile = Math.min(100, Math.max(0, 50 + zScore * 15 + (Math.random() - 0.5) * 20));
    points.push({ zScore, percentile, type: 'cohort' });
  }
  
  return points;
}

export function ExpressionProfilePlot({ gene, cohortName = 'PCPG (TCGA)' }: ExpressionProfilePlotProps) {
  const [activeTab, setActiveTab] = useState<string>(gene.gene);
  
  const cohortData = generateCohortDistribution(gene);
  
  // Create a line that follows the general trend
  const trendLine = cohortData
    .sort((a, b) => a.zScore - b.zScore)
    .map(d => ({ ...d }));

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-mono font-semibold">{gene.gene}</h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-foreground" />
            <span>Patient</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary opacity-60" />
            <span>{cohortName}</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            dataKey="zScore" 
            domain={[-5, 5]}
            tickCount={11}
            label={{ value: 'mRNA expression (Z-score)', position: 'bottom', offset: 15, fontSize: 11 }}
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            type="number" 
            dataKey="percentile" 
            domain={[0, 100]}
            label={{ value: 'Percentile', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip 
            contentStyle={{ 
              background: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              fontSize: 12
            }}
            formatter={(value: number, name: string) => [value.toFixed(1), name]}
          />
          
          {/* Cohort distribution line */}
          <Line 
            data={trendLine}
            type="monotone" 
            dataKey="percentile" 
            stroke="hsl(var(--primary))"
            strokeOpacity={0.6}
            strokeWidth={2}
            dot={false}
          />
          
          {/* Cohort scatter points */}
          <Scatter 
            data={cohortData}
            dataKey="percentile"
            fill="hsl(var(--primary))"
            fillOpacity={0.4}
            name={cohortName}
          />
          
          {/* Patient point */}
          <Scatter 
            data={[{ zScore: gene.zScore, percentile: gene.percentile }]}
            dataKey="percentile"
            fill="hsl(var(--foreground))"
            name="Patient"
            shape={(props: any) => (
              <circle cx={props.cx} cy={props.cy} r={6} fill="hsl(var(--foreground))" />
            )}
          />
          
          {/* Reference lines at Z-score thresholds */}
          <ReferenceLine x={-2} stroke="hsl(var(--expression-low))" strokeDasharray="5 5" strokeOpacity={0.5} />
          <ReferenceLine x={2} stroke="hsl(var(--expression-high))" strokeDasharray="5 5" strokeOpacity={0.5} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ExpressionProfilesProps {
  genes: GeneExpression[];
  title?: string;
  description?: string;
}

export function ExpressionProfiles({ genes, title, description }: ExpressionProfilesProps) {
  const [selectedGene, setSelectedGene] = useState(genes[0]?.gene || '');
  const currentGene = genes.find(g => g.gene === selectedGene) || genes[0];
  
  if (!genes.length) return null;

  return (
    <div className="mt-6">
      {title && (
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      
      <Tabs value={selectedGene} onValueChange={setSelectedGene}>
        <TabsList className="mb-4 bg-muted">
          {genes.slice(0, 5).map(gene => (
            <TabsTrigger key={gene.gene} value={gene.gene} className="font-mono text-sm">
              {gene.gene}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {currentGene && <ExpressionProfilePlot gene={currentGene} />}
    </div>
  );
}
