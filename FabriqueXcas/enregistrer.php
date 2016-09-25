<?php
// autorisation eventuelle du cross-domain
header("Access-Control-Allow-Origin:*");
$texte=$_POST['texte'];
if ($texte) {
  $texte=stripslashes($texte);
  $texte=addslashes($texte);
  //creation du fichier
  $clientFile='tmp/projet.txt';
  $f=fopen($clientFile,'w');
  fputs($f,$texte);
  fclose($f);
  // envoi du fichier
  $fsize = filesize($clientFile);
  $f2 = @fopen($clientFile, "r");
  if($f2) {
    header("Content-type: application/octetstream");
    header("Content-Length: ".$fsize);
  //header("Content-Disposition: attachment; filename=" .$clientFile);
    header("Content-Disposition: attachment; filename=projet.txt");
    header("Pragma: no-cache");
    header("Expires: 0");
    fpassthru($f2);
    flush();
  }
 }
?>
