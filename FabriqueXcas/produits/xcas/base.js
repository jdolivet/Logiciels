//   Copyright (C) 2009 J-P Branchard <Jean-Pierr.Branchard@ac-grenoble.fr>
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

function xcasBalise(){
  var xcas=document.getElementsByTagName("script");
  var i;
  for (i=0 ; i<xcas.length ; i++){
    if (xcas[i].getAttribute("language")=="xcas")
       xcasRequete(xcas[i].innerHTML);
  }
}

// inclusion feuille de style
function xcasInclureStyle(fileName){
  var link= document.createElement("link");
  link.type = "text/css"; 
  link.href =fileName;
  link.rel="stylesheet";
  var head=document.getElementsByTagName("head");
  if (head[0])
    head[0].appendChild(link);
  return;
}

// classe xcasbase et ses methodes
function xcasBase(){
  this.index;
  // serveur xcas :
 // if (!xcasBase.isOpera)
    this.url="http://www.xcasenligne.fr/fabrique/";
 //else
   // this.url="giac_online/fabrique/";

 // this.url="http://vds1100.sivit.org/giac/labomep/"
 //this.url="http://localhost/giac_online/fabrique/"; 
  
  // Methodes de xcasBase
  this.initialise=function(){
    this.index=xcasBase.listeElements.length;
    xcasBase.listeElements.push(this);
  }
  
  // inclusion de programmes javascript
  this.include=function(fileName){
    if (!document.getElementsByTagName){
      alert ("Chargement des modules impossible");
      return;
    }
    var script = document.createElement("script");
    script.type = "text/javascript"; 
    script.src =fileName;
    var head=document.getElementsByTagName("head");
    if (head[0])
      head[0].appendChild(script);
    return;
  }

  this.includeStyle=function(fileName){
    xcasInclureStyle(fileName);
  }

  this.fleche=function(ev){
    if (ev.keyCode!=FLECHE_HAUTE && ev.keyCode != FLECHE_BASSE)
      return;
    var input=document.getElementById("in");
    if (ev.keyCode==FLECHE_HAUTE && indexTabHisto>0){
      indexTabHisto--;
      input.value=tabHisto[indexTabHisto];
    }
    if (ev.keyCode==FLECHE_BASSE && indexTabHisto<tabHisto.length){
      indexTabHisto++; 
      if (indexTabHisto<tabHisto.length)
	input.value=tabHisto[indexTabHisto];
      else 
	input.value="";
    }
    return;
  }


  this.reqInit=function(){
    var req;
    if(window.XMLHttpRequest){
      req = new XMLHttpRequest(); 
    }
    else if(xcasBase.isIE) 
      //req = new ActiveXObject("Microsoft.XMLHTTP"); 
      req = new XMLHttpRequest(); 
    else { 
      alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest..."); 
      return; 
    } 
    return req;
  }

  this.reqG=function(s, url,option,xx,yy){
   //alert("s="+" url="+url+" option="+option);
    var i,reg;
    // correction du bug sur les saisie d exposant
    for(i=4 ;i<10;i++){
      reg=RegExp(String.fromCharCode(i+8304),"g");
      s=s.replace(reg,"^"+i);
    }
    var i;
    if (!s)
      return "";
    var reg=RegExp("\'","g");
    s=s.replace(reg,"\"");
    var req=new this.reqInit();
    url=this.url+url;
    try {
       req.open('post',url, false);
    }
    catch(err) {
       var txt="Erreur\n\n";
       txt+="Acces refuse au serveur XCAS en ligne.\n\n";
       txt+="Il faut activer l'acces aux sources de donnees sur plusieurs domaines dans les parametres de securite de votre navigateur.\n\n";
       alert(txt);
  }
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    try {
      req.send("option="+encodeURIComponent(option)+"&in="+encodeURIComponent(s)
	       +"&session_id="+encodeURIComponent(xcasBase.session_id)
	       +"&xx="+encodeURIComponent(xx)
	       +"&yy="+encodeURIComponent(yy));
    }
    catch(err) {
      alert(err);
    }
    var s=req.responseText; 
    for(i=0;i<xcasBase.htmlSymbols.length;i++){
      reg=RegExp(xcasBase.htmlSymbols[i],"g");
      s=s.replace(reg,xcasBase.utfSymbols[i]);
    }
    return s;
  }



  this.reqGiac=function(s){
   return s= this.reqG(s,"giac_interface.php","text");
 //return s= this.reqG(s,"test.php","text");
  }

  this.reqLabomep=function(s){
    return this.reqG(s,"giac_interface.php","labomep");
  }

  this.reqProg=function(s){
    return this.reqG(s,"giac_interface.php","prog");
  }

  this.reqMath=function(s){
    return this.reqG(s,"giac_interface.php","math");
  }

  this.reqTableur=function(s){
    var s=this.reqG(s,"giac_interface.php","spread");
   //alert(s);
    return s;
  }

  this.reqSVG=function(s){
    var s=this.reqG(s,"giac_interface.php","svg");
    return s;
  }

  this.reqMathSVG=function(s){
    return this.reqG(s,"giac_interface.php","text_math_svg");
  }

  this.reqSVGgrid=function(s,xx,yy){
    var s= this.reqG(s,"giac_interface.php","svg_grid",xx,yy);
    return s;
  }

  // explore le dom et construit un clone pour Opera
  this.exploreDom=function(node,clone){
    var node1;
    if (node.tagName){
        node1=this.createElementMathML("mml:"+node.tagName);
    }
    else
      node1=document.createTextNode(node.nodeValue);
    clone.appendChild(node1);
    var fils=node.firstChild;
    while (fils){
      this.exploreDom(fils,node1);
      fils=fils.nextSibling;
    }
    return clone;
  }

  // affiche le resultat en mathml
  this.createElementMathML=function(t) {
    if (xcasBase.isIE) return document.createElement("mml:"+t);
    else return document.createElementNS(xcasBase.mathmlURL,t);
  }

  this.insereMathML=function(id,s,inline,remplace){
    if (inline)
      display="inline";
    else
      display="block";
    if(xcasBase.isIE){
      var reg=RegExp("<","g");
      s=s.replace(reg,"<mml:");
      reg=RegExp("<mml:/","g");
      s=s.replace(reg,"</mml:");
      s="<mml:maction actiontype='link' dsi:href=''><mml:mrow>"+s+"</mml:mrow></mml:maction>";
      var mml = document.createElement("mml:math");
      mml.innerHTML+=s;
    } else if (xcasBase.isFirefox){
      var range = document.createRange();
      var mml=this.createElementMathML("math");
      // plantage avec opera ICI
      range.selectNodeContents(mml);
      var fragment = range.createContextualFragment(s);
      mml.appendChild(fragment);
    } else if (xcasBase.isOpera){
      var range = document.createRange();
      var brouillon=createElementMathML("math");
      var fragment = range.createContextualFragment(s);
      brouillon.appendChild(fragment);
      var mml=createElementMathML("mml:math");
      mml=this.exploreDom(brouillon,mml);
    } else if (xcasBase.isWebKit){
      var mml=this.createElementMathML("math");
      var mml2=document.createElement("span");
      mml2.innerHTML=s;
      mml=this.exploreDom(mml2,mml);
    }
    mml.setAttribute("display",display);
    mml.setAttribute("index",this.index);
    if (xcasBase.isIE)
      mml.update();
    if (remplace){
      while(id.firstChild)
	id.removeChild(id.firstChild);
    }
    id.appendChild(mml);
    return mml;
  }

  this.calcule=function(s){
    var sr=this.reqGiac(s);
    // rustine pour IE
    if (xcasBase.isIE)
      sr=sr.replace(new RegExp("``","g"),"` `");
    var t=sr.split(new RegExp("`","g"));
    xcasBase.session_id=t[0];
    return t[1];
  }


  this.calculeMml=function(s,conteneur,inline,remplace){
    var sr=this.reqGiac(s);
    // rustine pour IE
    if (xcasBase.isIE)
      sr=sr.replace(new RegExp("``","g"),"` `");
    var t=sr.split(new RegExp("`","g"));
    xcasBase.session_id=t[0];
    // on affiche le resultat en mathml  
    var mml=this.insereMathML(conteneur,t[2],inline,remplace);
    if (mml.scrollIntoView)
      mml.scrollIntoView(false); 
    return t[1];
  }

  this.createElement=function(type){
    var elt=document.createElement(type);
    elt.setAttribute("index",this.index);
    return elt;
  }

  this.element=function(type,cible,classe){
    var elem=document.createElement(type);
    if (classe)
      elem.className=classe;
    cible.appendChild(elem);
    return elem;
  }

  this.elementIndexe=function(type,cible,classe){
    var elem=this.createElement(type);
    if (classe)
      elem.className=classe;
    cible.appendChild(elem);
    return elem;
  }

}
// ------------ fin fonction xcasBase


