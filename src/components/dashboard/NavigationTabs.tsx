import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Dna, 
  GitMerge, 
  Pill, 
  Shield, 
  Sparkles,
  TrendingUp 
} from 'lucide-react';

export type TabId = 'overview' | 'expression' | 'mutations' | 'fusions' | 'cnv' | 'drugs' | 'immune';

interface NavigationTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Sparkles },
  { id: 'expression', label: 'Expression', icon: TrendingUp },
  { id: 'mutations', label: 'Mutations', icon: Dna },
  { id: 'fusions', label: 'Fusions', icon: GitMerge },
  { id: 'cnv', label: 'CNV', icon: BarChart3 },
  { id: 'drugs', label: 'Drug Targets', icon: Pill },
  { id: 'immune', label: 'Immune', icon: Shield },
];

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <nav className="border-b border-border bg-card px-6">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'nav-tab flex items-center gap-2 whitespace-nowrap py-3',
                isActive && 'nav-tab-active'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
