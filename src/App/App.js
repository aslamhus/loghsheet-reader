import React from 'react';
import LogsheetReader from './Components/LogsheetReader';
import Shows from './Components/Shows/Shows';
import Sidebar from './Components/Sidebar';
import TopNavigation from './Components/TopNavigation/TopNavigation';
import ShowTrackList from './Components/ShowTrackList';
import CustomConfirm from './Components/Common/CustomConfirm/CustomConfirm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../bootstrap-theme/styles.css';
import './root.css';
import './app.css';
import './buttons.css';
import AlertModal from './Components/Common/AlertModal/AlertModal';
import { useApp } from './hooks/useApp';
// import * as html2pdf from 'html-to-pdf-js';
// import { jsPDF } from "jspdf";

export default function App() {
  const {
    state: { customAlert },
  } = useApp();

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
          <CustomConfirm />
          <AlertModal
            variant={customAlert?.variant}
            onDismiss={customAlert?.onDismiss}
            content={customAlert?.content}
          />
        </div>
      </Router>
    </React.StrictMode>
  );
}