// Constantes


xcasBase.isIE = window.ActiveXObject;
xcasBase.isOpera=(navigator.appName=="Opera");
xcasBase.isFirefox=(navigator.userAgent.indexOf('Gecko')>-1 && navigator.userAgent.indexOf('KHTML')==-1);
xcasBase.isWebKit=(navigator.userAgent.indexOf('AppleWebKit/') > -1 || navigator.userAgent.indexOf('KHTML')>-1);
if (xcasBase.isIE &&document.documentMode==9) {
  xcasBase.isIE=false;
  xcasBase.isWebKit=true
}

xcasBase.mathmlURL = "http://www.w3.org/1998/Math/MathML";
xcasBase.svgURL="http://www.w3.org/2000/svg";

xcasBase.htmlSymbols=["&int;","&Integral;","&Sigma;","&part;","&nbsp;",
		      "&rarr;","&VerticalBar;","&deg;","&infin;","&InvisibleTimes;",
		      "&pi;","&le;","&ge;","\""];
xcasBase.utfSymbols=["\u222B","\u0222B","\u03A3","\u2202","\u0020",
		     "\u2192","|","\u000B0","\u221E","", 
		     "\u03C0","\u2264","\u2265","'"];

xcasBase.FLECHE_HAUTE=38;
xcasBase.FLECHE_BASSE=40; 
xcasBase.FLECHE_GAUCHE=37;
xcasBase.FLECHE_DROITE=39; 
xcasBase.CTRL_M=77; 
xcasBase.ENTREE=13;
xcasBase.session_id="";


