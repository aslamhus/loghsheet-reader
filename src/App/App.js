import React, { useRef, useState } from 'react';
import Preview from './Components/Preview';
import { FileSelect } from '@aslamhus/fileselect';
import { extractTrackData } from './utils/extractTrackData';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
// import * as html2pdf from 'html-to-pdf-js';
// import { jsPDF } from "jspdf";

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('Straight No Chaser');
  const [host, setHost] = useState('');
  const [showControls, setShowControls] = useState(true);
  const previewRef = useRef();

  const selectFiles = async (event) => {
    // setTracks([]);
    const fs = new FileSelect();
    const files = await fs.select();
    const blob = URL.createObjectURL(files[0]);
    const { tracks, date } = await extractTrackData(blob);
    setDate(date);
    setTracks(tracks);
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
    a.download = `${title}-${date}.pdf`.replace(/\s/g, '-');
    a.href = url;
    a.click();

    // const worker = html2pdf().from(previewRef.current).save();

    // const doc = new jsPDF();
    // doc.text("My show title", 10,10)
    // doc.save
  };

  const onTitleInputChange = (value) => {
    console.log('value!', value);
    setTitle(value);
  };

  const onDateInputChange = (value) => {
    console.log('d', value);
    setDate(value);
  };
  return (
    <div className="app">
      <div className="controls pdf-ignore">
        <h1>Logsheet reader</h1>
        <button onClick={selectFiles}>Upload Logsheet</button>
        {tracks.length > 0 && <button onClick={generatePDF}>Save as PDF</button>}
      </div>
      {tracks?.length > 0 && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Preview
            ref={previewRef}
            tracks={tracks}
            date={date}
            title={title}
            onTitleInputChange={onTitleInputChange}
            onDateInputChange={onDateInputChange}
          ></Preview>
        </LocalizationProvider>
      )}
    </div>
  );
}
