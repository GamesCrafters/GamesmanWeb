var P1COLOR = {red: 255, green: 0, blue: 0}
var P2COLOR = {red: 0, green: 0, blue: 255}
var BGCOLOR = {red: 0, green: 0, blue: 102}
var WINNING_MOVE_COLOR = {red: 0, green: 255, blue: 0}
var LOSING_MOVE_COLOR = {red: 139, green: 0, blue:0}
var BOARD_STARTING_COLOR = {red: 210, green: 180, blue: 140}
var HIGHLIGHTED_COLOR = {red: 0, green: 0, blue: 0}
var P1TURN = true;
var P2TURN = false;

var canvasID = "board";
var div = null;
var canvasWidth = 400;
var canvasHeight = 400;

var tilesX = 50;
var tilesY = 50;
var tileWidth = Math.floor(canvasWidth/tilesX);
var tileHeight = Math.floor(canvasHeight/tilesY);
var offsets; // = {x: 8, y: 110};
var tileBorder = 1;

var centers;
var tiles;
var currentCenter;
var previousCenter = null;

var centerRows;
var outerRows;
var triangleWidth = 30;
var triangleHeight = triangleWidth/2 * Math.sqrt(3);
var rowSpacing = 40;
var axisSpacing = 100;

function Point(setx, sety, setred, setgreen, setblue, setalpha, id){
  this.x = setx;
  this.y = sety;
  this.red = setred;
  this.green = setgreen;
  this.blue = setblue;
  this.alpha = setalpha;
  this.clicked =false;
  this.id = setx.toFixed(3)+"-"+sety.toFixed(3);
  function addToCollection(targetCollection) {
    targetCollection[this.id] = this;
  }
}
function Tile(setX, setY){
  this.centers = new Array();
  this.x = setX;
  this.y = setY;
  this.centerCount = 0;
}

$(document).ready(function() {
  
  //console.log('url parameters', gup('innerRows'));
  
  centerRows = parseInt(gup('centerRows')) || 3;
  outerRows = parseInt(gup('outerRows')) || 3;
  
  orDropDown = document.getElementById('outerRowsFormID');
  orDropDown.selectedIndex = outerRows;
  
  crDropDown = document.getElementById('centerRowsFormID');
  crDropDown.selectedIndex = centerRows;
  
  div = document.getElementById("testdiv")
  centers = new Array();
  //console.log('centerRows', centerRows, 'outerRows', outerRows);
  createHex(canvasWidth/2, 150, centerRows, outerRows);
  for(var i in centers) {
    //console.log('centers[i]', centers[i].length)
    tempc = centers[i];
	break;
  }
  var testCount = 0;
  for(var i in centers) {
    testCount++;
  }
  //console.log('centers.length', testCount);
  //console.log('tempc', tempc);
  currentCenter = tempc;
  previousCenter = tempc;
  makeTable(tilesX, tilesY);
  //putCentersInTiles(centers);
  drawEntireMap();
  //drawMapSegment(tiles[0]);
  offsets = {x: document.getElementById(canvasID).offsetLeft, y:document.getElementById(canvasID).offsetTop};
});

function gup(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results == null)
    return false;
  else
    return results[1];
}

