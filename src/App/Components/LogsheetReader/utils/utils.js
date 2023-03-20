export const downloadPDF = (pdfBlob, title) => {
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.download = title;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
};
