import { cn } from '@/lib/utils';
import { immuneMarkers } from '@/data/mockRNAsumData';
import { Shield } from 'lucide-react';

export function ImmuneProfile() {
  const getInterpretationColor = (interpretation: 'high' | 'normal' | 'low') => {
    switch (interpretation) {
      case 'high': return 'text-success';
      case 'low': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getBarColor = (interpretation: 'high' | 'normal' | 'low') => {
    switch (interpretation) {
      case 'high': return 'bg-success';
      case 'low': return 'bg-warning';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
      <h3 className="section-header">
        <Shield className="h-5 w-5 text-warning" />
        Immune Profile
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Key immune markers relative to TCGA pan-cancer cohort
      </p>

      <div className="space-y-4">
        {immuneMarkers.map((marker, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{marker.marker}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{marker.value.toFixed(1)}</span>
                <span className={cn('text-xs capitalize', getInterpretationColor(marker.interpretation))}>
                  ({marker.interpretation})
                </span>
              </div>
            </div>
            <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
              <div 
                className={cn('h-full rounded-full transition-all', getBarColor(marker.interpretation))}
                style={{ width: `${marker.percentile}%` }}
              />
              {/* Percentile marker */}
              <div 
                className="absolute top-0 h-full w-0.5 bg-foreground/30"
                style={{ left: '50%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>{marker.percentile}th percentile</span>
              <span>100%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