function makeTable() {
  tiles = new Array();
  var newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("id", canvasID);
  newCanvas.setAttribute("width", canvasWidth);
  newCanvas.setAttribute("height", canvasHeight);
  newCanvas.setAttribute("onclick", "handleClick(event)");
  //newCanvas.setAttribute("onmousemove", "handleMove(event)");
  for(var i = 0; i < tilesX; i++) {
    for(var j = 0; j < tilesY; j++) {
	  tiles[i+'-'+j] = new Tile(i * tileWidth, j * tileHeight); 
	}
  }
  div.appendChild(newCanvas);
}
function newGame() {
  //console.log("ir", document.forms["gameForm"].elements["centerRowsForm"].value);
  //console.log("or", document.forms["gameForm"].elements["outerRowsForm"].value);
  //console.log(window.location.href);
  var cr =  document.forms["gameForm"].elements["centerRowsForm"].value;
  var or =   document.forms["gameForm"].elements["outerRowsForm"].value
  //window.location.href = "file:///C:/Users/Kevin/Documents/My%20Dropbox/Spring_10/CS%2099/Y/arc.html?centerRows="+cr+"&outerRows="+or+"#top";
  
  qIndex = window.location.href.indexOf("?");
  var currentLoc = "";
  if(qIndex>-1) {
    currentLoc = window.location.href.substring(0, qIndex + 1);
  } else {
    currentLoc = window.location.href+"?";
  }
  currentLoc = currentLoc + 'game='+(gup('game') || "Y")+'&centerRows='+cr+'&outerRows='+or;
  //console.log(currentLoc);
  window.location.href = currentLoc;
  if((document.forms["gameForm"].elements["centerRowsForm"].value==centerRows) && (document.forms["gameForm"].elements["outerRowsForm"].value==outerRows)) {
    for( i in centers) {
      centers[i].red = BOARD_STARTING_COLOR.red;
	  centers[i].green = BOARD_STARTING_COLOR.green;
	  centers[i].blue = BOARD_STARTING_COLOR.blue;
	  drawMapPolygon(centers[i]);
    }
  } else {
    div.removeChild(document.getElementById(canvasID));
	
	centerRows = document.forms["gameForm"].elements["centerRowsForm"].value;
	outerRows = document.forms["gameForm"].elements["outerRowsForm"].value
	//console.log("outerRows", outerRows);
	init();
  }
  
}
function putCentersInTiles( toAdd ) {
  for ( var i in toAdd ) {
    xTile = Math.floor(toAdd[i].x/tileWidth);
	yTile = Math.floor(toAdd[i].y/tileHeight);
	t1 = tiles[xTile+"-"+yTile]
	if(t1!=null) {
	  t1.centers[toAdd[i].id] = toAdd[i];
	  t1.centerCount++;
	}
	//console.log(xTile+"-"+yTile);
  }
}
function drawEntireMap() {
  for(var i in tiles) {
    drawMapSegmentFirstTime(tiles[i]);
  }
}
function drawMapSegmentFirstTime( targetTile ){
  elem = document.getElementById(canvasID);
  if (!elem || !elem.getContext) { return; }
  // Get the canvas 2d context.
  var context = elem.getContext('2d');
  if (!context || !context.putImageData) { return; }

  if (context.createImageData) {
    imgd = context.createImageData(tileWidth, tileHeight);
  } else if (context.getImageData) {
    imgd = context.getImageData(0, 0, tileWidth, tileHeight);
  } else {
    imgd = {'width' : tileWidth, 'height' : tileHeight, 'data' : new Array(tileWidth*tileHeight*4)};
  }
  
  var pix = imgd.data;
  for (var i = 0, pl = pix.length; i < pl; i+= 4) {
    xx = Math.floor((i%(tileWidth*4))/4);
	yy = Math.floor(i / (tileWidth*4));
	temp = getNearestCenterAndDist(xx + targetTile.x, yy + targetTile.y, centers);
	c2 = temp.min2Center;
	c = temp.center;
	d = temp.dist;
	temp = null;
	//distToNearestCenter = Math.sqrt(Math.pow(xx+targetTile.x - c.x,2)+Math.pow(yy+targetTile.y - c.y,2));
	/*if(distToNearestCenter < 3 ) {
	  //console.log('distToNearestCenter', distToNearestCenter);
	  pix[i  ] = 255;
	  pix[i+1] = 255;
	  pix[i+2] = 255;
	  pix[i+3] = 255;
	} else */if(d > tileBorder) {
	  pix[i  ] = c.red;
	  pix[i+1] = c.green;
	  pix[i+2] = c.blue;
	  pix[i+3] = c.alpha* 255;
	} else {
	  //draw the bg color
	  pix[i  ] = BGCOLOR.red;
	  pix[i+1] = BGCOLOR.green;
	  pix[i+2] = BGCOLOR.blue;
	  pix[i+3] = 255;
	  addCenterToTile(targetTile, c2);
	}
	
	addCenterToTile( targetTile, c);
  }
  context.putImageData(imgd, targetTile.x, targetTile.y);
}
function drawMapSegment( targetTile ){ 
  elem = document.getElementById(canvasID);
  if (!elem || !elem.getContext) { return; }
  // Get the canvas 2d context.
  var context = elem.getContext('2d');
  if (!context || !context.putImageData) { return; }
  
  var count = 0;
  // centercount is not working
  // get centerCount to work as a better way of doing this
  for(var k in targetTile.centers) {
    count ++;
	if (count > 1) {
	  break;
	}
  }
  if(count ==0) {
    //console.log("something is not working");
  } else if(count == 1){
    //context.fillStyle = 'rgba('+targetTile.centers[0].red+','+targetTile.centers[0].green+','+targetTile.centers[0].blue+',1)';
	for(var i in targetTile.centers) {
	  fillColor = "rgba("+Math.floor(targetTile.centers[i].red)+","
	                     +Math.floor(targetTile.centers[i].green)+","
		    			 +Math.floor(targetTile.centers[i].blue)+","
					     +targetTile.centers[i].alpha+")";
	  				     //+targetTile.centers[0].alpha+")";
	}
	context.fillStyle = fillColor;
	//console.log(context.fillStyle);
	//console.log(fillColor);
	context.fillRect(targetTile.x, targetTile.y, tileWidth, tileHeight);
	
  } else {
  
    if (context.createImageData) {
      imgd = context.createImageData(tileWidth, tileHeight);
    } else if (context.getImageData) {
      imgd = context.getImageData(0, 0, tileWidth, tileHeight);
    } else {
      imgd = {'width' : tileWidth, 'height' : tileHeight, 'data' : new Array(tileWidth*tileHeight*4)};
    }
    
    var pix = imgd.data;
    for (var i = 0, pl = pix.length; i < pl; i+= 4) {
      xx = Math.floor((i%(tileWidth*4))/4);
	  yy = Math.floor(i / (tileWidth*4));

	  temp = getNearestCenterAndDist( xx + targetTile.x, yy + targetTile.y, targetTile.centers);
	  // inefficient
	  //temp = getNearestCenterAndDist( xx + targetTile.x, yy + targetTile.y, centers);
	  
	  c = temp.center;
	  d = temp.dist;
      if( d > tileBorder) {
	    pix[i  ] = c.red;
	    pix[i+1] = c.green;
	    pix[i+2] = c.blue;
	    pix[i+3] = c.alpha*255;
	  } else {
	    pix[i  ] = BGCOLOR.red;
	    pix[i+1] = BGCOLOR.green;
	    pix[i+2] = BGCOLOR.blue;
	    pix[i+3] = 255;
      }
    }
    context.putImageData(imgd, targetTile.x, targetTile.y);
  }
}
function getNearestCenter( boardX, boardY, centerOptions ) {
  var minCenter = null;
  var minDist = Infinity;
  for (var j in centerOptions ) {
	dist2 = Math.pow(boardX-centerOptions[j].x, 2)+Math.pow(boardY-centerOptions[j].y, 2);
	if (dist2<minDist){
	  minCenter = centerOptions[j];
      minDist = dist2;
	}
  }
  //console.log("point", boardX, boardY);
  //console.log("closest center", minCenter.x, minCenter.y);
  return minCenter;
}
function getNearestCenterAndDist( boardX, boardY, centerOptions ) {
  //centerOptions = centers;
  //console.log('centerOptions.length', centerOptions.length);
  //if(centerOptions.length == 0) {
  //  centerOptions = centers;
  //}
  var minCenter = null;
  var min2Center = null;
  var minDist = Infinity;
  var min2Dist = Infinity;
  for (var j in centerOptions ) {
	dist = Math.pow(boardX-centerOptions[j].x, 2)+Math.pow(boardY-centerOptions[j].y, 2);
	if (dist<minDist){
	  min2Center = minCenter;
	  min2Dist = minDist;
	  minCenter = centerOptions[j];
      minDist = dist;
	} else if( dist < min2Dist ){
	  min2Center = centerOptions[j];
	  min2Dist = dist;
	}
  }
  if( minCenter == null || min2Center == null ){
     //console.log('null', 'minCenter', minCenter, 'min2Center', min2Center);
  }
  
  /* inefficient but clear version
  var mid    = {x: (minCenter.x + min2Center.x)/2, y: (minCenter.y + min2Center.y)/2};
  var perpSlope  = (min2Center.x*-1 + minCenter.x)/(min2Center.y - minCenter.y);
  var v1 = {x: 1, y: perpSlope};
  var v2 = {x: boardX - mid.x, y: boardY - mid.y};
  var v1_dot_v2 = (v1.x * v2.x + v1.y * v2.y) / (Math.pow(v1.x,2)+Math.pow(v1.y,2));
  var v3 = {x: v1.x * v1_dot_v2, y: v1.y * v1_dot_v2 };
  var perpVector = {x: v2.x - v3.x, y: v2.y - v3.y };
  var vDist = Math.sqrt( Math.pow(perpVector.x, 2) + Math.pow(perpVector.y, 2) );  
  */
  //console.log("vDist", vDist);
  
  var perpSlope  = (min2Center.x*-1 + minCenter.x)/(min2Center.y - minCenter.y);
  var v1 = null;
  if (Math.abs(perpSlope) == Infinity) {
    v1 = {x: 0, y:1}
  } else {
    v1 = {x: 1, y: perpSlope};
  }
  var v2 = {x: boardX - (minCenter.x + min2Center.x)/2, y: boardY - (minCenter.y + min2Center.y)/2};
  var v1_dot_v2 = (v1.x * v2.x + v1.y * v2.y) / (Math.pow(v1.x,2)+Math.pow(v1.y,2));
  var vDist = Math.sqrt( Math.pow(v2.x - v1.x * v1_dot_v2, 2) + Math.pow(v2.y - v1.y * v1_dot_v2, 2) );  
  
  // parabolic    dist: Math.sqrt(min2Dist) - Math.sqrt(minDist)
  var k = {dist: vDist, center: minCenter, min2Center: min2Center}; 
  //console.log(k);
  //console.log(boardX, boardY, k, centerOptions);
  return k;
  
}
function drawMapPolygon( targetCenter ) {
  //console.log("drawMapPolygon");
  for( var i in tiles ){
	for( var j in tiles[i].centers ) {
      if(targetCenter == tiles[i].centers[j]){
	    drawMapSegment(tiles[i]);
		break;
	  }
	}
  }
}
function addCenterToTile( targetTile, targetCenter ){
  for( i in targetTile.centers ) {
    if(tileEquals(targetTile.centers[i], targetCenter)) {
	  return;
	}
  }
  targetTile.centers[targetCenter.id] = targetCenter;
  targetTile.centerCount++;
}
function tileEquals(t1, t2) {
  return t1.id == t2.id;
}
function getNearestTile( boardX, boardY ) {
  var xTile = Math.floor(boardX/tileWidth);
  var yTile = Math.floor(boardY/tileHeight);
  var ret = tiles[xTile+"-"+yTile];
  if( ret ) {
    return ret;
  }
  return new Tile(-1, -1);
  //console.log(xTile, yTile);
}

