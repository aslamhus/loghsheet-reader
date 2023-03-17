import React, { useRef } from 'react';
// import Table from '../Table/Table.js';
// import Table from 'react-bootstrap/Table';
// import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import { getDate } from '../../utils/utils';
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
  console.log('date', date);
  return (
    <div className="preview-container" ref={ref}>
      {/* <h1 className="pdf-ignore">Preview</h1> */}
      <input type="text" name="title" onChange={handleChange} className="pdf-title" value={title} />
      <DatePicker dateFormat="MMM d, yyyy" selected={new Date(date)} onChange={onDateInputChange} />
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Host
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Shaukat Husain</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Demis Tsimon</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <table className="cfuv-tracks">
        <thead>
          <tr>
            <th>#</th>
            <th>Track title</th>
            <th>Artist</th>
            <th>Album</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((row, index) => {
            return <Row key={`index-${index}-${row['Track Title']}`} data={row} index={index} />;
          })}
        </tbody>
      </table>
    </div>
  );
});

const Row = ({ data, index }) => {
  //   console.log('data', data);
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <span contentEditable suppressContentEditableWarning={true}>
          {data['Track Title']}
        </span>
      </td>
      <td>
        <span contentEditable suppressContentEditableWarning={true}>
          {data.Artist}
        </span>
      </td>
      <td>
        <span contentEditable suppressContentEditableWarning={true}>
          {data['Album Title']}
        </span>
      </td>
    </tr>
  );
};

export default Preview;
