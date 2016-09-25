xcasSvg.prototype.supprime=function(sID){
  var id=document.getElementById(sID);
  if (!id)
	return;
  var pere=id.parentNode;
  pere.removeChild(id);
} 

xcasSvg.prototype.exploreDom=function(node,clone){
  //alert(node.tagName);
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
    exploreDom(fils,node1);
    fils=fils.nextSibling;
  }
  return clone;
}



xcasSvg.prototype.source=function(sID){
  var id=document.getElementById(sID);
//	alert(sID+" "+id);
  if (!id)
	return;
  if (isIE){
   return printNode(id);
   } else {
   var serializer = new XMLSerializer();
   var xml = serializer.serializeToString(id);
   return xml
  }
}

xcasSvg.prototype.effaceTout=function(sId){
 var id=document.getElementById(sId);
 while (id.firstChild)
   id.removeChild(id.firstChild);
 return;
}

xcasSvg.prototype.attribue=function(objet,attribut,valeur){
  objet.setAttribute(attribut,valeur);
  if (objet.firstChild){
     objet=objet.firstChild;
     for(;;) {
       objet=objet.nextSibling;
       if (objet.setAttribute)
	objet.setAttribute(attribut,valeur);
       if (!objet.nextSibling)
	break;
     }
  }
}

xcasSvg.prototype.changeCouleur=function(i,n){
  var couleurs=["black","gray","red","darkblue","goldenrod","green","darkorange","purple"];
  attribue(document.getElementById("svg"+n),"stroke",couleurs[i]);
}

xcasSvg.prototype.changeEpais=function(objet,epaisseur){
   var isIE = window.ActiveXObject;
   if (!isIE)
     attribue(objet,"stroke-width",epaisseur);
}

xcasSvg.prototype.cloneSVG=function(){
 if (isIE)
   return source("cadreSVG");
 else	
   return document.getElementById("cadreSVG").lastChild.cloneNode(true);
}



