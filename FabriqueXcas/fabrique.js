//   Copyright (C) 2010 J-P Branchard <Jean-Pierr.Branchard@ac-grenoble.fr>
//   This program is free software; you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation; either version 2 of the License, or
//   (at your option) any later version.
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with this program; if not, write to the Free Software
//   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA.

function fabNouveau(){
  if (!confirm("Tout effacer ?"))
    return;
  fab.nbElt=0;
  fab.console=false;
  fab.onLoad="";
  fab.tableur=false;
  fab.svg=false;
  fab.feuilleCalc=0;
  fab.xmin=-5;
  fab.ymin=-5;
  fab.xmax=5;
  fab.ymax=5;
  fab.h=10;
  var el=document.getElementById("canevas");
  el.innerHTML="<p> </p>";
  el.focus();
  var ids=["test","programmeXcas"];
  for (i in ids){
    el=document.getElementById(ids[i]);
    el.value="";
    el.focus();
  }
  document.getElementById("choixStyle").selectedIndex=0;
}

function fabAlt(ev){
  var c=document.getElementById("canevas");
  if(ev.altKey && ev.keyCode==80)
    escamoteXcas();
  return false;
}

function escamoteXcas(){
  vaEtVient("progXcas",true);
  vaEtVient("gereProg",true);
  vaEtVient("testProg",true);
}

function recadre(){
  if (document.body.clientWidth<1250){
    alert("Ecran trop petit : vous devrez taper Alt-p pour saisir un programme Xcas");
    escamoteXcas();
  }
}

var fenetre_impression;

fab.nbElt=0;
fab.console=false;
fab.onLoad="";
fab.tableur=false;
fab.svg=false;
fab.feuilleCalc=0;
fab.xmin=-5;
fab.ymin=-5;
fab.xmax=5;
fab.ymax=5;
fab.h=10;

fab.id=function(){
  var nom="fab"+fab.nbElt;
  fab.nbElt++;
  return nom;
}

  fab.url="";
// variantes abandonnées (politique de meme prigine de fiefox)
// fab.url="http://xcasenligne.fr/fabrique/";
//fab.url="http://localhost/giac_online/fabrique/";
//fab.url="http://vds1100.sivit.org/giac/fabrique/"
fab.absolute=false;
fab.saisie=false;
fab.cibleSaisie=0;

function fabStyle(select){
  xcasInclureStyle("produits/style2/"+select.options[select.selectedIndex].value+".css")
}

function fabEcrit(elt){
  if (!fab.saisie)
    return;
  if (fab.cibleSaisie.value!="")
    fab.cibleSaisie.value+=" ";
  fab.cibleSaisie.value+=elt.getAttribute("id");
}

function fabCibleEcrit(elt){
  fab.saisie=true;
  fab.cibleSaisie=elt;
}

function insertAfter(nAInserer, nDeReference,nParent) {
  if (!nParent)
    var nParent=nDeReference.parentNode;
  if (nParent==nDeReference)
    return nParent.appendChild(nAInserer);
  if(nDeReference.nextSibling) {
    return nParent.insertBefore(nAInserer, nDeReference.nextSibling);
  } else { 
    return nParent.appendChild(nAInserer);
  }
}

function fabInsereHTML(html,p){
  var canevas=document.getElementById("canevas");
  if (p){
    var n = document.createElement("p");
    html="<span id='insert'>"+html+"</span>";
  }
  else {
    var n = document.createElement("fab");
  }
  var n1=document.createTextNode(" ");
  n.setAttribute("contenteditable","false");
  n.innerHTML=html;
   if (!window.ActiveXObject)  {  // Firefox, Google Chrome, Safari, Opera
    var selection = window.getSelection ();
    if (selection.rangeCount > 0) {
      var range = selection.getRangeAt (0);
      range.collapse (false);
      range.insertNode (n1);
      range.insertNode (n);
      range.setStartAfter(n1);
      // correction bug curseur
       if (xcasBase.isWebKit){
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
	}
    }
    }
    else {  // Internet Explorer
    var textRange = document.selection.createRange ();
    textRange.collapse (false);
    textRange.pasteHTML (n.outerHTML);
    // n.parentNode.removeChild(n);
    }
  if (p) {
    var insert=document.getElementById("insert");
    var parent=insert.parentNode;
    var ancre=parent;
    if (ancre==canevas)
      ancre=insert;
    else while (ancre!=canevas && ancre.parentNode!=canevas)
      ancre=ancre.parentNode;
    var noeud; 
    while (insert.firstChild) {
      noeud=insertAfter(insert.firstChild,ancre,canevas);
      // pourquoi le if est il necessaire ? bug potentiel.
      if (insert.firstChild)
	insert.removeChild(insert.firstChild);
    }
    if (n.parentNode)
      n.parentNode.removeChild(n);
    if (insert)
      insert.parentNode.removeChild(insert);
    fabParFin(canevas,noeud);
  } 
}

