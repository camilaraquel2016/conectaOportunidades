export const CATEGORIAS = [
  { valor: 'curso', rotulo: 'Curso' },
  { valor: 'oficina', rotulo: 'Oficina' },
  { valor: 'emprego', rotulo: 'Emprego' },
  { valor: 'estagio', rotulo: 'Estágio' },
];

const ROTULOS_CATEGORIA = Object.fromEntries(CATEGORIAS.map(({ valor, rotulo }) => [valor, rotulo]));


const CORES_CATEGORIA = {
  curso: {
    badge: 'bg-blue-600 text-white shadow-sm',
    barra: 'from-blue-500 to-sky-400',
    faixa: 'from-blue-700 via-blue-600 to-sky-500',
    fundo: 'from-blue-50 to-sky-50/70',
    icone: 'bg-gradient-to-br from-blue-500 to-sky-400 text-white shadow-md',
    destaque: 'group-hover:text-blue-700',
    borda: 'hover:border-blue-200',
    traco: 'border-l-blue-400',
    acao: 'from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600',
    sombra: 'hover:shadow-blue-500/30',
  },
  oficina: {
    badge: 'bg-amber-500 text-white shadow-sm',
    barra: 'from-amber-500 to-orange-400',
    faixa: 'from-amber-600 via-orange-500 to-amber-400',
    fundo: 'from-amber-50 to-orange-50/70',
    icone: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md',
    destaque: 'group-hover:text-amber-700',
    borda: 'hover:border-amber-200',
    traco: 'border-l-amber-400',
    acao: 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    sombra: 'hover:shadow-amber-500/30',
  },
  emprego: {
    badge: 'bg-emerald-600 text-white shadow-sm',
    barra: 'from-emerald-500 to-teal-400',
    faixa: 'from-emerald-700 via-emerald-600 to-teal-500',
    fundo: 'from-emerald-50 to-teal-50/70',
    icone: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md',
    destaque: 'group-hover:text-emerald-700',
    borda: 'hover:border-emerald-200',
    traco: 'border-l-emerald-400',
    acao: 'from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600',
    sombra: 'hover:shadow-emerald-500/30',
  },
  estagio: {
    badge: 'bg-purple-600 text-white shadow-sm',
    barra: 'from-purple-500 to-fuchsia-400',
    faixa: 'from-purple-700 via-purple-600 to-fuchsia-500',
    fundo: 'from-purple-50 to-fuchsia-50/70',
    icone: 'bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-md',
    destaque: 'group-hover:text-purple-700',
    borda: 'hover:border-purple-200',
    traco: 'border-l-purple-400',
    acao: 'from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600',
    sombra: 'hover:shadow-purple-500/30',
  },
};

const CORES_PADRAO = {
  badge: 'bg-slate-600 text-white shadow-sm',
  barra: 'from-slate-400 to-slate-300',
  faixa: 'from-slate-700 via-slate-600 to-slate-500',
  fundo: 'from-slate-50 to-slate-100/70',
  icone: 'bg-gradient-to-br from-slate-500 to-slate-400 text-white shadow-md',
  destaque: 'group-hover:text-slate-700',
  borda: 'hover:border-slate-300',
  traco: 'border-l-slate-300',
  acao: 'from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600',
  sombra: 'hover:shadow-slate-500/25',
};

export function obterCoresCategoria(categoria) {
  return CORES_CATEGORIA[categoria] ?? CORES_PADRAO;
}

export function formatarCategoria(categoria) {
  return ROTULOS_CATEGORIA[categoria] ?? 'Oportunidade';
}

export function formatarData(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  if (Number.isNaN(data.getTime())) return '';
  return data.toLocaleDateString('pt-BR');
}

export function correspondeAoTermo(oportunidade, termo) {
  const alvo = termo?.trim().toLowerCase();
  if (!alvo) return true;
  return [
    oportunidade.titulo,
    oportunidade.instituicao_empresa,
    oportunidade.descricao_requisitos,
    formatarCategoria(oportunidade.tipo_categoria),
  ].some((campo) => campo?.toLowerCase().includes(alvo));
}