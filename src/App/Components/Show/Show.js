import React from 'react';
import DatePicker from 'react-datepicker';
import TrackTable from '../TrackTable/TrackTable';
import HostDropdown from './HostDropdown';
import { getDate } from '@utils/utils';
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
  console.log('date', date, isNaN(date));
  // if (!(date instanceof Date) || isNaN(date)) {
  //   throw new Error('show date must be valid instance of Date object. Found: ' + date);
  // }

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

  return (
    <form className="show-container">
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
