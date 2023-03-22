<?php


namespace LogsheetReader\Log;

define('SITE_BASENAME','straight-no-chaser');

class Log {
public function __construct(){

}

/**
 * Log to /logs directory
 * 
 * @example 
 * 
 *  Log::write("update air_date (received from client): $air_date".PHP_EOL);
 *
 * @param string $content
 * @return void
 */
public static function write(string $content){
    $path = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . SITE_BASENAME . DIRECTORY_SEPARATOR . 'logs';

    if(!file_exists($path)){
        mkdir($path);
    }
    $filename = 'log_'.date("j.n.Y").'.log';
    file_put_contents($path . DIRECTORY_SEPARATOR  .$filename, $content, FILE_APPEND);
}

}