import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Dna, 
  GitMerge, 
  Activity,
  Pill, 
  Shield,
  FileText,
  BookOpen
} from 'lucide-react';

export type SectionId = 
  | 'findings-summary' 
  | 'mutated-genes' 
  | 'fusion-genes' 
  | 'structural-variants'
  | 'cn-altered' 
  | 'immune-markers' 
  | 'hrd-genes' 
  | 'cancer-genes'
  | 'addendum';

interface ReportSidebarProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
}

const sections = [
  { id: 'findings-summary' as const, label: 'Findings summary', icon: BarChart3 },
  { id: 'mutated-genes' as const, label: 'Mutated genes', icon: Dna },
  { id: 'fusion-genes' as const, label: 'Fusion genes', icon: GitMerge },
  { id: 'structural-variants' as const, label: 'Structural variants', icon: Activity },
  { id: 'cn-altered' as const, label: 'CN altered genes', icon: FileText },
  { id: 'immune-markers' as const, label: 'Immune markers', icon: Shield },
  { id: 'hrd-genes' as const, label: 'HRD genes', icon: BookOpen },
  { id: 'cancer-genes' as const, label: 'Cancer genes', icon: Dna },
  { id: 'addendum' as const, label: 'Addendum', icon: FileText },
];

export function ReportSidebar({ activeSection, onSectionChange }: ReportSidebarProps) {
  return (
    <nav className="w-56 flex-shrink-0 bg-card border-r border-border overflow-y-auto sticky top-0 h-screen">
      <div className="p-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-md transition-colors',
              'hover:bg-muted',
              activeSection === section.id 
                ? 'bg-primary/10 text-primary border-l-2 border-primary font-medium'
                : 'text-muted-foreground'
            )}
          >
            <section.icon className="h-4 w-4 flex-shrink-0" />
            <span>{section.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
