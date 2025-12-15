const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export const generateSubmissionsCSV = (submissions, filename = 'submissions.csv') => {
  if (!submissions || !submissions.length) return;

  const dataKeys = new Set();
  submissions.forEach(sub => {
    if (sub.data && typeof sub.data === 'object') {
      Object.keys(sub.data).forEach(k => dataKeys.add(k));
    }
  });
  const sortedDataKeys = Array.from(dataKeys).sort();

  // Beautify Headers
  const headers = ['Submission ID', 'Client Name', 'Date', ...sortedDataKeys.map(k => toTitleCase(k))];

  const rows = submissions.map(sub => {
    const rawName = sub.clientDetails?.userName || sub.clientID || 'Unknown';
    const clientName = toTitleCase(rawName);
    const dateStr = sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'N/A';
    
    const row = [
      sub._id,
      clientName,
      dateStr
    ];

    sortedDataKeys.forEach(key => {
      let val = sub.data?.[key] || '';
      if (typeof val === 'object') val = JSON.stringify(val);
      row.push(String(val));
    });

    return row;
  });

  const csvContent = [headers, ...rows].map(e => 
    e.map(cell => {
      const stringCell = String(cell);
      // Escape quotes and wrap in quotes if necessary
      if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
        return `"${stringCell.replace(/"/g, '""')}"`;
      }
      return stringCell;
    }).join(',')
  ).join('\n');

  // Add BOM for Excel UTF-8 compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
