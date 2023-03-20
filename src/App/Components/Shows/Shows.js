import React, { useEffect, useState } from 'react';
import Show from './Components/Show';
import Table from '../Table';
import { getShows } from '../../api/shows';
import { getDate } from '../LogsheetReader/utils/utils';
import './shows.css';

const tableHeaderCells = [
  // { title: 'id', name: 'id', orderName: 'id', size: 'xxs' },

  { title: 'Air date', name: 'air_date', orderName: 'air_date', size: 'm' },
  { title: 'Host', name: 'host', orderName: 'host', size: 'sm' },
  { title: 'Show Title', name: 'title', orderName: 'title', size: 'xs' },
];

export default function Shows({}) {
  const [shows, setShows] = useState([]);
  useEffect(() => {
    getShows().then((result) => {
      setShows(result);
    });
  }, []);

  return (
    <div className="shows-container">
      <Table dataSource={shows} enableCheckbox={false}>
        <Table.TitleBar title={'Straight No Chaser 101.9 FM'} />

        <Table.Head>
          {tableHeaderCells.map((cell) => (
            <Table.Cell
              key={cell?.title || Date.now()}
              size={cell?.size}
              center={cell?.center || false}
              left={cell?.left || false}
              right={cell?.right || false}
              disabled={cell?.disabled || false}
              title={cell?.title}
              orderName={cell?.orderName}
              name={cell?.name || cell?.orderName}
            />
          ))}
        </Table.Head>
        <Table.Body>
          <ShowRow />
        </Table.Body>
      </Table>
    </div>
  );
}

const ShowRow = ({ rowId, rowData, selected, ...props }) => {
  const handleRowClick = () => {
    // alert('hey! ' + rowId);
    const { id } = rowData;
    window.location = `/straight-no-chaser/shows/${id}`;
  };

  return (
    <Table.Row onClick={handleRowClick} className="something">
      <Table.Row.Cells>
        {tableHeaderCells.map((cell, index) => {
          let value = rowData[cell.name];
          if (cell.name == 'air_date') {
            value = getDate(value);
          }
          return (
            <Table.Cell key={`${cell.name}-${index}`} size={cell?.size}>
              <p> {value}</p>
            </Table.Cell>
          );
        })}
      </Table.Row.Cells>
    </Table.Row>
  );
};
