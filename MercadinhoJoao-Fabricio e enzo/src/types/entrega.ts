// src/types/entrega.ts
import * as Yup from 'yup';

export interface Fornecedor {
  nome_empresa: string;
  nome_produto: string;
  num_pedido: number;
  quantidade_produto: number;
  assinatura: string;
}

export interface Entregador {
  nome_completo: string;
  empresa_representante: string;
  documento: string;
  placa_veiculo: string;
}

// O schema deve ser definido exatamente com os campos de FormData
export const schema = Yup.object().shape({
  nome_empresa: Yup.string().required('Obrigatório'),
  nome_produto: Yup.string().required('Obrigatório'),
  num_pedido: Yup.number().transform((value) => (isNaN(value) ? undefined : value)).required('Obrigatório'),
  quantidade_produto: Yup.number().transform((value) => (isNaN(value) ? undefined : value)).required('Obrigatório'),
  nome_completo: Yup.string().required('Obrigatório'),
  placa_veiculo: Yup.string().required('Obrigatório'),
  documento: Yup.string().required('Obrigatório'),
});