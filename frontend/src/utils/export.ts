import { Gene } from '../types/gene';

export function exportGenesToCSV(genes: Gene[], filename: string) {
  if (!genes.length) return;

  const headers = Object.keys(genes[0]);
  const rows = genes.map((g) =>
    headers.map((key) => {
      const val = g[key as keyof Gene];
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}