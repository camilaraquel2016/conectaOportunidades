const EH_URL = /^https?:\/\//i;
const EH_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const EH_WHATSAPP = /(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|whatsapp\.com)/i;

function formatarTelefoneBR(digitos) {
  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  return resto.length === 9
    ? `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`
    : `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
}

export function normalizarTelefone(valor) {
  const digitos = String(valor ?? '').replace(/\D/g, '');
  if (digitos.length < 10 || digitos.length > 13) return null;

  const comCodigoPais = digitos.startsWith('55') && digitos.length >= 12;
  const local = comCodigoPais ? digitos.slice(2) : digitos;
  if (local.length < 10 || local.length > 11) return null;

  const ehCelular = local.length === 11 && local[2] === '9';
  const internacional = `55${local}`;

  return {
    internacional,
    rotulo: formatarTelefoneBR(local),
    telefone: `tel:+${internacional}`,
    whatsapp: ehCelular ? `https://wa.me/${internacional}` : null,
  };
}


export function classificarContato(valor) {
  const texto = String(valor ?? '').trim();
  if (!texto) return { tipo: 'vazio' };

  if (EH_URL.test(texto)) {
    return EH_WHATSAPP.test(texto)
      ? { tipo: 'whatsapp', href: texto, rotulo: 'Falar no WhatsApp' }
      : { tipo: 'url', href: texto, rotulo: 'Quero me inscrever' };
  }

  if (EH_EMAIL.test(texto)) {
    return { tipo: 'email', href: `mailto:${texto}`, rotulo: 'Enviar e-mail' };
  }

  const telefone = normalizarTelefone(texto);
  if (telefone) return { tipo: 'telefone', valor: texto, ...telefone };

  return { tipo: 'texto', valor: texto };
}