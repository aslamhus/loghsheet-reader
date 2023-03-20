import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';
import TrackTable from '../TrackTable/TrackTable';
import './preview.css';

import 'react-datepicker/dist/react-datepicker.css';
import Dropdown from 'react-bootstrap/Dropdown';

const Preview = React.forwardRef((props, ref) => {
  const { tracks, date, title, onTitleInputChange, onDateInputChange } = props;
  const registerRef = useRef();

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
  if (!tracks) return null;
  return (
    <div className="preview-container" ref={ref}>
      <form>
        {/* <h1 className="pdf-ignore">Preview</h1> */}
        <input
          type="text"
          name="title"
          onChange={handleChange}
          className="pdf-title"
          value={title}
        />
        <DatePicker
          dateFormat="MMM d, yyyy"
          selected={new Date(date)}
          onChange={onDateInputChange}
        />
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Host
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Shaukat Husain</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Demis Tsimon</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <TrackTable tracks={tracks} />
      </form>
    </div>
  );
});

export default Preview;
