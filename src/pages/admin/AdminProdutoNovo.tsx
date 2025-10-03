import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminProdutoNovo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    unidade: '',
    valorReferencia: '',
    descricao: '',
    certificacoes: {
      organico: false,
      agriculturaFamiliar: false,
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
      title: "Produto criado",
      description: "O produto foi cadastrado com sucesso.",
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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
            Novo Produto Base
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Cadastre um produto para o catálogo padrão
          </p>
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
          <div className="flex flex-col-reverse md:flex-row gap-3 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="w-full md:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="w-full md:w-auto"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProdutoNovo;
