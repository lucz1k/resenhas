export function formatarPelotao(valor) {
  return valor.replace(/\d+/, (num) => `${num}º`).replace(/pel/i, 'Pelotão');
}

export function formatarCia(valor) {
  return valor.replace(/\d+/, (num) => `${num}ª`).replace(/cia/i, 'Cia');
}

export function formatarPosto(nome) {
  return nome
    .replace(/SD PM/i, 'Sd PM')
    .replace(/CB PM/i, 'Cb PM')
    .replace(/3º SGT PM/i, '3º Sgt PM')
    .replace(/2º SGT PM/i, '2º Sgt PM')
    .replace(/1º SGT PM/i, '1º Sgt PM')
    .replace(/SUBTEN PM/i, 'Subten PM')
    .replace(/Al Of PM/i, 'Al Of PM')
    .replace(/ASP OF PM/i, 'Asp Of PM')   
    .replace(/2º TEN PM/i, '2º Ten PM')
    .replace(/1º TEN PM/i, '1º Ten PM')
    .replace(/CAP PM/i, 'Cap PM')     
    .replace(/MAJ PM/i, 'Maj PM')
    .replace(/TEN CEL PM/i, 'Ten Cel PM')
    .replace(/CEL PM/i, 'Cel PM');
}

export function removerCaracteresEspeciais(texto) {
  return texto.replace(/[^\w\s]/gi, '').trim();
}

export function formatarTextoEquipe(viatura, nomes) {
  const cabecalho = viatura ? `Viatura: ${viatura}` : '';
  const lista = nomes && nomes.length > 0 ? nomes.map(p => `- ${formatarPosto(p)}`).join('\n') : '';
  return [cabecalho, lista].filter(Boolean).join('\n');
}

export function formatarTextoApoio({ viatura, autoridade, policiais }) {
  const cabecalho = viatura ? `Viatura: ${viatura}` : '';
  const chefe = autoridade ? `Autoridade: ${formatarPosto(autoridade)}` : '';
  const lista = policiais && policiais.length > 0
    ? policiais.map(p => `- ${formatarPosto(p)}`).join('\n')
    : '';

  return [cabecalho, chefe, lista].filter(Boolean).join('\n');
}

export function formatarTextoArmamentos(armamento) {
  const partes = [];

  if (armamento.tipo) partes.push(`Tipo: ${armamento.tipo}`);
  if (armamento.calibre) partes.push(`Calibre: ${armamento.calibre}`);
  if (armamento.numeracao) partes.push(`Numeração: ${armamento.numeracao}`);
  if (armamento.disparos) partes.push(`Disparos: ${armamento.disparos}`);
  if (armamento.capsulas) partes.push(`Cápsulas: ${armamento.capsulas}`);
  if (armamento.municoes) partes.push(`Munições: ${armamento.municoes}`);

  return partes.join('\n');
}