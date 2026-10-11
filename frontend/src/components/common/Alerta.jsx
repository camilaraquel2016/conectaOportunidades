import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const ESTILOS = {
  erro: { classe: 'border-red-200 bg-red-50 text-red-700', Icone: AlertCircle, papel: 'alert' },
  sucesso: { classe: 'border-emerald-200 bg-emerald-50 text-emerald-700', Icone: CheckCircle2, papel: 'status' },
  info: { classe: 'border-brand-100 bg-brand-50 text-brand-700', Icone: Info, papel: 'status' },
};

export default function Alerta({ tipo = 'erro', children, aoFechar }) {
  const { classe, Icone, papel } = ESTILOS[tipo] ?? ESTILOS.erro;

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${classe}`} role={papel}>
      <Icone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="flex-1 leading-relaxed">{children}</p>
      {aoFechar && (
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar aviso"
          className="rounded p-0.5 transition-colors hover:bg-black/5"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
