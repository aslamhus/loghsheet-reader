import React, { useRef, useState } from 'react';
import Preview from './Components/Preview';
import { FileSelect } from '@aslamhus/fileselect';
import { extractTracks } from './utils/extractTracks';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
// import * as html2pdf from 'html-to-pdf-js';
// import { jsPDF } from "jspdf";

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [showControls, setShowControls] = useState(true);
  const previewRef = useRef();
  const selectFiles = async (event) => {
    // setTracks([]);
    const fs = new FileSelect();
    const files = await fs.select();
    const blob = URL.createObjectURL(files[0]);
    setTracks(await extractTracks(blob));
  };

  const togglePDFIgnoreContent = (bool) => {
    document.querySelectorAll('.pdf-ignore').forEach((node) => {
      node.style.display = bool ? '' : 'none';
    });
  };

  const generatePDF = async () => {
    // const html = previewRef.current.innerHTML;
    // setShowControls(false);
    togglePDFIgnoreContent(false);
    const html = document.documentElement.innerHTML;
    togglePDFIgnoreContent(true);

    // setShowControls(true);
    const pdfBlob = await fetch('/logsheet-reader/backend/index.php', {
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
    console.log('result', pdfBlob);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.download = 'mypdf.pdf';
    a.href = url;
    a.click();

    // const worker = html2pdf().from(previewRef.current).save();

    // const doc = new jsPDF();
    // doc.text("My show title", 10,10)
    // doc.save
  };

  return (
    <div className="app">
      <div className="controls pdf-ignore">
        <h1>Logsheet reader</h1>
        <button onClick={selectFiles}>Select Files</button>
        {tracks.length > 0 && <button onClick={generatePDF}>Save as PDF</button>}
      </div>
      {tracks?.length > 0 && <Preview ref={previewRef} tracks={tracks}></Preview>}
    </div>
  );
}
