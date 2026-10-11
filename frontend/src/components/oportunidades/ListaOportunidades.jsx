import EmptyState from '../common/EmptyState';
import Spinner from '../common/Spinner';
import Alerta from '../common/Alerta';
import OportunidadeCard from './OportunidadeCard';

export default function ListaOportunidades({
  oportunidades,
  loading,
  error,
  modo,
  aoVerDetalhes,
  aoAlternarStatus,
  aoLimparErro,
  tituloVazio,
  descricaoVazio,
}) {
  const semRegistros = oportunidades.length === 0;

  return (
    <div className="flex flex-col gap-4">
      {error && <Alerta tipo="erro" aoFechar={aoLimparErro}>{error}</Alerta>}
      {loading && semRegistros && <Spinner />}
      {!loading && !error && semRegistros && (
        <EmptyState titulo={tituloVazio} descricao={descricaoVazio} />
      )}

      {!semRegistros && (
        <>
          <p className="w-fit rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {oportunidades.length}{' '}
            {oportunidades.length === 1 ? 'oportunidade encontrada' : 'oportunidades encontradas'}
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {oportunidades.map((oportunidade) => (
              <OportunidadeCard
                key={oportunidade.id}
                oportunidade={oportunidade}
                modo={modo}
                aoVerDetalhes={aoVerDetalhes}
                aoAlternarStatus={aoAlternarStatus}
              />
            ))}
          </div>
        </>
      )}

      {loading && !semRegistros && (
        <p className="text-center text-xs text-slate-400">Atualizando lista...</p>
      )}
    </div>
  );
}
