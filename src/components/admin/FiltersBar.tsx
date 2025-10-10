import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterChip } from '@/hooks/useFilters';

interface FiltersBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFiltersClick: () => void;
  activeChips: FilterChip[];
  onRemoveChip: (group: string) => void;
  resultCount?: number;
  hasActiveFilters: boolean;
  filtersOpen: boolean;
  searchPlaceholder?: string;
}

export function FiltersBar({
  searchValue,
  onSearchChange,
  onFiltersClick,
  activeChips,
  onRemoveChip,
  resultCount,
  hasActiveFilters,
  filtersOpen,
  searchPlaceholder = "Buscar...",
}: FiltersBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          onClick={onFiltersClick}
          aria-expanded={filtersOpen}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1">
              {activeChips.length}
            </Badge>
          )}
        </Button>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {activeChips.map((chip) => (
            <Badge
              key={chip.value}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {chip.label}
              <button
                onClick={() => onRemoveChip(chip.group)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                aria-label={`Remover filtro ${chip.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {resultCount !== undefined && (
        <div className="text-sm text-muted-foreground">
          {resultCount} resultado{resultCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
