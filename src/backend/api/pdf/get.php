<?php

//  Use "namespace Aslamhusain\LogsheetReader;" 


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once $_SERVER['DOCUMENT_ROOT'] . '/straight-no-chaser/backend/config.php';
// require_once 'dompdf/autoload.inc.php';

use Dompdf\Dompdf;

use Aslamhusain\LogsheetReader\API\API;


$decoded = API::getPHPInput();
$html = $decoded->html;


// instantiate and use the dompdf class
$dompdf = new Dompdf();

// $html = file_get_contents('https://aslamhusain.com');
$dompdf->loadHtml($html);
// $dompdf->loadHtml('YO MAN world');

// (Optional) Setup the paper size and orientation
// $dompdf->setPaper('A4', 'landscape');

// Render the HTML as PDF
$dompdf->render();

// Output the generated PDF to Browser
$dompdf->stream();
?>