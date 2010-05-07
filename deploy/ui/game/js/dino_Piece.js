/*
 * Ownership should take either the value "green" for the green player or "purple" for the purple player 
 * myRow and myCol refer directly to the position of the piece on the board--they match up with the unique ID given to each image making up the board
 */
 
function Piece(row, col, ownership, id, currentSquare, arrow1, arrow2, arrow3){ 
	//Public instance variables 
    this.myRow = row; 				
    this.myCol = col;
    this.myPlayer = ownership;
	this.myCurrentSquare = currentSquare;
	
	this.myIDJQuery = '#' + id; 
	this.myID = id; 
	
    this.moveIncrement = 100; //pixels, determined by the width/length of the board squares 
	
    this.arrows = new Array(3); //assumes a piece will never move towards it's starting area 
	this.arrows[0] = arrow1;
	this.arrows[1] = arrow2;
	this.arrows[2] = arrow3; 
	
	//Public methods
	this.hideArrows = hideArrows; 
	this.applyOffsetToArrows = applyOffsetToArrows;
	this.setArrowsClickResponse = setArrowsClickResponse; 
	this.setArrowsHoverResponse = setArrowsHoverResponse; 
	
	this.drawNorthArrow = drawNorthArrow;
	this.drawSouthArrow = drawSouthArrow;
	this.drawEastArrow = drawEastArrow;
	this.drawWestArrow = drawWestArrow; 
	this.hideNorthArrow = hideNorthArrow;
	this.hideSouthArrow = hideSouthArrow;
	this.hideEastArrow = hideEastArrow;
	this.hideWestArrow = hideWestArrow; 
	this.findArrow = findArrow; 
	
	this.animatePiece = animatePiece;
	this.moveArrows = moveArrows; 
	this.arrowClicked = arrowClicked; 
	this.hide = hide; 
	
	this.animatePieceNorth = animatePieceNorth; 
	this.animatePieceSouth = animatePieceSouth; 
	this.animatePieceWest = animatePieceWest; 
	this.animatePieceEast = animatePieceEast; 
	
	this.moveArrowsNorth = moveArrowsNorth;
	this.moveArrowsSouth = moveArrowsSouth;
	this.moveArrowsWest = moveArrowsWest;
	this.moveArrowsEast = moveArrowsEast;
	
	//For debugging purposes
	this.showArrows = showArrows; 
	
    function animatePiece(direction){
		if(direction == "north") {
			this.animatePieceNorth();
		} else if (direction == "south") {
			this.animatePieceSouth();
		} else if(direction == "east") {
			this.animatePieceEast();
		} else if (direction == "west") {
			this.animatePieceWest();
		} else {
			//console.error("The argument passed to Piece.animatePiece(direction) did not contain a valid value-- ie. \"north\" \"south\" \"east\" \"west\""); 
		}
	}
	
	function moveArrows(direction) {
		if(direction == "north") {
			this.moveArrowsNorth();
		} else if (direction == "south") {
			this.moveArrowsSouth();
		} else if(direction == "east") {
			this.moveArrowsEast();
		} else if (direction == "west") {
			this.moveArrowsWest();
		} else {
			//console.error("The argument passed to Piece.moveArrows(direction) did not contain a valid value-- ie. \"north\" \"south\" \"east\" \"west\""); 
		}
	}
	
	function moveArrowsNorth() {
		for(var i = 0; i < this.arrows.length; i++) {
			this.arrows[i].moveNorth(); 
		}
	}
	
	function moveArrowsSouth() {
		for(var i = 0; i < this.arrows.length; i++) {
			this.arrows[i].moveSouth(); 
		}
	}
	
	function moveArrowsEast() {
		for(var i = 0; i < this.arrows.length; i++) {
			this.arrows[i].moveEast(); 
		}
	}
	
	function moveArrowsWest() {
		for(var i = 0; i < this.arrows.length; i++) {
			this.arrows[i].moveWest(); 
		}
	}
    
    function animatePieceNorth(){
        this.myRow--;
		$(this.myIDJQuery).animate({top: "-=105px"}); 
    }
    
    function animatePieceSouth(){
        this.myRow++;
		$(this.myIDJQuery).animate({top: "+=105px"}); 
    }
    
    function animatePieceEast(){
        this.myCol++;
		$(this.myIDJQuery).animate({left: "+=100px"}); 
    }
    
    function animatePieceWest(){
        this.myCol--;
		$(this.myIDJQuery).animate({left: "-=100px"});
    }
	
	function hideArrows() {
		for(var i = 0; i < this.arrows.length; i++) {
			this.arrows[i].hide(); 
		}
	}	
	
	function showArrows() {
		for(var i = 0; i < this.arrows.length; i++) {
			this.arrows[i].show(); 
		}
	}	
	
	function applyOffsetToArrows() {
		for(var i = 0; i < this.arrows.length; i++) {
			this.arrows[i].applyOffset(); 
		}
	}
	
	
	function setArrowsClickResponse(fn) {
		for(var i = 0; i < this.arrows.length; i++) {
			this.arrows[i].setClickResponse(fn);
		}
	}
	
	function setArrowsHoverResponse() {
	for(var i = 0; i < this.arrows.length; i++) {
			this.arrows[i].setHoverResponse();
		}
	}
	
	function drawNorthArrow() {
		var ar = this.findArrow("north"); 
		ar.drawSelf(); 
	}
	
	function drawSouthArrow() {
		var ar = this.findArrow("south"); 
		ar.drawSelf(); 
	}
	
	function drawEastArrow() {
		var ar = this.findArrow("east"); 
		ar.drawSelf(); 
	}
	
	function drawWestArrow() {
		var ar = this.findArrow("west"); 
		ar.drawSelf(); 
	}
	
	function hideNorthArrow() {
		var ar = this.findArrow("north"); 
		ar.hide(); 
	}
	
	function hideSouthArrow() {
		var ar = this.findArrow("south"); 
		ar.hide(); 
	}
	
	function hideEastArrow() {
		var ar = this.findArrow("east"); 
		ar.hide(); 
	}
	
	function hideWestArrow() {
		var ar = this.findArrow("west"); 
		ar.hide(); 
	}
	
	function findArrow(direction) {
		for(var i = 0; i < this.arrows.length; i++) {
			if( this.arrows[i].myDirection == direction) {
				return this.arrows[i];
			}
		}
		//console.error("Invalid direction argument given to Piece.findArrow()"); 
	}
	
	function arrowClicked(arrowID) {
		var direction = "";
		for(var i = 0; i < this.arrows.length; i++) {
			if(this.arrows[i].myID == arrowID) {
				direction = this.arrows[i].myDirection; 
			}
		}
		this.animatePiece(direction);
		this.moveArrows(direction); 
	} 
	
	function hide() {
		var el = document.getElementById(this.myID); 
		el.style.display = "none";
	}
}