function createHex(x, y, depthInside, depthOutside) {
  var depthInsideCopy = depthInside;
  var v0 = {x: -triangleWidth / 2, y: triangleHeight};
  var v1 = {x: triangleWidth  / 2, y: triangleHeight};
  var dir = {x: (v1.x - v0.x), y: v1.y - v0.y}
  var mag = Math.sqrt(Math.pow(dir.x, 2)+Math.pow(dir.y, 2));
  dir = {x: dir.x / mag, y: dir.y / mag };
  while(depthInside >= 0) {
    var start = {x: x + v0.x * depthInside, y: y + v0.y * depthInside};
    var end   = {x: x + v1.x * depthInside, y: y + v1.y * depthInside};
    var len   = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)) / depthInside;
  	//console.log( "("+start.x + ", "+start.y+")" +  " ("+end.x+", "+end.y+")" + ' depthInside: ' + depthInside);
	drawLine(start, end, depthInside, false);
    depthInside--;
  }
  
  v0 = {x: 0, y: - 1};
  v1 = {x: -triangleWidth*3/4, y: triangleHeight/2}
  mag =  Math.sqrt(Math.pow(v1.x, 2)+Math.pow(v1.y, 2))
  v1 = {x: v1.x / mag, y: - v1.y / mag};
  v2 = {x: -v1.x, y: v1.y};
  
  var llCorner = {x: x - (depthInsideCopy)*triangleWidth/2, y: y + (depthInsideCopy) * triangleHeight};
  var lrCorner = {x: x + (depthInsideCopy)*triangleWidth/2, y: y + (depthInsideCopy) * triangleHeight};
  
  //console.log('starting outter triangle -------------------------------------------');
  //console.log('v1', "<"+v1.x+", "+v1.y+">");
  var outsideLeftCorner =  {x:llCorner.x + v1.x * depthOutside * rowSpacing, y:llCorner.y - v1.y * depthOutside * rowSpacing}
  var outsideRightCorner = {x:lrCorner.x + v2.x * depthOutside * rowSpacing, y:lrCorner.y - v2.y * depthOutside * rowSpacing}
  var outsideTopCorner   = {x:x + v0.x * depthOutside * rowSpacing,    y:y + v0.y * depthOutside * rowSpacing}
  //console.log('outsideLeftCorner', outsideLeftCorner);
  //console.log('outsideRightCorner', outsideRightCorner);
  //console.log('outsideTopCorner', outsideTopCorner);
  //console.log('llCorner', "("+llCorner.x+","+llCorner.y+")")
  //console.log('lrCorner', "("+lrCorner.x+","+lrCorner.y+")")
  var outsideCounter =  1;
  var rowSpacingCopy = rowSpacing;
  while(outsideCounter <= depthOutside + 1) {
    var p0 = {x:          x + v0.x * rowSpacingCopy * outsideCounter,
			  y:          y + v0.y * rowSpacingCopy * outsideCounter };
    var p1 = {x: llCorner.x + v1.x * rowSpacingCopy * outsideCounter, 
			  y: llCorner.y - v1.y * rowSpacingCopy * outsideCounter};
    var p2 = {x: lrCorner.x + v2.x * rowSpacingCopy * outsideCounter,
			  y: lrCorner.y - v2.y * rowSpacingCopy * outsideCounter};
	drawArc(outsideLeftCorner, p2, p0,  outsideCounter+depthInsideCopy, 7 * Math.PI /6, outsideCounter == depthOutside + 1 );
	drawArc(outsideRightCorner, p1, p0,  outsideCounter+depthInsideCopy, - Math.PI/6, outsideCounter == depthOutside + 1);
	drawArc(outsideTopCorner, p2, p1,  outsideCounter+depthInsideCopy, Math.PI/2, outsideCounter == depthOutside + 1);
    outsideCounter++;
  }
}
function drawArc(center, p1, p2, ptCount, offset, lastRow) {
  var a1 = Math.atan2(p1.x - center.x, p1.y - center.y);
  var a2 = Math.atan2(p2.x - center.x, p2.y - center.y);
  if(a2 < a1) {
    temp = a1;
	a1 = a2;
	a2 = temp;
  } // a1 is smaller than a2
  var totalPoints = ptCount;
  var radius = mag(center,p1);
  while(ptCount >= 0) {
    var theta = a1 + (a2-a1)/totalPoints*ptCount + offset;
	var x1 = Math.cos(theta)*radius + center.x;
    var y1 = Math.sin(theta)*radius + center.y;
	var id = x1.toFixed(3) + "-"+y1.toFixed(3);
	//console.log(id);
	if(lastRow) {
	  centers[id] = new Point(x1, y1, BGCOLOR.red, BGCOLOR.green, BGCOLOR.blue, 1, id);
	  centers[id].clicked = true;
	} else {
	  centers[id] = new Point(x1, y1,  BOARD_STARTING_COLOR.red,  BOARD_STARTING_COLOR.green,  BOARD_STARTING_COLOR.blue, 1, id);
	}
	ptCount--;
  }
}

