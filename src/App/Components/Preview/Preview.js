import React from 'react';
// import Table from '../Table/Table.js';
// import Table from 'react-bootstrap/Table';
import { getDate } from '../../utils/utils';
import './preview.css';

const Preview = React.forwardRef((props, ref) => {
  const { tracks } = props;
  if (!tracks) return null;

  return (
    <div ref={ref}>
      <h1 className="pdf-ignore">Preview</h1>
      <h2 contentEditable suppressContentEditableWarning={true}>
        Your title
      </h2>
      <h3 contentEditable suppressContentEditableWarning={true}>
        {getDate()}
      </h3>
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
      <td>{data['Track Title']}</td>
      <td> {data.Artist}</td>
      <td> {data['Album Title']}</td>
    </tr>
  );
};

export default Preview;
