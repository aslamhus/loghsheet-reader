import React, { useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import TrackTable from '../TrackTable/TrackTable';
import HostDropdown from './HostDropdown';
import { getDate } from '@utils/utils';
import { generatePDF } from '@api/pdf';
import { saveShow } from '@api/shows';
import { downloadPDF } from './utils';
import { useApp } from '../../hooks/useApp';
import 'react-datepicker/dist/react-datepicker.css';
import './show.css';

export default function Show({
  tracks,
  date,
  title,
  onTitleInputChange,
  onDateInputChange,
  onSelectHost,
  host,
}) {
  const showRef = useRef();
  const { setTopNavButtons } = useApp();
  const handleError = (error) => {
    // show error alert
    console.error(error);
  };

  const handleSaveShow = async (event) => {
    const didSave = await saveShow({ title, host, date, tracks }).catch(handleError);
    console.log('didSave', didSave);
  };

  const toggleShowPdfHtml = (show) => {
    const pdfIgnore = showRef.current.querySelectorAll('.pdf-ignore');
    const pdfShow = showRef.current.querySelectorAll('.pdf-show');
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
    const html = getHTML(showRef.current);
    const pdfBlob = await generatePDF(html).catch(handleError);
    // show loader
    // notice of saving pdf
    // ask if they want to save to archive.
    const filenameDate = getDate(date);
    const filename = `${title ? `${title}` : 'Straight-no-chaser'}-${filenameDate}.pdf`.replace(
      /\s/g,
      '-'
    );
    downloadPDF(pdfBlob, filename);
  };

  const handleSubmit = (event) => {
    const { target: form } = event;
    console.log('form', form);
  };

  const handleChange = (event) => {
    const {
      target: { name, value },
    } = event;
    switch (name) {
      case 'title':
        onTitleInputChange(value);
        break;
      case 'date':
        onDateInputChange(value);
        break;
    }
  };

  useEffect(() => {
    if (!tracks || tracks?.length == 0) return;
    setTopNavButtons([<LogsheetTopNav handleSaveAsPDF={handleSaveAsPDF} />]);
    return () => {
      setTopNavButtons(null);
    };
  }, [tracks]);

  return (
    <form ref={showRef} onSubmit={handleSubmit} className="show-container">
      <div className="pdf-ignore">
        <label htmlFor="title">Show title/description:</label>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          className="pdf-title"
          value={title}
          placeholder="Optional title that describes the show, like 'Black History Month'"
        />
        <label htmlFor="air-date-picker">Air date:</label>

        <DatePicker
          name="air-date-picker"
          dateFormat="MMM d, yyyy"
          // selected={date ? new Date(date) : new Date()}
          selected={date || new Date()}
          onChange={onDateInputChange}
        />

        <label htmlFor="host-dropdown">Host:</label>
        <HostDropdown name="host-dropdown" host={host} onSelectHost={onSelectHost} />
      </div>
      <div className="pdf-show">
        <h1>Straight No Chaser CFUV 101.9 FM</h1>
        {title && <h2>{title}</h2>}

        {host && (
          <p>
            <strong>Hosted by {host}</strong>
          </p>
        )}
        {date && (
          <p>
            <em>{getDate(date)}</em>
          </p>
        )}
      </div>
      <TrackTable tracks={tracks} />
    </form>
  );
}

const LogsheetTopNav = ({ handleSaveAsPDF }) => {
  return (
    <>
      <li>
        <button>Save</button>
      </li>
      <li>
        <button onClick={handleSaveAsPDF}>Download PDF</button>
      </li>
    </>
  );
};