if (xcasBase.isWebKit)
  xcasInclureStyle("xcas/mathml.css");

function xcasOpacite(objet,opaque){
  var IEopacite, opacite;
  if (opaque) {
    IEopacite="100";
    opacite=1;
  } else {
    IEopacite="60";
    opacite=0.6;
  }
  if (xcasBase.isIE)
    objet.style.filter="alpha(opacity="+IEopacite+")";
  else
    objet.style.opacity=opacite;
}



// liste des objets crees
xcasBase.listeElements=new Array();

function xcasElement(elt){
  return xcasBase.listeElements[parseInt(elt.getAttribute("index"))];
}

function xcasInsereTexte(texte,tag,cible){
  var tag=document.createElement(tag);
  text=document.createTextNode(texte);
  tag.appendChild(text);
  cible.appendChild(tag);
}


// fonctions de requetes

function xcasRequete(s){
  var x=new xcasBase();
  return x.calcule(s);
}

// pour éviter que l'utlisateur attende la premiere reponse :
xcasRequete("0");

function xcasRequeteMml(s,conteneur,inline,remplace){
  if (typeof conteneur == typeof "a")
    conteneur=document.getElementById(conteneur);
  var x=new xcasBase();
  return x.calculeMml(s,conteneur,inline,remplace);
}



// autres classes
// leurs methodes sont dans des fichiers annexes

xcas.prototype=new xcasBase;

function xcas(){
  this.parent=xcasBase;
  this.parent();
  this.commande="";
  this.retours=new Array();
  this.retoursMml=new Array();
  this.retoursSvg=new Array();
  this.mmlEnLigne=false;
  this.remplaceMml=false;
  this.remplaceSvg=false;
  this.couleurs=new Array();
  this.couleurSvg="black";
  this.colors=new Array();
  this.colors["noir"]="black";
  this.colors["blanc"]="white";
  this.colors["gris"]="gray";
  this.colors["rouge"]="red";
  this.colors["jaune"]="goldenrod";
  this.colors["bleu"]="darkblue";
  this.colors["orange"]="darkorange";
  this.colors["violet"]="purple";
  this.colors["vert"]="green";
  return this;
}


