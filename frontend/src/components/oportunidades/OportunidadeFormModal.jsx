import { useState } from 'react';
import { AlignLeft, Building2, Info, LayoutGrid, Link2, Send, Type } from 'lucide-react';

import Modal from '../common/Modal';
import Alerta from '../common/Alerta';
import { criarOportunidade } from '../../services/api';
import { CATEGORIAS } from '../../utils/formatters';
import { validarOportunidade } from '../../utils/validators';

const ESTADO_INICIAL = {
  titulo: '',
  tipo_categoria: '',
  instituicao_empresa: '',
  descricao_requisitos: '',
  link_ou_contato: '',
};

const CAMPOS = [
  {
    campo: 'titulo',
    rotulo: 'Título',
    dica: 'Ex.: Oficina de Python para iniciantes',
    maxLength: 100,
    Icone: Type,
  },
  { campo: 'instituicao_empresa', rotulo: 'Instituição / Empresa', dica: 'Ex.: IFPI', maxLength: 100, Icone: Building2 },
  {
    campo: 'descricao_requisitos',
    rotulo: 'Descrição / Requisitos',
    dica: 'Pré-requisitos, horários, forma de participação...',
    maxLength: 1000,
    multilinha: true,
    Icone: AlignLeft,
  },
  {
    campo: 'link_ou_contato',
    rotulo: 'Link ou Contato',
    dica: 'URL, e-mail ou WhatsApp',
    maxLength: 255,
    Icone: Link2,
  },
];

const ROTULO = 'text-sm font-medium text-slate-700';
const CAMPO =
  'w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100';
const MENSAGEM_ERRO = 'mt-1 text-xs font-medium text-red-600';
const BOTAO_SECUNDARIO =
  'rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50';

function Campo({ campo, rotulo, dica, maxLength, multilinha, select, Icone, valor, erro, aoAlterar, children }) {
  const descricao = erro ? `${campo}-erro` : undefined;

  return (
    <div>
      <label className={ROTULO} htmlFor={campo}>
        {rotulo}
      </label>
      <div className="relative mt-1">
        <Icone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" aria-hidden="true" />
        {select ? (
          <select
            id={campo}
            name={campo}
            value={valor}
            onChange={aoAlterar}
            aria-invalid={Boolean(erro)}
            aria-describedby={descricao}
            className={`${CAMPO} cursor-pointer`}
          >
            {children}
          </select>
        ) : multilinha ? (
          <textarea
            id={campo}
            name={campo}
            rows={4}
            maxLength={maxLength}
            placeholder={dica}
            value={valor}
            onChange={aoAlterar}
            aria-invalid={Boolean(erro)}
            aria-describedby={descricao}
            className={`${CAMPO} resize-y`}
          />
        ) : (
          <input
            id={campo}
            name={campo}
            type="text"
            maxLength={maxLength}
            placeholder={dica}
            value={valor}
            onChange={aoAlterar}
            aria-invalid={Boolean(erro)}
            aria-describedby={descricao}
            className={CAMPO}
          />
        )}
      </div>
      {erro && (
        <p id={`${campo}-erro`} className={MENSAGEM_ERRO}>
          {erro}
        </p>
      )}
    </div>
  );
}

export default function OportunidadeFormModal({ aoFechar, aoSucesso }) {
  const [dados, setDados] = useState(ESTADO_INICIAL);
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setDados((atuais) => ({ ...atuais, [name]: value }));
  }

  async function lidarComEnvio(evento) {
    evento.preventDefault();
    const problemas = validarOportunidade(dados);
    setErros(problemas);
    if (Object.keys(problemas).length) return;

    setEnviando(true);
    setErroApi(null);
    try {
      const criada = await criarOportunidade({ ...dados });
      setDados(ESTADO_INICIAL);
      aoSucesso(criada);
    } catch (falha) {
      setErroApi(falha.mensagem ?? 'Não foi possível cadastrar a oportunidade.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal titulo="Publicar nova oportunidade" aoFechar={aoFechar} destaque>
      <form className="flex flex-col gap-4" onSubmit={lidarComEnvio} noValidate>
        {erroApi && <Alerta tipo="erro">{erroApi}</Alerta>}

        <p className="flex items-start gap-2 rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50 to-teal-50 p-3 text-xs leading-relaxed text-slate-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
          Publique com clareza: um bom título e um link de contato acessível aumentam as
          inscrições.
        </p>

        {CAMPOS.map(({ campo, rotulo, dica, maxLength, multilinha, Icone }) => (
          <Campo
            key={campo}
            campo={campo}
            rotulo={rotulo}
            dica={dica}
            maxLength={maxLength}
            multilinha={multilinha}
            Icone={Icone}
            valor={dados[campo]}
            erro={erros[campo]}
            aoAlterar={alterarCampo}
          />
        ))}

        <Campo
          campo="tipo_categoria"
          rotulo="Tipo / Categoria"
          dica="Selecione uma categoria"
          valor={dados.tipo_categoria}
          erro={erros.tipo_categoria}
          Icone={LayoutGrid}
          aoAlterar={alterarCampo}
          select
        >
          <option value="">Selecione uma categoria</option>
          {CATEGORIAS.map(({ valor, rotulo }) => (
            <option key={valor} value={valor}>
              {rotulo}
            </option>
          ))}
        </Campo>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={aoFechar} className={BOTAO_SECUNDARIO}>
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {enviando ? 'Publicando...' : 'Publicar Oportunidade'}
          </button>
        </div>
      </form>
    </Modal>
  );
}