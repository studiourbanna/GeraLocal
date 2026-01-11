export interface CepResponse {
  street: string;
  city: string;
  state: string;
  error?: string;
}

/**
 * Busca dados de endereço via API ViaCEP
 * @param cep String de 8 dígitos numéricos
 */
export const fetchAddressByCep = async (cep: string): Promise<CepResponse> => {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    return { street: '', city: '', state: '', error: 'CEP Inválido' };
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) {
      return { street: '', city: '', state: '', error: 'CEP não encontrado' };
    }

    return {
      street: data.logradouro,
      city: `${data.localidade}`,
      state: `${data.uf}`,
    };
  } catch (error) {
    return { street: '', city: '', state: '', error: 'Erro ao conectar ao serviço de CEP' };
  }
};

/**
 * Aplica máscara de CEP (00000-000)
 */
export const maskCep = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .substring(0, 9);
};