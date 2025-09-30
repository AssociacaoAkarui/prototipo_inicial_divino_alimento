import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">Categorias de Produtos</h1>
            <p className="text-muted-foreground">
              Gerenciar categorias dos produtos comercializados
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin/categorias/novo')}
            className="bg-primary hover:bg-primary/90 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Categoria
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredCategorias.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
              </CardContent>
            </Card>
          ) : (
            filteredCategorias.map((categoria) => (
              <Card key={categoria.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{categoria.nome}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={categoria.situacao === 'Ativo' ? 'default' : 'secondary'}
                        className={categoria.situacao === 'Ativo' ? 'bg-green-500' : 'bg-gray-500'}
                      >
                        {categoria.situacao}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(categoria.id)}
                        className="text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(categoria)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
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
