import React, { useRef, useState } from 'react';
import Preview from '@components/Preview';
import { FileSelect } from '@aslamhus/fileselect';
import { extractTrackData } from './utils/extractTrackData';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { generatePDF } from '@api/pdf';
import { saveShow } from '@api/shows';
import { downloadPDF } from './utils/utils';
import './logsheet-reader.css';

export default function LogsheetReader({}) {
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
    setTracks(tracks.map(convertPDFDataToDBSchema));
  };

  const convertPDFDataToDBSchema = (trackObj) => {
    return {
      artist: trackObj.Artist,
      album: trackObj['Album Title'],
      track: trackObj['Track Title'],
    };
  };

  const handleSaveAsPDF = async (event) => {
    const pdfBlob = await generatePDF();
    // notice of saving show and generating pdf.
    const didSave = await saveShow({ title, host, date, tracks });
    console.log('didSave', didSave);
    const filename = `${title}-${date}.pdf`.replace(/\s/g, '-');
    downloadPDF(pdfBlob, filename);
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
    <div className="controls pdf-ignore">
      <h1>Logsheet reader</h1>
      <button onClick={selectFiles}>Upload Logsheet</button>
      {tracks.length > 0 && <button onClick={handleSaveAsPDF}>Save as PDF</button>}
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
