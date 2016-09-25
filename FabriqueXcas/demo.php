<?php
// autorisation eventuelle du cross-domain
header("Access-Control-Allow-Origin:*");
header("Content-Type:text/html; charset=UTF-8");
$nom=$_POST['nom'];
if ($nom) {
  $contenu=file_get_contents("demos/".$nom.".txt");
  $contenu=str_replace(chr(13),"&",$contenu);   
  // il faut supprimer les sauts de ligne, sinon javascript voit une chaine non terminée
  $contenu=str_replace(chr(10),"&",$contenu);
  print $contenu."demos/".$nom."txt";
  // ecrit  le contenu dans iframeFichier pour vérification éventuelle
  print "<script>parent.retour_ouvrir(\"$contenu\"); </script> ";
 } else
  print $fichiertmp."<script> alert(\"le fichier demo $nom  n\'a pas ete charge \"); </script>";
?>
