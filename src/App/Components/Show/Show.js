import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import TrackTable from '../TrackTable/TrackTable';
import HostDropdown from './HostDropdown';
import { getDate } from '@utils/utils';
import { generatePDF } from '@api/pdf';
import { saveShow } from '@api/shows';
import { downloadPDF, getTracksEditableContent, getHTML } from './utils';
import { useApp } from '../../hooks/useApp';
import useConfirm from '../Common/CustomConfirm/useConfirm';
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
  const [hasMadeChanges, setHasMadeChanges] = useState(true);
  const showRef = useRef();
  const trackTableRef = useRef();
  const { confirm } = useConfirm();
  const { setTopNavButtons, setAlert } = useApp();

  const handleError = (error) => {
    // show error alert
    console.error(error);
  };

  const handleSaveShow = async () => {
    const formData = new FormData(showRef.current);
    const didSave = await saveShow({
      title: formData.get('title'),
      host: formData.get('host-dropdown'),
      date: formData.get('air-date-picker'),
      tracks: getTracksEditableContent(trackTableRef),
    }).catch(handleError);
    console.log('didSave', didSave);
    if (didSave.update == true) {
      setHasMadeChanges(false);
      setAlert({
        variant: 'info',
        content: 'Your show has been saved.',
        onDismiss: () => {
          setAlert(null);
        },
      });
    } else {
      setAlert({
        variant: 'danger',
        content: 'There was an error saving your show',
        onDismiss: () => setAlert(null),
      });
    }
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
    if (!hasMadeChanges) {
      setHasMadeChanges(true);
    }
  }, [title, host, date]);

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
            placeholder="'Black History Month'"
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
