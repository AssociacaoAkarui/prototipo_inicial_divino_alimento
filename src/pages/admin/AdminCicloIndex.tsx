import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FiltersBar } from '@/components/admin/FiltersBar';
import { FiltersPanel } from '@/components/admin/FiltersPanel';
import { useFilters } from '@/hooks/useFilters';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ShoppingBasket, Package, Store, ArrowLeft } from 'lucide-react';
import { formatarDataBR } from '@/utils/ciclo';

interface Ciclo {
  id: string;
  nome: string;
  inicio_ofertas: string;
  fim_ofertas: string;
  mercados: number;
  status: 'ativo' | 'inativo';
  tipo_venda?: 'cesta' | 'lote' | 'venda_direta';
}

export default function AdminCicloIndex() {
  const navigate = useNavigate();
  const { 
    filters, 
    updateFilter, 
    toggleArrayValue, 
    clearFilters, 
    clearFilterGroup,
    getActiveChips, 
    hasActiveFilters,
    isOpen,
    setIsOpen 
  } = useFilters('/admin/ciclo-index');
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cicloToDelete, setCicloToDelete] = useState<string | null>(null);
  const [ciclos, setCiclos] = useState<Ciclo[]>([
    { id: '1', nome: '1º Ciclo de Novembro 2025', inicio_ofertas: '2025-11-03', fim_ofertas: '2025-11-18', mercados: 3, status: 'ativo', tipo_venda: 'cesta' },
    { id: '2', nome: '2º Ciclo de Outubro 2025', inicio_ofertas: '2025-10-22', fim_ofertas: '2025-10-30', mercados: 2, status: 'inativo', tipo_venda: 'lote' },
    { id: '3', nome: '1º Ciclo de Outubro 2025', inicio_ofertas: '2025-10-13', fim_ofertas: '2025-10-20', mercados: 1, status: 'ativo', tipo_venda: 'venda_direta' }
  ]);

  const filteredCiclos = useMemo(() => {
    let result = [...ciclos];

    if (filters.search) {
      result = result.filter(ciclo => ciclo.nome.toLowerCase().includes(filters.search.toLowerCase()));
    }

    if (filters.status.length > 0) {
      result = result.filter(ciclo => filters.status.includes(ciclo.status));
    }

    if (filters.tipoVenda.length > 0) {
      result = result.filter(ciclo => ciclo.tipo_venda && filters.tipoVenda.includes(ciclo.tipo_venda));
    }

    return result.sort((a, b) => new Date(b.inicio_ofertas).getTime() - new Date(a.inicio_ofertas).getTime());
  }, [ciclos, filters]);

  const handleDelete = (id: string) => {
    setCicloToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cicloToDelete) {
      setCiclos(ciclos.filter(c => c.id !== cicloToDelete));
      toast({ title: "Ciclo excluído", description: "O ciclo foi excluído com sucesso." });
      setDeleteDialogOpen(false);
      setCicloToDelete(null);
    }
  };

  const handleTipoVendaChange = (cicloId: string, novoTipo: 'cesta' | 'lote' | 'venda_direta') => {
    setCiclos(ciclos.map(c => c.id === cicloId ? { ...c, tipo_venda: novoTipo } : c));
    toast({ title: "Tipo de venda atualizado", description: "O tipo de composição foi alterado com sucesso." });
  };

  const handleComposicao = (ciclo: Ciclo) => {
    if (!ciclo.tipo_venda) {
      toast({ title: "Ação indisponível", description: "Defina o tipo de venda no ciclo antes de continuar.", variant: "destructive" });
      return;
    }
    const rotas = { cesta: `/admin/composicao-cesta/${ciclo.id}`, lote: `/admin/composicao-lote/${ciclo.id}`, venda_direta: `/admin/composicao-venda-direta/${ciclo.id}` };
    navigate(rotas[ciclo.tipo_venda]);
  };

  const getComposicaoIcon = (tipo?: 'cesta' | 'lote' | 'venda_direta') => {
    switch (tipo) {
      case 'cesta': return <ShoppingBasket className="h-5 w-5 text-primary" />;
      case 'lote': return <Package className="h-5 w-5 text-primary" />;
      case 'venda_direta': return <Store className="h-5 w-5 text-primary" />;
      default: return <ShoppingBasket className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <ResponsiveLayout leftHeaderContent={<Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')} className="text-white hover:bg-white/20"><ArrowLeft className="h-5 w-5" /></Button>}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Gestão de Ciclos</h1>
          <p className="text-sm md:text-base text-muted-foreground">Acompanhe, edite e crie novos ciclos operacionais.</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <FiltersBar searchValue={filters.search} onSearchChange={(value) => updateFilter('search', value)} onFiltersClick={() => setIsOpen(true)} activeChips={getActiveChips()} onRemoveChip={clearFilterGroup} resultCount={filteredCiclos.length} hasActiveFilters={hasActiveFilters()} filtersOpen={isOpen} />
          </div>
          <Button onClick={() => navigate('/admin/ciclo')} className="bg-primary hover:bg-primary/90 whitespace-nowrap"><Plus className="h-4 w-4 mr-2" />Novo Ciclo</Button>
        </div>

        <div className="hidden md:block">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Ciclo</TableHead>
                  <TableHead>Período de Ofertas</TableHead>
                  <TableHead>Mercados</TableHead>
                  <TableHead>Tipo de Venda</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCiclos.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 space-y-4"><p className="text-muted-foreground">{hasActiveFilters() ? 'Sem resultados para os filtros selecionados.' : 'Nenhum ciclo encontrado.'}</p>{hasActiveFilters() && <Button variant="outline" onClick={clearFilters}>Limpar filtros</Button>}</TableCell></TableRow>
                ) : (
                  filteredCiclos.map((ciclo) => (
                    <TableRow key={ciclo.id}>
                      <TableCell className="font-medium">{ciclo.nome}</TableCell>
                      <TableCell>{formatarDataBR(ciclo.inicio_ofertas)} – {formatarDataBR(ciclo.fim_ofertas)}</TableCell>
                      <TableCell>{ciclo.mercados} mercados</TableCell>
                      <TableCell><Select value={ciclo.tipo_venda || ''} onValueChange={(value: 'cesta' | 'lote' | 'venda_direta') => handleTipoVendaChange(ciclo.id, value)}><SelectTrigger className="w-[140px]"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="cesta">Cesta</SelectItem><SelectItem value="lote">Lote</SelectItem><SelectItem value="venda_direta">Venda Direta</SelectItem></SelectContent></Select></TableCell>
                      <TableCell><Badge variant={ciclo.status === 'ativo' ? 'success' : 'warning'}>{ciclo.status === 'ativo' ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                      <TableCell className="text-right"><TooltipProvider><div className="flex justify-end gap-2"><Button variant="outline" size="icon" onClick={() => navigate(`/admin/ciclo/${ciclo.id}`)} className="h-10 w-10 border-2 border-primary hover:bg-primary/10"><Pencil className="h-5 w-5 text-primary" /></Button><Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => navigate(`/oferta/${ciclo.id}`)} className="h-10 w-10 border-2 border-primary hover:bg-primary/10"><ShoppingBasket className="h-5 w-5 text-primary" /></Button></TooltipTrigger><TooltipContent><p>Inserir Ofertas</p></TooltipContent></Tooltip><Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => handleComposicao(ciclo)} disabled={!ciclo.tipo_venda} className="h-10 w-10 border-2 border-primary hover:bg-primary/10 disabled:border-muted disabled:opacity-50">{getComposicaoIcon(ciclo.tipo_venda)}</Button></TooltipTrigger><TooltipContent><p>{ciclo.tipo_venda ? `Compor ${ciclo.tipo_venda}` : 'Defina o tipo de venda'}</p></TooltipContent></Tooltip><Button variant="outline" size="icon" onClick={() => handleDelete(ciclo.id)} className="h-10 w-10 border-2 border-destructive hover:bg-destructive/10"><Trash2 className="h-5 w-5 text-destructive" /></Button></div></TooltipProvider></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      <FiltersPanel open={isOpen} onOpenChange={setIsOpen} onApply={() => {}} onClear={clearFilters}>
        <div className="space-y-4"><Label>Status</Label><div className="space-y-2">{['ativo', 'inativo'].map((status) => (<div key={status} className="flex items-center space-x-2"><Checkbox id={`status-${status}`} checked={filters.status.includes(status)} onCheckedChange={() => toggleArrayValue('status', status)} /><label htmlFor={`status-${status}`} className="text-sm font-medium cursor-pointer capitalize">{status === 'ativo' ? 'Ativo' : 'Inativo'}</label></div>))}</div></div>
        <div className="space-y-4"><Label>Tipo de Venda</Label><div className="space-y-2">{['cesta', 'lote', 'venda_direta'].map((tipo) => (<div key={tipo} className="flex items-center space-x-2"><Checkbox id={`tipo-${tipo}`} checked={filters.tipoVenda.includes(tipo)} onCheckedChange={() => toggleArrayValue('tipoVenda', tipo)} /><label htmlFor={`tipo-${tipo}`} className="text-sm font-medium cursor-pointer">{tipo === 'cesta' ? 'Cesta' : tipo === 'lote' ? 'Lote' : 'Venda Direta'}</label></div>))}</div></div>
      </FiltersPanel>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmar exclusão</AlertDialogTitle><AlertDialogDescription>Deseja realmente excluir este ciclo? Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Excluir Ciclo</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </ResponsiveLayout>
  );
}
