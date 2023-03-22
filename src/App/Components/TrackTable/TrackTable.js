import React, { useEffect } from 'react';
import './track-table.css';

const TrackTable = React.forwardRef((props, ref) => {
  const { tracks, onRegisterChange } = props;

  const registerChange = (event) => {
    console.log('register change');
    if (onRegisterChange instanceof Function) {
      onRegisterChange();
    }
  };

  useEffect(() => {
    ref.current.addEventListener('keydown', registerChange);
    return () => {
      // ref.current.removeEventListener('keydown', registerChange);
    };
  }, []);
  return (
    <>
      <table ref={ref} className="cfuv-tracks">
        <thead>
          <tr>
            <th>#</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Track title</th>
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
});

const TR = ({ data, index }) => {
  return (
    <tr className="track-table-row" data-track-index={index}>
      <td>{index + 1}</td>
      <td>
        <span
          name="track"
          data-row-index={index}
          contentEditable
          suppressContentEditableWarning={true}
        >
          {data.track || ''}
        </span>
        {/* <input type="text" name="track" data-row-index={index} value={data.track}></input> */}
      </td>
      <td>
        <span
          name="artist"
          data-row-index={index}
          contentEditable
          suppressContentEditableWarning={true}
        >
          {data.artist || ''}
        </span>
        {/* <input type="text" name="artist" data-row-index={index} value={data.artist}></input> */}
      </td>
      <td>
        <span
          name="album"
          data-row-index={index}
          contentEditable
          suppressContentEditableWarning={true}
        >
          {data.album || ''}
        </span>
        {/* <input type="text" name="album" data-row-index={index} value={data.album}></input> */}
      </td>
      <td>
        <span
          name="label"
          data-row-index={index}
          contentEditable
          suppressContentEditableWarning={true}
        >
          {data?.label || ''}
        </span>
        {/* <input type="text" name="label" data-row-index={index} value={data.label}></input> */}
      </td>
    </tr>
  );
};

export default TrackTable;