function fabParFin(canevas,n){
  // recherche d'un autre paragraphe
  var b=false;
  while (n.nextSibling && !b){
    n=n.nextSibling 
      b=(n.tagName=="p");
  } 
  if (!b) {
    var par=document.createElement("p");
    var t=document.createTextNode("...");
    par.appendChild(t);
    canevas.appendChild(par);
    //if (!window.ActiveXObject) {
  // positionnement du curseu
  var range= window.getSelection().getRangeAt(0);
  range.setStart(par, t);
  range.setEnd(par, t);
  }
}


function fabEditeDistributeur(){
  document.getElementById("distrib").style.display="block";
  var s=document.getElementById("listeExos").getAttribute("liste");
  s=s.replace(/`/g,"\n"); 
  document.getElementById("distribDonnees").value=s;

}

function fabFermeDistributeur(){
  var recepteurs=document.getElementById("recepteurs");
  var s=elimineBlanc(recepteurs.value);
  recepteurs.value=s;
  document.getElementById("listeExos").setAttribute("recepteurs",s);
  vaEtVient("distrib");
  s=document.getElementById("distribDonnees").value;
  s=s.replace(/\n/g,"`"); 
  document.getElementById("listeExos").setAttribute("liste",s);
  fab.exos=s.split(new RegExp("`","g"));
  fabExo(-1);
  fab.saisie=false;
}

function fabActualiseDistributeur(){
  var s=document.getElementById("listeExos").getAttribute("recepteurs");
  document.getElementById("recepteurs").value=s;
  s=document.getElementById("listeExos").getAttribute("liste");
  s=s.replace(/`/g,"\n"); 
  document.getElementById("distribDonnees").value=s;
  fabFermeDistributeur();
  vaEtVient("distrib");
  fabExo(-1);
}


var formuleActive; 
function fabEditeFormule(elt){
  document.getElementById("formule").style.display="block";
  var entreeFormule=document.getElementById("entreeFormule");
  entreeFormule.value=elt.getAttribute("formule");
  formuleActive=elt;
}

function fabAfficheValeur(s) {
  document.getElementById("pvaleur").style.display="inline";
  var valeur=document.getElementById("valeur");
  if (s)
    valeur.value=s;
  else
    valeur.value="";
}

function fabEditeAction(elt){
  var i,s,t;
  document.getElementById("dialogue").style.display="block";
  document.getElementById("canevas").setAttribute("contenteditable","false");
  var actions=["onclick","onchange"];
  var action=document.getElementById("action");
  action.value="";
  action.setAttribute("elt",elt.getAttribute("id"));
  var nom=document.getElementById("nom");
  nom.value=elt.getAttribute("id");
  nom.focus();
  if (elt.tagName=="a"){
    fabAfficheValeur(elt.firstChild.data);
  } else if(elt.options){
    s=elt.options[0].value;
    for (i=1;i<elt.options.length;i++)
      s+=", "+elt.options[i].value;
    fabAfficheValeur(s);
  } else if (elt.value)
    fabAfficheValeur(elt.value);
  var argument=document.getElementById("arguments");
  argument.value="";
  argument.value=elt.getAttribute("arguments");
  var cible=document.getElementById("cible");
  cible.value="";
  if (elt.getAttribute("cible"))
    cible.value=elt.getAttribute("cible");
  else if (elt.tagName=="a"){
    cible.value=elt.getAttribute("href");
    document.getElementById("href").style.display="block";
  }
  var evt=document.getElementById("evt");
  evt.value="";
  for (i in actions){
    s=elt.getAttribute(actions[i]);
    if (s!=null){
      document.getElementById("actif").style.display="inline";
      document.getElementById("href").style.display="inline";
      t=elt.getAttribute("xcas");
      if (t!=null && t!="")
	s=t;
      action.value=s;
      evt.value=actions[i];
    }
  }
}

function elimineBlanc(s){
    s = s.replace(/[\s]{2,}/g," "); // Enlève les espaces doubles, triples, etc.
    s = s.replace(/^[\s]/, ""); // Enlève les espaces au début
    s = s.replace(/[\s]$/,""); // Enlève les espaces à la fin
    return s;    
    //ancien
  // for (var i=0; i<s.length && s.charAt(i)==" " ; i++) {
//   }
//   return s.substr(i);
}
 
function remplaceBlanc(s){
  return s.replace(/ /g,"_");
}


function fabImprimeFormule(elt){
  elt.style.display="none";
  var formule=document.getElementById("entreeFormule").value;
  var eval=document.getElementById("evaluer").checked;
  var disp=document.getElementById("deployer").checked;
  formuleActive.setAttribute("formule",formule);
  if (eval)
    xc.eval(formule);
  else
    xc.nonEval(formule);
  
  xc.imprimeMml(formuleActive,0,!disp,true);
}

function fabInsereAction(){
  // on escamote la boite de dialogue
  document.getElementById("canevas").setAttribute("contenteditable","true");
  document.getElementById("pvaleur").style.display="none";
  document.getElementById("actif").style.display="none";
  document.getElementById("href").style.display="none";
  document.getElementById("dialogue").style.display="none";
  var i,s;
  var action=document.getElementById("action");
  var argument=document.getElementById("arguments");
  argument.value=elimineBlanc(argument.value);
  //var  reg=new  RegExp("[ ,;]+", "g");
  var args=argument.value.split(" ");
  var nom=document.getElementById("nom");
  var elt=document.getElementById(action.getAttribute("elt"));
  var evt=document.getElementById("evt").value;
  var cible=document.getElementById("cible");
  cible.value=elimineBlanc(cible.value);
  var cibles=cible.value.split(" ");
  nom.value=remplaceBlanc(nom.value);
  if (elt.getAttribute("id")!=nom.value){
    while (document.getElementById(nom.value))
      nom.value=prompt("ce nom est pris, en choisir un autre ;",nom.value);
    elt.setAttribute("id",remplaceBlanc(nom.value));
  }
  var valeur=document.getElementById("valeur");
  if (elt.tagName=="a"){
    elt.firstChild.data=valeur.value;
  }
  if(elt.options){
    var options=valeur.value.split(",");
    for (i in options){
      s=elimineBlanc(options[i]);
      if (i<elt.options.length){
	elt.options[i].value=s;
	elt.options[i].firstChild.data=s;
      } else {
	var option=new Option(s);//,options[i],false,true);
	elt.options[elt.options.length]=option;
      }
    }
  } else if (elt.value)
    elt.value=valeur.value;
  elt.setAttribute("title",nom.value);
  if (elt.hasAttribute('href'))
    elt.setAttribute("href",cible.value);
  else
    elt.setAttribute("cible",cible.value);
  elt.setAttribute("arguments",argument.value);
  var faire="",remplace;
  if (action.value!=""){
    elt.setAttribute("xcas",action.value);
    faire="xc.eval('"+action.value+"'";
    for (i in args)
      faire+=",'"+args[i]+"'";
    faire+=");";
    var c;
    for (i in cibles){
      c=document.getElementById(cibles[i]);
      remplace=true;
      if (c)
	remplace=!(c.getAttribute("class")=="histo");
      faire+="xc.imprimeMml('"+cibles[i]+"',"+i+",true,"+remplace+");";
      faire+="xc.imprimeSvg(fab.graphique,"+remplace+");";     
    }
    //alert(evt+" "+faire);
    if (evt!=null && evt!="")
      elt.setAttribute(evt,faire);
    compile();
    fab.saisie=false;
  }
}

function fabSupprimeElt(){
  var nom=document.getElementById("nom");
  var elt=document.getElementById(nom.value);
  var parent=elt.parentNode;
  if (confirm("Confirmer la suppression de "+elt.id))
    parent.removeChild(elt);
  document.getElementById("canevas").setAttribute("contenteditable","true");
  document.getElementById("dialogue").style.display="none";
}

function fabInsereJs(texte){
  var script = document.createElement("script" );
  script.type = "text/javascript";
  script.innerHTML=texte;
  document.getElementsByTagName('head')[0].appendChild(script);
}

function compile(){
  var elem=document.getElementById("programmeXcas");
  xcasRequete(elem.value);
}

function fabInsereTable(){
  var nLi=prompt("Nombre de lignes");
  var nCol=prompt("Nombre de colonnes");
  var bord=prompt("Bordures visibles (1) ou non (0) ?");
  var classe="tab";
  if (bord==0)
    classe="tabInv";
  //var html="<p></p><table class='"+classe+"'><tbody>";
  var html="<table class='"+classe+"'><tbody>";
  var i,j;
  for (i=0 ; i<nLi ; i++){
    html+="<tr>";
    for (j=0 ; j<nCol ; j++)
       html+="<td>&#160;&#160;</td>";
      //html+="<td>cellule</td>";

    html+="</tr>";
  }
  html+="</tbody></table><p></p>";
  fabInsereHTML(html,true);
}

function fabSpe(select){
  document.getElementById("canevas").focus();
  var html=select.options[select.selectedIndex].value;
  fabInsereHTML(html);
  select.selectedIndex=0;
}

var fabTag="'  oncontextmenu='fabEditeAction(this)' ";

fab.demandeId=function(){
  var id=fab.id();
  var id1=remplaceBlanc(prompt("Nom :",id));
  while (document.getElementById(id1))
    id1=remplaceBlanc(prompt("Le nom '"+id1+"' est pris, en choisir un autre :",id));
  return id1;
}

function fabInsereEntree(){
  var id= fab.demandeId();
  var html="&#160;&#160;<input id='"+id+"' onclick='fabEcrit(this)'  onchange='' onkeypress='this.focus()' onkeyup='fabChapeau(this,event)'  title='"+id+fabTag+"/>&#160;";
  fabInsereHTML(html);
}

function fabInsereOk(){
  var id=fab.id();
  var html="&#160;&#160;<input type='button' id='"+id+"' value='ok'    onclick='' title='"+id+fabTag+"/>&#160;";
  fabInsereHTML(html);
}

function fabInsereLien(){
  var id=fab.id();
  var texte=prompt("Texte :");
  var html="&#160;<a onclick='' id='"+id+"' title='"+id+fabTag+">"+texte+"</a>&#160;&#160;";
  fabInsereHTML(html);
}

function fabInsereLienHtml(){
  var id=fab.id();
  var texte=prompt("Texte :");
  var href=prompt("Vers l'adresse :");
  var html="&#160;<a href='"+href+"' id='"+id+"' title='"+id+fabTag+">"+texte+"</a>&#160;";
  fabInsereHTML(html);
}

function fabInsereSortie(){
  var id=fab.demandeId();
  var html="<p class='sortie' contenteditable='false' onmousedown='return false' onmouseup='fabEcrit(this)' horsligne='1'  id='"+id+"'  title='"+id+fabTag+">"+"&#8230;</p> ";
  fabInsereHTML(html,true);
}

function fabInsereSortieDL(){
  var id=fab.demandeId();
  var html="&#160;<span class='sortieDL' contenteditable='false'  onmousedown='return false' onmouseup='fabEcrit(this)' id='"+id+"' title='"+id+fabTag+">&#8230;</span>&#160;&#160;";
  fabInsereHTML(html);
}

function fabInsereFormule(){
  var id=fab.id();
  var html="<span class='formule' id='"+id+"' title='"+id+"' oncontextmenu='fabEditeFormule(this)'>&#160;&#160;</span>&#160;";
  fabInsereHTML(html);
}

function fabInsereHisto(){
  var id=fab.demandeId();
  var html="<div class='histo' onmousedown='return false' onmouseup='fabEcrit(this)'  horsligne='1'  id='"+id+"' title='"+id+fabTag+">&#160;</div><p></p>";
  fabInsereHTML(html,true);
}

function fabInsereSelect(){
  var id=fab.demandeId();
  var html="&#160;<select contenteditable='false'  onclick='fabEcrit(this)'  id='"+id+"' onchange='' title='"+id+fabTag
    +"><option>item1</option><option>item2</option></select>"
    fabInsereHTML(html);
}

function fabInsereTableur(){
  if (fab.tableur){
    alert("Un seul tableur par exercice");
    return;
  }
  fab.tableur=true;
  var id=fab.id();
  var html="<p></p><div id='"+id+"' contenteditable='false' title='" +id+"'>&#160;</div><p contenteditable='true'>...</p>";
  fabInsereHTML(html);
  var nLi=prompt("Nombre de lignes");
  var nCol=prompt("Nombre de colonnes");
  fab.onLoad+="fab.feuilleCalc=new xcasTableur('"+id+"',"+nLi+","+nCol+");";
  fabNettoyeur(id);
  fab.feuilleCalc=new xcasTableur(id,nLi,nCol);
}

function fabRestaureTableur(){
  var s="";
  s+="fab.feuilleCalc.nb_lign="+fab.feuilleCalc.nb_lign+";";
  s+="fab.feuilleCalc.nb_col="+fab.feuilleCalc.nb_col+";";
  //if (fab.nb_lign!=""){
  s+="fab.nb_lign='"+fab.nb_lign+"';";
  s+="fab.nb_col='"+fab.nb_col+"';";
  s+="fab.sauvTab='"+fab.sauvTab+"';";
  s+="fab.feuilleCalc.sauvegarde=\'"+fab.feuilleCalc.sauvegarde+"';";
  //}
  s+="setTimeout('fab.feuilleCalc.restaure()',1000)";
  return s;
}

function fabInsereConsole(prog){
  fab.console=true;
  var id=fab.id();
  var html="<p></p><div id='"+id+"' contenteditable='false' title='" +id+"'></div><p></p>";
  fabInsereHTML(html);
  var message="Tapez les commandes Xcas ici :";
  if (prog){
    new xcasProg(id,message);
    fab.onLoad+="new xcasProg('"+id+"','"+message+"');";
  } else {
    new xcasConsole(id,message);
    fab.onLoad+="new xcasConsole('"+id+"','"+message+"');";
  } 
}

function fabInsereProg(){
  fabInsereConsole(true);
}

function fabInsereDistributeur(){
  //var html="<div class='distrib' contenteditable='false' ><img onclick='fabExo(-1)' src='img/bouton_gauche.png'/> <input id='listeExos' onchange='' onfocus='fabEditeExos(true,this)' title='listeExos' index='0' liste='' oncontextmenu=\"vaEtVient('distrib')\"/><img onclick='fabExo(1)' src='img/fleched.png'/></div><p></p>";
  var html="<div class='distrib' contenteditable='false' oncontextmenu='fabEditeDistributeur()' ><p class='ovale'><img onclick='fabExo(-1)' src='img/bouton_gauche.png'/><span id='numexo'></span> <input id='listeExos' onchange='' onfocus='fabEditeExos(true,this)' title='listeExos' index='0' liste='' /><img onclick='fabExo(1)' src='img/bouton_droit.png'/></p></div><p></p>";
  fabInsereHTML(html,true);
}

function fabInsereSvg(){
  if (fab.svg){
    alert("Un seul repere par exercice");
    return;
  }
  fab.svg=true;
  //var html="<p>Graphique :</p><div class='svg' id='svg'  contenteditable='false' title='svg' oncontextmenu=\"vaEtVient('fenetre\')\" >&#160;</div><p></p>";
  var html="<div class='svg' id='svg'  contenteditable='false' title='svg' oncontextmenu=\"vaEtVient('fenetre')\" ></div>";
  fabInsereHTML(html,true);
  fab.onLoad+="fab.graphique=new xcasSvg('svg',12,12,10,10);fab.graphique.svgGrid(-5,-5,5,5);";
  fabNettoyeur('svg');
  fab.graphique=new xcasSvg('svg',12,12,10,10);
  fab.graphique.svgGrid(-5,-5,5,5);
}

function fabRecadreSvg(){
  fab.xmin=parseInt(document.getElementById("xm").value);
  fab.ymin=parseInt(document.getElementById("ym").value);
  fab.xmax=parseInt(document.getElementById("xMax").value);
  fab.ymax=parseInt(document.getElementById("yMax").value);
  fab.h=parseInt(document.getElementById("hauteur").value);
  fabCadreSvg(fab.xmin,fab.ymin,fab.xmax,fab.ymax,fab.h);
}

function fabVide(){
  alert("Choisir d'abord un composant dans la liste");
}

function fabComposant(composant){
  document.getElementById("canevas").focus();
  var fonctions=[fabVide,
		 fabInsereEntree, 
		 fabInsereOk,
		 fabInsereLien,
		 fabInsereSelect,
		 fabInsereDistributeur,
		 fabInsereSortie,
		 fabInsereSortieDL,
		 fabInsereSvg,
		 fabInsereHisto,
		 fabInsereConsole,
		 fabInsereTableur,
		 fabInsereProg,
		 fabInsereFormule];
  var i=composant.selectedIndex;
  fonctions[i]();
  composant.selectedIndex=0;
}


function fabExecCommand(a,b,c){
  document.getElementById("canevas").focus();
  document.execCommand(a,b,c);
}

function fabFormat(cmd,objet) {
  document.getElementById("canevas").focus();
  if (document.queryCommandState(cmd)){
    document.execCommand("RemoveFormat", false, null);
  }
  else {
    document.execCommand(cmd, false, null);
  }
  document.getElementById("canevas").focus();
}

function appliqueStyle(s){
  var canevas=document.getElementById("canevas");
  //canevas.focus();
  var t=s.split(";");
  document.execCommand(t[0],false,"<"+t[1]+">");
  canevas.focus();
}

function fabPolice(s){
  var canevas=document.getElementById("canevas");
  //canevas.focus();
  var t=s.split(";");
  document.execCommand("fontSize",false,s);
  canevas.focus();
}




function positionAbsolute(){
  document.execCommand("2D-Position",false,true);
  var canevas=document.getElementById("canevas");
  if (fab.absolute){
    canevas.style.backgroundImage="";
    fab.absolute=false;
  }
  else {
    canevas.style.backgroundImage="url(img/grille.png)";
    fab.absolute=true;
  }
  var t=canevas.childNodes;
  if (fab.absolute){
    var left="", top="";
    for (var i=0; i<t.length; i++){
      if (t[i].tagName){	
	if(t[i].getAttribute("contenteditable"))
	  t[i].setAttribute("contenteditable","true");
	if (!t[i].style.top || 
	    (t[i].style.top==top && t[i].style.left==left)
	    ){
	  t[i].style.top=t[i].offsetTop-10+"px";
	  t[i].style.left=t[i].offsetLeft+"px";
	} else {
	  left=t[i].style.left;
	  top=t[i].style.top;
	}
	t[i].style.marginLeft="0";
      }
    }
    for (i=0; i<t.length; i++) 
      if (t[i].tagName){
	t[i].style.position="absolute";
	if ((t[i].getAttribute("class")!="tableur")&&
	    (t[i].style.textAlign=="center" 
	     || t[i].style.textAlign=="right"
	     || t[i].getAttribute("align")=="center"
	     || t[i].getAttribute("align")=="right"
	     || t[i].offsetWidth>900))
	  t[i].style.width="974px";
      }
  }
  else {
    for (var i=t.length-1 ; i>=0 ; i--){
      if (t[i].tagName){
	t[i].style.position="static";
	if (t[i].getAttribute("class")=="histo")
	  t[i].style.marginLeft="20%";
	if (marginAuto(t[i])){
	      //if (t[i].getAttribute("class")=="tab" || t[i].getAttribute("class")=="tabInv"){
	      t[i].style.marginLeft="auto";
	      t[i].style.marginright="auto";
	    }
	if(t[i].getAttribute("contenteditable"))
	  t[i].setAttribute("contenteditable","false");
      }
    }
  }
}

function marginAuto(e){
  var classe=e.getAttribute("class");
  if (classe=="tab" || classe=="tabInv" || classe=="svg")
    return true;
  /*
    var nom=e.tagName;
    if (nom=="svg")
    return true;
  */
  return false;
}

 
// Sauvegarde et restauration

var marqueurSauv=fabAccents("@`");


function fabCar(s,n,preserveGuillemet){
  c= s.charCodeAt(n);
  if (c==34 & !preserveGuillemet)
    //return "\\\"";
    //  ------ encore des gros pb d encodage ici (compatibilite ie ff webkit ...) -----------------------------
    return "&#34;";
 if ( c==38)
   return  "&#38;"
  if (c<127)
    return s.charAt(n);
  else
    return '&#'+c+';';
  // return((c == 38)? '&amp;' : ((c > 127)? '&#'+c+';' : n));
  /*return((c > 127)? '&#'+c+';' : n); - si pas besoin de remplacer & par &amp;*/  
}


function fabAccents(s,preserveGuillemet){ 
  var sprim="";
  for (var j=0; j<s.length ; j++)
    sprim+=fabCar(s,j,preserveGuillemet);
  s=sprim;
  return s;
}

function baliseUnique(x){
  var t=["input","br","hr"]
    for (var i in t)
      if (x==t[i])
	return true;
  return false;
}


function fabDom(elem,indent,sauvegarde){
  var i;
  var s="";
  var attr="";
  if (elem.tagName){
    if (elem.tagName=="p" && elem.childNodes.length==1){
      if (!elem.firstChild)
	return "";
      if (elem.firstChild.tagName=="br")
	return s;
      if (elem.firstChild.data){
	var t=elem.firstChild.data;
	if (t=="" || t.length==1 && t.charCodeAt(0)==160)
	  return s;
      }
    }
    s=indent+"<"+elem.tagName;
    var at=elem.attributes;
    var math=false;
    for (i in at){
      if (at[i].name){
	attr=at[i].name;
	if (attr.indexOf("xmlns",0)>=0)
	  math=true;
	if (!sauvegarde) {
	  if (attr.indexOf("tem",0)<0 &&
	      attr.indexOf("moz")<0 &&
	      attr!="_moz_dirty" &&
	      attr!="oncontextmenu" &&
	      attr!="contenteditable" &&
	      !(attr=="onfocus" && elem.getAttribute("id")=="listeExos"))
	    s+=" "+attr+"=\""+at[i].value+"\"";
	} else if (attr.indexOf("tem",0)<0 &&
		   attr.indexOf("moz")<0 &&
		   attr!="_moz_dirty" &&
		   attr!="complete")
	  s+=" "+attr+"=\""+at[i].value+"\"";
      }
    }
    if (elem.tagName=="math" && !math)
      s+=" xmlns='http://www.w3.org/1998/Math/MathML' ";
    var unique=baliseUnique(elem.nodeName);
    if (unique)
      s+="/>\n";
    else
      s+=">\n";
    if (elem.getAttribute("class")!="console" &&
	elem.getAttribute("class")!="tableur" &&
	elem.getAttribute("class")!="prog" &&
	elem.getAttribute("class")!="svg"){
      var t=elem.childNodes;
      for (i=0 ; i<t.length ; i++)
	s+=fabDom(t[i],indent+" ",sauvegarde);
    }
    if (!unique)
      s+=indent+"</"+elem.tagName+">\n";
  } 
  else if (elem.nodeValue 
	   &&  elem.nodeValue!="" 
	   &&  elem.nodeValue!=" " 
	   && elem.nodeValue!="\n"
	   ){
    s=indent+fabAccents(elem.nodeValue)+"\n";
  } 
  return s;
}

var fabDejaImprime=false;

function fabImprime(sauve){
  fabNettoie();
  fabExo(-2);
  if (!fabDejaImprime){
    var auteur=document.getElementById("auteur");
    auteur.value=prompt("Nom de l'auteur : ",auteur.value);
    fabDejaImprime=true;
  }
  if (!fenetre_impression){
    fenetre_impression=window.open("produits/impression.xhtml","impression");
  }
  var choixStyle=document.getElementById("choixStyle"); 
  document.getElementById("style").value=choixStyle.options[choixStyle.selectedIndex].text;
  var canevas=document.getElementById("canevas"); 
  var s="<div id='canevas'>\n";
  var t;
  for (i=0; i<canevas.childNodes.length ; i++){
    t=fabDom(canevas.childNodes[i],"");
    s+=t;
  }
  s+="</div>\n";
  s+="<input id='recepteurs' type='hidden' value='"+document.getElementById("recepteurs").value+"'/>\n";
  var form=document.getElementById("formImpr");
  if (sauve)
    form.setAttribute("action",fab.url+"sauve.php");
  else
    form.setAttribute("action",fab.url+"produits/impr.php");
  var input=document.getElementById("impr");
  input.value=s;
  s=document.getElementById("programmeXcas").value;
  input=document.getElementById("prog");
  input.value=s;
  input=document.getElementById("onload");
  s="";
  if (fab.onLoad!="")
    s+=fab.onLoad+";fab.nbElt="+fab.nbElt+";fabCadreSvg("+fab.xmin+","+fab.ymin+","+fab.xmax+","+fab.ymax+","+fab.h+");"+fabRestaureTableur();
  //alert(s);
  input.value=s;
  form.submit();
}



function fabEnregistrer() {
  if (!fabDejaImprime){
    alert("Il faut avoir previsualiser au moins une fois en cliquant sur l'oeil");
    return;
  }
  fabNettoie();
  if (window.ActiveXObject)
    alert("Sous internet explorer, un dialogue surgira en bas de page quand vous cliqurez sur \"OK\", vous devez y choisir l\'option \"Enregistrer sous\".");
  var form=document.getElementById("sauve");
  form.setAttribute("action",fab.url+"enregistrer.php");
  //form.setAttribute("action","enregistrer.php");
  var s="xhtml"+marqueurSauv;
  s+=fabAccents(document.getElementById("auteur").value+marqueurSauv);
  s+=fabAccents(document.getElementById("programmeXcas").value)+marqueurSauv;
  var canevas=document.getElementById("canevas");
  var t;
  for (var i in canevas.childNodes){
    t=fabDom(canevas.childNodes[i],"",true);
    // --------------------------------------- problemes sous FF et webkit voir ie ---------------------------
    // peut etre faut-il le reserver a IE
   // t=t.replace(/\"/g,"\\\"");
   //t=t.replace(/\\/g,"");
    s+=t;
  }
  s=s.replace(/\'/g,"'");
  s+=marqueurSauv+fab.onLoad+"fabInitialiseSvg("+fab.xmin+","+fab.ymin+","+fab.xmax+","+fab.ymax+","+fab.h+");";
  s+=marqueurSauv+fab.nbElt;
  s+=marqueurSauv+fab.console;
  s+=marqueurSauv+fab.tableur;
  s+=marqueurSauv;     
  if (fab.tableur){
    s+=fab.nb_lign;
    s+=marqueurSauv;
    s+=fab.nb_col;
    s+=marqueurSauv;
    //s+=fab.sauvTab;
    s+=fab.sauvTab.replace(/\"/g,"\\\"");
  }
  form.texte.value=s;
  form.submit();
}

// on uploade le fichier vers ouvrir.php
// et ouvrir.php renvoie
//<script> parent.retour_ouvrir(contenu du fichier uploadé,destination)


function fabOuvrir() {
  var form=document.getElementById("sauve"); 
  form.setAttribute("action",fab.url+"ouvrir.php");
  //form.setAttribute("action","ouvrir.php");
  form.submit();
}

function fabDemo(select) {
  var form=document.getElementById("sauve"); 
  form.setAttribute("action",fab.url+"demo.php");
  if (select.selectedIndex==0)
    return;
  var nom=select.options[select.selectedIndex].value;
  form.nom.value=nom;
  form.submit();
}


function retour_ouvrir(contenu) {
  //alert(1);
  document.getElementById("canevas").innerHTML="";
  contenu=contenu.replace(/\"/g,"\"");  // à cause des éventuels magic_quotes et addslashes
  contenu=contenu.replace(/\'/g,"'");  // à cause des éventuels magic_quotes et addslashes
  contenu=contenu.replace(/&&/g,"\n"); // on remet les sauts de ligne
  // extraction du contenu
  //alert(contenu);
  var tab=contenu.split(marqueurSauv);
  var i=0; 
  i++;
  if (tab[i]!="")
    document.getElementById("auteur").value=tab[i]; 
  i++;
  document.getElementById("programmeXcas").value="";
  if (tab[i]!=""){
    var reg=RegExp("&#34;","g");
    document.getElementById("programmeXcas").value=tab[i].replace(reg,"\"");

	}	
  i++;
  if (tab[i]!=""){
    var canevas=document.getElementById("canevas");
    canevas.innerHTML="";
    tab[i] = tab[i].replace(/mml:/g,"");
    //alert(tab[i]);
    canevas.innerHTML=tab[i];
  }
  i++;
  if (tab[i]!=""){
    fab.onLoad=tab[i];
    eval(tab[i]);
  }
  i++;
  if (tab[i]!="")
    fab.nbElt=parseInt(tab[i]);
  i++;
  if (tab[i]!="")
    fab.console=(tab[i]=="true");
  i++;
  if (tab[i]=="true"){//alert("tableur "+tab[i]);
    fab.tableur=(tab[i]=="true");
    i++;
    fab.nb_lign=tab[i];
    i++;
    fab.nb_col=tab[i];
    i++;
    fab.sauvTab=tab[i];  
    fab.sauvTab=fab.sauvTab.replace(/\\/g,"");
    //alert(fab.sauvTab);
    setTimeout("fab.feuilleCalc.restaure()",1000);
  }    
  vaEtVient("ouvrir");
  compile();
  fabActualiseDistributeur();
}


function vaEtVient(elem,visible){
  if (elem.charAt)
    elem= document.getElementById(elem);
  if (!elem.style.display){
    if (visible)
      elem.style.display="none";
    else
      elem.style.display="block";
  } else if (elem.style.display=="block")
    elem.style.display="none";
  else
    elem.style.display="block";
}

function colore(){
  var valeurs=["black","white","gray","red","yellow","blue","orange","purple","green"];
  var valeur=document.getElementById("couleur").selectedIndex;
  var valeurF=document.getElementById("couleur_fond").selectedIndex;
  document.execCommand("forecolor",false,valeurs[valeur]);
  document.execCommand("hilitecolor",false,valeurs[valeurF]);
}

function teste_couleur(){
  var valeurs=["black","white","gray","red","yellow","blue","orange","purple","green"];
  var valeur=document.getElementById("couleur").selectedIndex;
  var valeurF=document.getElementById("couleur_fond").selectedIndex;
  var test=document.getElementById("test_couleur");
  test.style.color=valeurs[valeur];
  test.style.backgroundColor=valeurs[valeurF];
}

function initialisePalette(valeur,valeurF){
  document.getElementById("couleur").selectedIndex=0;
  document.getElementById("couleur_fond").selectedIndex=1;
  teste_couleur();
}

// indentation automatique du programme


function accoladeOuvrante(s){
  var acc=[
	   /\{[\(\s]/i, 
	   /\balors[\(\s]/i,
	   /\bsinon[\(\s]/i,
	   /\bfaire[\(\s]/i,
	   /\brepeter[\(\s]/i,
	   ];
  var i,j=-1;
  for (i in acc)
    if (s.search(acc[i])>-1)
      j=i;
  return j;
}

function accoladeFermante(s,j){
  //   /\}[\(\s]/i,
  if (!j)
    return false;
  if (j==-1)
    return false;
  var acc=[
	   /\}[;\(\s]|/i,  
	   /\bsinon[\(\s]/i,
	   /\bfsi[;\(\s]/i,
	   /\bfpour[;\(\s]/i,
	   /\bjusqua[\(\s]/i,
	   /\bftantque[;\(\s]/i,

	   ];
  var i,k=-1;
  for (i in acc)
    if (s.search(acc[i])>-1)
      k=i;
  if (k==j)
    return true;
  if (j==1 && k==2 || j==3 && k==5)
    return true;
  return false; 
} 


function contientMotCle(s){
  var motCles=[
	       /\bif[\(\s]/i,
	       /\belse[\r\{\s]/i,
	       /\bfor[\(\s]/i,
	       /\bwhile[\(\s]/i,
	       /\bfunction\b/i,
	       /\bsi[\(\s]/i,     
	       /\balors[\(\s]/i,
	       /\bsinon[\(\s]/i,
	       /\bpour[\(\s]/i,
	       /\brepeter[\(\s]/i,
	       /\btantque[\(\s]/i,
	       /\bfaire[\(\s]/i,
	       ];
  var i;
  for (i in motCles)
    if (s.search(motCles[i])>-1)
      return true;
  return false;
}


function indente(){
  var lignes=new Array();
  var script=document.getElementById("programmeXcas");
  var prog=script.value;
  script.value="";
  lignes=prog.split(new RegExp("\n","g"));
  var i=0,j;
  while (i<lignes.length){
    lignes[i] = lignes[i].replace(/^\s*|\s*$/,"");
    if (lignes[i]=="")
      lignes.splice(i,1);
    else {
      lignes[i]+="\n";
      i++;
    }
  }
  while (lignes[lignes.length-1]=="")
    lignes.pop();
  var deca=0;
  var accOuv=[-1];
  var blanc,ouvre,ferme, mot=false;
  for (i=0 ; i<lignes.length ; i++){
    ferme=accoladeFermante(lignes[i],accOuv[deca]);
    if (ferme && deca>0){
      deca--;
      accOuv.pop();
    }
    blanc="";
    for (j=0; j<deca ; j++)
      blanc+="  ";
    if (ouvre==-1 && mot)
      script.value+=blanc+" "+lignes[i];
    else
      script.value+=blanc+lignes[i];
    mot=contientMotCle(lignes[i]);
    ouvre=accoladeOuvrante(lignes[i]);
    if (ouvre>-1){
      deca++;
      accOuv.push(ouvre);
    }  
  }
}








