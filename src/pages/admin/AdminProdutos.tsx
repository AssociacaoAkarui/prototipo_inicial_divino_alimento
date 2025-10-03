import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  unidade: string;
  valorReferencia: number;
  status: 'Ativo' | 'Inativo';
}

const AdminProdutos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for products
  const produtos: Produto[] = [
    { 
      id: '1', 
      nome: 'Tomate Orgânico', 
      categoria: 'Hortaliças', 
      unidade: 'kg',
      valorReferencia: 4.50,
      status: 'Ativo'
    },
    { 
      id: '2', 
      nome: 'Ovos Caipiras', 
      categoria: 'Derivados', 
      unidade: 'dúzia',
      valorReferencia: 15.00,
      status: 'Ativo'
    },
    { 
      id: '3', 
      nome: 'Mel Orgânico', 
      categoria: 'Derivados', 
      unidade: 'litro',
      valorReferencia: 28.90,
      status: 'Inativo'
    },
    { 
      id: '4', 
      nome: 'Alface Crespa', 
      categoria: 'Hortaliças', 
      unidade: 'maço',
      valorReferencia: 3.00,
      status: 'Ativo'
    },
    { 
      id: '5', 
      nome: 'Banana Prata', 
      categoria: 'Frutas', 
      unidade: 'kg',
      valorReferencia: 5.50,
      status: 'Ativo'
    }
  ];

  const filteredProdutos = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/admin/produto/${id}`);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Produto excluído",
      description: "O produto foi removido com sucesso.",
    });
  };

  const handleAddProduto = () => {
    navigate('/admin/produto');
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
              Produtos
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Gerencie produtos base cadastrados no sistema
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
                  placeholder="Buscar produto por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleAddProduto} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Lista de Produtos ({filteredProdutos.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredProdutos.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                {searchTerm ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Unidade de Medida</TableHead>
                      <TableHead>Valor de Referência (R$)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProdutos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">
                          {produto.nome}
                        </TableCell>
                        <TableCell>{produto.categoria}</TableCell>
                        <TableCell>{produto.unidade}</TableCell>
                        <TableCell>R$ {produto.valorReferencia.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={produto.status === 'Ativo' ? 'success' : 'warning'}
                          >
                            {produto.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(produto.id)}
                              className="flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden md:inline">Editar</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="hidden md:inline">Excluir</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Deseja realmente excluir este produto? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(produto.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
    </ResponsiveLayout>
  );
};

export default AdminProdutos;
