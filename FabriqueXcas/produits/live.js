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
//   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA


var xc=new xcas();

function fabChapeau(elt,ev){
  if (window.ActiveXObject)
    return;
  // correction du bug sur les saisie d exposant
  var i,reg,s;
  s=elt.value;
  reg=RegExp(String.fromCharCode(178),"g");
  s=s.replace(reg,"^2");
  reg=RegExp(String.fromCharCode(179),"g");
  s=s.replace(reg,"^3");
  for(i=4 ;i<10;i++){
    reg=RegExp(String.fromCharCode(i+8304),"g");
    s=s.replace(reg,"^"+i);
  }
  elt.value=s;
   elt.focus();
}

function fab(){
}


fab.exos=false;
fab.actionExo="fabDistribue()";
fab.sauvTab="";
fab.nb_lign="";
fab.nb_col="";
fab.marqueurTab="@@";

function fabExo(direction){
  var s,t,tLi,tCol;
  var listeExo=document.getElementById("listeExos");
  if (!listeExo)
    return;
  if (!fab.exos ||xcasBase.isIE ){
    s=listeExo.getAttribute("liste");
    fab.exos=s.split(new RegExp("`","g"));
  }
  var index=listeExo.getAttribute("index");
  if (direction==-2) {
    // on revient au premier exercice
    index=1;
    direction=-1;
  }
  if (direction==1 && fab.exos.length>1 && index>=fab.exos.length-1)
    return;
  fabNettoie(document.getElementById("canevas"));
  if (direction!=0){
    if (fab.nbElt && fab.feuilleCalc){
      if (fab.sauvTab!="")
	t=fab.sauvTab.split(fab.marqueurTab);
      else
	t=new Array(); 
      if (index==t.length && fab.id){    //fab.id teste si on est sous la fabrique
	if (fab.sauvTab!=""){
	  fab.sauvTab+=fab.marqueurTab;
	  fab.nb_lign+=fab.marqueurTab;
	  fab.nb_col+=fab.marqueurTab;
	}
	fab.sauvTab+=fab.feuilleCalc.sauvegarde;
	fab.nb_lign+=fab.feuilleCalc.nb_lign;
	fab.nb_col+=fab.feuilleCalc.nb_col;
      }
    }
  }
  if (direction==-1 && index>0)
    index--;
  else if(direction==1) {
    if (index<fab.exos.length-1 && fab.exos[index]!=""
	|| fab.id && fab.feuilleCalc
	|| fab.feuilleCalc && index<t.length-1)   
	index++;
  }
  else if (direction==0) {
    fab.exos[index]=listeExo.value;
    listeExo.setAttribute("liste",fab.exos.join(";"));
  }
  listeExo.value=fab.exos[index];
  listeExo.setAttribute("index",index); 
  listeExo.blur();
  fabEditeExos(false,listeExo);
  fabSimuleChange();
  if (fab.sauvTab && fab.sauvTab!=""){
      t=fab.sauvTab.split(fab.marqueurTab);
      tLi=fab.nb_lign.split(fab.marqueurTab);
      tCol=fab.nb_col.split(fab.marqueurTab);
      if (index<t.length){
	fab.feuilleCalc.sauvegarde=t[index];
	fab.feuilleCalc.nb_lign=tLi[index];
	fab.feuilleCalc.nb_col=tCol[index];
	fab.feuilleCalc.restaure();
      }
      else {
	if (fab.id) // on est sous la fabrique
	  fab.feuilleCalc.vide();  	
      }    
  }
  if (!fab.id){
    var numexo=document.getElementById("numexo");
    index++;
    var text=document.createTextNode("Question "+index+"/"+fab.exos.length);
    while (numexo.firstChild)
      numexo.removeChild(numexo.firstChild);
    numexo.appendChild(text);
  }
}

function fabEditeExos(modeEdition,listeExo){
  if (modeEdition)
    listeExo.style.backgroundColor="yellow";
  else
    listeExo.style.backgroundColor="white";
  var action=listeExo.getAttribute("onchange");
  var actionEd="fabExo(0,this)";
 // if (action!=actionEd)
   // fab.actionExo=action;
  if (modeEdition)
    listeExo.setAttribute("onchange",actionEd);
  else {
    listeExo.setAttribute("onchange",fab.actionExo);
  }
  window.status="onchange : "+listeExo.getAttribute("onchange")+ "modeEdition : "+modeEdition+" "+fab.actionExo;
}


function fabSimuleChange(){
  var listeExo=document.getElementById("listeExos");
  if (xcasBase.isIE)
    fabDistribue();
  else {
    var evt = document.createEvent("MutationEvents");
    evt.initMutationEvent("change", true, true, listeExo,
		       0, 0, 0, 0, 0, false, false, false, false, 0, null);
   listeExo.dispatchEvent(evt);
  }
}


function fabNettoie(elem){
  if (!elem)
    return;
  if (elem==document.getElementById("listeExos"))
    return;
  if (elem.getAttribute){
    var classe=elem.getAttribute("class");
    if (classe=="sortie" || classe=="sortieDL" || classe=="histo"){
      while(elem.firstChild)
	elem.removeChild(elem.firstChild);
      elem.appendChild(document.createTextNode(" ..."));
    }
  }
  if (elem.value && elem.getAttribute("type")!="button")
    elem.value="";
  var t=elem.childNodes;
  for (i in t)
    fabNettoie(t[i]);
}

function fabNettoyeur(id){
  if (!id)
    return;
  var elem=document.getElementById(id);
  if (!elem)
    return;
  while (elem.firstChild)
    elem.removeChild(elem.firstChild);
}

function fabDistribue(){
  var listeExos=document.getElementById("listeExos");
  s=listeExos.getAttribute("recepteurs");
  var recepteurs;
  if (s)
    recepteurs=s.split(" ");
  else
    recepteurs=[""];
  s=listeExos.value;
  var emetteurs=s.split(" ");
  var elt;
  for (i in emetteurs){
    if (i<recepteurs.length)
      fabNettoyeur(recepteurs[i]);
   // if (i<emetteurs.length){
    if (emetteurs[i].charAt(0)!="$")
      xc.nonEval(emetteurs[i]);
    else 
      xc.eval(emetteurs[i].substr(1));
    
      xc.imprimeMml(recepteurs[i],0,true,true);  
   // } else 
    xc.eval(emetteurs[i]);
    xc.imprimeSvg(fab.graphique,true,true); 
  }
}

function fabCadreSvg(xmin,ymin,xmax,ymax,h){
  var svg=document.getElementById("svg");
  if (!svg)
    return;
  var w=h*(xmax-xmin)/(ymax-ymin); 
  svg.style.width=w+2.6+"cm";
  svg.style.height=h+2.1+"cm";
  fabNettoyeur('svg');
  fab.graphique=new xcasSvg('svg',w+2.5,h+2,w,h);//xmax-xmin,ymax-ymin);
  fab.graphique.svgGrid(xmin,ymin,xmax,ymax);
}

function fabInitialiseSvg(xmin,ymin,xmax,ymax,h){
  fab.xmin=xmin;
  fab.ymin=ymin;
  fab.xmax=xmax;
  fab.ymax=ymax;
  fab.h=h;
  fabCadreSvg(fab.xmin,fab.ymin,fab.xmax,fab.ymax,fab.h);
}

