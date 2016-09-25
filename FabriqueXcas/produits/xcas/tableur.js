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

xcasTableur.prototype.ctrl=function(ev){
  //if (xcasBase.isIE)
  //ev=event;
  // alert(ev.keyCode);
  if (ev.keyCode==xcasBase.ENTREE){
    this.entree.select();
    this.fill_cell(false);
  }
}

  xcasTableur.prototype.modeSaisie=function(ev){ 
// probleme avec Opera qui ne détecte pas ev.ctrlKey
//if (xcasBase.isIE)
    //ev=event;
 
  if (ev.ctrlKey){
    if (ev.keyCode==67){ 
      this.copy();
      this.saisie=false;
    } else if (ev.keyCode==86)
      this.paste();
    return;
  }

  if (ev.keyCode==13){ //entree
     this.saisie=false;
     return;
  }

  if (this.entree.value.charAt(0)!="=")
    return;
  if (ev.keyCode!=17)
    this.saisie=true;	
  return;
}



xcasTableur.prototype.vide=function(){
  if (!confirm("Vider la feuille ?"))
    return;
  var i,j, dom_cellule, t,cell;
  this.cell_marquees=[];
  for (i=0; i<this.nb_col; i++)
    for (j=0; j<this.nb_lign ; j++){
      cell=this.lettres[i]+j;
      dom_cellule=document.getElementById(cell);
      dom_cellule.setAttribute("ancienne",dom_cellule.getAttribute("formule"));
      dom_cellule.setAttribute("formule","");
      this.cell_marquees.push(cell);
      if (dom_cellule.firstChild)
	dom_cellule.removeChild(dom_cellule.firstChild);
    }
  this.nb_col=0;
  this.nb_lign=0;
  this.entree.value="";
  this.cell("A0");
  return;
}

xcasTableur.prototype.annule=function(){
  var i,t,dom_cellule;
  for (i=0; i<this.cell_marquees.length;i++){
      dom_cellule=document.getElementById(this.cell_marquees[i]);
      t=dom_cellule.getAttribute("ancienne");
      dom_cellule.setAttribute("ancienne",dom_cellule.getAttribute("formule"));
      dom_cellule.setAttribute("formule",t);
  }
  this.calculeTab();
  this.nb_lign=this.nb_lign_sauv;
  this.nb_col=this.nb_col_sauv;
  return;
}


xcasTableur.prototype.subst_cell=function(){
 var dom_cellule=document.getElementById(this.cellActive);
 dom_cellule.setAttribute("ancienne",dom_cellule.getAttribute("formule"));
 dom_cellule.setAttribute("formule",this.entree.value);
 return;
}

  xcasTableur.prototype.fill_cell=function(statique){
  this.cell_marquees=[this.cellActive];
  this.cell_max(this.cellActive);
  this.subst_cell();
  var t=this.coordonnees(this.cellActive);
  this.calculeTab();
  if (statique)
    return;
  if (t[1]<this.n_lign-1){
    t[1]+=1;
    this.saisie=false;
    this.cell(t[0]+t[1]);
  }
  return;
}

xcasTableur.prototype.remplit_cellule=function(cellule,formule){
  var cell=document.getElementById(cellule);
  cell.setAttribute("formule",formule);
  this.cell_max(cellule);
}

xcasTableur.prototype.fill_bottom=function() {
  this.cell_marquees=[];
  this.subst_cell();
  var cell=document.getElementById(this.cellActive);
  var formule=cell.getAttribute("formule");
  var reg_lettre=RegExp("[A-Z]","g");
  var letter=this.cellActive.match(reg_lettre);
  var reg_nombre=RegExp("[0-9].|[0-9]","g");
  var nombre=Number(this.cellActive.match(reg_nombre));
  var i=0;
  for (i=nombre+1 ; i<this.n_lign ; i++){ 
    this.cell_marquees.push(letter+i);
    cell =document.getElementById(letter+i);
    cell.setAttribute("formule",this.translation(formule,0,i-nombre));
  }
  i=this.n_lign-1;
  this.cell_max(letter+i);
  this.calculeTab();
  this.saisie=false;
  return;
}

xcasTableur.prototype.fill_right=function() {
  this.cell_marquees=[];
  this.subst_cell();
  var cell=document.getElementById(this.cellActive);
  var formule=cell.getAttribute("formule");
  var cell=document.getElementById(this.cellActive);
  var reg_lettre=RegExp("[A-Z]","g");
  var letter=String(this.cellActive.match(reg_lettre));
  var code=Number(letter.charCodeAt(0));
  var reg_nombre=RegExp("[0-9].|[0-9]","g");
  var nombre=Number(this.cellActive.match(reg_nombre));
  var fin=this.lettres[this.n_col-1].charCodeAt(0)-code+1;
  for (i=0 ; i<fin ; i++){
    letter=String.fromCharCode(code+i);
    this.cell_marquees.push(letter+nombre);
    cell =document.getElementById(letter+nombre);
    cell.setAttribute("formule",this.translation(formule,i,0));
  }
  if (nombre<this.n_lign-1)
    nombre++;
  this.cell_max(this.lettres[this.n_col-1]+nombre);
  this.calculeTab();
  this.saisie=false;
  return;
}


