
import { CATEGORIAS } from './formatters';

const FORMATO_EMAIL = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;
const CARACTERES_TELEFONE = /^\+?[\d\s().-]+$/;

const CAMPOS_TEXTUAIS = [
  { campo: 'titulo', rotulo: 'O título', minimo: 5, maximo: 100 },
  { campo: 'instituicao_empresa', rotulo: 'A instituição/empresa', maximo: 100 },
  { campo: 'descricao_requisitos', rotulo: 'A descrição dos requisitos', maximo: 1000 },
  { campo: 'link_ou_contato', rotulo: 'O link ou contato', maximo: 255 },
];

export function contatoValido(valor) {
  const contato = (valor ?? '').trim();
  if (contato.toLowerCase().startsWith('http://') || contato.toLowerCase().startsWith('https://')) {
    return true;
  }
  if (FORMATO_EMAIL.test(contato)) return true;
  const digitos = contato.replace(/\D/g, '');
  return CARACTERES_TELEFONE.test(contato) && digitos.length >= 10 && digitos.length <= 13;
}

export function validarOportunidade(dados = {}) {
  const erros = {};

  CAMPOS_TEXTUAIS.forEach(({ campo, rotulo, minimo, maximo }) => {
    const valor = (dados[campo] ?? '').trim();
    if (!valor) {
      erros[campo] = `${rotulo} é obrigatório.`;
    } else if (minimo && valor.length < minimo) {
      erros[campo] = `${rotulo} deve ter no mínimo ${minimo} caracteres.`;
    } else if (valor.length > maximo) {
      erros[campo] = `${rotulo} deve ter no máximo ${maximo} caracteres.`;
    }
  });

  const categoria = dados.tipo_categoria;
  if (!categoria) {
    erros.tipo_categoria = 'Selecione o tipo de categoria.';
  } else if (!CATEGORIAS.some(({ valor }) => valor === categoria)) {
    erros.tipo_categoria = 'Categoria inválida.';
  }

  if (!contatoValido(dados.link_ou_contato)) {
    erros.link_ou_contato = 'Informe um link, e-mail ou WhatsApp válido para a inscrição.';
  }

  return erros;
}
