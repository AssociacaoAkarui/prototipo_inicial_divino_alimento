import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { Search, Plus, Pencil, Trash2, ShoppingBasket, Package, Store, ArrowLeft } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cicloToDelete, setCicloToDelete] = useState<string | null>(null);
  const [ciclos, setCiclos] = useState<Ciclo[]>([
    {
      id: '1',
      nome: '1º Ciclo de Novembro 2025',
      inicio_ofertas: '2025-11-03',
      fim_ofertas: '2025-11-18',
      mercados: 3,
      status: 'ativo',
      tipo_venda: 'cesta'
    },
    {
      id: '2',
      nome: '2º Ciclo de Outubro 2025',
      inicio_ofertas: '2025-10-22',
      fim_ofertas: '2025-10-30',
      mercados: 2,
      status: 'inativo',
      tipo_venda: 'lote'
    },
    {
      id: '3',
      nome: '1º Ciclo de Outubro 2025',
      inicio_ofertas: '2025-10-13',
      fim_ofertas: '2025-10-20',
      mercados: 1,
      status: 'ativo',
      tipo_venda: 'venda_direta'
    }
  ]);

  const filteredCiclos = ciclos
    .filter(ciclo => ciclo.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.inicio_ofertas).getTime() - new Date(a.inicio_ofertas).getTime());

  const handleDelete = (id: string) => {
    setCicloToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cicloToDelete) {
      setCiclos(ciclos.filter(c => c.id !== cicloToDelete));
      toast({
        title: "Ciclo excluído",
        description: "O ciclo foi excluído com sucesso.",
      });
      setDeleteDialogOpen(false);
      setCicloToDelete(null);
    }
  };

  const handleTipoVendaChange = (cicloId: string, novoTipo: 'cesta' | 'lote' | 'venda_direta') => {
    setCiclos(ciclos.map(c => 
      c.id === cicloId ? { ...c, tipo_venda: novoTipo } : c
    ));
    toast({
      title: "Tipo de venda atualizado",
      description: "O tipo de composição foi alterado com sucesso.",
    });
  };

  const handleComposicao = (ciclo: Ciclo) => {
    if (!ciclo.tipo_venda) {
      toast({
        title: "Ação indisponível",
        description: "Defina o tipo de venda no ciclo antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    const rotas = {
      cesta: `/admin/composicao-cesta/${ciclo.id}`,
      lote: `/admin/composicao-lote/${ciclo.id}`,
      venda_direta: `/admin/composicao-venda-direta/${ciclo.id}`
    };

    navigate(rotas[ciclo.tipo_venda]);
  };

  const getComposicaoIcon = (tipo?: 'cesta' | 'lote' | 'venda_direta') => {
    switch (tipo) {
      case 'cesta':
        return <ShoppingBasket className="h-4 w-4" />;
      case 'lote':
        return <Package className="h-4 w-4" />;
      case 'venda_direta':
        return <Store className="h-4 w-4" />;
      default:
        return <ShoppingBasket className="h-4 w-4" />;
    }
  };

  const getTipoVendaLabel = (tipo?: 'cesta' | 'lote' | 'venda_direta') => {
    switch (tipo) {
      case 'cesta':
        return 'Cesta';
      case 'lote':
        return 'Lote';
      case 'venda_direta':
        return 'Venda Direta';
      default:
        return 'Selecione';
    }
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/dashboard')}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Gestão de Ciclos
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Acompanhe, edite e crie novos ciclos operacionais.
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar ciclo por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => navigate('/admin/ciclo')}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Ciclo
          </Button>
        </div>

        {/* Desktop Table */}
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
                {filteredCiclos.map((ciclo) => (
                  <TableRow key={ciclo.id}>
                    <TableCell className="font-medium">{ciclo.nome}</TableCell>
                    <TableCell>{formatarDataBR(ciclo.inicio_ofertas)} – {formatarDataBR(ciclo.fim_ofertas)}</TableCell>
                    <TableCell>{ciclo.mercados} mercados</TableCell>
                    <TableCell>
                      <Select
                        value={ciclo.tipo_venda || ''}
                        onValueChange={(value: 'cesta' | 'lote' | 'venda_direta') => 
                          handleTipoVendaChange(ciclo.id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cesta">Cesta</SelectItem>
                          <SelectItem value="lote">Lote</SelectItem>
                          <SelectItem value="venda_direta">Venda Direta</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ciclo.status === 'ativo' ? 'success' : 'warning'}>
                        {ciclo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/ciclo/${ciclo.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/oferta/${ciclo.id}`)}
                              >
                                <ShoppingBasket className="h-4 w-4 text-primary" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Inserir Ofertas</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleComposicao(ciclo)}
                                disabled={!ciclo.tipo_venda}
                              >
                                {getComposicaoIcon(ciclo.tipo_venda)}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {ciclo.tipo_venda 
                                  ? `Compor ${getTipoVendaLabel(ciclo.tipo_venda)}`
                                  : 'Defina o tipo de venda'
                                }
                              </p>
                            </TooltipContent>
                          </Tooltip>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(ciclo.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredCiclos.map((ciclo) => (
            <Card key={ciclo.id} className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">{ciclo.nome}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatarDataBR(ciclo.inicio_ofertas)} – {formatarDataBR(ciclo.fim_ofertas)}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{ciclo.mercados} mercados</span>
                  <Badge variant={ciclo.status === 'ativo' ? 'success' : 'warning'}>
                    {ciclo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                <div className="mt-3">
                  <Label className="text-xs">Tipo de Venda</Label>
                  <Select
                    value={ciclo.tipo_venda || ''}
                    onValueChange={(value: 'cesta' | 'lote' | 'venda_direta') => 
                      handleTipoVendaChange(ciclo.id, value)
                    }
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cesta">Cesta</SelectItem>
                      <SelectItem value="lote">Lote</SelectItem>
                      <SelectItem value="venda_direta">Venda Direta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/ciclo/${ciclo.id}`)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/oferta/${ciclo.id}`)}
                  >
                    <ShoppingBasket className="h-4 w-4 mr-2" />
                    Ofertas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleComposicao(ciclo)}
                    disabled={!ciclo.tipo_venda}
                  >
                    {getComposicaoIcon(ciclo.tipo_venda)}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ciclo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir este ciclo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir Ciclo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResponsiveLayout>
  );
}
