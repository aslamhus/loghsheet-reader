<?php




use LogsheetReader\API;
use LogsheetReader\Database\DB;
use LogsheetReader\Shows\Shows;


$config_path = $_SERVER['SERVER_NAME'] == 'local.aslamhusain' ? '/straight-no-chaser/dist/backend/config.php' : '/straight-no-chaser/backend/config.php';
require_once $_SERVER['DOCUMENT_ROOT'] . $config_path;

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
} else {
    http_response_code(400);
    exit;
}
$db = new DB();
$shows = new Shows($db);
try {
    $didUpdate = $shows->update($show->showId, $show->host, $show->title, $show->air_date, $tracks);
    if($didUpdate){
        http_response_code(200);
        echo json_encode(['update' => true]);
    } else {
        throw new \Exception('Failed to update show: '.json_encode($didUpdate));
    }
} catch(\Exception $e) {
    http_response_code(200);
    echo json_encode(['error' => $e->getMessage()]);
}
exit;



// add tracks to show






// ?>