export const downloadPDF = (pdfBlob, title) => {
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.download = title;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
};

export const getHTML = (el) => {
  toggleShowPdfHtml(true, el);
  const style = document.querySelector('#pdf-styles');
  const html = `<html><head><style>${style.innerHTML}</style></head><body>${el.innerHTML}</body></html>`;
  toggleShowPdfHtml(false, el);
  return html;
};

const toggleShowPdfHtml = (shouldShow, el) => {
  const pdfIgnore = el.querySelectorAll('.pdf-ignore');
  // const pdfShow = el.querySelectorAll('.pdf-show');
  // pdfShow.forEach((el) => {
  //   el.style.display = shouldShow ? 'block' : 'none';
  // });
  pdfIgnore.forEach((el) => {
    el.style.display = shouldShow ? 'none' : '';
  });
};

export const getTracksEditableContent = (trackTableRef) => {
  let trackTableContent = [];
  const rows = trackTableRef.current.querySelectorAll('tr');
  rows.forEach((tr, index) => {
    let trackObj = {};
    const spans = tr.querySelectorAll('span');
    if (spans.length == 0) return;
    spans.forEach((span) => {
      const name = span.getAttribute('name');
      const value = span.textContent;
      trackObj[name] = value;
    });
    trackTableContent.push(trackObj);
  });
  return trackTableContent;
};
