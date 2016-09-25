<?php
// autorisation eventuelle du cross-domain
// il faut resoudre encore le pb des cookies (pour les sessions)
header("Access-Control-Allow-Origin:*");
// neutralise le cache
header("Expires:Sat,1 Jan 2000 00:00:00 GMT");
header("Cache-control : no-store, no-cache, must-revalidate");
header("Cache-Control : post-check=0, pre-check=0",false);

//on avertit le navigateur qu'on lui envoie du html (text/html remplace par text)
//header("Content-Type:text; charset=iso-8859-1");
header("Content-Type:text; charset=UTF-8");

// chargement du module giac par php
// on evite d'y recourir en chargeant giac dans le fichier
// /etc/php5/apache2/php.ini
// ajouter la ligne extension=phpgiac.so
// puis sudo /etc/init.d/apache2 restart
// les sessions sont alors inutiles
//dl("phpgiac.so");
// limite le temps de calcul à 1 seconde sur le serveur
set_time_limit(1);
$session_id=$_POST["session_id"];
if ($session_id!="")
  session_id($session_id);
session_start();
$context=session_id();
$archive=$_SESSION["archive"];
giac_eval_txt("srand()",$context);
giac_unarchive_session($archive,$context);
$input=$_POST["in"];
//print $input."\n";
$input=stripslashes($input);
$option=$_POST["option"];
$xx=$_POST["xx"];
$yy=$_POST["yy"];
switch ($option) {
 case "prog" :
   $retour=giac_eval_prog($input,$context);
   break;
 case "text" :
   //$retour="ok";
   $retour=giac_eval_txt_mathml($input,$context);
   break;
 case "labomep" :
   $retour=giac_labomep($input,$context);
   break;
 case "math" : 
   $retour=giac_txt_mathml($input,$context);
   break;
 case "math_eval" :
   $retour=giac_txt_mathml_et_eval($input,$context);
   break;
 case "spread" :
    $retour=giac_eval_spread($input,$context); 
    break;
 case "svg" :
   $retour=giac_eval_svg($input,$context);
   if ($retour=="undef`" || $retour=="`" || $retour=="error`" || $retour=="`")
     $retour="E";
   break;
 case "text_math_svg" :
   $retour=giac_eval_txt_mathml_svg($input,$context);
   break;
 case "svg_grid" :
   giac_eval_txt_mathml($input,$context);
   $retour=giac_svg_preamble($xx,$yy)."<g id=\"figures\"></g></g><g>".giac_svg_grid()."<g id='legende'></g></svg>";
   break;
 }
print   $context."`".$retour."`\n";
if ($option!="spread"){
  $archive=giac_archive_session($context);
  $_SESSION["archive"]=$archive;
 }
//print  $option."`".$input."`\n";

?>