//translation de coordonnees de cellules
// nouvelle version
xcasTableur.prototype.translation=function(chaine,k,l){
  var chiffres=["0","1","2","3","4","5","6","7","8","9"];
  var i=0;
  var absLi,absCol=false;
  var refCol=-1,refLi;
  var nouvelleChaine="";
  var s,lettre;
  while (i<chaine.length){
    lettre=chaine.charAt(i);
    if (lettre=="$"){
	absCol=true;   
	nouvelleChaine+=lettre;
	i++;
    } else {
      if (refCol==-1){
	for (j in this.lettres)
	  if (lettre==this.lettres[j]){
	    refCol=j;
	    break;
	  }
      } 
      if (refCol==-1){
	nouvelleChaine+=lettre;
	i++;
      }
      else {
	refLi=0;
	i++;
	lettre=chaine.charAt(i);
	if (lettre=="$"){
	  absLi=true;
	  i++;
	  lettre=chaine.charAt(i);
	}
	j=i;
	while (lettre in chiffres){
	  refLi=10*refLi+parseInt(lettre);
	  i++;
	  if (i<chaine.length)
	    lettre=chaine.charAt(i);
	  else
	    lettre="";
	}
	if (j!=i) {
	  if (!absCol)
	    refCol=parseInt(refCol)+k;
	  if (!absLi)
	    refLi+=l;
	  else
	    refLi="$"+refLi;
	  nouvelleChaine+=this.lettres[refCol]+refLi;
	}
	else
	  nouvelleChaine+=lettre;
	refCol=-1;
	absCol=false;
	absLi=false;
      }
    }
  }
  return nouvelleChaine;
}

 

xcasTableur.prototype.copy=function(){
  saisie=false;
  this.ref_copy=this.cellActive;
  dom_cellule=document.getElementById(this.cellActive);
  this.form_copy=this.entree.value;
  dom_cellule.setAttribute("formule",this.entree.value);
  return;
}


xcasTableur.prototype.paste=function(){
  this.cell_marquees=[this.cellActive];
  this.cell_max(this.cellActive);
  var reg_lettre=RegExp("[A-E]","g");
  var lettre_cell=String(this.cellActive.match(reg_lettre));
  var lettre_ref=String(this.ref_copy.match(reg_lettre));
  var reg_nombre=RegExp("[0-9].|[0-9]","g");
  var nombre_cell=Number(this.cellActive.match(reg_nombre));
  var nombre_ref=Number(this.ref_copy.match(reg_nombre));
  dom_cellule=document.getElementById(this.cellActive);
  var c=this.translation(this.form_copy, lettre_cell.charCodeAt(0)-lettre_ref.charCodeAt(0) ,nombre_cell-nombre_ref );
  dom_cellule.setAttribute("formule",c);
  this.entree.value=c;
  this.calculeTab();
  return;
}

xcasTableur.prototype.spreadForm=function(i,j){
  var cell=document.getElementById(this.lettres[j]+i);
  var f=cell.getAttribute("formule");
  if (f!="" && f!=" ")
    return f;
  else
    return "0";
}

xcasTableur.prototype.cellSubst=function(cell,s,m){
  var l,L,f;
  result=cell.getAttribute("result");
  var f=cell.getAttribute("formule");
  this.sauvegarde+=f+"`";
  if (result+""==s && result!="0")
    return;
  cell.setAttribute("result",s);
  if (cell.firstChild)
    cell.removeChild(cell.firstChild);
  l=cell.clientWidth+0;
  if (f!="" && f!=" "){
    this.insereMathML(cell,m,false,false);
    if (this.isIE){
      L=cell.firstChild.clientWidth+0;
      if (L>l){
       cell.style.width=L;
       this.table.style.width=tab.clientWidth+L-l;
      }
      else
       cell.style.width=l;
    }
  } 
  return;
}

xcasTableur.prototype.spreadSubst=function(i,j,s,m){
  var cell=document.getElementById(this.lettres[j]+i);
  this.cellSubst(cell,s,m);
  return;
}


xcasTableur.prototype.actualiseTab=function(s){
  var t=s.split(new RegExp("`","g"));
  xcasBase.session_id=t[0];
  var k;
  this.sauvegarde="";
  for (i=0; i<this.nb_lign ; i++)
    for (j=0 ; j<this.nb_col ; j++){
      k=2*(i*this.nb_col+j)+1;
      this.spreadSubst(i,j,t[k],t[k+1]);
    }
}

xcasTableur.prototype.calculeTab=function(){
  var spreadheet=new String();
  spreadsheet="spreadsheet[";
  var cell=document.getElementById('AO');
  var i=0;
  var j=0;
  var der_col=this.nb_col-1, der_lign=this.nb_lign-1;
  var formule="";
  for (i=0 ; i<this.nb_lign ; i++){
    spreadsheet+="[";
    for (j=0 ; j<der_col ; j++){
      formule=this.spreadForm(i,j);
      spreadsheet+="[regrouper("+formule+"),1,0],";
    }
    formule=this.spreadForm(i,j);
    spreadsheet+="[regrouper("+formule+"),1,0]]";
    if (i==der_lign)
      spreadsheet+="]";
    else
      spreadsheet+=",";
  }
  var s;
  s=this.reqTableur(spreadsheet); 
  if (s.indexOf("Fatal error")>=0){
    alert("DUREE EXCESSIVE. CALCUL REFUSE. Passez en mode numerique")
    return;
  }
  this.actualiseTab(s);
  return;
}


xcasTableur.prototype.restaure=function(){
  var tab=this.sauvegarde.split(new RegExp("`","g"));
  var cell;
  for (i=0; i<this.nb_lign ; i++)
    for (j=0 ; j<this.nb_col ; j++){
      cell=document.getElementById(this.lettres[j]+i);
      k=i*this.nb_col+j;
      if (tab[k])
	cell.setAttribute("formule",tab[k]);
      else
	cell.setAttribute("formule","");
    }
  this.calculeTab();
}