xcas.prototype.argument=function(arg){
  var elem=document.getElementById(arg);
  if (!elem){
    /*alert("ATTENTION : l'element "+arg+" n\'existe pas");*/
    return arg;
  }
  switch (elem.tagName.toLowerCase()){
    case "input":
    return elem.value;
    case "select":
    return elem.selectedIndex;
    case "div":
    return elem.getAttribute("texte");
    case "p":
    return elem.getAttribute("texte");
    case "span":
    return elem.getAttribute("texte");
  }
}

  xcas.prototype.eval=function(){
  var i;
  // synthese de la commande
  this.commande="";
  if (arguments.length>0){
    this.commande=arguments[0];
    if (arguments.length>1){
      this.commande+="("+this.argument(arguments[1]);
      for (i=2 ; i<arguments.length ; i++)
	this.commande+=","+this.argument(arguments[i]);
      this.commande+=")";
    }
  }
  var sr;
  sr=this.reqLabomep(this.commande);
  var tr=sr.split(new RegExp("`SVG","g"));
  var t=tr[0].split(new RegExp("`","g"));
  var r=t[1].split(new RegExp(",","g"));
  // traitement des couleurs
  this.couleurs=new Array();
  this.retours=new Array();
  this.retoursMml=new Array();
  var c;
  for (i=0;i<r.length;i++){
    c=this.couleur(r[i]);
    if (c[0])
      this.couleurs.push(c[1]);
    else {
      this.retours.push(r[i]);
      this.retoursMml.push(t[i+2]);
      if (i>this.couleurs.length)
	this.couleurs.push("black");
    }
  }
  //graphique eventuel
  this.retoursSvg=new Array();
  t=tr[1].split(new RegExp("`","g"));
  if (t[0] && t[0] != "" && t[0]!=" " 
      && t[0] != "error" 
      && t[0]!="undef")
    this.retoursSvg=t;
  return sr;
}


xcas.prototype.evalSvg=function(){
  var i;
  // synthese de la commande
  this.commande="";
  if (arguments.length>0){
    this.commande=arguments[0];
    if (arguments.length>1){
      this.commande+="("+this.argument(arguments[1]);
      for (i=2 ; i<arguments.length ; i++)
	this.commande+=","+this.argument(arguments[i]);
      this.commande+=")";
    }
  } 
  var sr;
  sr=this.reqSVG(this.commande); 
  var t=sr.split(new RegExp("`","g"));
  //this.retours=t[1].split(new RegExp(",","g"));
  this.retoursSvg=new Array();
  for (i=1; i<t.length ; i++)
    this.retoursSvg.push(t[i]);
  return sr;
}



xcas.prototype.nonEval=function(){
  this.couleurs=new Array();
  var i;
  // synthese de la commande
  this.commande="";
  if (arguments.length>0){
    this.commande=arguments[0];
    if (arguments.length>1){
      this.commande+="("+this.argument(arguments[1]);
      for (i=2 ; i<arguments.length ; i++)
	this.commande+=","+this.argument(arguments[i]);
      this.commande+=")";
    }
  }
  var sr;
  sr=this.reqMath(this.commande);
  var t=sr.split(new RegExp("`","g"));
  this.retours=t[1].split(new RegExp(",","g"));
  this.retoursMml=new Array();
  for (i=2; i<t.length ; i++)
    this.retoursMml.push(t[i]);
 //alert(t);
  return sr;
}



xcas.prototype.imprimeEnLigne=function(enLigne){
    this.mmlEnLigne=enLigne;
}

xcas.prototype.remplaceQuandImprime=function(remplace){
    this.remplaceMml=remplace;
    this.remplaceSvg=remplace;
}

xcas.prototype.couleur=function(s){
  if (s.length<3)
     return [false,s];
  var t=s.substring(1,s.length-1);
  if (this.colors[t])
    return [true, this.colors[t]];
  if (t.charAt(0)=="#")
    return [true,t];
  return [false,s];
    
}

