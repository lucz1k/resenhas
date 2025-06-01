export function formatarData(data) {
  // Ex: 2025-05-31 → 31MAI25
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const d = data instanceof Date ? data : new Date(data);
  if (isNaN(d.getTime())) return '';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = meses[d.getMonth()];
  const ano = String(d.getFullYear()).slice(-2);
  return `${dia}${mes}${ano}`;
}
