import { BookOpen, Briefcase, GraduationCap, Sparkles, Wrench } from 'lucide-react';

const ICONES_CATEGORIA = {
  curso: BookOpen,
  oficina: Wrench,
  emprego: Briefcase,
  estagio: GraduationCap,
};

export function obterIconeCategoria(categoria) {
  return ICONES_CATEGORIA[categoria] ?? Sparkles;
}