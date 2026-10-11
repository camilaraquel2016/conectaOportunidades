import { useEffect, useState } from 'react';
import { Building2, CalendarDays, ExternalLink, Loader2, Mail, MessageCircle, Phone } from 'lucide-react';

import Modal from '../common/Modal';
import Alerta from '../common/Alerta';
import { getOportunidadeDetalhes } from '../../services/api';
import { classificarContato } from '../../utils/contato';
import { formatarCategoria, formatarData, obterCoresCategoria } from '../../utils/formatters';
import { obterIconeCategoria } from './IconesCategoria';

const ACAO_BASE =
  'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98]';
const ACAO_WHATSAPP = `${ACAO_BASE} bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg`;
const ACAO_SECUNDARIA = `${ACAO_BASE} border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50`;
const CHIP_DATA =
  'inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm';

function AcoesDeContato({ contato, cores }) {
  const acaoPrincipal = `${ACAO_BASE} bg-gradient-to-r ${cores.acao} text-white shadow-md hover:shadow-lg`;

  if (contato.tipo === 'whatsapp' || contato.tipo === 'url') {
    return (
      <a
        href={contato.href}
        target="_blank"
        rel="noopener noreferrer"
        className={contato.tipo === 'whatsapp' ? ACAO_WHATSAPP : acaoPrincipal}
      >
        {contato.tipo === 'whatsapp' && <MessageCircle className="h-4 w-4" aria-hidden="true" />}
        {contato.rotulo}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    );
  }

  if (contato.tipo === 'email') {
    return (
      <a href={contato.href} className={acaoPrincipal}>
        <Mail className="h-4 w-4" aria-hidden="true" />
        {contato.rotulo}
      </a>
    );
  }

  if (contato.tipo === 'telefone') {
    return (
      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{contato.rotulo}</p>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          {contato.whatsapp && (
            <a
              href={contato.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Falar no WhatsApp com ${contato.rotulo}`}
              className={ACAO_WHATSAPP}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Falar no WhatsApp
            </a>
          )}
          <a href={contato.telefone} aria-label={`Ligar para ${contato.rotulo}`} className={ACAO_SECUNDARIA}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            {contato.whatsapp ? 'Ligar' : `Ligar para ${contato.rotulo}`}
          </a>
        </div>
      </div>
    );
  }

  return (
    <p className="rounded-xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
      Contato para inscrição: <strong>{contato.valor}</strong>
    </p>
  );
}

/**
 * RF-03: exibe os detalhes e consulta a API, que ja registra o log de
 * visualizacao no banco quando a oportunidade esta ativa.
 */
export default function OportunidadeDetalhesModal({ idOportunidade, aoFechar }) {
  const [oportunidade, setOportunidade] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function carregarDetalhes() {
      try {
        const dados = await getOportunidadeDetalhes(idOportunidade);
        if (!cancelado) setOportunidade(dados);
      } catch (falha) {
        if (!cancelado) setErro(falha.mensagem ?? 'Não foi possível carregar os detalhes.');
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarDetalhes();
    return () => {
      cancelado = true;
    };
  }, [idOportunidade]);

  const ativa = oportunidade?.status === 'ativa';
  const contato = classificarContato(oportunidade?.link_ou_contato);
  const cores = obterCoresCategoria(oportunidade?.tipo_categoria);
  const Icone = obterIconeCategoria(oportunidade?.tipo_categoria);

  /** Faixa colorida de ponta a ponta com a identidade da categoria. */
  const cabecalho = oportunidade && (
    <div className={`bg-gradient-to-br ${cores.faixa} px-6 pb-7 pt-8 text-white`}>
      <div className="flex flex-col gap-4 pr-9">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
            {formatarCategoria(oportunidade.tipo_categoria)}
          </span>
          {!ativa && (
            <span className="rounded-full bg-slate-900/30 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
              Encerrada
            </span>
          )}
        </div>

        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-lg ring-1 ring-white/30">
            <Icone className="h-7 w-7" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold leading-snug md:text-2xl">{oportunidade.titulo}</h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-white/90">
              <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="line-clamp-2">{oportunidade.instituicao_empresa}</span>
            </p>
            <span className={`mt-3 ${CHIP_DATA}`}>
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {formatarData(oportunidade.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      titulo={oportunidade?.titulo ?? 'Detalhes da oportunidade'}
      aoFechar={aoFechar}
      cabecalho={cabecalho}
      largo
    >
      {carregando && (
        <div className="flex justify-center py-12" role="status">
          <Loader2 className="h-7 w-7 animate-spin text-brand-600" aria-hidden="true" />
          <span className="sr-only">Carregando detalhes...</span>
        </div>
      )}

      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      {oportunidade && (
        <div className="flex flex-col gap-5">
          <section
            className={`rounded-2xl border-l-4 bg-gradient-to-br py-5 pl-5 pr-4 ${cores.traco} ${cores.fundo}`}
          >
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-700">
              {oportunidade.descricao_requisitos}
            </p>
          </section>

          {!ativa && (
            <Alerta tipo="info">
              Esta oportunidade foi encerrada e não recebe mais inscrições.
            </Alerta>
          )}

          {ativa && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <AcoesDeContato contato={contato} cores={cores} />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}