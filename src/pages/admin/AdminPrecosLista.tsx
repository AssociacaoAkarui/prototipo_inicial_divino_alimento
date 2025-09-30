import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { mercadosLocais } from "@/data/mercados-locais";

export default function AdminPrecosLista() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMercados = useMemo(() => {
    return mercadosLocais.filter(m =>
      m.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <ResponsiveLayout>
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Lista de Mercados – Gestão de Preços</h1>
            <p className="text-muted-foreground">
              Selecione um mercado para definir preços específicos
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mercado por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Desktop Table */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle>Mercados Cadastrados</CardTitle>
            <CardDescription>
              {filteredMercados.length} mercado(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Mercado</TableHead>
                  <TableHead>Tipo de Mercado</TableHead>
                  <TableHead>Administrador Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMercados.map((mercado) => (
                  <TableRow key={mercado.id}>
                    <TableCell className="font-medium">{mercado.nome}</TableCell>
                    <TableCell>{mercado.tipo}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>
                      <Badge variant={mercado.status === 'ativo' ? "default" : "secondary"}>
                        {mercado.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-success hover:bg-success/90"
                        onClick={() => navigate(`/admin/precos/${mercado.id}`)}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Gerenciar Preços
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredMercados.map((mercado) => (
            <Card key={mercado.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{mercado.nome}</CardTitle>
                    <CardDescription>{mercado.tipo}</CardDescription>
                  </div>
                  <Badge variant={mercado.status === 'ativo' ? "default" : "secondary"}>
                    {mercado.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Administrador Responsável</p>
                  <p className="text-sm font-medium">—</p>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-success hover:bg-success/90"
                  onClick={() => navigate(`/admin/precos/${mercado.id}`)}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Gerenciar Preços
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMercados.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Nenhum mercado encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </ResponsiveLayout>
  );
}
