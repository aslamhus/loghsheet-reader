export const generatePDF = async () => {
  // const html = previewRef.current.innerHTML;
  // setShowControls(false);
  togglePDFIgnoreContent(false);
  const html = document.documentElement.innerHTML;
  togglePDFIgnoreContent(true);

  // setShowControls(true);
  const pdfBlob = await fetch('/straight-no-chaser/api/pdf/get.php', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ html }),
  }).then((res) => {
    if (res.ok) {
      return res.blob();
    } else {
      throw new Error('fetch error: ' + res.statusText);
    }
  });
  return pdfBlob;
};

const togglePDFIgnoreContent = (bool) => {
  document.querySelectorAll('.pdf-ignore').forEach((node) => {
    node.style.display = bool ? '' : 'none';
  });
};
