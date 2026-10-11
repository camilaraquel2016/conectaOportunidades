import { Search, X } from 'lucide-react';

import PillsCategoria from '../oportunidades/PillsCategoria';


export default function HeroBusca({
  termoBusca,
  categoriaAtiva,
  aoDefinirTermoBusca,
  aoSelecionarCategoria,
  aoIrParaVitrine,
}) {
  const irParaVitrine = (evento) => {
    evento.preventDefault();
    aoIrParaVitrine();
  };

  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 p-8 text-white shadow-2xl md:p-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/20 blur-3xl motion-safe:animate-pulse [animation-duration:9s]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-slate-900/25 blur-3xl motion-safe:animate-pulse [animation-duration:13s]" aria-hidden="true" />

      <div className="relative">
        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight drop-shadow-sm md:text-5xl">
          Oportunidades para você,{' '}
          <span className="relative whitespace-nowrap">
            em um só lugar
            <span className="absolute inset-x-0 bottom-1.5 -z-10 h-3 rounded-full bg-white/25" aria-hidden="true" />
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-white/85 md:text-base">
          Cursos, oficinas, estágios e empregos publicados pela comunidade. Busque por
          tecnologia, instituição ou área de atuação.
        </p>

        <form className="mt-8" onSubmit={irParaVitrine} role="search">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-slate-100">
              <Search className="h-4 w-4 text-slate-500" aria-hidden="true" />
            </span>
            <input
              id="busca"
              type="search"
              value={termoBusca}
              onChange={(evento) => aoDefinirTermoBusca(evento.target.value)}
              placeholder="Busque por python, UFPI, design..."
              aria-label="Buscar oportunidades por texto"
              className="h-16 w-full appearance-none rounded-2xl border-0 bg-white py-4 pl-16 pr-28 text-base text-slate-800 shadow-xl outline-none ring-1 ring-white/60 transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-white/50 [&::-webkit-search-cancel-button]:appearance-none"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 bg-blue-600 px-5 py-2 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Buscar</span>
            </button>
            {termoBusca && (
              <button
                type="button"
                onClick={() => aoDefinirTermoBusca('')}
                aria-label="Limpar busca"
                className="absolute right-32 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/70">
            Ou filtre por categoria
          </p>
          <PillsCategoria
            categoriaAtiva={categoriaAtiva}
            aoSelecionar={aoSelecionarCategoria}
            variante="hero"
            rotuloTodas="Todas"
          />
        </div>
      </div>
    </section>
  );
}