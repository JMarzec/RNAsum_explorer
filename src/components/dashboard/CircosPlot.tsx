import { useEffect, useRef } from 'react';
import { geneFusions } from '@/data/mockRNAsumData';

// Chromosome data with lengths (GRCh38)
const chromosomes = [
  { id: '1', label: '1', len: 248956422, color: '#264653' },
  { id: '2', label: '2', len: 242193529, color: '#287271' },
  { id: '3', label: '3', len: 198295559, color: '#2a9d8f' },
  { id: '4', label: '4', len: 190214555, color: '#8ab17d' },
  { id: '5', label: '5', len: 181538259, color: '#e9c46a' },
  { id: '6', label: '6', len: 170805979, color: '#f4a261' },
  { id: '7', label: '7', len: 159345973, color: '#ee8959' },
  { id: '8', label: '8', len: 145138636, color: '#e76f51' },
  { id: '9', label: '9', len: 138394717, color: '#d62828' },
  { id: '10', label: '10', len: 133797422, color: '#9b2226' },
  { id: '11', label: '11', len: 135086622, color: '#6d597a' },
  { id: '12', label: '12', len: 133275309, color: '#5f4b66' },
  { id: '13', label: '13', len: 114364328, color: '#355070' },
  { id: '14', label: '14', len: 107043718, color: '#1d3557' },
  { id: '15', label: '15', len: 101991189, color: '#457b9d' },
  { id: '16', label: '16', len: 90338345, color: '#4a8fe7' },
  { id: '17', label: '17', len: 83257441, color: '#5390d9' },
  { id: '18', label: '18', len: 80373285, color: '#7400b8' },
  { id: '19', label: '19', len: 58617616, color: '#6930c3' },
  { id: '20', label: '20', len: 64444167, color: '#5e60ce' },
  { id: '21', label: '21', len: 46709983, color: '#5390d9' },
  { id: '22', label: '22', len: 50818468, color: '#4ea8de' },
  { id: 'X', label: 'X', len: 156040895, color: '#e63946' },
  { id: 'Y', label: 'Y', len: 57227415, color: '#f4a261' },
];

// Mock fusion breakpoint data
const fusionLinks = [
  { gene5: 'TMPRSS2', chr5: '21', pos5: 41508081, gene3: 'ERG', chr3: '21', pos3: 38380030 },
  { gene5: 'BCR', chr5: '22', pos5: 23632600, gene3: 'ABL1', chr3: '9', pos3: 130713881 },
  { gene5: 'EML4', chr5: '2', pos5: 42396490, gene3: 'ALK', chr3: '2', pos3: 29223528 },
  { gene5: 'FGFR3', chr5: '4', pos5: 1803564, gene3: 'TACC3', chr3: '4', pos3: 1738349 },
  { gene5: 'NTRK1', chr5: '1', pos5: 156843640, gene3: 'TPM3', chr3: '1', pos3: 154127270 },
];

interface CircosPlotProps {
  width?: number;
  height?: number;
}

