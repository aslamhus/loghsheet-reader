import React, { useRef } from 'react';
// import Table from '../Table/Table.js';
// import Table from 'react-bootstrap/Table';
// import Form from 'react-bootstrap/Form';
import Datetime from 'react-datetime';

import { getDate } from '../../utils/utils';
import 'react-datetime/css/react-datetime.css';
import './preview.css';

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
      {/* <h1 className="pdf-ignore">Preview</h1> */}
      <input type="text" name="title" onChange={handleChange} className="pdf-title" value={title} />
      <Datetime initialValue={getDate(date)} dateFormat={'MMM Do, YYYY'} />
      {/* <input
        type="text"
        name="date"
        onChange={handleChange}
        className="pdf-date"
        value={getDate(date)}
      /> */}
      {/* <Form.Control
        type="date"
        name="date_of_birth"
        // error={errors.date_of_birth}
        ref={registerRef}
      /> */}{' '}
      <table>
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
