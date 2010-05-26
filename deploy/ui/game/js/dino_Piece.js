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
    this.moveIncrement = 100; //Measured in pixels; determined by the width/length of the board squares 

    this.arrows = new Array(3); //assumes a piece will never move towards it's starting area 
	this.arrows[0] = arrow1;
	this.arrows[1] = arrow2;
	this.arrows[2] = arrow3; 
	
	//Public methods
	
	//Initialization methods
	this.applyOffsetToArrows = applyOffsetToArrows;
	this.applyOffset = applyOffset; 
	
	//Hide/show methods
	this.hide = hide; 
	this.hideArrows = hideArrows; 
	this.drawNorthArrow = drawNorthArrow;
	this.drawSouthArrow = drawSouthArrow;
	this.drawEastArrow = drawEastArrow;
	this.drawWestArrow = drawWestArrow; 
	this.hideNorthArrow = hideNorthArrow;
	this.hideSouthArrow = hideSouthArrow;
	this.hideEastArrow = hideEastArrow;
	this.hideWestArrow = hideWestArrow; 
	
	//Event handlers
	this.arrowClicked = arrowClicked; 
	this.findArrow = findArrow; 
	this.setArrowsClickResponse = setArrowsClickResponse; 
	this.setArrowsHoverResponse = setArrowsHoverResponse; 
	
	//Movement methods
	this.animatePiece = animatePiece;
	this.animatePieceNorth = animatePieceNorth; 
	this.animatePieceSouth = animatePieceSouth; 
	this.animatePieceWest = animatePieceWest; 
	this.animatePieceEast = animatePieceEast; 
	
	this.moveArrows = moveArrows;
	this.moveArrowsNorth = moveArrowsNorth;
	this.moveArrowsSouth = moveArrowsSouth;
	this.moveArrowsWest = moveArrowsWest;
	this.moveArrowsEast = moveArrowsEast;
	
	this.animatePieceToGoal = animatePieceToGoal; 
	this.animatePieceNorthToGoal = animatePieceNorthToGoal;
	this.animatePieceEastToGoal = animatePieceEastToGoal; 
	
	//Debugging methods
	this.showArrows = showArrows; 
	
    function animatePiece(direction, board, piece){
		if(direction == "north") {
			this.animatePieceNorth(board, piece);
		} else if (direction == "south") {
			this.animatePieceSouth(board, piece);
		} else if(direction == "east") {
			this.animatePieceEast(board, piece);
		} else if (direction == "west") {
			this.animatePieceWest(board, piece);
		} else {
			//console.error("The argument passed to Piece.animatePiece(direction) did not contain a valid value-- ie. \"north\" \"south\" \"east\" \"west\""); 
		}
	}
	
	function animatePieceToGoal(direction, board, piece){
		if(direction == "north") {
			this.animatePieceNorthToGoal(board, piece);
		} else if(direction == "east") {
			this.animatePieceEastToGoal(board, piece);
		} else {
			//console.error("The argument passed to Piece.animatePieceToGoal(direction) did not contain a valid value-- ie. \"north\" \"east\""); 
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
    
    function animatePieceNorth(board, piece){
        this.myRow--;
		$(this.myIDJQuery).animate({top: "-="+this.moveIncrement+"px"}, function() {
			board.updateBoardRepresentation(piece);
			board.setupNextTurn(); 
		} ); 
    }
    
    function animatePieceSouth(board, piece){
        this.myRow++;
		$(this.myIDJQuery).animate({top: "+="+this.moveIncrement+"px"}, function() {
			board.updateBoardRepresentation(piece);
			board.setupNextTurn(); 
		} ); 
    }
    
    function animatePieceEast(board, piece){
        this.myCol++;
		$(this.myIDJQuery).animate({left: "+="+this.moveIncrement+"px"}, function() {
			board.updateBoardRepresentation(piece);
			board.setupNextTurn(); 
		} ); 
    }
    
    function animatePieceWest(board, piece){
        this.myCol--;
		$(this.myIDJQuery).animate({left: "-="+this.moveIncrement+"px"}, function() {
			board.updateBoardRepresentation(piece);
			board.setupNextTurn(); 
		} );
    }
	
	function animatePieceNorthToGoal(board, piece) {
		this.myRow--;
		$(this.myIDJQuery).animate({opacity: 0, top: "-="+this.moveIncrement+"px"}, 500, function() {
			board.updateBoardRepresentation(piece);
			board.setupNextTurn(); 
		} ); 
	}
	
	function animatePieceEastToGoal(board, piece) {
		this.myCol++;
		$(this.myIDJQuery).animate({opacity: 0, left: "+="+this.moveIncrement+"px"}, 500, function() {
			board.updateBoardRepresentation(piece); 
			board.setupNextTurn(); 
		} );
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
	
	function applyOffset() {
		var el = document.getElementById(this.myID); 
		var valAsString = $(this.myIDJQuery).css('top'); 
		var numVal = parseInt(valAsString.substring(0,valAsString.length-2));
		el.style.top = numVal - 50 + "px"; 
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
	
	function arrowClicked(arrowID,movingIntoGoal,board,piece) {
		var direction = "";
		for(var i = 0; i < this.arrows.length; i++) {
			if(this.arrows[i].myID == arrowID) {
				direction = this.arrows[i].myDirection; 
			}
		}
		if(movingIntoGoal) {
			this.animatePieceToGoal(direction, board, piece); 
			this.moveArrows(direction); 
		} else {
			this.animatePiece(direction, board, piece);
			this.moveArrows(direction); 
		} 
	} 
	
	function hide() {
		var el = document.getElementById(this.myID); 
		el.style.display = "none";
	}
}