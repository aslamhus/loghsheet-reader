import React from 'react';
import LogsheetReader from './Components/LogsheetReader';
import Shows from './Components/Shows/Shows';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
// import * as html2pdf from 'html-to-pdf-js';
// import { jsPDF } from "jspdf";

export default function App() {
  return (
    <div className="app">
      <LogsheetReader />
      <Shows />
    </div>
  );
}
