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

xcasConsole.prototype.valide=function(ev,obj){
  if (xcasBase.isIE){
	if (event.keyCode==xcasBase.ENTREE)
        this.giac();
  } else
  if (ev.keyCode==xcasBase.ENTREE)
        this.giac();
}

// envoie le contenu de la fenetre "programmation"
xcasConsole.prototype.prog=function(){
  var s="";
  if (!this.script)
    return s; 
  var tab=this.script.value.split(new RegExp("\n","g"));
  var i;
  var n=tab.length-1;
  for (i in tab){
    if (tab[i].substr(0,3)=="//*")
      tab[i]="";
    else if (i<n)
      tab[i]+="\n";
  }      
  // echange avec le serveur
  var sp=this.reqProg(tab.join("")); 
  var t=sp.split(new RegExp("`","g"));
  if (t[1]!="" && t[1]!="\n") {
    s="Dans votre programme, erreur dans la ligne "+t[1]+" juste avant "+t[2];
    tab[t[1]-1]="//* Erreur dans la ligne suivante, juste avant "+t[2]
      +"\n"+
      tab[t[1]-1];
  }
  this.script.value=tab.join("");
  this.changeScript=false;
  this.session_id=t[0];
  return s;
} 


xcasConsole.prototype.giac=function(){
  var s=this.input.value,sprog="";
  if (s == "")
    return;
  if (this.changeScript)
    sprog=this.prog();
  if (sprog=="undefined")
    sprog="";
  // ------ on enregistre la requete
  this.tabHisto.push(s);
  this.input.value="";
  this.input.focus();
  var text=document.createTextNode(s+" "+sprog);
  p=document.createElement("p");
  this.histo.appendChild(p);
  var span=this.createElement("span");
  span.onclick=function(){xcasElement(this).touche(text.nodeValue)};
  span.appendChild(text);
  p.appendChild(span);
  //------- traitement de l'instruction
  var sr=this.reqGiac(s);
  // rustine pour IE
  if (xcasBase.isIE)
    sr=sr.replace(new RegExp("``","g"),"` `");
  var t=sr.split(new RegExp("`","g"));
  // on affiche le resultat en mathml  
  var mml;
  mml=this.insereMathML(p,t[2],false,false);
  mml.onclick=function(){xcasElement(this).touche("("+t[1]+")");};
  this.session_id=t[0];
  // on scrolle en bas
  this.input.scrollIntoView(false);
}


xcasConsole.prototype.touche=function(instruction){
  this.input.value+=instruction;
  this.input.focus();
}
