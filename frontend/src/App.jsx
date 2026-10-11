import { useState } from 'react';
import { Plus } from 'lucide-react';

import Alerta from './components/common/Alerta';
import Navbar from './components/layout/Navbar';
import HeroBusca from './components/layout/HeroBusca';
import ListaOportunidades from './components/oportunidades/ListaOportunidades';
import OportunidadeDetalhesModal from './components/oportunidades/OportunidadeDetalhesModal';
import OportunidadeFormModal from './components/oportunidades/OportunidadeFormModal';
import { useOportunidades } from './hooks/useOportunidades';

const MODO_GESTAO = 'gestao';
const ID_VITRINE = 'vitrine';

export default function App() {
  const {
    oportunidades,
    loading,
    error,
    categoria,
    definirCategoria,
    termoBusca,
    definirTermoBusca,
    carregarOportunidades,
    alternarStatus,
    limparErro,
  } = useOportunidades();

  const [modo, setModo] = useState('candidato');
  const [detalhesId, setDetalhesId] = useState(null);
  const [formAberto, setFormAberto] = useState(false);
  const [sucesso, setSucesso] = useState('');

  const emGestao = modo === MODO_GESTAO;

  function tratarSucesso() {
    setFormAberto(false);
    setSucesso('Oportunidade cadastrada com sucesso!');
    carregarOportunidades();
  }

  function rolarParaVitrine() {
    document.getElementById(ID_VITRINE)?.scrollIntoView({ behavior: 'smooth' });
  }

  const mensagemVazia = termoBusca.trim()
    ? {
        titulo: `Nenhum resultado para "${termoBusca.trim()}"`,
        descricao: 'Tente outro termo, como "python", "IFPI" ou "design", ou limpe a busca.',
      }
    : {};

  const lista = (
    <ListaOportunidades
      oportunidades={oportunidades}
      loading={loading}
      error={error}
      modo={modo}
      aoVerDetalhes={(oportunidade) => setDetalhesId(oportunidade.id)}
      aoAlternarStatus={alternarStatus}
      aoLimparErro={limparErro}
      tituloVazio={mensagemVazia.titulo}
      descricaoVazio={mensagemVazia.descricao}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-50 via-slate-50 to-slate-100">
      <Navbar modo={modo} aoTrocarModo={setModo} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
        {sucesso && <Alerta tipo="sucesso" aoFechar={() => setSucesso('')}>{sucesso}</Alerta>}

        {emGestao ? (
          <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-slate-800">Gestão de oportunidades</h1>
                <p className="text-sm text-slate-500">
                  Publique novas vagas e acompanhe as que estão ativas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormAberto(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Nova Oportunidade
              </button>
            </div>
            {lista}
          </section>
        ) : (
          <section className="flex flex-col gap-6">
            <HeroBusca
              termoBusca={termoBusca}
              categoriaAtiva={categoria}
              aoDefinirTermoBusca={definirTermoBusca}
              aoSelecionarCategoria={definirCategoria}
              aoIrParaVitrine={rolarParaVitrine}
            />

            <div id={ID_VITRINE} className="flex scroll-mt-6 flex-col gap-4">
              {/* Leitores de tela ouvem a mudanca do resultado da busca em tempo real. */}
              <p aria-live="polite" className="sr-only">
                {loading
                  ? 'Carregando oportunidades'
                  : `${oportunidades.length} ${
                      oportunidades.length === 1 ? 'oportunidade encontrada' : 'oportunidades encontradas'
                    }`}
              </p>
              {lista}
            </div>
          </section>
        )}
      </main>

      {detalhesId !== null && (
        <OportunidadeDetalhesModal
          idOportunidade={detalhesId}
          aoFechar={() => setDetalhesId(null)}
        />
      )}

      {formAberto && <OportunidadeFormModal aoFechar={() => setFormAberto(false)} aoSucesso={tratarSucesso} />}
    </div>
  );
}
