import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UsuarioDados = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nomeCompleto: 'João da Silva',
    nomeFantasia: 'João Silva',
    celular: '(11) 98765-4321',
    informacoesPagamento: 'Banco: Itaú\nAgência: 1234\nConta: 56789-0\nChave PIX: joao@email.com',
    email: 'joao.silva@email.com',
    aceitePolitica: true,
    perfilFornecedor: true,
    perfilConsumidor: false,
    perfilAdministrador: true,
    situacao: 'Ativo'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }

    if (!formData.celular.trim()) {
      newErrors.celular = 'Celular é obrigatório';
    }

    if (!formData.aceitePolitica) {
      newErrors.aceitePolitica = 'É obrigatório aceitar a Política de Privacidade e Termos de Uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Simular salvamento
      toast({
        title: "Sucesso",
        description: "Dados atualizados com sucesso",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Erro",
        description: "Corrija os dados antes de prosseguir",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <ResponsiveLayout
      headerContent={
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleCancel}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="hidden md:inline">Voltar</span>
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
            Dados Pessoais
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Atualize suas informações pessoais
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                className={errors.nomeCompleto ? 'border-destructive' : ''}
              />
              {errors.nomeCompleto && (
                <p className="text-sm text-destructive">{errors.nomeCompleto}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input
                id="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={(e) => handleInputChange('nomeFantasia', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular">
                Celular <span className="text-destructive">*</span>
              </Label>
              <Input
                id="celular"
                value={formData.celular}
                onChange={(e) => handleInputChange('celular', e.target.value)}
                placeholder="(00) 00000-0000"
                className={errors.celular ? 'border-destructive' : ''}
              />
              {errors.celular && (
                <p className="text-sm text-destructive">{errors.celular}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                O e-mail não pode ser alterado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações para Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="informacoesPagamento">
                Conta Bancária, Chave PIX, etc.
              </Label>
              <Textarea
                id="informacoesPagamento"
                value={formData.informacoesPagamento}
                onChange={(e) => handleInputChange('informacoesPagamento', e.target.value)}
                placeholder="Digite as informações para recebimento de pagamentos"
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfil de Acesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilFornecedor"
                checked={formData.perfilFornecedor}
                onCheckedChange={(checked) => 
                  handleInputChange('perfilFornecedor', checked as boolean)
                }
              />
              <Label htmlFor="perfilFornecedor" className="cursor-pointer">
                Fornecedor
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilConsumidor"
                checked={formData.perfilConsumidor}
                onCheckedChange={(checked) => 
                  handleInputChange('perfilConsumidor', checked as boolean)
                }
              />
              <Label htmlFor="perfilConsumidor" className="cursor-pointer">
                Consumidor
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="perfilAdministrador"
                checked={formData.perfilAdministrador}
                disabled
              />
              <Label 
                htmlFor="perfilAdministrador" 
                className="cursor-not-allowed opacity-50"
              >
                Administrador (não editável)
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status e Termos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="situacao">Situação</Label>
              <Input
                id="situacao"
                value={formData.situacao}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="aceitePolitica"
                checked={formData.aceitePolitica}
                onCheckedChange={(checked) => 
                  handleInputChange('aceitePolitica', checked as boolean)
                }
                className={errors.aceitePolitica ? 'border-destructive' : ''}
              />
              <Label htmlFor="aceitePolitica" className="cursor-pointer text-sm">
                Aceito a Política de Privacidade e os Termos de Uso <span className="text-destructive">*</span>
              </Label>
            </div>
            {errors.aceitePolitica && (
              <p className="text-sm text-destructive">{errors.aceitePolitica}</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pb-6">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
          >
            Salvar
          </Button>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default UsuarioDados;
