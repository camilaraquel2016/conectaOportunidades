import { SearchX } from 'lucide-react';

export default function EmptyState({
  titulo = 'Nenhuma oportunidade encontrada',
  descricao = 'Nenhuma oportunidade encontrada para o filtro selecionado no momento. Tente outro filtro ou publique uma nova oportunidade.',
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-brand-200 bg-gradient-to-b from-white to-brand-50/60 px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-teal-500 text-white shadow-md">
        <SearchX className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-slate-800">{titulo}</h3>
      <p className="max-w-md text-sm text-slate-500">{descricao}</p>
    </div>
  );
}
