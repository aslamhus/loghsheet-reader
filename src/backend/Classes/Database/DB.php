<?php

namespace LogsheetReader\Database;
use \PDO;

class DB {

    public $pdo;
    public function __construct(){
        $connect = [
            'host' => $_ENV['DB_HOST'],
            'db'   => $_ENV['DB_NAME'],
            'user' => $_ENV['DB_USER'],
            'pass' => $_ENV['DB_PASS']
        ];
    $dsn = "mysql:host=".$connect['host'].";dbname=".$connect['db'].";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    try {
        $this->pdo = new PDO($dsn, $connect['user'], $connect['pass'], $options);
    } catch (\PDOException $e) {
        throw new \PDOException($e->getMessage(), (int)$e->getCode());
    }

    }

    public function getPDO() : PDO{
        return $this->pdo;
    }


}
