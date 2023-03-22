import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import TrackTable from '../TrackTable/TrackTable';
import HostDropdown from './HostDropdown';
import { getDate, getYMDDate } from '@utils/utils';
import { generatePDF } from '@api/pdf';
import { downloadPDF, getTracksEditableContent, getHTML } from './utils';
import { useApp } from '../../hooks/useApp';
import useConfirm from '../Common/CustomConfirm/useConfirm';
import 'react-datepicker/dist/react-datepicker.css';
import './show.css';

/**
 *
 * @param {Object} props
 * @property {string} props.date - date string, compatible with Javascript date object
 * @returns
 */
export default function Show({
  tracks,
  date,
  title,
  host,
  onTitleInputChange,
  onDateInputChange,
  onSelectHost,
  onSave,
  initialHasMadeChanges,
}) {
  const [mounted, setMounted] = useState(false);
  const [hasMadeChanges, setHasMadeChanges] = useState(initialHasMadeChanges);

  const showRef = useRef();
  const trackTableRef = useRef();
  const { confirm } = useConfirm();
  const { setTopNavButtons, setAlert } = useApp();

  const handleError = (error) => {
    // show error alert
    console.error(error);
    setAlert({ variant: 'danger', content: error.message, onDismiss: () => setAlert(null) });
  };

  const handleSaveShow = async () => {
    const formData = new FormData(showRef.current);
    const body = {
      title: formData.get('title'),
      host: formData.get('host-dropdown'),
      utc_timestamp: new Date(formData.get('air-date-picker')).getTime(),
      date: formData.get('air-date-picker'),
      tracks: getTracksEditableContent(trackTableRef),
    };

    if (onSave instanceof Function) {
      Promise.resolve(onSave(body))
        .catch(handleError)
        .then((result) => {
          setHasMadeChanges(false);
        });
    }
  };

  const handleSaveAsPDF = async (event) => {
    const html = getHTML(showRef.current);
    const pdfBlob = await generatePDF(html).catch(handleError);
    const filenameDate = getYMDDate(date).replace(/,/g, '');
    const filename = `${title ? `${title}` : 'Straight-no-chaser'}-${filenameDate}.pdf`.replace(
      /\s/g,
      '-'
    );
    downloadPDF(pdfBlob, filename);
    if (hasMadeChanges) {
      const confirmSave = await confirm('Would you like to save your show?');
      if (confirmSave) {
        handleSaveShow();
      }
    }
  };

  const handleSubmit = (event) => {
    const { target: form } = event;
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
    console.log('hasMadeChanges', hasMadeChanges);
    if (!tracks || tracks?.length == 0) return;
    setTopNavButtons([
      <LogsheetTopNav
        handleSaveAsPDF={handleSaveAsPDF}
        handleSaveShow={handleSaveShow}
        hasMadeChanges={hasMadeChanges}
      />,
    ]);
    return () => {
      setTopNavButtons(null);
    };
  }, [tracks, hasMadeChanges]);

  useEffect(() => {
    console.log('3) date prop for Show', date);
    if (!hasMadeChanges && mounted) {
      setHasMadeChanges(true);
    }
  }, [title, host, date]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <form ref={showRef} onSubmit={handleSubmit} className="show-container">
        <div className="pdf-ignore">
          <label htmlFor="title">Show title/description:</label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            className="pdf-title"
            value={title || ''}
            placeholder="Optional title"
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
        <div
          //  className="pdf-show"
          className="pdf-show"
        >
          <div className="title">
            <h1>Straight No Chaser</h1>

            {title && <h2>{title}</h2>}
            {host && <h3>Host: {host}</h3>}
            {date && <h4>Air date: {getDate(date)}</h4>}
          </div>
          <div className="info">
            <h3>CFUV 101.9 FM</h3>
            <p>Wednesdays 6pm - 8pm PST</p>
            <a
              className="listen-link"
              target="_blank"
              href="http://cfuv.uvic.ca/cms/?shows=straight-no-chaser"
            >
              Listen to a live stream of last week's show
            </a>
          </div>
        </div>
        <TrackTable
          onRegisterChange={() => setHasMadeChanges(true)}
          ref={trackTableRef}
          tracks={tracks}
        />
      </form>
    </>
  );
}

const LogsheetTopNav = ({ handleSaveAsPDF, handleSaveShow, hasMadeChanges }) => {
  return (
    <>
      <li>
        <button onClick={handleSaveShow} disabled={!hasMadeChanges}>
          Save
        </button>
      </li>
      <li>
        <button onClick={handleSaveAsPDF}>Download PDF</button>
      </li>
    </>
  );
};
