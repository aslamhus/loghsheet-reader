<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


use LogsheetReader\API;
use LogsheetReader\Database\DB;
use LogsheetReader\Shows\Shows;


require_once $_SERVER['DOCUMENT_ROOT'] . '/logsheet-reader/dist/backend/config.php';

if(
    !API::ValidateOrigin(['http://localhost:3003','https://aslamhusain.com']) ||
    !API::ValidateRequestMethod(['POST'])
    ){
    // ultimately we will need another API authorization method, like login credential
    http_response_code(403);
    exit;
}

$decoded = API::getPHPInput();

if(!empty($decoded->show) && !empty($decoded->tracks)){
    $show = $decoded->show;
    $tracks = $decoded->tracks;
}
$db = new DB();
$shows = new Shows($db);
try {
    $didUpdate = $shows->update($show->host, $show->title, $show->air_date, $tracks);
    if($didUpdate){
        http_response_code(200);
        echo json_encode(['update' => true]);
    }
} catch(\Exception $e) {
    http_response_code(200);
    echo json_encode(['error' => $e->getMessage()]);
}
exit;



// add tracks to show






// ?>