function mag(v1, v2) {
  return Math.sqrt(Math.pow(v1.x-v2.x,2)+Math.pow(v1.y-v2.y,2));
}
function drawLine(start, end, segments, specialColor) {
  if(start.x == end.x && start.y == end.y) {
    var id = start.x.toFixed(3) + "-" + start.y.toFixed(3);
    centers[id] = new Point(start.x, start.y,  BOARD_STARTING_COLOR.red,  BOARD_STARTING_COLOR.green,  BOARD_STARTING_COLOR.blue, 1, id);
    return;
  }
  //console.log('start', "("+start.x+", "+start.y+")", 'end', "("+end.x+", "+end.y+")", "segments", segments);
  var vMag = Math.sqrt(Math.pow(start.x - end.x, 2)+ Math.pow(start.y - end.y, 2));
  var dir = {x: (end.x - start.x), y: end.y - start.y}
  var dirMag = Math.sqrt(Math.pow(dir.x, 2)+Math.pow(dir.y, 2));
  dir = {x: dir.x / dirMag, y: dir.y / dirMag };
  for(var i = 0; i <= segments; i++ ) {
    var setX = start.x + dir.x * i * vMag / segments;
	var setY = start.y + dir.y * i * vMag / segments;
	var id  = setX.toFixed(3) + "-" + setY.toFixed(3);
	//console.log('i ' + i, 'id', id);
    if(specialColor) {
	  if(i==0 || i==segments) {
	    centers[id] = new Point(setX, setY, 0, 255, 0, 1, id);
	  } else {
        centers[id] = new Point(setX, setY, 255, 0, 0, 1, id);
	  }
    } else { 
      centers[id] = new Point(setX, setY, BOARD_STARTING_COLOR.red,  BOARD_STARTING_COLOR.green, BOARD_STARTING_COLOR.blue, 1, id);
    }
  }
  ptBuf = "";
}

