<?php



$html = file_get_contents('http://cfuv.uvic.ca/cms/?shows=straight-no-chaser');
$doc = new DOMDocument();
  $doc->loadHTML($html);
  $xpath = new DOMXPath($doc);
  $results = $xpath->query("audio");
var_dump($results);
if ($results->length > 0) {
    echo "results greater than 0";
    var_dump($results->item(0));
}