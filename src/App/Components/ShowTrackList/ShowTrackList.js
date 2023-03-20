import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDate } from '@utils/utils';
import { getShows } from '../../api/shows';
import TrackTable from '../TrackTable/TrackTable';
import './show-track-list.css';

export default function ShowTrackList({}) {
  const [showData, setShowData] = useState({});
  const [tracks, setTracks] = useState([]);
  const { showId } = useParams();

  useEffect(() => {
    getShows(showId).then((res) => {
      const { tracks, show } = res;
      console.log('showData', show);
      setShowData(show);
      setTracks(tracks);
    });
  }, [showId]);

  return (
    <div className="show-track-list-container">
      {showData?.title && <h2>{showData.title}</h2>}
      <h3>{getDate(showData?.air_date)}</h3>
      <strong>{showData?.host ? showData.host : '-'}</strong>
      <TrackTable tracks={tracks} />
    </div>
  );
}
