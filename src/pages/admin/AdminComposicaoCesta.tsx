import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Search, ArrowLeft } from 'lucide-react';

interface ProdutoOfertado {
  id: string;
  nome: string;
  unidade: string;
  valor: number;
  fornecedor: string;
  quantidadeOfertada: number;
  selecionado: boolean;
  quantidadePedida: number;
}

export default function AdminComposicaoCesta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [produtos, setProdutos] = useState<ProdutoOfertado[]>([
    {
      id: '1',
      nome: 'Tomate Orgânico',
      unidade: 'kg',
      valor: 4.50,
      fornecedor: 'João Produtor',
      quantidadeOfertada: 50,
      selecionado: false,
      quantidadePedida: 0
    },
    {
      id: '2',
      nome: 'Alface Crespa',
      unidade: 'kg',
      valor: 3.20,
      fornecedor: 'Maria Horta',
      quantidadeOfertada: 30,
      selecionado: false,
      quantidadePedida: 0
    },
    {
      id: '3',
      nome: 'Ovos Caipiras',
      unidade: 'dúzia',
      valor: 15.00,
      fornecedor: 'Sítio Boa Vista',
      quantidadeOfertada: 100,
      selecionado: false,
      quantidadePedida: 0
    }
  ]);

  const ciclo = {
    nome: '1º Ciclo de Novembro 2025',
    quantidade: 50,
    valorMaximo: 80.00,
    tipo: 'Cesta'
  };

  const valorAtual = produtos
    .filter(p => p.selecionado)
    .reduce((acc, p) => acc + (p.valor * p.quantidadePedida), 0);
  
  const saldo = ciclo.valorMaximo - valorAtual;

  const handleToggleProduto = (id: string) => {
    setProdutos(produtos.map(p => 
      p.id === id ? { ...p, selecionado: !p.selecionado, quantidadePedida: !p.selecionado ? 1 : 0 } : p
    ));
  };

  const handleQuantidadeChange = (id: string, quantidade: number) => {
    setProdutos(produtos.map(p => 
      p.id === id ? { ...p, quantidadePedida: Math.max(0, Math.min(quantidade, p.quantidadeOfertada)) } : p
    ));
  };

  const handleSalvar = () => {
    const selecionados = produtos.filter(p => p.selecionado);
    if (selecionados.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um produto.",
        variant: "destructive"
      });
      return;
    }

    if (saldo < 0) {
      toast({
        title: "Erro",
        description: "O valor total excede o valor máximo por cesta.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Composição salva!",
      description: "A composição das cestas foi atualizada com sucesso.",
    });
  };

  const produtosSelecionados = produtos.filter(p => p.selecionado);
  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.fornecedor.toLowerCase().includes(busca.toLowerCase())
  );

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
      <div className="space-y-6">
        {/* Cabeçalho com informações do ciclo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">{ciclo.nome}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Tipo: {ciclo.tipo}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Quantidade</p>
                  <p className="text-2xl font-bold">{ciclo.quantidade}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Máximo</p>
                  <p className="text-2xl font-bold">R$ {ciclo.valorMaximo.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor Atual</p>
                  <p className="text-2xl font-bold">R$ {valorAtual.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <p className={`text-2xl font-bold ${saldo < 0 ? 'text-destructive' : 'text-success'}`}>
                    R$ {saldo.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Produtos Selecionados */}
        {produtosSelecionados.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Produtos Selecionados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Medida</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Ofertados</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Valor Acumulado</TableHead>
                    <TableHead>Disponíveis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosSelecionados.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell>{produto.unidade}</TableCell>
                      <TableCell>R$ {produto.valor.toFixed(2).replace('.', ',')}</TableCell>
                      <TableCell>{produto.fornecedor}</TableCell>
                      <TableCell>{produto.quantidadeOfertada}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={produto.quantidadePedida}
                          onChange={(e) => handleQuantidadeChange(produto.id, parseInt(e.target.value) || 0)}
                          className="w-20"
                          min="0"
                          max={produto.quantidadeOfertada}
                        />
                      </TableCell>
                      <TableCell>R$ {(produto.valor * produto.quantidadePedida).toFixed(2).replace('.', ',')}</TableCell>
                      <TableCell>{produto.quantidadeOfertada - produto.quantidadePedida}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Todos os Produtos Ofertados */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Todos os Produtos Ofertados</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar fornecedor ou produto..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Selecionar</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Medida</TableHead>
                  <TableHead>Valor Unit.</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Quantidade Ofertada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtosFiltrados.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>
                      <Checkbox
                        checked={produto.selecionado}
                        onCheckedChange={() => handleToggleProduto(produto.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>{produto.unidade}</TableCell>
                    <TableCell>R$ {produto.valor.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell>{produto.fornecedor}</TableCell>
                    <TableCell>{produto.quantidadeOfertada}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => navigate('/admin/ciclo-index')}>
                Voltar
              </Button>
              <Button onClick={handleSalvar}>
                Salvar Composição
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
}
