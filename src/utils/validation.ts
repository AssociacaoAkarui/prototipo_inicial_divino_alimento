// Validação de CPF
export const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

// Validação de CNPJ
export const validarCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/\D/g, '');

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
};

// Validação de e-mail
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validação de celular (11 dígitos)
export const validarCelular = (celular: string): boolean => {
  const digitos = celular.replace(/\D/g, '');
  return digitos.length === 11;
};

// Validação de chave PIX
export const validarChavePix = (chave: string): { valido: boolean; tipo?: string; mensagem?: string } => {
  const limpo = chave.replace(/\D/g, '');

  // E-mail
  if (validarEmail(chave)) {
    return { valido: true, tipo: 'email' };
  }

  // Celular (11 dígitos)
  if (limpo.length === 11 && validarCelular(chave)) {
    return { valido: true, tipo: 'celular' };
  }

  // CPF (11 dígitos)
  if (limpo.length === 11 && validarCPF(limpo)) {
    return { valido: true, tipo: 'cpf' };
  }

  // CNPJ (14 dígitos)
  if (limpo.length === 14 && validarCNPJ(limpo)) {
    return { valido: true, tipo: 'cnpj' };
  }

  // EVP (32 caracteres alfanuméricos)
  if (/^[A-Za-z0-9]{32}$/.test(chave)) {
    return { valido: true, tipo: 'evp' };
  }

  return { 
    valido: false, 
    mensagem: 'Informe uma chave PIX válida (e-mail, celular, CPF, CNPJ ou EVP).' 
  };
};

// Validação de agência
export const validarAgencia = (agencia: string): boolean => {
  const digitos = agencia.replace(/\D/g, '');
  return /^\d{4,5}$/.test(digitos);
};

// Validação de conta
export const validarConta = (conta: string): boolean => {
  return /^\d{1,12}-\d{1}$/.test(conta);
};
