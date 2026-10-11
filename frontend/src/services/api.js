
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

function extrairMensagem(erro) {
  const dados = erro.response?.data;

  if (dados && typeof dados === 'object') {
    if (typeof dados.detail === 'string') return dados.detail;
    const mensagens = Object.values(dados).flat().filter(Boolean);
    if (mensagens.length) return mensagens.join(' ');
  }
  if (erro.code === 'ECONNABORTED') return 'A requisição demorou demais. Tente novamente.';
  if (!erro.response) return 'Não foi possível conectar à API. Verifique se o backend está rodando.';
  return 'Ocorreu um erro inesperado na API.';
}

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => Promise.reject(Object.assign(erro, { mensagem: extrairMensagem(erro) })),
);

function apenasPreenchidos(filtros = {}) {
  return Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor));
}

export async function getOportunidades(filtros) {
  const { data } = await api.get('/oportunidades/', { params: apenasPreenchidos(filtros) });
  return data;
}

export async function getOportunidadeDetalhes(id) {
  const { data } = await api.get(`/oportunidades/${id}/`);
  return data;
}

export async function criarOportunidade(dados) {
  const { data } = await api.post('/oportunidades/', dados);
  return data;
}

export async function atualizarStatusOportunidade(id, novoStatus) {
  const { data } = await api.patch(`/oportunidades/${id}/status/`, { status: novoStatus });
  return data;
}

export default api;
