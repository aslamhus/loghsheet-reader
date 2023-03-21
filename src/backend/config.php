<?php
require_once __DIR__ . '/vendor/autoload.php';


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$dotenv->required(['DEV'])->notEmpty();
$dotenv->required('DEV')->allowedValues(['DEV', 'PRODUCTION']);


if($_ENV['DEV'] === 'DEV'){

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    }
    



?>