import { LayoutGrid } from 'lucide-react';

import { CATEGORIAS } from '../../utils/formatters';
import { obterIconeCategoria } from './IconesCategoria';

const VARIANTES = {
  claro: {
    base: 'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
    ativo: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md',
    inativo:
      'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 hover:shadow-sm',
  },
  hero: {
    base: 'inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5',
    ativo: 'bg-blue-600 text-white shadow-md',
    inativo: 'border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/20',
  },
};

export default function PillsCategoria({
  categoriaAtiva,
  aoSelecionar,
  variante = 'hero',
  rotuloTodas = 'Todas',
}) {
  const estilo = VARIANTES[variante];
  const opcoes = [
    { valor: '', rotulo: rotuloTodas, Icone: LayoutGrid },
    ...CATEGORIAS.map((categoria) => ({
      ...categoria,
      Icone: obterIconeCategoria(categoria.valor),
    })),
  ];

  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Filtrar por categoria">
      {opcoes.map(({ valor, rotulo, Icone }) => {
        const ativo = categoriaAtiva === valor;
        return (
          <button
            key={valor || 'todas'}
            type="button"
            aria-pressed={ativo}
            onClick={() => aoSelecionar(valor)}
            className={`flex items-center gap-2 ${estilo.base} ${ativo ? estilo.ativo : estilo.inativo}`}
          >
            <Icone className="h-4 w-4" aria-hidden="true" />
            {rotulo}
          </button>
        );
      })}
    </div>
  );
}