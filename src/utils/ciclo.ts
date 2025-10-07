import { format, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type Periodicidade = 'semanal' | 'quinzenal';

export interface CicloData {
  inicio_ofertas: string;
  periodicidade?: Periodicidade;
}

/**
 * Calcula o nome do ciclo no formato: {n}º Ciclo de {Mês} {Ano}
 * baseado na data de início e na posição dentro do mês
 */
export const calcularNomeCiclo = (
  inicioOfertas: string,
  ciclosDoMes: CicloData[]
): string => {
  if (!inicioOfertas) return '';
  
  const dataInicio = parseISO(inicioOfertas);
  const mes = format(dataInicio, 'MMMM', { locale: ptBR });
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
  const ano = format(dataInicio, 'yyyy');
  
  // Ordenar ciclos do mês por data de início
  const ciclosOrdenados = [...ciclosDoMes]
    .filter(c => c.inicio_ofertas)
    .sort((a, b) => new Date(a.inicio_ofertas).getTime() - new Date(b.inicio_ofertas).getTime());
  
  // Encontrar a posição do ciclo atual
  const posicao = ciclosOrdenados.findIndex(c => c.inicio_ofertas === inicioOfertas) + 1 || ciclosOrdenados.length + 1;
  
  return `${posicao}º Ciclo de ${mesCapitalizado} ${ano}`;
};

/**
 * Calcula a data de fim baseada na periodicidade
 */
export const calcularFimOfertas = (
  inicioOfertas: string,
  periodicidade: Periodicidade
): string => {
  if (!inicioOfertas) return '';
  
  const dataInicio = parseISO(inicioOfertas);
  const dias = periodicidade === 'semanal' ? 7 : 14;
  const dataFim = addDays(dataInicio, dias);
  
  return format(dataFim, "yyyy-MM-dd'T'HH:mm");
};

/**
 * Formata a data para exibição (dd/mm/aaaa)
 */
export const formatarDataBR = (data: string | Date): string => {
  if (!data) return '';
  const d = typeof data === 'string' ? parseISO(data) : data;
  return format(d, 'dd/MM/yyyy', { locale: ptBR });
};

/**
 * Retorna os tipos de venda permitidos para cada mercado
 */
export const getTiposVendaPermitidos = (mercadoId: string): string[] => {
  const regras: Record<string, string[]> = {
    '1': ['cesta'], // Mercado Central
    '2': ['cesta', 'lote'], // Mercado Zona Norte
    '3': ['venda_direta'], // Feira Livre
  };
  return regras[mercadoId] || ['cesta', 'lote', 'venda_direta'];
};

/**
 * Retorna o administrador responsável pelo mercado
 */
export const getAdministradorMercado = (mercadoId: string): string => {
  const admins: Record<string, string> = {
    '1': 'João Silva',
    '2': 'Anna Cardoso',
    '3': 'Maria Santos',
  };
  return admins[mercadoId] || '';
};

/**
 * Retorna o nome do mercado
 */
export const getNomeMercado = (mercadoId: string): string => {
  const nomes: Record<string, string> = {
    '1': 'Mercado Central',
    '2': 'Mercado Zona Norte',
    '3': 'Feira Livre',
  };
  return nomes[mercadoId] || '';
};

/**
 * Retorna o label do tipo de venda
 */
export const getTipoVendaLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    'cesta': '🧺 Cesta',
    'lote': '📦 Lote',
    'venda_direta': '🏬 Venda Direta',
  };
  return labels[tipo] || tipo;
};
