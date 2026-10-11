import { useState } from 'react';
import { ArrowRight, Building2, CalendarDays } from 'lucide-react';

import { formatarCategoria, formatarData, obterCoresCategoria } from '../../utils/formatters';
import { obterIconeCategoria } from './IconesCategoria';

const ACAO_PERIGO =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100';
const ACAO_NEUTRA =
  'flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50';

export default function OportunidadeCard({
  oportunidade,
  modo = 'candidato',
  aoVerDetalhes,
  aoAlternarStatus,
}) {
  const [confirmando, setConfirmando] = useState(false);
  const ativa = oportunidade.status === 'ativa';
  const novoStatus = ativa ? 'encerrada' : 'ativa';
  const cores = obterCoresCategoria(oportunidade.tipo_categoria);
  const Icone = obterIconeCategoria(oportunidade.tipo_categoria);

  function lidarComEncerramento() {
    if (!confirmando) {
      setConfirmando(true);
      return;
    }
    setConfirmando(false);
    aoAlternarStatus(oportunidade.id, novoStatus);
  }

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-md${
        ativa ? '' : ' opacity-75'
      }`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cores.barra}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white ${cores.badge}`}>
            <Icone className="h-3.5 w-3.5" aria-hidden="true" />
            {formatarCategoria(oportunidade.tipo_categoria)}
          </span>
          {!ativa && (
            <span className="rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Encerrada
            </span>
          )}
        </div>

        <h3 className="mt-5 line-clamp-2 text-xl font-bold leading-snug tracking-tight text-slate-900">
          {oportunidade.titulo}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <Building2 className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="truncate">{oportunidade.instituicao_empresa}</span>
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-center border-t border-slate-100 pt-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Publicado em {formatarData(oportunidade.created_at)}
            </span>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 p-4">
        {modo === 'gestao' ? (
          confirmando ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={lidarComEncerramento} className={`${ACAO_PERIGO} flex-1`}>
                Confirmar
              </button>
              <button type="button" onClick={() => setConfirmando(false)} className={ACAO_NEUTRA}>
                Cancelar
              </button>
            </div>
          ) : (
            <button type="button" onClick={lidarComEncerramento} className={ACAO_PERIGO}>
              {ativa ? 'Encerrar Vaga' : 'Reativar Vaga'}
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={() => aoVerDetalhes(oportunidade)}
            aria-label={`Ver detalhes e inscrever-se em ${oportunidade.titulo}`}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.99] ${cores.acao}`}
          >
            Ver Detalhes e Inscrever-se
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        )}
      </footer>
    </article>
  );
}