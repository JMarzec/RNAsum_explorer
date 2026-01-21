import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Copy, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Column {
  key: string;
  label: string;
  visible?: boolean;
}

interface DataTableControlsProps {
  columns: Column[];
  onColumnVisibilityChange?: (key: string, visible: boolean) => void;
  onSearch?: (value: string) => void;
  data?: any[];
  searchValue?: string;
}

export function DataTableControls({ 
  columns, 
  onColumnVisibilityChange,
  onSearch,
  data,
  searchValue = ''
}: DataTableControlsProps) {
  const [search, setSearch] = useState(searchValue);
  
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'csv' && data) {
      const headers = columns.map(c => c.label).join(',');
      const rows = data.map(row => columns.map(c => row[c.key] ?? '').join(','));
      const csv = [headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.csv';
      a.click();
      toast.success('Exported to CSV');
    } else {
      toast.info(`${format.toUpperCase()} export coming soon`);
    }
  };

  const handleCopy = () => {
    if (data) {
      const headers = columns.map(c => c.label).join('\t');
      const rows = data.map(row => columns.map(c => row[c.key] ?? '').join('\t'));
      const text = [headers, ...rows].join('\n');
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearch?.(value);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
          Excel
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
          CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
          PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-3.5 w-3.5 mr-1" />
          Copy
        </Button>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Column visibility
            <ChevronDown className="h-3.5 w-3.5 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.key}
              checked={column.visible !== false}
              onCheckedChange={(checked) => onColumnVisibilityChange?.(column.key, checked)}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="flex-1" />
      
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search:"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-8 w-48 h-8 text-sm"
        />
      </div>
    </div>
  );
}
