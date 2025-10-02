import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Categoria {
  id: number;
  nome: string;
  situacao: 'Ativo' | 'Inativo';
}

const AdminCategorias = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);

  // Mock data
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 1, nome: 'Frutas', situacao: 'Ativo' },
    { id: 2, nome: 'Verduras', situacao: 'Ativo' },
    { id: 3, nome: 'Legumes', situacao: 'Ativo' },
    { id: 4, nome: 'Cereais', situacao: 'Ativo' },
    { id: 5, nome: 'Laticínios', situacao: 'Inativo' },
  ]);

  const filteredCategorias = useMemo(() => {
    return categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categorias, searchTerm]);

  const handleEdit = (id: number) => {
    navigate(`/admin/categorias/${id}`);
  };

  const handleDelete = (categoria: Categoria) => {
    setCategoriaToDelete(categoria);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoriaToDelete) {
      setCategorias(prev => prev.filter(c => c.id !== categoriaToDelete.id));
      toast({
        title: "Sucesso",
        description: `Categoria "${categoriaToDelete.nome}" excluída com sucesso`,
      });
    }
    setDeleteDialogOpen(false);
    setCategoriaToDelete(null);
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/dashboard')}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
              Categorias de Produtos
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Gerenciar categorias dos produtos comercializados
            </p>
          </div>
        </div>

        {/* Search and Actions */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => navigate('/admin/categorias/novo')} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Categoria
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Lista de Categorias ({filteredCategorias.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredCategorias.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                {searchTerm ? 'Nenhuma categoria encontrada.' : 'Nenhuma categoria cadastrada.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Categoria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategorias.map((categoria) => (
                      <TableRow key={categoria.id}>
                        <TableCell className="font-medium">
                          {categoria.nome}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={categoria.situacao === 'Ativo' ? 'default' : 'warning'}
                            className={categoria.situacao === 'Ativo' ? 'bg-green-500 hover:bg-green-600' : ''}
                          >
                            {categoria.situacao}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(categoria.id)}
                              className="flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden md:inline">Editar</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(categoria)}
                              className="flex items-center gap-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden md:inline">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{categoriaToDelete?.nome}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResponsiveLayout>
  );
};

export default AdminCategorias;
