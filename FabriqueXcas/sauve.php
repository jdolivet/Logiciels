<?php
// autorisation eventuelle du cross-domain
header("Access-Control-Allow-Origin:*");

$auteur=$_POST["auteur"];
$auteur=stripslashes($auteur);
$date=date('Y');
$style=$_POST["style"].".css";
$prog=$_POST["prog"];
$prog=stripslashes($prog);
$impr=$_POST["impr"];
$impr=stripslashes($impr);
$onload=$_POST["onload"];
$onload=stripslashes($onload);
$texte=<<<CHAINE
<?xml version='1.0'  encoding='UTF-8' ?>
<!DOCTYPE html PUBLIC
    "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN"
    "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" 
  xmlns:mml="http://www.w3.org/1998/Math/MathML"
  xmlns:svg="http://www.w3.org/2000/svg"
  xml:lang="en">

<!--
  Copyright (C)  $auteur $date

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
-->

<head>
  <title>exercice fabriqu&eacute;</title>
<link rel="stylesheet" href="style2/impr.css" type="text/css" />
<link rel="stylesheet" href="style2/$style" type="text/css" />
<script   type="text/javascript"  src="xcas/base.js">
</script>
<script   type="text/javascript"  src="live.js">
</script>
<script  type="text/javascript">
// <![CDATA[
function recadre(){
  // uniquement pout internet Explorer
  if (!window.ActiveXObject)
    return;
  var elem=document.getElementById("canevas");
  if (elem.style.height<document.body.clientHeight)
    elem.style.height=document.body.clientHeight; 
}
// ]]>
</script>
<script language="xcas">
// <![CDATA[
$prog
// ]]>
</script>

</head>
<body onload="xcasBalise();fabExo(-1);recadre()">
$impr
<script>
$onload
</script>
</body>
</html>
CHAINE;
if ($texte) {
  //creation du fichier
  $clientFile='tmp/exercice.xhtml';
  $f=fopen($clientFile,'w');
  fputs($f,$texte);
  fclose($f);
  // envoi du fichier
  $fsize = filesize($clientFile);
  $f2 = @fopen($clientFile, "r");
  if($f2) {
    //header("Content-type: application/octetstream");
header("Content-Type:application/xhtml+xml ");

    header("Content-Length: ".$fsize);
  //header("Content-Disposition: attachment; filename=" .$clientFile);
    header("Content-Disposition: attachment; filename=exercice.xhtml");
    header("Pragma: no-cache");
    header("Expires: 0");
    fpassthru($f2);
    flush();
  }
 }
?>

