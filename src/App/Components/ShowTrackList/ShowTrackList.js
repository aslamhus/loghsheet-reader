import React, { useState, useEffect } from 'react';
import Show from '../Show';
import { useParams } from 'react-router-dom';
import { getShows } from '../../api/shows';
import './show-track-list.css';
import Spinner from 'react-bootstrap/Spinner';

export default function ShowTrackList({}) {
  const [showData, setShowData] = useState({});
  const [tracks, setTracks] = useState([]);
  const { showId } = useParams();

  const onDateInputChange = (date) => {
    setShowData({ ...showData, timestamp: new Date(date) });
  };

  const onTitleInputChange = (title) => {
    setShowData({ ...showData, title });
  };

  useEffect(() => {
    getShows(showId).then((res) => {
      const { tracks, show } = res;
      setShowData({
        ...show,
        timestamp: new Date(show.timestamp * 1000),
      });
      /**
       * Note about date conversion.
       * Easiest way to translate mysql date format
       * a valid javascript Date object
       * is to get unix_timestamp from mysql, then
       * multiply by 1000. Mysql Unix timestamp
       * gives epoch time in seconds, javascript's epoch time
       * is in milliseconds, hence the multiplication.
       *
       */
      setTracks(tracks);
    });
  }, [showId]);

  return (
    <div className="show-track-list-container">
      {!showData ? (
        <Spinner variant="primary" animation="border" />
      ) : (
        <Show
          tracks={tracks}
          date={showData.timestamp}
          title={showData?.title}
          host={showData?.host}
          onTitleInputChange={onTitleInputChange}
          onDateInputChange={onDateInputChange}
          onSelectHost={null}
        />
      )}
      {/* {showData?.title && <h2>{showData.title}</h2>}
      <h3>{getDate(showData?.air_date)}</h3>
      <strong>{showData?.host ? showData.host : '-'}</strong>
      <TrackTable tracks={tracks} /> */}
    </div>
  );
}
