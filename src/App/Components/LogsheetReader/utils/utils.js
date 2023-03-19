export const getDate = (dateString) => {
  const d = new Date(dateString.replace(/-/g, '/'));
  // return d.toDateString();

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const downloadPDF = (pdfBlob, title) => {
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.download = title;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
};