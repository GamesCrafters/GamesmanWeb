//--------------------------------------------------------------------------
// Inner classes
//--------------------------------------------------------------------------
var Edge = function (setC1, setC2, setRed, setGreen, setBlue,setAlpha) {
    this.c1 = setC1;
    this.c2 = setC2;
    this.red = setRed;
    this.green = setGreen;
    this.blue = setBlue;
	this.alpha = setAlpha
};
var edgesEqual = function(e1, e2) {
    return (e1.c1.id==e2.c1.id && e1.c2.id == e2.c2.id) || (e1.c1.id==e2.c2.id && e1.c2.id==c2.c1.id);
};
var Point = function(setx, sety, setred, setgreen, setblue, setalpha, setindex){
    this.x = setx;
    this.y = sety;
    this.red = setred;
    this.green = setgreen;
    this.blue = setblue;
    this.alpha = setalpha;
	this.index = setindex;
    this.clicked = false;
    this.fringe = false;
    this.outerCorner = false;
    this.innerCorner = false;
    this.edgeCount = 0;
    this.whoClicked = "";
    this.rad = circleRad;
    this.id = setx.toFixed(3)+"-"+sety.toFixed(3);
};


//--------------------------------------------------------------------------
// Board Setup
//--------------------------------------------------------------------------
/*var newGame = function() {
    var cr =  document.forms["gameForm"].elements["centerRowsForm"].value;
	var or =   document.forms["gameForm"].elements["outerRowsForm"].value
	qIndex = window.location.href.indexOf("?");
    var currentLoc = "";
    if(qIndex>-1) {
		currentLoc = window.location.href.substring(0, qIndex + 1);
    } else {
		currentLoc = window.location.href+"?";
    }
    currentLoc = currentLoc + 'game='+(gup('game') || "Y")+'&centerRows='+cr+'&outerRows='+or;
    window.location.href = currentLoc;
};*/
var makeBoard = function (width, height) {
    var newCanvas = document.createElement("canvas");
    newCanvas.setAttribute("id", canvasID);
    newCanvas.setAttribute("width", width);
    newCanvas.setAttribute("height", height);
    //console.log('canvas set to', 'width', width, 'height', height);
    newCanvas.setAttribute("onclick", "handleClick(event)");
    div.appendChild(newCanvas);
    y.board = $(newCanvas);  // hack to access the global Y game object
};
var makeEdges = function() {
    for(var i in centers) {
		var edgesAndDists = new Array();
		for(var j in centers) {
			if(centers[i].id!=centers[j].id) {
				edgesAndDists.push({dist: mag(centers[i], centers[j]), c1: centers[i], c2: centers[j]});
			}
		}
		edgesAndDists.sort(compareCenters);
		var count = 6;
		if(centers[i].fringe) {
			count = 4;
		}
		if(centers[i].outerCorner) {
			count = 3;
		}
		if(centers[i].innerCorner) {
			count = 5;
		}
		if(centers[i].fringe && centers[i].innerCorner) {
			count = 2;
		}
		centers[i].edgeCount = count;
		for(var k = 0; k < count; k++) {
			if(k < edgesAndDists.length) {
				var ne =  new Edge(centers[i], edgesAndDists[k].c2, EDGE_STARTING_COLOR.red, EDGE_STARTING_COLOR.green, EDGE_STARTING_COLOR.blue, 255);
				edges.push(ne);
			}
		}
    
    }
};
var compareCenters = function(cad1, cad2)  {
    if(cad1.dist > cad2.dist) {
	return 1;
    } else {
	return -1;
    }
};
var drawArc = function(center, p1, p2, ptCount, offset, lastRow) {
    var a1 = Math.atan2(p1.x - center.x, p1.y - center.y);
    var a2 = Math.atan2(p2.x - center.x, p2.y - center.y);
    if(a2 < a1) {
		temp = a1;
		a1 = a2;
		a2 = temp;
    } // a1 is smaller than a2
    var totalPoints = ptCount;
    ptCount--;
    var radius = mag(center,p1);
    /*while(ptCount >= 0) {
		var theta = a1 + (a2-a1)/totalPoints*ptCount + offset;
		var x1 = Math.cos(theta)*radius + center.x;
		var y1 = Math.sin(theta)*radius + center.y;
		var id = x1.toFixed(3) + "-"+y1.toFixed(3);
		//console.log(id);
		
		var tempC = new Point(x1, y1,  BOARD_STARTING_COLOR.red,  BOARD_STARTING_COLOR.green,  BOARD_STARTING_COLOR.blue, 1, CENTER_INDEX);
		centers.push(tempC);
		CENTER_INDEX+=1;
		if(lastRow) {
			tempC.fringe = true;
			if(ptCount==0) {
				tempC.outerCorner = true;
			}
		}
		
		ptCount--;
	}*/
    
	for(var i = 0; i <= ptCount; i++) {
		var theta = a1 + (a2-a1)/totalPoints*i + offset;
		var x1 = Math.cos(theta)*radius + center.x;
		var y1 = Math.sin(theta)*radius + center.y;
		var id = x1.toFixed(3) + "-"+y1.toFixed(3);
		//console.log(id);
		
		var tempC = new Point(x1, y1,  BOARD_STARTING_COLOR.red,  BOARD_STARTING_COLOR.green,  BOARD_STARTING_COLOR.blue, 1, CENTER_INDEX);
		centers.push(tempC);
		CENTER_INDEX+=1;
		if(lastRow) {
			tempC.fringe = true;
			if(i==0) {
				tempC.outerCorner = true;
			}
		}
	}

};
var drawLine = function(start, end, segments, lastRow) {
    if(start.x == end.x && start.y == end.y) {
		var id = start.x.toFixed(3) + "-" + start.y.toFixed(3);
		var tempC = new Point(start.x, start.y, BOARD_STARTING_COLOR.red, 
					BOARD_STARTING_COLOR.green,
					BOARD_STARTING_COLOR.blue, 1, CENTER_INDEX);
		tempC.innerCorner = true;
		tempC.fringe = true;
		centers.push(tempC);
		CENTER_INDEX+=1;
		return;
    }
    //console.log('start', "("+start.x+", "+start.y+")", 'end', "("+end.x+", "+end.y+")", "segments", segments);
    var vMag = Math.sqrt(Math.pow(start.x - end.x, 2) +
			 Math.pow(start.y - end.y, 2));
    var dir = {x: (end.x - start.x), y: end.y - start.y}
    var dirMag = Math.sqrt(Math.pow(dir.x, 2)+Math.pow(dir.y, 2));
    dir = {x: dir.x / dirMag, y: dir.y / dirMag };
    for(var i = 0; i <= segments; i++ ) {
		var setX = start.x + dir.x * i * vMag / segments;
		var setY = start.y + dir.y * i * vMag / segments;
		var id  = setX.toFixed(3) + "-" + setY.toFixed(3);
		//console.log('i ' + i, 'id', id);
		var tempC = new Point(setX, setY, BOARD_STARTING_COLOR.red,
					BOARD_STARTING_COLOR.green,
					BOARD_STARTING_COLOR.blue, 1, CENTER_INDEX);
		if(lastRow) {
			tempC.fringe = true;
		}
		if((i==0) || (i==segments)) {
			tempC.fringe = true;
		}
		//centers[id].innerCorner = true;
		if(lastRow && ((i==0)||(i == segments))) {
			tempC.innerCorner = true;
			//console.log('innerCorner set to true');
		}
		centers.push(tempC);
		CENTER_INDEX+=1;
    }
};
var gup = function(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if(results == null)
	return false;
    else
	return results[1];
};

