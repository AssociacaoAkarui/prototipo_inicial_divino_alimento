import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminProdutoEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  // Mock data - em produção viria do backend
  const [formData, setFormData] = useState({
    nome: 'Tomate Orgânico',
    categoria: 'Hortaliças',
    unidade: 'kg',
    valorReferencia: '4.50',
    descricao: 'Tomate orgânico cultivado sem agrotóxicos',
    status: 'Ativo',
    certificacoes: {
      organico: true,
      agriculturaFamiliar: true,
      certificadoMunicipal: false
    }
  });

  const categorias = ['Hortaliças', 'Frutas', 'Derivados', 'Grãos', 'Legumes'];
  const unidades = ['kg', 'unidade', 'maço', 'litro', 'dúzia', 'grama'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria || !formData.unidade || !formData.valorReferencia) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    
    navigate('/admin/produtos');
  };

  const handleDelete = () => {
    toast({
      title: "Produto excluído",
      description: "O produto foi removido com sucesso.",
    });
    navigate('/admin/produtos');
  };

  const handleCancel = () => {
    navigate('/admin/produtos');
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate(-1)}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
              Editar Produto Base
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Atualize as informações do produto
            </p>
          </div>
          <Badge variant={formData.status === 'Ativo' ? 'success' : 'warning'}>
            {formData.status}
          </Badge>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome do Produto */}
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome do Produto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Tomate Orgânico"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoria">
                  Categoria <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  required
                >
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Unidade de Medida */}
              <div className="space-y-2">
                <Label htmlFor="unidade">
                  Unidade de Medida <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.unidade}
                  onValueChange={(value) => setFormData({ ...formData, unidade: value })}
                  required
                >
                  <SelectTrigger id="unidade">
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map((unidade) => (
                      <SelectItem key={unidade} value={unidade}>
                        {unidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Valor de Referência */}
              <div className="space-y-2">
                <Label htmlFor="valorReferencia">
                  Valor de Referência (R$) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="valorReferencia"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valorReferencia}
                  onChange={(e) => setFormData({ ...formData, valorReferencia: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Produto</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o produto..."
                  rows={3}
                />
              </div>

              {/* Certificações */}
              <div className="space-y-3">
                <Label>Certificações</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="organico"
                      checked={formData.certificacoes.organico}
                      onCheckedChange={(checked) => 
                        setFormData({ 
                          ...formData, 
                          certificacoes: { ...formData.certificacoes, organico: checked as boolean } 
                        })
                      }
                    />
                    <Label htmlFor="organico" className="font-normal cursor-pointer">
                      Orgânico
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agriculturaFamiliar"
                      checked={formData.certificacoes.agriculturaFamiliar}
                      onCheckedChange={(checked) => 
                        setFormData({ 
                          ...formData, 
                          certificacoes: { ...formData.certificacoes, agriculturaFamiliar: checked as boolean } 
                        })
                      }
                    />
                    <Label htmlFor="agriculturaFamiliar" className="font-normal cursor-pointer">
                      Agricultura Familiar
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="certificadoMunicipal"
                      checked={formData.certificacoes.certificadoMunicipal}
                      onCheckedChange={(checked) => 
                        setFormData({ 
                          ...formData, 
                          certificacoes: { ...formData.certificacoes, certificadoMunicipal: checked as boolean } 
                        })
                      }
                    />
                    <Label htmlFor="certificadoMunicipal" className="font-normal cursor-pointer">
                      Certificado Municipal
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row gap-3 mt-6 md:justify-between">
            <div className="flex flex-col-reverse md:flex-row gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="w-full md:w-auto"
              >
                Cancelar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full md:w-auto text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
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
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Button 
              type="submit"
              className="w-full md:w-auto"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProdutoEditar;
