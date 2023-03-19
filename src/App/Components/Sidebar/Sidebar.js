import React from 'react';
import { Link } from 'react-router-dom';
import StraightNoChaserLogo from '@images/straight-no-chaser-square.png';
import './sidebar.css';

export default function Sidebar({ show }) {
  return (
    <div className="border-end bg-white" id="sidebar-wrapper">
      <div className="sidebar-heading border-bottom bg-light">
        <img src={StraightNoChaserLogo}></img>
      </div>
      <div className="list-group list-group-flush">
        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to={'/logsheet-reader'}
        >
          Logsheet Reader
        </Link>

        <Link
          className="list-group-item list-group-item-action list-group-item-light p-3"
          to={'/shows'}
        >
          Past shows
        </Link>
      </div>
    </div>
  );
}
