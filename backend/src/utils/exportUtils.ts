
export function exportToCSV(data: any[], filename: string) {
  const csvRows = [];
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function exportToPDF(data: any[], title: string, columns: string[]) {
  // Simple PDF export using jsPDF (make sure to install jsPDF)
  // npm install jspdf autotable
  // This is a basic implementation; you can enhance as needed.
  // @ts-ignore
  import('jspdf').then(jsPDFModule => {
    // @ts-ignore
    import('jspdf-autotable').then(() => {
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF();
      doc.text(title, 10, 10);
      // @ts-ignore
      doc.autoTable({
        head: [columns],
        body: data.map(row => columns.map(col => row[col])),
        startY: 20,
      });
      doc.save(`${title}.pdf`);
    });
  });
}