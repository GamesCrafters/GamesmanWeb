<?php
$obid = $_GET['obid'];
$reqid = $_GET['reqid'];
$hook = $_GET['hook'];
$action = $_GET['action'];
$fen = $_GET['fen'];

$split = split(' ', $fen);


echo file_get_contents("http://k4it.de/egtb/fetch.php?obid=$obid&reqid=$reqid&hook=$hook&action=$action&fen=$split[0] egtb&fen=$fen");

//echo ("http://k4it.de/egtb/fetch.php?obid=$obid&reqid=$reqid&hook=$hook&action=$action&fen=$split[0] egtb&fen=$fen");
?>
