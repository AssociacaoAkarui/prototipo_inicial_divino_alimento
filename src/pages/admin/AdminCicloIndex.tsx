import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Search, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Ciclo {
  id: string;
  nome: string;
  inicio_ofertas: Date;
  fim_ofertas: Date;
  mercados_count: number;
  status: 'ativo' | 'inativo';
}

const AdminCicloIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cicloToDelete, setCicloToDelete] = useState<string | null>(null);

  // Mock data - substituir por dados reais
  const [ciclos, setCiclos] = useState<Ciclo[]>([
    {
      id: '1',
      nome: 'Ciclo Primavera 2025',
      inicio_ofertas: new Date('2025-09-10'),
      fim_ofertas: new Date('2025-10-10'),
      mercados_count: 3,
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'Ciclo Verão 2025',
      inicio_ofertas: new Date('2025-11-01'),
      fim_ofertas: new Date('2025-12-01'),
      mercados_count: 5,
      status: 'inativo'
    }
  ]);

  const filteredCiclos = ciclos.filter(ciclo =>
    ciclo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setCicloToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cicloToDelete) {
      setCiclos(ciclos.filter(c => c.id !== cicloToDelete));
      toast.success('Ciclo excluído com sucesso.');
      setDeleteDialogOpen(false);
      setCicloToDelete(null);
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCiclos.map((ciclo) => (
                  <TableRow key={ciclo.id}>
                    <TableCell className="font-medium">{ciclo.nome}</TableCell>
                    <TableCell>
                      {format(ciclo.inicio_ofertas, 'dd/MM/yyyy')} – {format(ciclo.fim_ofertas, 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{ciclo.mercados_count} mercados</TableCell>
                    <TableCell>
                      <Badge
                        variant={ciclo.status === 'ativo' ? 'default' : 'secondary'}
                        className={ciclo.status === 'ativo' ? 'bg-green-500' : 'bg-orange-500'}
                      >
                        {ciclo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/ciclo/${ciclo.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(ciclo.id)}
                          className="border-destructive text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
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
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{ciclo.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(ciclo.inicio_ofertas, 'dd/MM/yyyy')} – {format(ciclo.fim_ofertas, 'dd/MM/yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ciclo.mercados_count} mercados
                    </p>
                  </div>
                  <Badge
                    variant={ciclo.status === 'ativo' ? 'default' : 'secondary'}
                    className={ciclo.status === 'ativo' ? 'bg-green-500' : 'bg-orange-500'}
                  >
                    {ciclo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/admin/ciclo/${ciclo.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(ciclo.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
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
};

export default AdminCicloIndex;
