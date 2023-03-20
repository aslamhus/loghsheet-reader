import React from 'react';
import LogsheetReader from './Components/LogsheetReader';
import Shows from './Components/Shows/Shows';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../bootstrap-theme/styles.css';
import './root.css';
import './app.css';
import './buttons.css';
import Sidebar from './Components/Sidebar';
import TopNavigation from './Components/TopNavigation/TopNavigation';
import ShowTrackList from './Components/ShowTrackList';
// import * as html2pdf from 'html-to-pdf-js';
// import { jsPDF } from "jspdf";

export default function App() {
  return (
    <React.StrictMode>
      <Router basename="/straight-no-chaser">
        <div className="app">
          <div className="d-flex" id="wrapper">
            <Sidebar />
            <div id="page-content-wrapper">
              <TopNavigation />
              {/* <!-- Page content--> */}
              <div className="container-fluid p-4">
                <Routes>
                  <Route path="/" element={<LogsheetReader />}></Route>
                  <Route path="/logsheet-reader" element={<LogsheetReader />}></Route>
                  <Route path="/shows" element={<Shows />}></Route>
                  <Route path="/shows/:showId" element={<ShowTrackList />}></Route>
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </React.StrictMode>
  );
}
