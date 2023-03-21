import React, { useEffect, useRef, useState } from 'react';
import Preview from '@components/Preview';
import { FileSelect } from '@aslamhus/fileselect';
import { extractTrackData } from './utils/extractTrackData';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { generatePDF } from '@api/pdf';
import { saveShow } from '@api/shows';
import { downloadPDF } from './utils/utils';
import { getDate } from '@utils/utils';
import './logsheet-reader.css';
import { useApp } from '../../hooks/useApp';

export default function LogsheetReader({}) {
  const [tracks, setTracks] = useState([]);
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [host, setHost] = useState('');
  const previewRef = useRef();

  const { setTopNavButtons } = useApp();

  const selectFiles = async (event) => {
    // setTracks([]);
    const fs = new FileSelect();
    const files = await fs.select();
    const blob = URL.createObjectURL(files[0]);
    const { tracks, date } = await extractTrackData(blob);
    const dateFormatted = new Date(date);
    // set to 6pm
    dateFormatted.setHours(18);
    setDate(dateFormatted);
    setTracks(tracks.map(convertPDFDataToDBSchema));
  };

  const convertPDFDataToDBSchema = (trackObj) => {
    return {
      artist: trackObj.Artist,
      album: trackObj['Album Title'],
      track: trackObj['Track Title'],
    };
  };

  const handleError = (error) => {
    // show error alert
    console.error(error);
  };

  const handleSaveShow = async (event) => {
    const didSave = await saveShow({ title, host, date, tracks }).catch(handleError);
    console.log('didSave', didSave);
  };

  const toggleShowPdfHtml = (show) => {
    const pdfIgnore = previewRef.current.querySelectorAll('.pdf-ignore');
    const pdfShow = previewRef.current.querySelectorAll('.pdf-show');
    pdfShow.forEach((el) => {
      el.style.display = show ? 'block' : 'none';
    });
    pdfIgnore.forEach((el) => {
      el.style.display = show ? 'none' : '';
    });
  };

  const getHTML = (el) => {
    toggleShowPdfHtml(true);
    const style = document.querySelector('#pdf-styles');
    const html = `<html><head><style>${style.innerHTML}</style></head><body>${el.innerHTML}</body></html>`;
    console.log('html', html);
    toggleShowPdfHtml(false);
    return html;
  };

  const handleSaveAsPDF = async (event) => {
    const html = getHTML(previewRef.current);
    const pdfBlob = await generatePDF(html).catch(handleError);
    // notice of saving show and generating pdf.
    const filenameDate = getDate(date);
    const filename = `${title ? `${title}` : 'Straight-no-chaser'}-${filenameDate}.pdf`.replace(
      /\s/g,
      '-'
    );
    downloadPDF(pdfBlob, filename);
  };

  const onTitleInputChange = (value) => {
    setTitle(value);
  };

  const onDateInputChange = (value) => {
    // console.log('d', value);
    setDate(value);
  };

  useEffect(() => {
    if (!tracks || tracks?.length == 0) return;
    setTopNavButtons([<LogsheetTopNav handleSaveAsPDF={handleSaveAsPDF} />]);
  }, [tracks]);

  return (
    <div className="controls pdf-ignore">
      <h1>Logsheet reader</h1>
      <button onClick={selectFiles}>Upload Logsheet</button>
      {tracks?.length > 0 && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Preview
            ref={previewRef}
            tracks={tracks}
            date={date}
            title={title}
            onTitleInputChange={onTitleInputChange}
            onDateInputChange={onDateInputChange}
            onSelectHost={(host) => setHost(host)}
            host={host}
          ></Preview>
        </LocalizationProvider>
      )}
    </div>
  );
}

const LogsheetTopNav = ({ handleSaveAsPDF }) => {
  return (
    <>
      <li>
        <button>Save show</button>
      </li>
      <li>
        <button onClick={handleSaveAsPDF}>Save as PDF</button>
      </li>
    </>
  );
};