function getNearestCenterAndDistWithLog( boardX, boardY, centerOptions ) {
  //centerOptions = centers;
  //console.log("-----------------------");
  var minCenter = null;
  var min2Center = null;
  var minDist = Infinity;
  var min2Dist = Infinity;
  for (var j in centerOptions ) {
	dist = Math.pow(boardX-centerOptions[j].x, 2)+Math.pow(boardY-centerOptions[j].y, 2);
	if (dist<minDist){
	  min2Center = minCenter;
	  min2Dist = minDist;
	  minCenter = centerOptions[j];
      minDist = dist;
	} else if( dist < min2Dist ){
	  min2Center = centerOptions[j];
	  min2Dist = dist;
	}
  }
  if( minCenter == null || min2Center == null ){
     //console.log('null', 'minCenter', minCenter, 'min2Center', min2Center);
  }
  
  var mid    = {x: (minCenter.x + min2Center.x)/2, y: (minCenter.y + min2Center.y)/2};
  //console.log('c1', "("+minCenter.x+","+minCenter.y+")", 'c2', "("+min2Center.x+","+min2Center.y+")")
  //console.log('c1.id', minCenter.id, 'c2.id', min2Center.id, 'c1 == c2', minCenter == min2Center)
  //console.log('mid', 'x', mid.x, 'y', mid.y);
  var perpSlope  = (min2Center.x*-1.0 + minCenter.x)/(min2Center.y - minCenter.y);
  var v1 = {x: 1, y: perpSlope};
  if (Math.abs(perpSlope) == Infinity) {
    v1 = {x: 0, y: 1}
  }
  //console.log('perpSlope', perpSlope, 'top', min2Center.x*-1.0 + minCenter.x, 'bottom', min2Center.y - minCenter.y);
  
  var v2 = {x: boardX - mid.x, y: mid.y - boardY};
  var v1_dot_v2 = v1.x * v2.x + v1.y * v2.y;
  var v3 = {x: v1.x * v1_dot_v2, y: v1.y * v1_dot_v2 };
  //console.log('v1', "("+v1.x+","+v1.y+")", 'v2', "("+v2.x+","+v2.y+")", 'v3', "("+v3.x+","+v3.y+")");
  var perpVector = {x: v2.x - v3.x, y: v2.y - v3.y };
  //console.log('perpVector', 'x', perpVector.x, 'y', perpVector.y);
  var vDist = Math.sqrt( Math.pow(perpVector.x, 2) + Math.pow(perpVector.y, 2) );
  //console.log('vDist', vDist);
  //console.log("vDist", vDist);
  
  // parabolic    dist: Math.sqrt(min2Dist) - Math.sqrt(minDist)
  var k = {dist: vDist, center: minCenter, min2Center: min2Center}; 
  //console.log(k);
  //console.log(boardX, boardY, k, centerOptions);
  return k;
  
}
function gr() { return Math.random()*255; }

