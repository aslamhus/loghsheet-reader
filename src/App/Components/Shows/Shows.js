import React, { useEffect, useState } from 'react';
import Table from '../Table';
import { deleteShows, getShows } from '../../api/shows';
import { useNavigate } from 'react-router-dom';
import { getDate } from '@utils/utils';
import { useApp } from '../../hooks/useApp';
import './shows.css';

const tableHeaderCells = [
  // { title: 'id', name: 'id', orderName: 'id', size: 'xxs' },

  { title: 'Air date', name: 'air_date', orderName: 'air_date', size: 'm' },
  { title: 'Host', name: 'host', orderName: 'host', size: 'sm' },
  { title: 'Show Title', name: 'title', orderName: 'title', size: 'xs' },
];

export default function Shows({}) {
  const [shows, setShows] = useState([]);
  const { setAlert } = useApp();

  const handleDeleteRow = async (rows) => {
    // delete tracks by id
    const ids = rows.map((row) => row.id);
    const deleteRequest = await deleteShows(ids).catch((error) => {
      console.error('error deleting show', error);
      setAlert({
        variant: 'danger',
        content: `There was an error deleting the show: ${error.message}`,
        onDismiss: setAlert(null),
      });
    });
    if (deleteRequest.delete == true) {
      setAlert({
        variant: 'success',
        content: `Shows deleted`,
        onDismiss: setAlert(null),
      });
      removeShows(ids);
    }
  };

  /**
   * Remove shows from UI
   *
   * @param {Array<Number>} ids
   */
  const removeShows = (ids) => {
    const newShows = shows.filter((show) => {
      if (!ids.includes(show.id)) {
        return show;
      }
    });
    console.log('newShows', newShows);
    setShows(newShows);
  };

  useEffect(() => {
    getShows().then((result) => {
      setShows(result);
    });
  }, []);

  return (
    <div className="shows-container">
      <Table
        className="shows-table"
        dataSource={shows}
        enableCheckbox={true}
        onDelete={handleDeleteRow}
      >
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

const ShowRow = ({ rowData, ...props }) => {
  const navigate = useNavigate();
  const handleRowClick = () => {
    const { id } = rowData;
    navigate(`/shows/${id}`, { rowData });
  };

  return (
    <Table.Row onClick={handleRowClick} rowData={rowData} {...props}>
      <Table.Row.Cells>
        {tableHeaderCells.map((cell, index) => {
          let value = rowData[cell.name];

          if (cell.name == 'air_date') {
            value = getDate(new Date(rowData.timestamp * 1000));
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
