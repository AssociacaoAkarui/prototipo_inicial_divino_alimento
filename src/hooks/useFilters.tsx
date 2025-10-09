import { useState, useEffect, useCallback } from 'react';

export interface FilterChip {
  group: string;
  label: string;
  value: string;
}

export interface FilterState {
  search: string;
  status: string[];
  tipo: string[];
  categoria: string[];
  produtoBase: string[];
  perfis: string[];
  tipoVenda: string[];
  [key: string]: string | string[];
}

const defaultFilterState: FilterState = {
  search: '',
  status: [],
  tipo: [],
  categoria: [],
  produtoBase: [],
  perfis: [],
  tipoVenda: [],
};

export function useFilters(routeKey: string) {
  const storageKey = `filters:${routeKey}`;
  
  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = sessionStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : { ...defaultFilterState };
  });

  const [isOpen, setIsOpen] = useState(false);

  // Salvar no sessionStorage sempre que mudar
  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(filters));
  }, [filters, storageKey]);

  const updateFilter = useCallback((key: keyof FilterState, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayValue = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = prev[key] as string[];
      const newValue = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: newValue };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ ...defaultFilterState });
    sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  const clearFilterGroup = useCallback((group: string) => {
    setFilters(prev => ({ ...prev, [group]: Array.isArray(prev[group]) ? [] : '' }));
  }, []);

  const getActiveChips = useCallback((): FilterChip[] => {
    const chips: FilterChip[] = [];
    
    Object.keys(filters).forEach(key => {
      if (key === 'search') return;
      
      const value = filters[key];
      if (Array.isArray(value) && value.length > 0) {
        chips.push({
          group: key,
          label: `${getLabelForGroup(key)}: ${value.join(', ')}`,
          value: key,
        });
      }
    });
    
    return chips;
  }, [filters]);

  const hasActiveFilters = useCallback(() => {
    return Object.keys(filters).some(key => {
      if (key === 'search') return false;
      const value = filters[key];
      return Array.isArray(value) ? value.length > 0 : !!value;
    });
  }, [filters]);

  return {
    filters,
    updateFilter,
    toggleArrayValue,
    clearFilters,
    clearFilterGroup,
    getActiveChips,
    hasActiveFilters,
    isOpen,
    setIsOpen,
  };
}

function getLabelForGroup(key: string): string {
  const labels: Record<string, string> = {
    status: 'Status',
    tipo: 'Tipo de Mercado',
    categoria: 'Categoria',
    produtoBase: 'Produto Base',
    perfis: 'Perfis',
    tipoVenda: 'Tipo de Venda',
  };
  return labels[key] || key;
}