function handleClick(e) {
  var mouseX = e.layerX - offsets.x;
  var mouseY = e.layerY - offsets.y;
  
  //getNearestCenterAndDistWithLog(mouseX, mouseY, centers);
  t = getNearestTile(mouseX, mouseY);
  if(t==null) {
    return;
  }
  c = getNearestCenter(mouseX, mouseY, t.centers);
  if(c==null) {
    return;
  }
  if(!c.clicked) {
    if(P1TURN==true) {
      c.red = P1COLOR.red;
      c.green = P1COLOR.green;
      c.blue = P1COLOR.blue;
      c.alpha = 1;
	  
      P1TURN = false;
	  P2TURN = true;
	  c.clicked = true;
	  drawMapPolygon(c);
    } else if(P2TURN==true) {
      c.red = P2COLOR.red;
      c.green = P2COLOR.green;
      c.blue = P2COLOR.blue;
      c.alpha = 1;
	  
	  P1TURN = true;
	  P2TURN = false;
	  c.clicked = true;
	  drawMapPolygon(c);
    }
	
	var temp = getMovesFromFakeServer();
  var winningMoves = temp.winningMoves;
  var losingMoves = temp.losingMoves;
  for(var i in winningMoves) {
    //console.log("w", winningMoves[i]);
	winningMoves[i].red = WINNING_MOVE_COLOR.red;
	winningMoves[i].green = WINNING_MOVE_COLOR.green;
	winningMoves[i].blue = WINNING_MOVE_COLOR.blue;
	drawMapPolygon(winningMoves[i]);
  }
  for(var i in losingMoves) {
    //console.log("l", losingMoves[i])
	losingMoves[i].red = LOSING_MOVE_COLOR.red;
	losingMoves[i].green = LOSING_MOVE_COLOR.green;
	losingMoves[i].blue = LOSING_MOVE_COLOR.blue;
	drawMapPolygon(losingMoves[i]);
  }
  }
  
  
}
function getMovesFromFakeServer() {
  var winning = new Array();
  var losing  = new Array();
  for(i in centers) {
    if(!centers[i].clicked) {
	  rand = Math.random();
	  if(rand > 0.5) {
	    winning.push(centers[i]);
	  } else {
	    losing.push(centers[i]);
	  }
	}
  }
  return {winningMoves:winning, losingMoves:losing};
}


