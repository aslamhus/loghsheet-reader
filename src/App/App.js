import React from 'react';
import LogsheetReader from './Components/LogsheetReader';
import Shows from './Components/Shows/Shows';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
// import * as html2pdf from 'html-to-pdf-js';
// import { jsPDF } from "jspdf";

export default function App() {
  return (
    <React.StrictMode>
      <div className="app">
        <Router basename="/logsheet-reader">
          <Routes>
            <Route path="/" element={<LogsheetReader />}></Route>
            <Route path="/reader" element={<LogsheetReader />}></Route>
            <Route path="/shows" element={<Shows />}></Route>
          </Routes>
        </Router>
      </div>
    </React.StrictMode>
  );
}