xcas.prototype.imprimeMml=function(conteneur,i,enLigne,remplace){
  if (conteneur=="")
    return;
  if (this.retoursMml.length==0)
    return;
  if (typeof conteneur == typeof "a")
    conteneur=document.getElementById(conteneur);
  //alert("conteneur : "+conteneur);
  if (!conteneur)
    return;
  if (enLigne!=null)
    this.mmlEnLigne=enLigne;
  // specifique a la fabrique
  if (conteneur.getAttribute("horsligne"))
    this.mmlEnLigne=false;
  if (remplace!=null)
    this.remplaceMml=remplace; 
  if (!i)
    var i=0;
  if (i>this.retoursMml.length)
    i=retoursMml.length-1;
  if (this.retours[i]==null || this.retours[i]=="SVG" || i>0 &&this.retours[i-1]=="SVG" )
    return;
  conteneur.setAttribute("texte",this.retours[i]);
  var mml=this.insereMathML(conteneur,this.retoursMml[i],this.mmlEnLigne,this.remplaceMml);
 //alert(i+this.couleurs+this.retours);
  conteneur.style.color=this.couleurs[i];
  if (!this.remplaceMml){
    var hr=document.createElement("hr");
    conteneur.appendChild(hr);
    hr.scrollIntoView(false);
  }
  if (fab.id && 
      conteneur.getAttribute("class")=="sortie"){ // on est sous la fabrique
    //alert(conteneur.getAttribute("class"));
    var h=parseInt(conteneur.style.height);
    if (isNaN(h))
      h=0;
    conteneur.style.height="auto";
    conteneur.style.lineHeight="auto";
    var ht=conteneur.offsetHeight;
    //alert(h+" "+ht);
    if (ht>h+2){
      conteneur.style.height=ht+"px";
      //conteneur.style.lineHeight=conteneur.style.height;
    } 
    else{
      conteneur.style.height=h+"px";
      //conteneur.style.lineHeight=conteneur.style.height;
    } 
  }
}


xcas.prototype.imprimeSvg=function(xcSvg,remplace,protege){
  if (!xcSvg)
    return;
  if (remplace!=null)
    this.remplaceSvg=remplace;
  if (protege==null)
    protege=false;
  var couleur="black";
  if (this.couleurs.length>this.retours.length)
    couleur=this.couleurs[this.couleurs.length-1];
  xcSvg.insere(this.retoursSvg[0],"figures",couleur,this.remplaceSvg,protege);
  xcSvg.insere(this.retoursSvg[1],"legende",couleur,this.remplaceSvg,protege);
}

//xcasConsole : envoyer des requetes xcas et afficher les reponses

xcasConsole.prototype=new xcasBase;

function xcasConsole(id, message){
  this.parent=xcasBase;
  this.parent();
  this.include("xcas/console.js");
  this.includeStyle("xcas/console.css");
  this.initialise();
  if (id){
    var console;
    if (typeof id==typeof "a")
      console=document.getElementById(id);
    else
      console=id;
    //console.setAttribute("class","console");
	console.className="console";
    if (message) 
      xcasInsereTexte(message,"p",console);
    this.histo=document.createElement("div");
    console.appendChild(this.histo);
    this.input=this.createElement("input");
    this.input.onkeydown=function(event){this.blur();this.focus();xcasElement(this).valide(event)};
    console.appendChild(this.input);
    console.setAttribute("index",this.index);
    console.onclick=function(){xcasElement(this).input.focus()};
    this.input.focus();
    this.tabHisto=new Array();
  }
}

//xcasProg : console + programmation xcas

xcasProg.prototype=new xcasConsole();

function xcasProg(id, message){
  this.parent=xcasConsole;
  var console=document.createElement("div");
  this.parent(console,message);
  this.includeStyle("xcas/prog.css");
  var bloc=document.getElementById(id);
  bloc.className="prog";
  bloc.appendChild(console);
  this.changeScript=false;
  this.script=this.createElement("textarea");
  this.script.value="//Tapez le programme ici\n";
  this.script.onclick=function(event){xcasElement(this).changeScript=true};
  this.script.onkeypress=function(event){this.blur();this.focus()};

  bloc.appendChild(this.script);
 if (xcasBase.isIE){
     console.style.display="inline"; 
     this.script.style.width="59%";
  }
}


xcasTableur.prototype=new xcasBase;

