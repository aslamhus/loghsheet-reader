import React, { useEffect, useRef, useState } from 'react';
import Preview from '@components/Preview';
import { FileSelect } from '@aslamhus/fileselect';
import { extractTrackData } from './utils/extractTrackData';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './logsheet-reader.css';

export default function LogsheetReader({}) {
  const [tracks, setTracks] = useState([]);
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [host, setHost] = useState('');

  const selectFiles = async (event) => {
    console.l;
    // setTracks([]);
    const fs = new FileSelect();
    fs.removeFiles();
    const files = await fs.select();
    const blob = URL.createObjectURL(files[0]);
    const { tracks, date } = await extractTrackData(blob);
    const dateFormatted = new Date();
    const [, year, month, day] = date.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/);
    dateFormatted.setFullYear(parseInt(year));
    /** DateObject set month is zero based  */
    dateFormatted.setMonth(parseInt(month) - 1);
    dateFormatted.setDate(parseInt(day));
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

  const onTitleInputChange = (value) => {
    setTitle(value);
  };

  const onDateInputChange = (value) => {
    // console.log('d', value);
    setDate(value);
  };

  return (
    <div className="controls pdf-ignore">
      <h1>Logsheet reader</h1>
      <button onClick={selectFiles}>Upload Logsheet</button>
      {tracks?.length > 0 && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Preview
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
