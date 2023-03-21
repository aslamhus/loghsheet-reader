<?php



header("Cache-Control: no-cache, must-revalidate"); //HTTP 1.1
header("Pragma: no-cache"); //HTTP 1.0

use LogsheetReader\API;
use LogsheetReader\Database\DB;
use LogsheetReader\Shows\Shows;


require_once $_SERVER['DOCUMENT_ROOT'] . '/straight-no-chaser/backend/config.php';

if(
    !API::ValidateOrigin(['http://localhost:3003','https://aslamhusain.com']) ||
    !API::ValidateRequestMethod(['GET'])
    ){
    // ultimately we will need another API authorization method, like login credential
    http_response_code(403);
    exit;
}


$params = API::getQueryParams(['id']);

$db = new DB();
$shows = new Shows($db);
$result = [];
if(!isset($params['id'])){
    $result = $shows->getAllShows();
} else {
    $show = $shows->getShowById($params['id']);
    $tracks = $shows->getShowTracks($params['id']);
    $result = [ 'show' => $show, 'tracks' => $tracks];
}
http_response_code(200);
echo json_encode($result);
exit;



// add tracks to show






// ?>