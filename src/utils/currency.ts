/**
 * Formata um valor numérico para o padrão monetário brasileiro (R$ 9.999,99)
 * @param value - Número ou string a ser formatada
 * @returns String formatada em padrão BRL
 */
export const formatBRL = (value: number | string): string => {
  const num = typeof value === 'string'
    ? Number(String(value).replace(/\./g, '').replace(',', '.'))
    : value ?? 0;
  
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(num || 0);
};

/**
 * Converte uma string no formato brasileiro (9.999,99) para número (9999.99)
 * @param value - String no formato brasileiro
 * @returns Número convertido
 */
export const parseBRLToNumber = (value: string): number => {
  if (!value) return 0;
  return Number(value.replace(/\./g, '').replace(',', '.'));
};

/**
 * Formata um valor de input para o padrão brasileiro enquanto digita
 * Aceita apenas números e vírgula
 * @param value - Valor atual do input
 * @returns Valor formatado
 */
export const formatBRLInput = (value: string): string => {
  // Remove tudo que não seja número ou vírgula
  let cleaned = value.replace(/[^\d,]/g, '');
  
  // Permite apenas uma vírgula
  const parts = cleaned.split(',');
  if (parts.length > 2) {
    cleaned = parts[0] + ',' + parts.slice(1).join('');
  }
  
  // Limita a 2 casas decimais após a vírgula
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + ',' + parts[1].substring(0, 2);
  }
  
  return cleaned;
};