function xcasTableur(id, nLi, nCol, cellule){
  if (!cellule)
    cellule="A0";
  this.parent=xcasBase;
  this.parent();
  this.include("xcas/tableur.js");
  this.includeStyle("xcas/tableur.css");
  this.initialise();
  var bloc=document.getElementById(id);
  //bloc.setAttribute("class","tableur");
  bloc.className="tableur";
  var i,j;
  this.outils=this.element("div",bloc,"outils");
  this.tabCell=this.element("b",this.outils);
  this.tabCell.appendChild(document.createTextNode("A0"));
  this.entree=this.elementIndexe("input",this.outils);
  this.entree.onkeyup=function(event){xcasElement(this).modeSaisie(event);};
  this.entree.onkeydown=function(event){this.blur();this.focus();xcasElement(this).ctrl(event);};
  this.cell=function(cellule){ 
    if (this.saisie){
      this.entree.focus();
      this.entree.value+=cellule;
      return;
    }
    var domCellule=document.getElementById(this.cellActive);
    domCellule.style.backgroundColor="white";
    domCellule.style.color="black";
    this.cellActive=cellule;
    domCellule=document.getElementById(this.cellActive);
    domCellule.style.backgroundColor="#ffff99";
    this.tabCell.firstChild.nodeValue=cellule;
    var formule=domCellule.getAttribute('formule');
    if (formule &&  formule!="null")
      this.entree.value=formule;
    else
      this.entree.value="";
    this.entree.focus();
  }

  this.insereOutil=function(src,cible,titre,fonction,param){
    if (!param)
      var param="";
    var a=this.element("a",this.outils);
    a.setAttribute("title",titre);
    a.onmouseover=function(){xcasOpacite(this,false)};
    a.onmouseout=function(){xcasOpacite(this,true)};
    img=this.elementIndexe("img",a);
    img.setAttribute("src","xcas/img/"+src+".gif");
    img.onclick=function(){eval("xcasElement(this)."+fonction+"("+param+")")};
    // modif pour fabrique
    //img.setAttribute("onclick","xcasElement(this)."+fonction+"("+param+")");
    a.appendChild(img);
  }
  
  
  this.coordonnees=function(cellule){
    //alert(cellule);
    var s=cellule.slice(1);
    return [cellule.charAt(0), parseInt(s)];
  }
  
  this.cell_max=function(cellule){
    var t=this.coordonnees(cellule);
    var A="A";
    this.nb_col_sauv=this.nb_col;
    this.nb_lign_sauv=this.nb_lign;
    this.nb_lign=Math.max(this.nb_lign,t[1]+1);
    this.nb_col=Math.max(this.nb_col,Number(t[0].charCodeAt(0))-A.charCodeAt(0)+1);
    return;
  }

  // des soucis avec "button" sous ie
  var ok=this.elementIndexe("span",this.outils);
  ok.appendChild(document.createTextNode("OK"));
  ok.onclick=function(){xcasElement(this).fill_cell(false);};
  //ok.setAttribute("onclick","xcasElement(this).fill_cell(false);");
  var annul=this.insereOutil("annul",this.outils,"annuler","annule");
  var gomme=this.insereOutil("gomme",this.outils,"Vider la feuille","vide");
  var bas=this.insereOutil("bas",this.outils,"Copier vers le bas","fill_bottom");
  var droit=this.insereOutil("droit",this.outils,"Copier vers la droite","fill_right");
  var initial=this.insereOutil("initial",this.outils,"Recalculer","fill_cell",true);
  var conteneur=this.element("div",bloc,"conteneur");
  var tableau=this.element("div",conteneur,"tableau");
  var table=this.element("table",tableau);		
  this.table=this.element("tbody",table);  
  var A="A";
  var tr,td;
  tr=this.element("tr",this.table);
  td=this.element("td",tr,"col1");
  this.lettres=new Array();
  for (j=0 ; j<nCol ; j++) {
    td=this.element("th",tr);
    this.lettres.push(String.fromCharCode(A.charCodeAt(0)+j));
    td.appendChild(document.createTextNode(this.lettres[j]));
  }
  for (i=0;i<nLi;i++){
    tr=this.element("tr",this.table);
    td=this.element("th",tr,"col1");
    td.appendChild(document.createTextNode(i));
    for (j=0 ; j<nCol ; j++) {
      td=this.elementIndexe("td",tr);
      td.setAttribute("id",this.lettres[j]+i);
      td.onclick=function(){xcasElement(this).cell(this.id)};
      //modif pour fabrique
      //td.setAttribute("onclick","xcasElement(this).cell(this.id)");
    }
  }
  this.cellActive="A0";
  this.saisie=false;
  this.cell("A0");
  this.n_lign=nLi;
  this.n_col=nCol;
  this.nb_lign=0;
  this.nb_col=0;
  this.sauvegarde="";
  this.nb_lign_sauv;
  this.nb_col_sauv;
  this.ref_copy;
  this.form_copy;
  this.cell_marquees=new Array();
  // remplissage
  var coord=this.coordonnees(cellule);
  var lettre;
  var cell, t, formule;
  for (i=4 ; i<arguments.length; i++){
    lettre=coord[0];
    formule=arguments[i]+"";
    t=formule.split(new RegExp(";","g"));
    for (j in t){
     cell=document.getElementById(lettre+coord[1]);
     this.cell_max(lettre+coord[1]);
     lettre=String.fromCharCode(lettre.charCodeAt(0)+1);
     cell.setAttribute("formule",t[j]);
     cell.appendChild(document.createTextNode(t[j]));
    }
    coord[1]++;
  }
  return this;
}

