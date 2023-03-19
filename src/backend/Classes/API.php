<?php

namespace LogsheetReader;

class API {

    public function __construct(){
        
    }

    public static function getPHPInput(){
        $data = file_get_contents('php://input');
       return json_decode($data);
    }

    public static function getQueryParams(array $params){
        $getParams = [];
        foreach($params as $param){
            if(isset($_GET[$param])){
                $getParams["$param"] = $_GET[$param];
            }
        }
       return $getParams;
    }

    

    public static function ValidateOrigin(array $allow_origins){
        // validate referer
        $refererAllowed = false;
        if(isset($_SERVER['HTTP_REFERER'])){
            foreach($allow_origins as $origin){
                $isRefererAllowed = strpos($_SERVER['HTTP_REFERER'], $origin);
                if($isRefererAllowed > -1){
                    $refererAllowed = true;
                   break;
                }
            }
        }
        if($refererAllowed) return true;
       // validate origin
        if(isset($_SERVER['HTTP_ORIGIN'])){
            if(in_array($_SERVER['HTTP_ORIGIN'], $allow_origins)){
                return true;
            }
        }

        return false;
    }

    public static function ValidateRequestMethod(array $allow_methods){
        
        if(in_array($_SERVER['REQUEST_METHOD'], $allow_methods)){
            return true;
        }
        return false;
    }


}
?>
