<?php




use LogsheetReader\API;
use LogsheetReader\Database\DB;
use LogsheetReader\Shows\Shows;


$config_path = $_SERVER['SERVER_NAME'] == 'local.aslamhusain' ? '/straight-no-chaser/dist/backend/config.php' : '/straight-no-chaser/backend/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . $config_path;

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