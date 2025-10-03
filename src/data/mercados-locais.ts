export interface MercadoLocal {
  id: string;
  nome: string;
  status: 'ativo' | 'inativo';
  tipo: 'Cestas' | 'Venda Direta';
  administrador?: string;
}

export const mercadosLocais: MercadoLocal[] = [
  { id: "mc", nome: "Mercado Central", status: "ativo", tipo: "Cestas", administrador: "Fernanda Lima" },
  { id: "mv", nome: "Mercado da Vila", status: "ativo", tipo: "Venda Direta", administrador: "Carlos Silva" },
  { id: "sl", nome: "Supermercado Local", status: "ativo", tipo: "Venda Direta", administrador: "Fernanda Lima" },
  { id: "fo", nome: "Feira Orgânica", status: "ativo", tipo: "Cestas", administrador: "Ana Santos" }
];

export const getMercadosAtivos = () => mercadosLocais.filter(m => m.status === 'ativo');