import React from 'react';
import './track-table.css';

export default function TrackTable({ tracks }) {
  console.log('tracks', tracks);
  return (
    <>
      <table className="cfuv-tracks">
        <thead>
          <tr>
            <th>#</th>
            <th>Track title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((row, index) => {
            return <TR key={`index-${index}-${row['Track Title']}`} data={row} index={index} />;
          })}
        </tbody>
      </table>
    </>
  );
}

const TR = ({ data, index }) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <span contentEditable suppressContentEditableWarning={true}>
          {data.track || ''}
        </span>
      </td>
      <td>
        <span contentEditable suppressContentEditableWarning={true}>
          {data.artist || ''}
        </span>
      </td>
      <td>
        <span contentEditable suppressContentEditableWarning={true}>
          {data.album || ''}
        </span>
      </td>
      <td>
        <span contentEditable suppressContentEditableWarning={true}>
          {data?.label || ''}
        </span>
      </td>
    </tr>
  );
};