xcasSvg.prototype=new xcasBase;

function xcasSvg(id,largeur,hauteur,X,Y){
  this.parent=xcasBase;
  this.parent();
  this.include("xcas/svg.js");
  //this.includeStyle("xcas/svg.css");
  this.initialise();
  this.NS="http://www.w3.org/2000/svg";
  if (id){
    id=document.getElementById(id);
    this.svg=document.createElementNS(this.NS,"svg");
    this.svg.setAttribute("width",largeur+"cm");
    this.svg.setAttribute("height",hauteur+"cm");
    this.X=X;
    this.Y=Y;
    id.appendChild(this.svg);
  }
}

xcasSvg.prototype.exploreDomSvg=function(node,clone){
  var node1;
  var i;
  if (node.tagName){
    node1=document.createElementNS(this.NS,node.tagName);
    for (i=0; i<node.attributes.length; i++)
	node1.setAttribute(node.attributes[i].name,node.attributes[i].value);
  }
  else
    node1=document.createTextNode(node.nodeValue);
  clone.appendChild(node1);
  var fils=node.firstChild;
  while (fils){
    this.exploreDomSvg(fils,node1);
    fils=fils.nextSibling;
  }
  return clone;
}



xcasSvg.prototype.insere=function(str,sId,couleur,remplace,protege){
  if( !str)
    return;
  var id, i,node;;
  if (sId && sId!="")
     id=document.getElementById(sId);
  else
    if (this.svg)
      id=this.svg;
    else
      return;
  if (remplace){
    for (i=id.childNodes.length-1; i>=0; i--){
      node=id.childNodes[i];
      if (protege 
	  || !node.tagName 
	  || node.getAttribute("protege")!="1")	   
	id.removeChild(node);
      }
  }
  var svgElement;
  if (xcasBase.isWebKit){ 
        svgElement=document.createElementNS(this.NS,"svg");
        var node=parent.document.createElement("span");
        node.innerHTML=str;
         svgElement=this.exploreDomSvg(node.firstChild,svgElement);
        svgElement=svgElement.firstChild;
   } else {
    var range = document.createRange();
    range.selectNodeContents(id); //(svg)
    //plantage safari ici
    svgElement = range.createContextualFragment(str); 
  }
  id.appendChild(svgElement);
  // on retrouve svgElement dans le dom
  i=id.childNodes.length-1;
  if (i==-1)
    return;
  while ( i>0 && !id.childNodes[i].tagName){
    i--;
  }
  if (protege && id.childNodes[i].setAttribute)
    id.childNodes[i].setAttribute("protege","1");
  if (sId=="legende")
    id.childNodes[i].setAttribute("fill",couleur);
  else
    id.childNodes[i].setAttribute("stroke",couleur);
}


xcasSvg.prototype.svgGrid=function(xmin,ymin,xmax,ymax){
  var fenetre="xyztrange("+xmin+","+xmax+","+ymin+","+ymax+",-5,5,"+xmin+","+xmax+","+ymin+","+ymax+",-2,2,1,0,1)";
  var sr=this.reqSVGgrid(fenetre,this.X,this.Y);
  var t=sr.split(new RegExp("`","g"));
  while (this.svg.firstChild)
    this.svg.removeChild(this.svg.firstChild);
  this.insere(t[1]);
  return;
}

