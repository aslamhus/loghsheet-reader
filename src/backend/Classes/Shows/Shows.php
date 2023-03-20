<?php

namespace LogsheetReader\Shows;

use LogsheetReader\Database\DB;
use \DateTime;


class Shows {

    private DB $db;

    public function __construct(DB $db){
        $this->db = $db;
    }

    public function update(string $host, string $title, string $air_date, array $tracks){
        // convert string date to date
        $converted_air_date = $this->stringToDate("$air_date 18:00:00");
        
        // update or insert show details
        $show = $this->getShow($host, $title, $converted_air_date);
        if(empty($show)){
            // insert
            $this->insertShow($host, $title, $converted_air_date);
            $show = $this->getShow($host, $title, $converted_air_date);
        } else {
            // update
            $this->updateShow($show['id'], $host, $title, $converted_air_date);
        }
        // update or insert tracks
        $show_id = $show['id'];
        return $this->updateTracks($show_id, $tracks);
    }

    private function getShow(string $host, string $title, DateTime $air_date) : array {
        $pdo = $this->db->getPDO();
        $stmt = $pdo->prepare("SELECT *, COUNT(*) as count FROM shows WHERE host = ? AND title = ? AND air_date = ?");
        $stmt->execute([$host, $title, $this->mysqlDate($air_date)]); 
        $result = $stmt->fetch();
        if($result['count'] > 1){
        throw new \Exception('There are multiple shows matching this date, title and host. Please check the database for an incorrect show entry');      
     } 
     if($result['count'] == 0){
        return [];
     }
       return $result;
    }

    public function getAllShows() : array {
        $pdo = $this->db->getPDO();
        $stmt = $pdo->prepare("SELECT * FROM shows ORDER BY air_date DESC");
        $stmt->execute();
        $result = $stmt->fetchAll();
       return $result;
    }

    public function getShowById(int $show_id) : array {
        $pdo = $this->db->getPDO();
        $query = "SELECT * FROM shows WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$show_id]);
        $result = $stmt->fetch();
        
       return $result;
    }

    public function getShowTracks(int $show_id) : array {
        $pdo = $this->db->getPDO();
        $query = "SELECT * FROM tracks WHERE show_id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$show_id]);
        $result = $stmt->fetchAll();
        
       return $result;
    }



    private function stringToDate(string $date) : DateTime {
        $date = DateTime::createFromFormat('Y-m-d H:i:s', $date);
        return $date;
    }

    private function mysqlDate(DateTime $date) : string {
        return $date->format('Y-m-d H:i:s');
    }
 

    private function insertShow(string $host, string $title, DateTime $air_date) : bool{
        $pdo = $this->db->getPDO();
        $stmt = $pdo->prepare('INSERT INTO shows(`host`,`title`,`air_date`,`date_created`) VALUES(?,?,?,NOW())');
        return $stmt->execute([ $host,  $title, $this->mysqlDate($air_date)]);
    }

    private function updateShow(int $id, string $host, string $title, DateTime $air_date) : bool{
        $pdo = $this->db->getPDO();
        $stmt = $pdo->prepare('update shows set `host` = ?, `title` = ?, `air_date` = ?, `date_updated` = NOW() WHERE `id` = ?');
        $stmt->execute([ $host,  $title, $this->mysqlDate($air_date), $id]);
        return $stmt->execute();
    }

    private function updateTracks(int $show_id, array $tracks){
        $this->deleteAllShowTracks($show_id);
        foreach($tracks as $track){
            if(!$this->addTrackToShow($show_id, $track)){
                throw new \Exception("Error adding track to show");
            }
        }
        return true;

    }

    private function deleteAllShowTracks(int $show_id) : bool{
        $pdo = $this->db->getPDO();
        $stmt = $pdo->prepare('DELETE FROM tracks where `show_id` = ?');
        return $stmt->execute([$show_id]);
    }

    private function addTrackToShow(int $show_id,object $track) : bool{
        // var_dump($track);
        $pdo = $this->db->getPDO();
        $stmt = $pdo->prepare('insert into tracks(`track`, `artist`,`album`,`label`,`show_id`) VALUES(?,?,?,?,?)');
        return $stmt->execute([
            $track->{"track"},
            $track->artist,
            $track->{"album"},
            $track->{"label"} ?? "",
            $show_id
        ]);
    }
    




}