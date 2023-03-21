<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


use LogsheetReader\API;
use LogsheetReader\Database\DB;
use LogsheetReader\Shows\Shows;


require_once $_SERVER['DOCUMENT_ROOT'] . '/straight-no-chaser/dist/backend/config.php';

if(
    !API::ValidateOrigin(['http://localhost:3003','https://aslamhusain.com']) ||
    !API::ValidateRequestMethod(['DELETE'])
    ){
    // ultimately we will need another API authorization method, like login credential
    http_response_code(403);
    exit;
}


$data = API::getPHPInput();
$ids = $data->ids;
$db = new DB();
$shows = new Shows($db);
$result = [];
if(!empty($ids)){
   if($shows->deleteShows($ids)){
    $result = ['delete' => true];
   }
    http_response_code(200);
} else {
    http_response_code(400);
}
echo json_encode($result);
exit;



// add tracks to show






// ?>