//--------------------------------------------------------------------------
// Drawing the board
//--------------------------------------------------------------------------
var drawCircles = function() {
    elem = document.getElementById(canvasID);
    if (!elem || !elem.getContext) { return; }
    // Get the canvas 2d context.
    var context = elem.getContext('2d');
    if (!context || !context.putImageData) { return; }
  
    for(var i in centers) {
		var fillColor = null;
		if(SHOW_MOVE_VALUES == true || centers[i].clicked) {
			fillColor = "rgba(" + Math.floor(centers[i].red) + "," +
							Math.floor(centers[i].green)+ "," +
							Math.floor(centers[i].blue) + "," +
							centers[i].alpha+")";
		} else if(!centers[i].clicked) {
			fillColor = "rgba(" + BOARD_STARTING_COLOR.red + "," +
								BOARD_STARTING_COLOR.green+ "," +
								BOARD_STARTING_COLOR.blue+ "," +
								centers[i].alpha+")";
		}
		centers[i].alpha+")";
		context.fillStyle = fillColor;
		context.beginPath();
		context.arc(centers[i].x, centers[i].y, centers[i].rad, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
    }
};
/*var drawCircle = function(center, rad) {
    //console.log("drawCircle", 'c.red', center.red, 'c.green', center.green, 'c.blue', center.blue);
    elem = document.getElementById(canvasID);
    if (!elem || !elem.getContext) { return; }
    // Get the canvas 2d context.
    var context = elem.getContext('2d');
    if (!context || !context.putImageData) { return; }
  
    var fillColor = "rgba("+Math.floor(center.red)+","
                    +Math.floor(center.green)+","
                    +Math.floor(center.blue)+","
                    +center.alpha+")";
    //var fillColor = "rgb("+gr()+","+gr()+","+gr()+")";
    
    context.fillStyle = fillColor;
    //console.log(context.fillStyle);
    context.beginPath();
    context.arc(center.x, center.y, rad, 0, Math.PI*2, true);
    context.closePath();
    context.fill();
};*/
var drawEdges = function(circleSet) {
    elem = document.getElementById(canvasID);
    if (!elem || !elem.getContext) { return; }
    // Get the canvas 2d context.
    var context = elem.getContext('2d');
    if (!context || !context.putImageData) { return; }
    context.beginPath();
    context.strokeStyle = 'rgb('+EDGE_STARTING_COLOR.red+', '+
                          EDGE_STARTING_COLOR.green+', '+
                          EDGE_STARTING_COLOR.blue+')';
    context.lineWidth   = EDGE_WIDTH;
    for(var c in circleSet) {
	for(var i in circleSet[c].edges) {
	    context.moveTo(circleSet[c].edges[i].c1.x,
			   circleSet[c].edges[i].c1.y);
	    context.lineTo(circleSet[c].edges[i].c2.x,
			   circleSet[c].edges[i].c2.y);
	    //console.log('from', circleSet[c].edges[i].c1.x, circleSet[c].edges[i].c1.y, 'to', circleSet[c].edges[i].c2.x, circleSet[c].edges[i].c2.y);
	}
    }
    context.stroke();
    //console.log("drew edges");
};
var drawEdgesFromList = function(edgesIn) {
    elem = document.getElementById(canvasID);
    if (!elem || !elem.getContext) { return; }
    // Get the canvas 2d context.
    var context = elem.getContext('2d');
    if (!context || !context.putImageData) { return; }
  
    for(var e in edgesIn) {
		context.beginPath();
		context.lineWidth = EDGE_WIDTH;
		context.strokeStyle = 'rgb('+edgesIn[e].red+', '+
								edgesIn[e].green+', '+
								edgesIn[e].blue+')';
		context.moveTo(edgesIn[e].c1.x, edgesIn[e].c1.y);
		context.lineTo(edgesIn[e].c2.x, edgesIn[e].c2.y);
		context.stroke();
    }
  
    //console.log("drew edges from list");
};
var drawEdge = function(edge) {
    elem = document.getElementById(canvasID);
    if (!elem || !elem.getContext) { return; }
    // Get the canvas 2d context.
    var context = elem.getContext('2d');
    if (!context || !context.putImageData) { return; }
    context.beginPath();
    context.strokeStyle = 'rgb('+edge.red+', '+
                          edge.green+', '+
                          edge.blue+')';
    context.lineWidth   = EDGE_WIDTH;
    context.moveTo(edge.c1.x, edge.c1.y);
    context.lineTo(edge.c2.x, edge.c2.y);
    context.stroke();
    //console.log("drew edge");
};
var createHex = function(x, y, depthInside, depthOutside) {
    var depthInsideCopy = depthInside;
    var v0 = {x: -triangleWidth / 2, y: triangleHeight};
    var v1 = {x: triangleWidth  / 2, y: triangleHeight};
    var dir = {x: (v1.x - v0.x), y: v1.y - v0.y}
    var mag = Math.sqrt(Math.pow(dir.x, 2)+Math.pow(dir.y, 2));
    dir = {x: dir.x / mag, y: dir.y / mag };
	for(var i = 0; i <= depthInside; i++) {
		var start = {x: x + v0.x * i, y: y + v0.y * i};
		var end   = {x: x + v1.x * i, y: y + v1.y * i};
		drawLine(start, end, i, (i==depthInside));
	}
  
    v0 = {x: 0, y: - 1};
    v1 = {x: -triangleWidth*3/4, y: triangleHeight/2}
    mag =  Math.sqrt(Math.pow(v1.x, 2)+Math.pow(v1.y, 2))
    v1 = {x: v1.x / mag, y: - v1.y / mag};
    v2 = {x: -v1.x, y: v1.y};
  
    var llCorner = {x: x - (depthInsideCopy)*triangleWidth/2,
		    y: y + (depthInsideCopy) * triangleHeight};
    var lrCorner = {x: x + (depthInsideCopy)*triangleWidth/2,
		    y: y + (depthInsideCopy) * triangleHeight};
  
    //console.log('starting outer triangle -------------------------------------------');
    //console.log('v1', "<"+v1.x+", "+v1.y+">");
    var outsideLeftCorner =  {x:llCorner.x + v1.x * depthOutside * rowSpacing, y:llCorner.y - v1.y * depthOutside * rowSpacing}
    var outsideRightCorner = {x:lrCorner.x + v2.x * depthOutside * rowSpacing, y:lrCorner.y - v2.y * depthOutside * rowSpacing}
    var outsideTopCorner   = {x:x + v0.x * depthOutside * rowSpacing,  y:y + v0.y * depthOutside * rowSpacing}
    //console.log('outsideLeftCorner', outsideLeftCorner);
    //console.log('outsideRightCorner', outsideRightCorner);
    //console.log('outsideTopCorner', outsideTopCorner);
    //console.log('llCorner', "("+llCorner.x+","+llCorner.y+")")
    //console.log('lrCorner', "("+lrCorner.x+","+lrCorner.y+")")
    var outsideCounter =  1;
    var rowSpacingCopy = rowSpacing;
    /*while(outsideCounter <= depthOutside) {
		var p0 = {x: x + v0.x * rowSpacingCopy * outsideCounter, y: y + v0.y * rowSpacingCopy * outsideCounter };
		var p1 = {x: llCorner.x + v1.x * rowSpacingCopy * outsideCounter, y: llCorner.y - v1.y * rowSpacingCopy * outsideCounter};
		var p2 = {x: lrCorner.x + v2.x * rowSpacingCopy * outsideCounter, y: lrCorner.y - v2.y * rowSpacingCopy * outsideCounter};
		drawArc(outsideLeftCorner, p0, p2,  outsideCounter+depthInsideCopy, 7 * Math.PI /6, outsideCounter == depthOutside);
		drawArc(outsideTopCorner, p1, p2,  outsideCounter+depthInsideCopy, Math.PI/2, outsideCounter == depthOutside);
		drawArc(outsideRightCorner, p0, p1,  outsideCounter+depthInsideCopy, -Math.PI/6, outsideCounter == depthOutside);
		
		outsideCounter++;
    }*/
	for(var i = depthOutside; i >= 1; i--) {
		var p0 = {x: x + v0.x * rowSpacingCopy * i, y: y + v0.y * rowSpacingCopy * i };
		var p1 = {x: llCorner.x + v1.x * rowSpacingCopy * i, y: llCorner.y - v1.y * rowSpacingCopy * i};
		var p2 = {x: lrCorner.x + v2.x * rowSpacingCopy * i, y: lrCorner.y - v2.y * rowSpacingCopy * i};
		drawArc(outsideLeftCorner, p0, p2,  i+depthInsideCopy, 7 * Math.PI /6, i == depthOutside);
		drawArc(outsideTopCorner, p1, p2,  i+depthInsideCopy, Math.PI/2, i == depthOutside);
		drawArc(outsideRightCorner, p0, p1,  i+depthInsideCopy, -Math.PI/6, i == depthOutside);
    }
};
var mag = function(v1, v2) {
    return Math.sqrt(Math.pow(v1.x-v2.x,2) + Math.pow(v1.y-v2.y,2));
};
//--------------------------------------------------------------------------
// User interaction
//--------------------------------------------------------------------------
var getClickedCenter = function(boardX, boardY) {
    //console.log("getClickedCenter");
    for(var j in centers) {
	var dist2 = mag(centers[j], {x: boardX, y: boardY});
	//console.log(dist2<circleRad, 'dist2', dist2, 'circleRad2', circleRad2);
	if(dist2<circleRad) {
	    return centers[j];
	}
    }
    return null;
};
var handleClick = function(e) {
    //console.log('clicked');
    offsets = {x: document.getElementById(canvasID).offsetLeft, y:document.getElementById(canvasID).offsetTop};
    var mouseX = e.layerX - offsets.x;
    var mouseY = e.layerY - offsets.y;
    //drawCircle(new Point(mouseX, mouseY, 120, 120, 120, 255), 3);
  
    //getNearestCenterAndDistWithLog(mouseX, mouseY, centers);
    c = getClickedCenter(mouseX, mouseY, centers);
	//console.log('clickedCenter: ', c.index, c);
    //console.log('clickedCenter', c);
    if(c==null) {
		return;
    }
    //console.log('innerCorner', c.innerCorner, 'outerCorner', c.outerCorner, 'fringe', c.fringe, 'edgeCount', c.edgeCount);
    //console.log('edges.length', c.edges.length);
    if(!c.clicked) {
		if(P1TURN==true) {
			c.red = P1COLOR.red;
			c.green = P1COLOR.green;
			c.blue = P1COLOR.blue;
			c.alpha = 1;
			c.whoClicked = "P1";
			for(var e in edges) {
				if((edges[e].c1==c && edges[e].c2.whoClicked == "P1") || (edges[e].c1.whoClicked == "P1" && edges[e].c2 == c)) {
					edges[e].red = P1COLOR.red;
					edges[e].green = P1COLOR.green;
					edges[e].blue = P1COLOR.blue;
					drawEdge(edges[e]);
				}
			}
			P1TURN = false;
			P2TURN = true;
			c.clicked = true;
		}
		else if(P2TURN==true) {
			c.red = P2COLOR.red;
			c.green = P2COLOR.green;
			c.blue = P2COLOR.blue;
			c.alpha = 1;
			c.whoClicked = "P2";
			
			for(var e in edges) {
				if((edges[e].c1==c && edges[e].c2.whoClicked == "P2") || (edges[e].c1.whoClicked == "P2" && edges[e].c2 == c)) {
					edges[e].red = P2COLOR.red;
					edges[e].green = P2COLOR.green;
					edges[e].blue = P2COLOR.blue;
					drawEdge(edges[e]);
				}
			}
			P1TURN = true;
			P2TURN = false;
			c.clicked = true;
		}
		c.rad = circleRad + circleRadExtra;
		
		//drawCircle(c, circleRad + circleRadExtra);
		
		/*var temp = getMovesFromFakeServer();
		var winningMoves = temp.winningMoves;
		var losingMoves = temp.losingMoves;
		for(var i in winningMoves) {
			//console.log("w", winningMoves[i]);
			winningMoves[i].red = WINNING_MOVE_COLOR.red;
			winningMoves[i].green = WINNING_MOVE_COLOR.green;
			winningMoves[i].blue = WINNING_MOVE_COLOR.blue;
			//drawCircle(winningMoves[i], circleRad);
			//console.log('winningMove', winningMoves[i]);
		}
		for(var i in losingMoves) {
			//console.log("l", losingMoves[i])
			losingMoves[i].red = LOSING_MOVE_COLOR.red;
			losingMoves[i].green = LOSING_MOVE_COLOR.green;
			losingMoves[i].blue = LOSING_MOVE_COLOR.blue;
			//drawCircle(losingMoves[i], circleRad);
			//console.log('losingMove', losingMoves[i]);
		}*/
    }
	
    clearEverything();
    drawEverything();
	y.doMove(c.index);
};
var clearEverything = function() {
    elem = document.getElementById(canvasID);
    if (!elem || !elem.getContext) { return; }
    // Get the canvas 2d context.
    var context = elem.getContext('2d');
    if (!context || !context.putImageData) { return; }
    context.clearRect(0, 0, canvasWidth, canvasHeight);
};
var drawEverything = function() {
    elem = document.getElementById(canvasID);
    if (!elem || !elem.getContext) { return; }
    // Get the canvas 2d context.
    var context = elem.getContext('2d');
    if (!context || !context.putImageData) { return; }
    drawEdgesFromList(edges);
    drawCircles();
};
/*var getMovesFromFakeServer = function() {
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
};*/

//--------------------------------------------------------------------------
// Initial Setup
//--------------------------------------------------------------------------
var y;
$(function() {
   centers = new Array();
   edges = new Array();
  
   div = document.getElementById("testdiv");
   if(div.clientWidth>canvasWidth) {
       canvasWidth = div.clientWidth;
   }
   if(div.clientWidth>canvasHeight) {
       var footer = document.getElementsByName("footer");
       canvasHeight = div.clientWidth;
       canvasHeight = window.innerHeight - 250;
   }
   // determine if the height or width is going to be the
   //constraining factor when drawing
   if(canvasHeight>canvasWidth) {
       constraint = canvasWidth;
   } else {
       constraint = canvasHeight;
   }
  
   // get row and column info from the URL
   centerRows = gup('centerRows');
   if(!centerRows) {
       centerRows = 2;
   } else {
       centerRows = parseInt(centerRows);
   }
   outerRows = gup('outerRows');
   if(!outerRows) {
       outerRows = 2;
   } else {
       outerRows = parseInt(outerRows);
   }
   if(centerRows<=1 && outerRows>3) {
       centerRows = 2;
   }
   // set the drop down menus to reflect the actual board
   orDropDown = document.getElementById('outerRowsFormID');
   for(var i = 0; i < orDropDown.length; i++) {
       if(orDropDown[i].value == outerRows.toString()) {
	   orDropDown.selectedIndex = i;
	   break;
       }
   }
  
   crDropDown = document.getElementById('centerRowsFormID');
   for(var i = 0; i < crDropDown.length; i++) {
       if(crDropDown[i].value == centerRows.toString()) {
	   crDropDown.selectedIndex = i;
	   break;
       }
   }
   centerRows-=1;
  
   // determine what the spacing should be depending on how big the canvas is
   //console.log('outerRows', outerRows, 'centerRows', centerRows);
   var width = 2 * (rowSpacing * Math.sqrt(3) / 2 * outerRows) +
               triangleWidth * centerRows + (circleRad + circleRadExtra) * 2;
   rowSpacing *= (constraint) / (width);
   triangleWidth *= (constraint) / width;
   triangleHeight *= (constraint) / width;
   circleRad = triangleWidth / 3.0;
   circleRadExtra = circleRad / 6.0;
   if(circleRad > 30) {
       circleRad = 30;
   }
   EDGE_WIDTH = Math.ceil(circleRad/3.0);
  
  

   // create the centers and edges
   createHex(canvasWidth/2,
	     outerRows * rowSpacing + circleRad + circleRadExtra,
	     centerRows, outerRows);
   makeEdges();
  
   // Instantiate the Y game object
   centerRows += 1;
   y = new Y(centerRows, outerRows);
   centerRows -= 1;
   // create the html canvas
   makeBoard(canvasWidth, canvasHeight);
  
   // draw the edges, and then the circles over them
   drawEdgesFromList(edges);
   drawCircles();
   //console.log("directly before y.start()");
   y.start();
});

function Y(centerRows, outerRows, config) {
    config = config || {};
    config.options = config.options || {};
    config.options.centerRows = centerRows;
    config.options.outerRows = outerRows;
    Y.superClass.constructor.call(this, 'y', 0, 0, config);
  
    // Register event listeners to hook into the framework.
    this.addEventListener('nextvaluesreceived',
			  this.handleNextValuesReceived.bind(this));
}
GCWeb.extend(Y, GCWeb.Game);

Y.prototype.start = function(team) {
    this.player = team || GCWeb.Team.BLUE;
    Y.superClass.start.call(this);
};

Y.prototype.getDefaultBoardString = function() {
    var ret = "";
	//console.log('centers.length: ', centers.length);
    for(var c = 0; c < centers.length; c++) {
		//console.log("centers[c].whoClicked: " + centers[c].whoClicked + ", " + c);
		if(centers[c].whoClicked == "P1") {
			ret = ret + "X";
		} else if(centers[c].whoClicked == "P2") {
			ret = ret + "O";
		} else {
			ret = ret + " ";
		}
		//console.log('ret: "'+ret+'"');
    }
    //console.log('getDefaultBoardString: "' + ret + '"');
    return ret;
};

Y.prototype.handleNextValuesReceived = function(moveValues) {
    //console.log("I got move values! ", moveValues);
	//if(SHOW_MOVE_VALUES==true) {
		for(var m in moveValues) {
			var centerIndex = parseInt(moveValues[m].move);
			for(var i in centers) {
				if(centers[i].index == centerIndex) {
					if(moveValues[m].value=="win" && !centers[i].clicked) {
						centers[i].red = WINNING_MOVE_COLOR.red;
						centers[i].green = WINNING_MOVE_COLOR.green;
						centers[i].blue = WINNING_MOVE_COLOR.blue;
						break;
					} else if(moveValues[m].value=="lose" && !centers[i].clicked) {
						centers[i].red = LOSING_MOVE_COLOR.red;
						centers[i].green = LOSING_MOVE_COLOR.green;
						centers[i].blue = LOSING_MOVE_COLOR.blue;
						break;
					}
				}
			}
		}
		//clearEverything();
		//drawEverything();
	//}
	clearEverything();
	drawEverything();
};
Y.prototype.showMoveValues = function(moves) {
    //console.log("I should show move values", moves);
    SHOW_MOVE_VALUES = true;
	clearEverything();
	drawEverything();
};
Y.prototype.hideMoveValues = function() {
    //console.log("I should hide move values");
    SHOW_MOVE_VALUES = false;
	clearEverything();
	drawEverything();
};


if(false) {
    Y.P1COLOR = {red: 255, green: 0, blue: 0};
    Y.P2COLOR = {red: 0, green: 0, blue: 255};
    Y.BGCOLOR = {red: 0, green: 0, blue: 102};
    Y.WINNING_MOVE_COLOR = {red: 50, green: 50, blue: 50};
    Y.LOSING_MOVE_COLOR = {red: 0, green: 200, blue:50};
    Y.BOARD_STARTING_COLOR = {red: 210, green: 180, blue: 140};
    Y.EDGE_STARTING_COLOR = {red: 0, green: 0, blue: 0};
    Y.HIGHLIGHTED_COLOR = {red: 0, green: 0, blue: 0};
    Y.EDGE_WIDTH = 4;
    Y.P1TURN = true;
    Y.P2TURN = false;

    Y.canvasID = "board";
    Y.div = null;
    Y.canvasWidth = 0;
    Y.canvasHeight = 0;
    Y.constraint;
    Y.circleRad = 10;

    Y.offsets; // = {x: 8, y: 110};
    Y.tileBorder = 1;

    Y.centers;
    Y.edges;
    //Y.currentCenter;
    //Y.previousCenter = null;

    Y.centerRows;
    Y.outerRows;
    Y.triangleWidth = 30;
    Y.triangleHeight = triangleWidth/2 * Math.sqrt(3);
    Y.rowSpacing = 40;
    Y.axisSpacing = 100;
};

// ---- Duplicated variables ----
var P1COLOR = {red: 0, green: 0, blue: 255};
var P2COLOR = {red: 255, green: 0, blue: 0};
var BGCOLOR = {red: 0, green: 0, blue: 102};
var WINNING_MOVE_COLOR = {red: 0, green: 255, blue: 0};
var LOSING_MOVE_COLOR = {red: 139, green: 0, blue: 0};
var BOARD_STARTING_COLOR = {red: 210, green: 180, blue: 140};
var EDGE_STARTING_COLOR = {red: 0, green: 0, blue: 0};
var HIGHLIGHTED_COLOR = {red: 0, green: 0, blue: 0};
var EDGE_WIDTH = 4;
var P1TURN = true;
var P2TURN = false;
var SHOW_MOVE_VALUES = false;
var CENTER_INDEX = 0;

var canvasID = "board";
var div = null;
var canvasWidth = 0;
var canvasHeight = 0;
var constraint;
var circleRad = 10;
var circleRadExtra = 4;

var offsets; // = {x: 8, y: 110};
var tileBorder = 1;

var centers;
var edges;
//Y.currentCenter;
//Y.previousCenter = null;

var centerRows;
var outerRows;
var triangleWidth = 30;
var triangleHeight = triangleWidth / 2 * Math.sqrt(3);
var rowSpacing = 40;
var axisSpacing = 100;