export function CircosPlot({ width = 500, height = 500 }: CircosPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2 - 40;
  const innerRadius = outerRadius - 20;
  const linkRadius = innerRadius - 10;
  
  // Calculate total genome length
  const totalLength = chromosomes.reduce((sum, chr) => sum + chr.len, 0);
  
  // Calculate arc angles for each chromosome
  const gap = 0.01; // Gap between chromosomes in radians
  const totalGap = gap * chromosomes.length;
  const availableAngle = 2 * Math.PI - totalGap;
  
  let currentAngle = -Math.PI / 2; // Start at top
  const chrArcs = chromosomes.map((chr) => {
    const angleSpan = (chr.len / totalLength) * availableAngle;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    currentAngle = endAngle + gap;
    return { ...chr, startAngle, endAngle, midAngle: (startAngle + endAngle) / 2 };
  });
  
  // Helper to convert polar to cartesian
  const polarToCartesian = (angle: number, radius: number) => ({
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  });
  
  // Helper to create arc path
  const createArc = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    const start1 = polarToCartesian(startAngle, outerR);
    const end1 = polarToCartesian(endAngle, outerR);
    const start2 = polarToCartesian(endAngle, innerR);
    const end2 = polarToCartesian(startAngle, innerR);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    
    return `M ${start1.x} ${start1.y} 
            A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x} ${end1.y}
            L ${start2.x} ${start2.y}
            A ${innerR} ${innerR} 0 ${largeArc} 0 ${end2.x} ${end2.y}
            Z`;
  };
  
  // Get position angle for a genomic coordinate
  const getPositionAngle = (chrId: string, position: number) => {
    const chrArc = chrArcs.find((c) => c.id === chrId);
    if (!chrArc) return 0;
    const fraction = position / chrArc.len;
    return chrArc.startAngle + fraction * (chrArc.endAngle - chrArc.startAngle);
  };
  
  // Create bezier curve for fusion link
  const createFusionLink = (link: typeof fusionLinks[0]) => {
    const angle1 = getPositionAngle(link.chr5, link.pos5);
    const angle2 = getPositionAngle(link.chr3, link.pos3);
    
    const p1 = polarToCartesian(angle1, linkRadius);
    const p2 = polarToCartesian(angle2, linkRadius);
    
    // Create a curved path through the center
    const controlRadius = linkRadius * 0.3;
    const midAngle = (angle1 + angle2) / 2;
    
    // Use quadratic bezier with control point near center
    return `M ${p1.x} ${p1.y} Q ${centerX} ${centerY} ${p2.x} ${p2.y}`;
  };
  
  const isSameChromosome = (link: typeof fusionLinks[0]) => link.chr5 === link.chr3;

  return (
    <div className="relative">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height}
        className="mx-auto"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Chromosome arcs */}
        {chrArcs.map((chr) => (
          <g key={chr.id}>
            <path
              d={createArc(chr.startAngle, chr.endAngle, innerRadius, outerRadius)}
              fill={chr.color}
              stroke="white"
              strokeWidth={0.5}
              className="transition-opacity hover:opacity-80"
            />
            {/* Chromosome labels */}
            {(() => {
              const labelPos = polarToCartesian(chr.midAngle, outerRadius + 15);
              const rotation = (chr.midAngle * 180) / Math.PI;
              const shouldFlip = rotation > 90 || rotation < -90;
              return (
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] font-medium fill-foreground"
                  transform={shouldFlip ? `rotate(${rotation + 180}, ${labelPos.x}, ${labelPos.y})` : `rotate(${rotation}, ${labelPos.x}, ${labelPos.y})`}
                >
                  {chr.label}
                </text>
              );
            })()}
          </g>
        ))}
        
        {/* Fusion links */}
        {fusionLinks.map((link, idx) => (
          <path
            key={idx}
            d={createFusionLink(link)}
            fill="none"
            stroke={isSameChromosome(link) ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
            strokeWidth={2}
            opacity={0.7}
            className="transition-all hover:opacity-100 hover:stroke-[3px] cursor-pointer"
          >
            <title>{`${link.gene5}::${link.gene3} (chr${link.chr5}:${link.pos5.toLocaleString()} → chr${link.chr3}:${link.pos3.toLocaleString()})`}</title>
          </path>
        ))}
        
        {/* Fusion breakpoint markers */}
        {fusionLinks.flatMap((link, idx) => {
          const angle5 = getPositionAngle(link.chr5, link.pos5);
          const angle3 = getPositionAngle(link.chr3, link.pos3);
          const p5 = polarToCartesian(angle5, linkRadius);
          const p3 = polarToCartesian(angle3, linkRadius);
          const color = isSameChromosome(link) ? 'hsl(var(--destructive))' : 'hsl(var(--primary))';
          
          return [
            <circle
              key={`${idx}-5`}
              cx={p5.x}
              cy={p5.y}
              r={4}
              fill={color}
              className="cursor-pointer"
            >
              <title>{`${link.gene5} (chr${link.chr5}:${link.pos5.toLocaleString()})`}</title>
            </circle>,
            <circle
              key={`${idx}-3`}
              cx={p3.x}
              cy={p3.y}
              r={4}
              fill={color}
              className="cursor-pointer"
            >
              <title>{`${link.gene3} (chr${link.chr3}:${link.pos3.toLocaleString()})`}</title>
            </circle>,
          ];
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-destructive" />
          <span className="text-muted-foreground">Intrachromosomal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary" />
          <span className="text-muted-foreground">Interchromosomal</span>
        </div>
      </div>
    </div>
  );
}
