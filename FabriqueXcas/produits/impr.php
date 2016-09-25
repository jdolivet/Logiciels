<?php
// autorisation eventuelle du cross-domain
// il faut resoudre encore le pb des cookies (pour les sessions)
header("Access-Control-Allow-Origin:*");
// neutralise le cache
header("Expires:Sat,1 Jan 2000 00:00:00 GMT");
header("Cache-control : no-store, no-cache, must-revalidate");
header("Cache-Control : post-check=0, pre-check=0",false);

header("Content-Type:application/xhtml+xml ");
//header("Content-Type:text/xml ");

echo "<?xml version='1.0'  encoding='UTF-8' ?>";
?>

<!DOCTYPE html PUBLIC
    "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN"
    "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">


<html xmlns="http://www.w3.org/1999/xhtml" 
  xmlns:mml="http://www.w3.org/1998/Math/MathML"
  xmlns:svg="http://www.w3.org/2000/svg"
  xml:lang="en">

<!--
  Copyright (C)
  <?php 
  $auteur=$_POST["auteur"];
  $auteur=stripslashes($auteur);
print $auteur." ".date('Y')."\n";
  ?>
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
<?php 
  $style=$_POST["style"];
print "<link rel='stylesheet' href='style2/".$style.".css' type='text/css' />"
?>
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
<?php 
  $prog=$_POST["prog"];
  $prog=stripslashes($prog);
  print $prog."\n";
?>
// ]]>
</script>

</head>
<body onload="xcasBalise();fabExo(-1);recadre()">
    
 
<?php 
  $impr=$_POST["impr"];
  $impr=stripslashes($impr);
  print $impr."\n";
  $onload=$_POST["onload"];
  $onload=stripslashes($onload);
  print "<script>".$onload."</script>\n";
?>

</body>
</html>