<?php

//  Use "namespace Aslamhusain\LogsheetReader;" 


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once './vendor/autoload.php';
// require_once 'dompdf/autoload.inc.php';

$data = file_get_contents('php://input');
$decoded = json_decode($data);
$html = $decoded->html;

use Dompdf\Dompdf;

// instantiate and use the dompdf class
$dompdf = new Dompdf();

$dompdf->loadHtml($html);
// $dompdf->loadHtml('YO MAN world');

// (Optional) Setup the paper size and orientation
$dompdf->setPaper('A4', 'landscape');

// Render the HTML as PDF
$dompdf->render();

// Output the generated PDF to Browser
$dompdf->stream();
?>