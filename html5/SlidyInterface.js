/**
-drawValidMoves is called in the meta file by a drawPieces function that is activated 
when a sliding piece is clicked on.  validmoves is an ArrayList of (x,y) positions we will draw at. 
The meta file must give nested arrays with all(x,y) coordinates for valid moves. 
-For example [[100,100], [200, 50]] says there are two moves for that piece:
at (100, 100) and (200, 50). 
-jCanvas is the board object for us to draw on, imported into function in case. Possibly unnecessary. 
-jCanvas and jQuery must be imported in meta file. 
 */
function drawValidMoves(ctx, validmoves, x1, y1, pieceWidth) {
	console.log("inside drawValidMoves");
	for (var i = 0; i < validmoves.length; i++) {
		var move = validmoves[i];
		canvasPolyArrow(x1, y1, move[0], move[1], pieceWidth);
	}
	console.log("drew all valid moves!");
}

		
/** Draws arrow objects on the canvas with widths half the width of 
the piece and length adjusted to valid moves. 
Determines which direction the move is and then draws the arrow 
from the center of the piece to the center of the move */
function canvasPolyArrow(fromx, fromy, tox, toy, pieceWidth) {
    width = (pieceWidth / 4);
	length = Math.sqrt(((tox - fromx)*(tox - fromx)) + ((toy - fromy)*(toy - fromy)));
	halfwidth = (width / 2);
	arrowsides = width;
	arrowtip = (width * 2);
	taillength = (length - arrowtip);
	arrowbase = (width * 2);
	angle = Math.atan((Math.abs(toy - fromy))/(Math.abs(tox - fromx)))
	compangle = ((Math.PI / 2) - angle)
	startx = fromx
	starty= fromy

	NPolyArrow = function() { $("canvas").drawLine({
		layer: true,
		fillStyle: "yellow",
		strokeWidth: 10,
		x1: startx - halfwidth, y1: starty,
		x2: startx - halfwidth, y2: toy + arrowbase,
		x3: startx - halfwidth - arrowsides, y3: toy + arrowbase,
		x4: tox, y4: toy,
		x5: startx + halfwidth + arrowsides, y5: toy + arrowbase,
		x6: startx + halfwidth, y6: toy + arrowbase,
		x7: startx + halfwidth, y7: starty,
		
		});
	}
	
	SPolyArrow = function() { $("canvas").drawLine({
		layer: true,
		fillStyle: "yellow",
		strokeWidth: 10,
		x1: startx - halfwidth, y1: starty,
		x2: startx - halfwidth, y2: toy - arrowbase,
		x3: startx - halfwidth - arrowsides, y3: toy + arrowbase,
		x4: tox, y4: toy,
		x5: startx + halfwidth + arrowsides, y5: toy - arrowbase,
		x6: startx + halfwidth, y6: toy - arrowbase,
		x7: startx + halfwidth, y7: starty,
		});
	}

	EPolyArrow = function() { $("canvas").drawLine({
		layer: true,
		fillStyle: "yellow",
		strokeWidth: 10,
		x1: startx, y1: starty - halfwidth,
		x2: tox - arrowbase, y2: starty - halfwidth,
		x3: tox - arrowbase, y3: starty - halfwidth - arrowsides,
		x4: tox, y4: toy,
		x5: tox - arrowbase, y5: starty + halfwidth + arrowsides,
		x6: tox - arrowbase, y6: starty + halfwidth,
		x7: startx, y7: starty + halfwidth,
		});
	}

	WPolyArrow = function() { $("canvas").drawLine({
		layer: true,
		fillStyle: "yellow",
		strokeWidth: 10,
		x1: startx, y1: starty - halfwidth,
		x2: tox + arrowbase, y2: starty - halfwidth,
		x3: tox + arrowbase, y3: starty - halfwidth - arrowsides,
		x4: tox, y4: toy,
		x5: tox + arrowbase, y5: starty + halfwidth + arrowsides,
		x6: tox + arrowbase, y6: starty + halfwidth,
		x7: startx, y7: starty + halfwidth,
		});
	}
	
	NEPolyArrow = function() { $("canvas").drawLine({
		layer: true,
		fillStyle: "yellow",
		strokeWidth: 10,
		x1: startx - (halfwidth * Math.cos(compangle)), y1: starty - (halfwidth * Math.sin(compangle)),
		x2: startx - (halfwidth * Math.cos(compangle)) + (taillength * Math.cos(angle)), y2: starty - (halfwidth * Math.sin(compangle)) - (taillength * Math.sin(angle)),
		x3: startx - (halfwidth * Math.cos(compangle)) + (taillength * Math.cos(angle)) - (arrowsides * Math.cos(compangle)), y3: starty - (halfwidth * Math.sin(compangle)) - (taillength * Math.sin(angle)) - (arrowsides * Math.sin(compangle)),
		x4: tox, y4: toy,
		x5: startx + (halfwidth * Math.cos(compangle)) + (taillength * Math.cos(angle)) + (arrowsides * Math.cos(compangle)), y5: starty + (halfwidth * Math.sin(compangle)) - (taillength * Math.sin(angle)) + (arrowsides * Math.sin(compangle)),
		x6: startx + (halfwidth * Math.cos(compangle)) + (taillength * Math.cos(angle)), y6: starty + (halfwidth * Math.sin(compangle)) - (taillength * Math.sin(angle)),
		x7: startx + (halfwidth * Math.cos(compangle)), y7: starty + (halfwidth * Math.sin(compangle)),

		});
	}

	SEPolyArrow = function() { $("canvas").drawLine({
		layer: true,
		fillStyle: "yellow",
		strokeWidth: 10,
		x1: startx + (halfwidth * Math.cos(compangle)), y1: starty - (halfwidth * Math.sin(compangle)),
		x2: startx + (halfwidth * Math.cos(compangle)) + (taillength * Math.cos(angle)), y2: starty - (halfwidth * Math.sin(compangle)) + (taillength * Math.sin(angle)),
		x3: startx + (halfwidth * Math.cos(compangle)) + (taillength * Math.cos(angle)) + (arrowsides * Math.cos(compangle)), y3: starty - (halfwidth * Math.sin(compangle)) + (taillength * Math.sin(angle)) - (arrowsides * Math.sin(compangle)),
		x4: tox, y4: toy,
		x5: startx - (halfwidth * Math.cos(compangle)) + (taillength * Math.cos(angle)) - (arrowsides * Math.cos(compangle)), y5: starty + (halfwidth * Math.sin(compangle)) + (taillength * Math.sin(angle)) + (arrowsides * Math.sin(compangle)),
		x6: startx - (halfwidth * Math.cos(compangle)) + (taillength * Math.cos(angle)), y6: starty + (halfwidth * Math.sin(compangle)) + (taillength * Math.sin(angle)),
		x7: startx - (halfwidth * Math.cos(compangle)), y7: starty + (halfwidth * Math.sin(compangle)),

		});
	}

	NWPolyArrow = function() { $("canvas").drawLine({
		layer: true,
		fillStyle: "yellow",
		strokeWidth: 10,
		x1: startx + (halfwidth * Math.cos(compangle)), y1: starty - (halfwidth * Math.sin(compangle)),
		x2: startx + (halfwidth * Math.cos(compangle)) - (taillength * Math.cos(angle)), y2: starty - (halfwidth * Math.sin(compangle)) - (taillength * Math.sin(angle)),
		x3: startx + (halfwidth * Math.cos(compangle)) - (taillength * Math.cos(angle)) + (arrowsides * Math.cos(compangle)), y3: starty - (halfwidth * Math.sin(compangle)) - (taillength * Math.sin(angle)) - (arrowsides * Math.sin(compangle)),
		x4: tox, y4: toy,
		x5: startx - (halfwidth * Math.cos(compangle)) - (taillength * Math.cos(angle)) - (arrowsides * Math.cos(compangle)), y5: starty + (halfwidth * Math.sin(compangle)) - (taillength * Math.sin(angle)) + (arrowsides * Math.sin(compangle)),
		x6: startx - (halfwidth * Math.cos(compangle)) - (taillength * Math.cos(angle)), y6: starty + (halfwidth * Math.sin(compangle)) - (taillength * Math.sin(angle)),
		x7: startx - (halfwidth * Math.cos(compangle)), y7: starty + (halfwidth * Math.sin(compangle)),

		});
	}

	SWPolyArrow = function() { $("canvas").drawLine({
		layer: true,
		fillStyle: "yellow",
		strokeWidth: 10,
		x1: startx - (halfwidth * Math.cos(compangle)), y1: starty - (halfwidth * Math.sin(compangle)),
		x2: startx - (halfwidth * Math.cos(compangle)) - (taillength * Math.cos(angle)), y2: starty - (halfwidth * Math.sin(compangle)) + (taillength * Math.sin(angle)),
		x3: startx - (halfwidth * Math.cos(compangle)) - (taillength * Math.cos(angle)) - (arrowsides * Math.cos(compangle)), y3: starty - (halfwidth * Math.sin(compangle)) + (taillength * Math.sin(angle)) - (arrowsides * Math.sin(compangle)),
		x4: tox, y4: toy,
		x5: startx + (halfwidth * Math.cos(compangle)) - (taillength * Math.cos(angle)) + (arrowsides * Math.cos(compangle)), y5: starty + (halfwidth * Math.sin(compangle)) + (taillength * Math.sin(angle)) + (arrowsides * Math.sin(compangle)),
		x6: startx + (halfwidth * Math.cos(compangle)) - (taillength * Math.cos(angle)), y6: starty + (halfwidth * Math.sin(compangle)) + (taillength * Math.sin(angle)),
		x7: startx + (halfwidth * Math.cos(compangle)), y7: starty + (halfwidth * Math.sin(compangle)),

		});
	}
	
	if (startx < tox && starty == toy) {
		EPolyArrow();
	}
	if (startx > tox && starty == toy) {
		WPolyArrow();
	}
	if (startx == tox && starty < toy) {
		SPolyArrow();
	}
	if (startx == tox && starty > toy) {
		NPolyArrow();
	}	
	if (startx < tox && starty < toy) {
		SEPolyArrow();
	}
	if (startx < tox && starty > toy) {
		NEPolyArrow();
	}
	if (startx > tox && starty < toy) {
		SWPolyArrow();
	}
	if (startx > tox && starty > toy) {
		NWPolyArrow();
	}
}


