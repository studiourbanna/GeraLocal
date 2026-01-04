export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateProduct = (product: any): string[] => {
  const errors: string[] = [];
  if (!product.name) errors.push('Nome é obrigatório');
  if (!product.price || product.price <= 0) errors.push('Preço deve ser maior que 0');
  if (!product.stock || product.stock < 0) errors.push('Estoque não pode ser negativo');
  return errors;
};