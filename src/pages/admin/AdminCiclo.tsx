import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X, Info, GripVertical, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { formatBRLInput, parseBRLToNumber } from '@/utils/currency';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  calcularNomeCiclo,
  calcularFimOfertas,
  getTiposVendaPermitidos,
  getAdministradorMercado,
  getNomeMercado,
  getTipoVendaLabel,
  Periodicidade,
} from '@/utils/ciclo';

type TipoVenda = 'cesta' | 'lote' | 'venda_direta';

interface MercadoCiclo {
  id: string;
  mercado_id: string;
  tipo_venda: TipoVenda;
  ordem_atendimento: number;
  
  // Cesta
  quantidade_cestas?: number;
  valor_alvo_cesta?: string;
  
  // Lote
  valor_alvo_lote?: string;
  
  // Comum
  ponto_entrega?: string;
  periodo_entrega_fornecedor_inicio?: string;
  periodo_entrega_fornecedor_fim?: string;
  periodo_retirada_inicio?: string;
  periodo_retirada_fim?: string;
  periodo_compras_inicio?: string;
  periodo_compras_fim?: string;
}

const AdminCiclo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [nome, setNome] = useState('');
  const [periodicidade, setPeriodicidade] = useState<Periodicidade>('semanal');
  const [inicioOfertas, setInicioOfertas] = useState('');
  const [fimOfertas, setFimOfertas] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');
  const [mercados, setMercados] = useState<MercadoCiclo[]>([]);

  // Mock data - em produção, buscar de uma API
  const ciclosExistentes = [
    { inicio_ofertas: '2025-10-13T00:00', periodicidade: 'semanal' as Periodicidade },
    { inicio_ofertas: '2025-10-22T00:00', periodicidade: 'semanal' as Periodicidade },
  ];

  // Carregar dados do ciclo em modo de edição
  useEffect(() => {
    if (isEdit && id) {
      // Mock data - substituir por API call
      const mockCiclo = {
        nome: '1º Ciclo de Outubro 2025',
        periodicidade: 'semanal' as Periodicidade,
        inicio_ofertas: '2025-10-13T08:00',
        fim_ofertas: '2025-10-20T18:00',
        observacoes: 'Ciclo de teste',
        status: 'ativo' as 'ativo' | 'inativo',
        mercados: [
          {
            id: '1',
            mercado_id: '1',
            tipo_venda: 'cesta' as TipoVenda,
            ordem_atendimento: 1,
            quantidade_cestas: 50,
            valor_alvo_cesta: '45,00',
            ponto_entrega: 'centro',
          },
        ],
      };

      setNome(mockCiclo.nome);
      setPeriodicidade(mockCiclo.periodicidade);
      setInicioOfertas(mockCiclo.inicio_ofertas);
      setFimOfertas(mockCiclo.fim_ofertas);
      setObservacoes(mockCiclo.observacoes);
      setStatus(mockCiclo.status);
      setMercados(mockCiclo.mercados);
    }
  }, [id, isEdit]);

  // Atualizar nome do ciclo automaticamente
  useEffect(() => {
    if (inicioOfertas) {
      const nomeCalculado = calcularNomeCiclo(inicioOfertas, [
        ...ciclosExistentes,
        { inicio_ofertas: inicioOfertas, periodicidade },
      ]);
      setNome(nomeCalculado);
    }
  }, [inicioOfertas, periodicidade]);

  // Calcular fim automaticamente baseado na periodicidade
  useEffect(() => {
    if (inicioOfertas && periodicidade) {
      const fimCalculado = calcularFimOfertas(inicioOfertas, periodicidade);
      setFimOfertas(fimCalculado);
    }
  }, [inicioOfertas, periodicidade]);

  // Drag & drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddMercado = () => {
    const newMercado: MercadoCiclo = {
      id: Date.now().toString(),
      mercado_id: '',
      tipo_venda: 'cesta',
      ordem_atendimento: mercados.length + 1
    };
    setMercados([...mercados, newMercado]);
  };

  const handleRemoveMercado = (id: string) => {
    setMercados(mercados.filter(m => m.id !== id));
  };

  const handleUpdateMercado = (id: string, field: string, value: any) => {
    setMercados(mercados.map(m => {
      if (m.id === id) {
        // Se mudou o mercado, aplicar regras e resetar tipo de venda se necessário
        if (field === 'mercado_id') {
          const tiposPermitidos = getTiposVendaPermitidos(value);
          const tipoAtual = m.tipo_venda;
          const novoTipo = tiposPermitidos.includes(tipoAtual) ? tipoAtual : (tiposPermitidos[0] as TipoVenda);
          return { ...m, [field]: value, tipo_venda: novoTipo };
        }
        return { ...m, [field]: value };
      }
      return m;
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setMercados((items) => {
        const oldIndex = items.findIndex((m) => m.id === active.id);
        const newIndex = items.findIndex((m) => m.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        
        // Renumerar ordem_atendimento sequencialmente
        return reordered.map((m, index) => ({
          ...m,
          ordem_atendimento: index + 1,
        }));
      });
    }
  };

  const handleSubmit = () => {
    // Validações
    if (!nome || nome.length < 3) {
      toast.error('Nome do ciclo é obrigatório (mín. 3 caracteres).');
      return;
    }

    if (mercados.length === 0) {
      toast.error('Adicione pelo menos um mercado ao ciclo.');
      return;
    }

    if (!inicioOfertas || !fimOfertas) {
      toast.error('Defina o período de ofertas.');
      return;
    }

    if (new Date(inicioOfertas) >= new Date(fimOfertas)) {
      toast.error('A data de início deve ser anterior à data de fim.');
      return;
    }

    // Validar campos obrigatórios dos mercados
    for (const mercado of mercados) {
      if (!mercado.mercado_id) {
        toast.error('Selecione o mercado em todos os cards.');
        return;
      }

      if (mercado.tipo_venda === 'cesta') {
        if (!mercado.quantidade_cestas || !mercado.valor_alvo_cesta || !mercado.ponto_entrega) {
          toast.error('Preencha todos os campos obrigatórios do tipo Cesta.');
          return;
        }
      }

      if (mercado.tipo_venda === 'lote') {
        if (!mercado.valor_alvo_lote || !mercado.ponto_entrega) {
          toast.error('Preencha todos os campos obrigatórios do tipo Lote.');
          return;
        }
      }

      if (mercado.tipo_venda === 'venda_direta') {
        if (!mercado.ponto_entrega) {
          toast.error('Preencha o ponto de entrega para Venda Direta.');
          return;
        }
      }
    }

    // Simular save
    toast.success(isEdit ? 'Ciclo atualizado com sucesso!' : 'Ciclo criado com sucesso!');
    navigate('/admin/ciclo-index');
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/ciclo-index')}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              {isEdit ? 'Editar Ciclo' : 'Novo Ciclo'}
            </h1>
          </div>
          {isEdit && (
            <Badge className={status === 'ativo' ? 'bg-green-500' : 'bg-orange-500'}>
              {status === 'ativo' ? 'Ativo' : 'Inativo'}
            </Badge>
          )}
        </div>

        {/* Layout em duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seção 1: Informações do Ciclo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🧾 Informações do Ciclo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Ciclo *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: 1º Ciclo de Outubro 2025"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Nome gerado automaticamente baseado na data de início
                  </p>
                </div>

                <div>
                  <Label htmlFor="periodicidade">Periodicidade *</Label>
                  <Select value={periodicidade} onValueChange={(v: Periodicidade) => setPeriodicidade(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semanal">Semanal (7 dias)</SelectItem>
                      <SelectItem value="quinzenal">Quinzenal (14 dias)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Seção 2: Mercados do Ciclo */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🏪 Mercados do Ciclo
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddMercado}
                    className="border-primary text-primary"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Mercado
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mercados.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum mercado adicionado. Clique em "Adicionar Mercado" para começar.
                  </p>
                ) : (
                  mercados.map((mercado) => (
                     <Card key={mercado.id} className="border-2 border-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">Mercado #{mercado.ordem_atendimento}</CardTitle>
                            {mercado.mercado_id && (
                              <Badge variant="outline" className="text-xs">
                                Admin: {getAdministradorMercado(mercado.mercado_id)}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMercado(mercado.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Selecionar Mercado *</Label>
                            <Select
                              value={mercado.mercado_id}
                              onValueChange={(value) => handleUpdateMercado(mercado.id, 'mercado_id', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o mercado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Mercado Central</SelectItem>
                                <SelectItem value="2">Mercado Zona Norte</SelectItem>
                                <SelectItem value="3">Feira Livre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Tipo de Venda *</Label>
                            <Select
                              value={mercado.tipo_venda}
                              onValueChange={(value: TipoVenda) => handleUpdateMercado(mercado.id, 'tipo_venda', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getTiposVendaPermitidos(mercado.mercado_id).map((tipo) => (
                                  <SelectItem key={tipo} value={tipo}>
                                    {getTipoVendaLabel(tipo)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {mercado.mercado_id && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Tipos permitidos: {getTiposVendaPermitidos(mercado.mercado_id).map(t => getTipoVendaLabel(t).split(' ')[1]).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="flex items-center gap-2">
                            Ordem de Atendimento *
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Define a prioridade dos mercados (1 é atendido primeiro)
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Label>
                          <Input
                            type="number"
                            value={mercado.ordem_atendimento}
                            onChange={(e) => handleUpdateMercado(mercado.id, 'ordem_atendimento', parseInt(e.target.value))}
                          />
                        </div>

                        {/* Campos específicos por tipo */}
                        {mercado.tipo_venda === 'cesta' && (
                          <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-medium text-sm">Configurações de Cesta</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Quantidade de cestas *</Label>
                                <Input
                                  type="number"
                                  value={mercado.quantidade_cestas || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'quantidade_cestas', parseInt(e.target.value))}
                                />
                              </div>
                              <div>
                                <Label>Valor alvo por cesta (R$) *</Label>
                                <Input
                                  type="text"
                                  value={mercado.valor_alvo_cesta || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'valor_alvo_cesta', formatBRLInput(e.target.value))}
                                  placeholder="0,00"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Ponto de entrega *</Label>
                              <Select
                                value={mercado.ponto_entrega}
                                onValueChange={(value) => handleUpdateMercado(mercado.id, 'ponto_entrega', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o ponto" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="centro">Centro</SelectItem>
                                  <SelectItem value="zona_norte">Zona Norte</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Período entrega fornecedores (início)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_entrega_fornecedor_inicio || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_entrega_fornecedor_inicio', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Período entrega fornecedores (fim)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_entrega_fornecedor_fim || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_entrega_fornecedor_fim', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Período retirada consumidores (início)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_retirada_inicio || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_retirada_inicio', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Período retirada consumidores (fim)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_retirada_fim || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_retirada_fim', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {mercado.tipo_venda === 'lote' && (
                          <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-medium text-sm">Configurações de Lote</h4>
                            <div>
                              <Label>Valor alvo por lote (R$) *</Label>
                              <Input
                                type="text"
                                value={mercado.valor_alvo_lote || ''}
                                onChange={(e) => handleUpdateMercado(mercado.id, 'valor_alvo_lote', formatBRLInput(e.target.value))}
                                placeholder="0,00"
                              />
                            </div>
                            <div>
                              <Label>Ponto de entrega *</Label>
                              <Select
                                value={mercado.ponto_entrega}
                                onValueChange={(value) => handleUpdateMercado(mercado.id, 'ponto_entrega', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o ponto" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="centro">Centro</SelectItem>
                                  <SelectItem value="zona_norte">Zona Norte</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Período entrega fornecedores (início)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_entrega_fornecedor_inicio || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_entrega_fornecedor_inicio', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Período entrega fornecedores (fim)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_entrega_fornecedor_fim || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_entrega_fornecedor_fim', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {mercado.tipo_venda === 'venda_direta' && (
                          <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-medium text-sm">Configurações de Venda Direta</h4>
                            <div>
                              <Label>Ponto de entrega *</Label>
                              <Select
                                value={mercado.ponto_entrega}
                                onValueChange={(value) => handleUpdateMercado(mercado.id, 'ponto_entrega', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o ponto" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="centro">Centro</SelectItem>
                                  <SelectItem value="zona_norte">Zona Norte</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Período de compras (início)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_compras_inicio || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_compras_inicio', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Período de compras (fim)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_compras_fim || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_compras_fim', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Período entrega fornecedores (início)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_entrega_fornecedor_inicio || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_entrega_fornecedor_inicio', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Período entrega fornecedores (fim)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_entrega_fornecedor_fim || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_entrega_fornecedor_fim', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Período retirada consumidores (início)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_retirada_inicio || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_retirada_inicio', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Período retirada consumidores (fim)</Label>
                                <Input
                                  type="datetime-local"
                                  value={mercado.periodo_retirada_fim || ''}
                                  onChange={(e) => handleUpdateMercado(mercado.id, 'periodo_retirada_fim', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Seção 3: Período Global */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🕒 Período do Ciclo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inicio">Início das ofertas *</Label>
                    <Input
                      id="inicio"
                      type="datetime-local"
                      value={inicioOfertas}
                      onChange={(e) => setInicioOfertas(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fim">Fim das ofertas *</Label>
                    <Input
                      id="fim"
                      type="datetime-local"
                      value={fimOfertas}
                      onChange={(e) => setFimOfertas(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Calculado automaticamente (+{periodicidade === 'semanal' ? '7' : '14'} dias)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seção 4: Observações e Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Observações e Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Informações adicionais sobre o ciclo..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Status *</Label>
                  <RadioGroup value={status} onValueChange={(value: 'ativo' | 'inativo') => setStatus(value)}>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ativo" id="ativo" />
                        <Label htmlFor="ativo" className="cursor-pointer">Ativo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inativo" id="inativo" />
                        <Label htmlFor="inativo" className="cursor-pointer">Inativo</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral - Ordenação */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Ordem de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mercados.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Adicione mercados para definir a ordem
                  </p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={mercados.map(m => m.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {mercados.map((mercado) => (
                          <SortableItem
                            key={mercado.id}
                            id={mercado.id}
                            mercado={mercado}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Calendar className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Gestão de Ciclos</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure períodos de oferta e vendas para cada mercado
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer fixo */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 z-10">
          <div className="max-w-7xl mx-auto flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/ciclo-index')}
              className="border-primary text-primary"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              {isEdit ? 'Salvar Alterações' : 'Salvar Ciclo'}
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

// Componente Sortable Item para drag & drop
interface SortableItemProps {
  id: string;
  mercado: MercadoCiclo;
}

function SortableItem({ id, mercado }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const nomeMercado = getNomeMercado(mercado.mercado_id);
  const tipoLabel = getTipoVendaLabel(mercado.tipo_venda);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-background border rounded-lg cursor-move hover:border-primary/50 transition-colors"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          #{mercado.ordem_atendimento} – {nomeMercado || 'Selecione o mercado'}
        </div>
        {nomeMercado && (
          <div className="text-xs text-muted-foreground truncate">
            {tipoLabel}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCiclo;
