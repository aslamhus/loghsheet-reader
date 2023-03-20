import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShows } from '../../api/shows';
import TrackTable from '../TrackTable/TrackTable';
import './show-track-list.css';

export default function ShowTrackList({}) {
  const [tracks, setTracks] = useState([]);
  const { showId } = useParams();

  useEffect(() => {
    console.log('getting show for show id', showId);
    getShows(showId).then((res) => {
      setTracks(res);
    });
  }, [showId]);

  return (
    <div className="show-track-list-container">
      <h2>Show title - date</h2>
      <strong>Host</strong>
      <TrackTable tracks={tracks} />
    </div>
  );
}
