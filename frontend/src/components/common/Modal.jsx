import { useEffect } from 'react';
import { X } from 'lucide-react';


export default function Modal({
  titulo,
  aoFechar,
  children,
  destaque = false,
  cabecalho = null,
  largo = false,
}) {
  useEffect(() => {
    function aoTeclarTecla(evento) {
      if (evento.key === 'Escape') aoFechar();
    }
    document.addEventListener('keydown', aoTeclarTecla);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', aoTeclarTecla);
      document.body.style.overflow = '';
    };
  }, [aoFechar]);

  function fecharPeloFundo(evento) {
    if (evento.target === evento.currentTarget) aoFechar();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={fecharPeloFundo}
    >
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl animate-slide-up ${
          largo ? 'sm:max-w-2xl' : 'sm:max-w-lg'
        }`}
      >
        {cabecalho ? (
          <div className="relative">
            {cabecalho}
            <button
              type="button"
              onClick={aoFechar}
              aria-label="Fechar"
              className="absolute right-4 top-4 rounded-xl p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <header
            className={`sticky top-0 flex items-start justify-between gap-4 border-b px-6 py-4 ${
              destaque
                ? 'border-white/20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'border-slate-100 bg-white text-slate-800'
            }`}
          >
            <h2 className="text-lg font-semibold">{titulo}</h2>
            <button
              type="button"
              onClick={aoFechar}
              aria-label="Fechar"
              className={`rounded-lg p-1.5 transition-colors ${
                destaque
                  ? 'text-white/80 hover:bg-white/20 hover:text-white'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>
        )}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}