import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface SectionContainerProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function SectionContainer({ id, title, children, className = '' }: SectionContainerProps) {
  return (
    <section id={id} className={`mb-8 scroll-mt-4 ${className}`}>
      <div className="border-b border-border pb-2 mb-4">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

interface SubSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SubSection({ title, children, defaultOpen = true }: SubSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="text-muted-foreground">-</span> {title}
      </h3>
      {children}
    </div>
  );
}

interface CollapsibleLegendProps {
  title: string;
  children: ReactNode;
}

export function CollapsibleLegend({ title, children }: CollapsibleLegendProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 p-3 bg-muted/50 rounded-md text-sm">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
