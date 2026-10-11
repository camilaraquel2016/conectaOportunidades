import { GraduationCap, UserRound, BriefcaseBusiness } from 'lucide-react';

const MODOS = [
  { chave: 'candidato', rotulo: 'Visão Candidato', Icone: UserRound },
  { chave: 'gestao', rotulo: 'Gestão / Anunciante', Icone: BriefcaseBusiness },
];

export default function Navbar({ modo = 'candidato', aoTrocarModo }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-lg font-bold leading-tight text-transparent">
              Conecta Oportunidades
            </p>
            <p className="text-xs text-slate-500">
              Qualificação profissional e mercado de trabalho em um só lugar
            </p>
          </div>
        </div>

        <div
          className="flex rounded-lg border border-slate-200 bg-slate-50 p-1"
          role="group"
          aria-label="Modo de visualização"
        >
          {MODOS.map(({ chave, rotulo, Icone }) => {
            const ativo = modo === chave;
            return (
              <button
                key={chave}
                type="button"
                onClick={() => aoTrocarModo(chave)}
                aria-pressed={ativo}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  ativo
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-800'
                }`}
              >
                <Icone className="h-4 w-4" aria-hidden="true" />
                {rotulo}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