function handleMove(e) {
  //console.log(e);
  mouseX = e.layerX - offsets.x;
  mouseY = e.layerY - offsets.y;
  //console.log('vDist', getNearestCenterAndDist(mouseX, mouseY, centers).dist);
  c = getNearestCenter(mouseX, mouseY, getNearestTile(mouseX, mouseY).centers);
  
  if(!currentCenter.clicked) {
    currentCenter.red = BOARD_STARTING_COLOR.red;
	currentCenter.green = BOARD_STARTING_COLOR.green;
	currentCenter.blue = BOARD_STARTING_COLOR.blue;
	//drawMapPolygon(currentCenter);
	//drawMapPolygon(c);
  }
  
  if(!c.clicked) {
	c.red = HIGHLIGHTED_COLOR.red;
	c.green = HIGHLIGHTED_COLOR.green;
	c.blue = HIGHLIGHTED_COLOR.blue;
	//drawMapPolygon(currentCenter);
	//drawMapPolygon(c);
  }
  
  drawMapPolygon(currentCenter);
  drawMapPolygon(c);
  currentCenter = c;
  
  if(false) {
  if ( c != currentCenter ) {
	if(!currentCenter.clicked) {
	  currentCenter.red = BOARD_STARTING_COLOR.red;
	  currentCenter.green = BOARD_STARTING_COLOR.green;
	  currentCenter.blue = BOARD_STARTING_COLOR.blue;
	  drawMapPolygon(currentCenter);
	} else {
	  
	}
	
	currentCenter = c;
	
	
	if(!c.clicked) {
	  currentCenter.red = HIGHLIGHTED_COLOR.red;
	  currentCenter.green = HIGHLIGHTED_COLOR.green;
	  currentCenter.blue = HIGHLIGHTED_COLOR.blue;
	}
	//drawMapPolygon(previousCenter);
	drawMapPolygon(currentCenter);
  }
  }
}