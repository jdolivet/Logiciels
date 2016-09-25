<?php
// autorisation eventuelle du cross-domain
header("Access-Control-Allow-Origin:*");
header("Content-Type:text/html; charset=UTF-8");
$fichiertmp=$_FILES["fichier"]['tmp_name'];
$fichier=$_FILES["fichier"]['name'];
//$destination=$_GET['destination'];
if ($fichier) {
  @move_uploaded_file($fichiertmp, "tmp/fichier.txt") ;
  $contenu=file_get_contents("tmp/fichier.txt");
 // $contenu=str_replace(chr(34),"'",$contenu);
  $contenu=str_replace(chr(13),"&",$contenu);   
  // il faut supprimer les sauts de ligne, sinon javascript voit une chaine non terminée
  $contenu=str_replace(chr(10),"&",$contenu);
  print $contenu;
  // ecrit  le contenu dans iframeFichier pour vérification éventuelle
  print "<script>parent.retour_ouvrir(\"$contenu\"); </script> ";
//  print "<script> parent.retour_ouvrir(\"$contenu\",'$destination'); </script> ";
 } else
  print $fichiertmp."<script> alert(\"le fichier $fichier n\'a pas été chargé \"); </script>";
?>