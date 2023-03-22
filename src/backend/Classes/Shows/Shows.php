<?php

namespace LogsheetReader\Shows;

use LogsheetReader\Database\DB;
use \DateTime;
use LogsheetReader\Log\Log;


class Shows {

    private DB $db;

    public function __construct(DB $db){
        $this->db = $db;
    }

    public function create(string $host, string $title, string $air_date, int $utc_timestamp, array $tracks, $replace) : bool {
        $show = null;
        // convert string date to date

       
        $converted_air_date = $this->stringToDate($air_date);
        // check for conflicting show
        $conflictingShow = $this->getShowByWeek($converted_air_date);
        if($replace != true && $conflictingShow){
            throw new \Exception('conflict');
        }
        if(empty($conflictingShow)){
            // insert
            $this->insertShow($host, $title, $converted_air_date);
            $show = $this->getShow($host, $title, $converted_air_date);
        } else {
            // update
            $this->updateShow($conflictingShow['id'], $host, $title, $converted_air_date, $utc_timestamp);
            $show = $conflictingShow;
        }
        // update or insert tracks
        return $this->updateTracks($show['id'], $tracks);
    }

    public function update(int $showId, string $host, string $title, string $air_date,  int $utc_timestamp, array $tracks) : bool{
        // convert string date to date
        $converted_air_date = $this->stringToDate($air_date);
        // check for conflicting show
        
        // update or insert show details
        $show = $this->getShowById($showId);
        if(empty($show)){
            // insert
            throw new \Exception('Failed to update show. Could not find show with id '.$showId);
        } else {
            // update
            try {
            $didUpdateShow  = $this->updateShow($show['id'], $host, $title, $converted_air_date, $utc_timestamp);
            $didUpdateTracks =$this->updateTracks($show['id'], $tracks);
            if(!$didUpdateShow || !$didUpdateTracks){
                throw new \Exception('Failed to update show - updating either show or tracks failed');
            }
            } catch(\Exception $e){
                throw new \Exception('Failed to update show. '.$e->getMessage());
            }
        }
        // update or insert tracks
        return true;
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

    /**
     * Get show by week
     *
     * @param DateTime $air_date
     * @return Array|Bool
     */
    private function getShowByWeek(DateTime $air_date){
        $pdo = $this->db->getPDO();
        $stmt = $pdo->prepare("SELECT * FROM shows WHERE WEEK(DATE(air_date)) = WEEK(?)");
        $stmt->execute([$this->mysqlDate($air_date)]); 
        $result = $stmt->fetch();
        return $result;
    }

    public function getAllShows() : array {
        $pdo = $this->db->getPDO();
        $stmt = $pdo->prepare("SELECT *, UNIX_TIMESTAMP(air_date) AS timestamp FROM shows ORDER BY air_date DESC");

        $stmt->execute();
        $result = $stmt->fetchAll();

       return $result;
    }

    public function getShowById(int $show_id) : array {
        // 2021-01-01T12:00:00-04:00
        $pdo = $this->db->getPDO();
        $query = "SELECT *, UNIX_TIMESTAMP(air_date) AS timestamp FROM shows WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$show_id]);
        $result = $stmt->fetch();

        Log::write("get show by id: ".$result['air_date'].PHP_EOL);
        
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

    public function deleteShows(array $ids) : bool {
        $pdo = $this->db->getPDO();
        foreach($ids as $id){
            $query = "DELETE FROM shows WHERE id = ?";
            $stmt = $pdo->prepare($query);
           try {
            $stmt->execute([$id]);
           } catch(\Exception $e){
            throw new \Exception('There was an error deleting the show. '.$e->getMessage());
           }
        }
    
       return true;
    }



    private function stringToDate(string $jsDate) : DateTime {
        $timestamp = strtotime($jsDate);
        $date = new DateTime();
        $date->setTimestamp($timestamp);
        if($date == false){
            throw new \Exception('Failed to convert javascript date to php date: '.$jsDate);
        }
        return $date;
    }

    private function mysqlDate(DateTime $date) : string {
        return $date->format('Y-m-d H:i:s');
    }
 

    private function insertShow(string $host, string $title, DateTime $air_date) : bool{

        Log::write("insert mysql_air_date (inserted to db): ".$this->mysqlDate($air_date).PHP_EOL);
        $pdo = $this->db->getPDO();
        $stmt = $pdo->prepare('INSERT INTO shows(`host`,`title`,`air_date`,`date_created`) VALUES(?,?,?,NOW())');
        return $stmt->execute([ $host,  $title, $this->mysqlDate($air_date)]);
    }

    public function updateShow(int $id, string $host, string $title, DateTime $air_date, int $utc_timestamp) : bool{

        Log::write("update mysql_air_date (inserted to db): ".$this->mysqlDate($air_date).PHP_EOL);
        Log::write("update utc_timestamp (inserted to db): ".$utc_timestamp.PHP_EOL);
        $pdo = $this->db->getPDO();
        $stmt = $pdo->prepare('update shows set `host` = ?, `title` = ?, `air_date` = FROM_UNIXTIME(?), `date_updated` = NOW() WHERE `id` = ?');
        $stmt->execute([ $host,  $title, $utc_timestamp, $id]);
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