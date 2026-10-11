import { Loader2 } from 'lucide-react';

export default function Spinner({ texto = 'Carregando oportunidades...' }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" aria-hidden="true" />
      <p className="text-sm">{texto}</p>
    </div>
  );
}
