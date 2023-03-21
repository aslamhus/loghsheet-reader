<?php

//  Use "namespace Aslamhusain\LogsheetReader;" 


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once $_SERVER['DOCUMENT_ROOT'] . '/straight-no-chaser/dist/backend/config.php';
// require_once 'dompdf/autoload.inc.php';

use Dompdf\Dompdf;
use LogsheetReader\API;


if(
    !API::ValidateOrigin(['http://localhost:3003','https://aslamhusain.com']) ||
    !API::ValidateRequestMethod(['POST'])
    ){
    // ultimately we will need another API authorization method, like login credential
    http_response_code(403);
    exit;
}
try {


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
} catch(\Exception $e){
    echo json_encode(['error' => $e->getMessage()]);
}
?>