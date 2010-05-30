function Board(sizeOfCenterArea, firstPlayer, clickHandlerFunction, skin) {
	//Public instance variables 
	this.boardWidth = sizeOfCenterArea + 2;
	this.numPurplePieces = sizeOfCenterArea - 1; 
	this.numGreenPieces = sizeOfCenterArea - 1; 
	this.currentPlayer = firstPlayer; 
	this.skinChoice = skin; 
	
	this.imageDirectoryAddress = "game/images/dino/"; 
	this.IDSeparater = "-"; 
	this.greenPieceIDIdentifier = "GP";
	this.purplePieceIDIdentifier = "PP"; 
	this.northArrowIDIdentifier = "NA";
	this.southArrowIDIdentifier = "SA";
	this.eastArrowIDIdentifier = "EA"; 
	this.westArrowIDIdentifier = "WA"; 
	
	this.orangeSpaceAddress = "CommonSquare.jpg";
	this.greenSpaceAddress = "OStartSquare.jpg";
	this.purpleSpaceAddress = "XStartSquare.jpg";
	this.greenGoalAddress = "OGoalSquare.png";
	this.purpleGoalAddress = "XGoalSquare.png";
	this.transparentAddress = "Transparent.png";  
	
	this.northArrowAddress = this.imageDirectoryAddress + "UpArrow.png"; 
	this.eastArrowAddress = this.imageDirectoryAddress + "RightArrow.png"; 
	this.southArrowAddress = this.imageDirectoryAddress + "DownArrow.png";
	this.westArrowAddress = this.imageDirectoryAddress + "LeftArrow.png";

	this.purplePieceAddress = "XPiece.png";
	this.greenPieceAddress = "OPiece.png";
	
	this.transparentLocation = "T"; 
	this.purpleGoalLocation = "PG";
	this.greenGoalLocation = "GG";
	this.purpleStartLocation = "PS"
	this.greenStartLocation = "GS"; 
	this.emptyLocation = null; 
	
	this.piecesOnBoard = new Array(this.boardWidth); 
	this.purplePieces = new Array(this.numPurplePieces); 
	this.greenPieces = new Array(this.numGreenPieces); 
	this.skinSet = new Array(7); 
	
	this.currentPlayerCanMove = false; 
	
	//Public Methods
	
	//Initialization methods
	this.populateArrayWithPieces = populateArrayWithPieces;
	this.make2DArray = make2DArray; 
	this.drawBoard = drawBoard; 
	this.applyOffsetToAllArrows = applyOffsetToAllArrows;
	this.applyOffsetToAllPieces = applyOffsetToAllPieces; 
	this.applySkin = applySkin; 
	
	//Hide/show methods
	this.hideGreenArrows = hideGreenArrows; 
	this.hidePurpleArrows = hidePurpleArrows;
	this.hideAllArrows = hideAllArrows; 
	this.drawArrows = drawArrows;
	
	//Event handlers
	this.setAllArrowsClickResponse = setAllArrowsClickResponse; 
	this.setAllArrowsHoverResponse = setAllArrowsHoverResponse; 
	this.findPieceObject = findPieceObject;
	
	//Movement methods
	this.toggleNextPlayer = toggleNextPlayer; 
	this.currentPlayerWon = currentPlayerWon;
	this.updateBoardRepresentation = updateBoardRepresentation; 
	this.removePurplePiece = removePurplePiece;
	this.removeGreenPiece = removeGreenPiece; 
	this.removePieceOnGoal = removePieceOnGoal; 
	this.showPlayerTrappedAlert = showPlayerTrappedAlert;
	this.showGameOverAlert = showGameOverAlert; 
	this.setupNextTurn = setupNextTurn; 
	this.movingIntoGoal = movingIntoGoal; 
	
	//Debugging methods
	this.showGreenArrows = showGreenArrows;
	this.showPurpleArrows = showPurpleArrows; 
	this.showAllArrows = showAllArrows; 
	this.printGreenPieces = printGreenPieces;
	this.printPurplePieces = printPurplePieces; 
	this.printPiecesOnBoard = printPiecesOnBoard; 
	this.printSkinSet = printSkinSet; 
	
	//Constructor 
	this.applySkin(); 
	this.printSkinSet();
	this.piecesOnBoard =  this.make2DArray(this.piecesOnBoard);
	this.printSkinSet();
	this.populateArrayWithPieces(); 
	//this.printSkinSet();
	this.drawBoard(); 
	//this.printSkinSet();
	var myThis = this;
	setTimeout(function() {
		myThis.applyOffsetToAllPieces(); 
		myThis.applyOffsetToAllArrows();
		myThis.hideAllArrows();
		myThis.drawArrows();
	}, 10);
	this.setAllArrowsClickResponse(clickHandlerFunction);
	this.setAllArrowsHoverResponse(); 
	//End of constructor
	
	function applySkin() {
		this.orangeSpaceAddress = this.imageDirectoryAddress + this.skinChoice + this.orangeSpaceAddress;
		this.greenSpaceAddress = this.imageDirectoryAddress + this.skinChoice + this.greenSpaceAddress;
		this.purpleSpaceAddress = this.imageDirectoryAddress + this.skinChoice + this.purpleSpaceAddress;
		this.greenGoalAddress = this.imageDirectoryAddress + this.skinChoice + this.greenGoalAddress;
		this.purpleGoalAddress = this.imageDirectoryAddress + this.skinChoice + this.purpleGoalAddress;
		this.transparentAddress = this.imageDirectoryAddress + this.skinChoice + this.transparentAddress;  
		this.purplePieceAddress = this.imageDirectoryAddress + this.skinChoice + this.purplePieceAddress;
		this.greenPieceAddress = this.imageDirectoryAddress + this.skinChoice + this.greenPieceAddress;
	}
	
	function removePurplePiece(piece) {
		piece.hide(); 
		for(var i = 0; i < this.purplePieces.length; i++) {
			if(this.purplePieces[i] == piece) {
				this.purplePieces[i] = null;
				break; 
			}
		}
		this.piecesOnBoard[piece.myCol][piece.myRow] = piece.myCurrentSquare; 
	}
	
	function removeGreenPiece(piece) {
		piece.hide(); 
		for(var i = 0; i < this.greenPieces.length; i++) {
			if(this.greenPieces[i] == piece) {
				this.greenPieces[i] = null;
				break; 
			}
		}
		this.piecesOnBoard[piece.myCol][piece.myRow] = piece.myCurrentSquare; 
	}
	
	function populateArrayWithPieces() {
		// The entire board is guaranteed to have at least 3 columns and 3 rows
		
		var firstColumn = 0;
		var secondColumn = 1;
		var thirdColumn = 2; 
		var secondLastColumn = this.piecesOnBoard.length-2;
		var lastColumn = this.piecesOnBoard.length-1; 
		
		var firstRow = 0;
		var secondRow = 1;
		var thirdRow = 2; 
		var thirdLastRow = this.piecesOnBoard.length-3; 
		var secondLastRow = this.piecesOnBoard.length-2;
		var lastRow = this.piecesOnBoard.length-1;

		//Populates the first column of the array representing the game board
		this.piecesOnBoard[firstColumn][firstRow] = this.transparentLocation; 
		for(var i = secondRow; i <= thirdLastRow; i++) {							
			this.piecesOnBoard[firstColumn][i] = this.greenStartLocation; 
		}
		this.piecesOnBoard[firstColumn][secondLastRow] = this.transparentLocation; 
		this.piecesOnBoard[firstColumn][lastRow] = this.transparentLocation; 
		
		//Populates the second column of the array representing the game board
		this.piecesOnBoard[secondColumn][firstRow] = this.purpleGoalLocation;
		for(var i = secondRow; i <= secondLastRow; i++) {		 
			this.piecesOnBoard[secondColumn][i] = this.emptyLocation; 
		}
		this.piecesOnBoard[secondColumn][lastRow] = this.transparentLocation; 
		
		//Populates the third column to the second last column of the array representing the game board
		for(var i = thirdColumn; i <= secondLastColumn; i++) {
			this.piecesOnBoard[i][firstRow] = this.purpleGoalLocation; 
			for(var j = secondRow; j <= secondLastRow; j++) {
				this.piecesOnBoard[i][j] = this.emptyLocation; 	
			}
			this.piecesOnBoard[i][lastRow] = this.purpleStartLocation; 
		}
		
		//Populates the last column of the array representing the game board 
		this.piecesOnBoard[lastColumn][firstRow] = this.transparentLocation; 
		
		for(var i = secondRow; i <= secondLastRow; i++) {		 
			this.piecesOnBoard[lastColumn][i] = this.greenGoalLocation; 
		}
		this.piecesOnBoard[lastColumn][lastRow] = this.transparentLocation; 
		
	}
	
	function drawBoard() {
		var greenPieceCount = 0;
		var purplePieceCount = 0; 
		for (var i = 0; i < this.boardWidth; i++){
				var nextRow = document.createElement("tr");
				
				$('#board').append(nextRow);
				for (var j = 0; j < this.boardWidth; j++){
					var nextCell = document.createElement("td");
					
					var inFirstRow = (i == 0);
					var inSecondRow = (i == 1);
					var inLastRow = (i == this.boardWidth - 1);
					var inSecondToLastRow = (i == this.boardWidth - 2);
					
					var inFirstColumn = (j == 0);
					var inFirstTwoColumns = (j <= 1);
					var inLastColumn = (j == this.boardWidth - 1);
					
					if (inLastRow){
						if (inFirstTwoColumns || inLastColumn){
							nextCell.setAttribute("style", "background-image:url('" + this.transparentAddress+ "');");
							nextCell.setAttribute("height", "100px");
							nextCell.setAttribute("width", "100px");
						} else {
							var purplePiece = document.createElement("img");
							var pieceID = this.purplePieceIDIdentifier + this.IDSeparater + purplePieceCount; 
							purplePiece.setAttribute("src", this.purplePieceAddress);
							purplePiece.setAttribute("id", pieceID);
							purplePiece.setAttribute("style", "position:absolute");
							
							var arrow1 = document.createElement("img");
							var arrow1ID = this.purplePieceIDIdentifier + this.IDSeparater + purplePieceCount + this.IDSeparater + this.northArrowIDIdentifier; 
							arrow1.setAttribute("src", this.northArrowAddress); 
							arrow1.setAttribute("id", arrow1ID); 
							arrow1.setAttribute("style", "position:absolute;"); 
							
							var arrow2 = document.createElement("img");
							var arrow2ID = this.purplePieceIDIdentifier + this.IDSeparater + purplePieceCount + this.IDSeparater + this.eastArrowIDIdentifier; 
							arrow2.setAttribute("src", this.eastArrowAddress); 
							arrow2.setAttribute("id", arrow2ID); 
							arrow2.setAttribute("style", "position:absolute"); 
							
							var arrow3 = document.createElement("img");
							var arrow3ID = this.purplePieceIDIdentifier + this.IDSeparater + purplePieceCount + this.IDSeparater + this.westArrowIDIdentifier; 
							arrow3.setAttribute("src", this.westArrowAddress); 
							arrow3.setAttribute("id", arrow3ID); 
							arrow3.setAttribute("style", "position:absolute");
						
							nextCell.setAttribute("style", "background-image:url('" + this.purpleSpaceAddress+ "');");
							nextCell.setAttribute("height", "100px");
							nextCell.setAttribute("width", "100px");
							
							var tempSquare = this.piecesOnBoard[j][i]; 
							this.purplePieces[purplePieceCount] = this.piecesOnBoard[j][i] = new Piece(i,j,"purple", pieceID, tempSquare, new Arrow(arrow1ID, null, "north"), new Arrow(arrow2ID, null, "east"), new Arrow(arrow3ID, null, "west")); 
							this.purplePieces[purplePieceCount].arrows[0].myOwner = this.purplePieces[purplePieceCount]; 
							this.purplePieces[purplePieceCount].arrows[1].myOwner = this.purplePieces[purplePieceCount]; 
							this.purplePieces[purplePieceCount].arrows[2].myOwner = this.purplePieces[purplePieceCount]; 
							
							purplePieceCount += 1; 
						
							$(nextCell).append(arrow1);
							$(nextCell).append(arrow2);
							$(nextCell).append(arrow3);
							$(nextCell).append(purplePiece);
						}
					} else if (inSecondToLastRow){
						if (inFirstColumn){
							nextCell.setAttribute("style", "background-image:url('" + this.transparentAddress + "');");
							nextCell.setAttribute("height", "100px");
							nextCell.setAttribute("width", "100px");
						} else if (inLastColumn) {	
							nextCell.setAttribute("style", "background-image:url('" + this.greenGoalAddress+ "');");
							nextCell.setAttribute("height", "100px");
							nextCell.setAttribute("width", "100px");
						} else {
							nextCell.setAttribute("style", "background-image:url('" + this.orangeSpaceAddress+ "');");
							nextCell.setAttribute("height", "100px");
							nextCell.setAttribute("width", "100px");
						}
					} else if (inFirstRow) {
						if (inFirstColumn || inLastColumn) {
							nextCell.setAttribute("style", "background-image:url('" + this.transparentAddress + "');");
							nextCell.setAttribute("height", "100px");
							nextCell.setAttribute("width", "100px");
						} else {
							nextCell.setAttribute("style", "background-image:url('" + this.purpleGoalAddress+ "');");
							nextCell.setAttribute("height", "100px");
							nextCell.setAttribute("width", "100px");
						}
					} else {
						if (inFirstColumn) {
							var greenPiece = document.createElement("img");
							var pieceID = this.greenPieceIDIdentifier + this.IDSeparater + greenPieceCount; 
							greenPiece.setAttribute("src", this.greenPieceAddress);
							greenPiece.setAttribute("id", pieceID);
							greenPiece.setAttribute("style", "position:absolute");
							
							var arrow1 = document.createElement("img");
							var arrow1ID = this.greenPieceIDIdentifier + this.IDSeparater + greenPieceCount + this.IDSeparater + this.northArrowIDIdentifier; 
							arrow1.setAttribute("src", this.northArrowAddress); 
							arrow1.setAttribute("id", arrow1ID); 
							arrow1.setAttribute("style", "position:absolute"); 
							
							var arrow2 = document.createElement("img");
							var arrow2ID = this.greenPieceIDIdentifier + this.IDSeparater + greenPieceCount + this.IDSeparater + this.eastArrowIDIdentifier; 
							arrow2.setAttribute("src", this.eastArrowAddress); 
							arrow2.setAttribute("id", arrow2ID); 
							arrow2.setAttribute("style", "position:absolute"); 
							
							var arrow3 = document.createElement("img");
							var arrow3ID = this.greenPieceIDIdentifier + this.IDSeparater + greenPieceCount + this.IDSeparater + this.southArrowIDIdentifier; 
							arrow3.setAttribute("src", this.southArrowAddress); 
							arrow3.setAttribute("id", arrow3ID); 
							arrow3.setAttribute("style", "position:absolute");
							
							nextCell.setAttribute("style", "background-image:url('" + this.greenSpaceAddress + "');");
							nextCell.setAttribute("height", "100px");
							nextCell.setAttribute("width", "100px");
							
							var tempSquare = this.piecesOnBoard[j][i]; 
							this.greenPieces[greenPieceCount] = this.piecesOnBoard[j][i] = new Piece(i,j,"green", pieceID, tempSquare, new Arrow(arrow1ID, null, "north"), new Arrow(arrow2ID, null, "east"), new Arrow(arrow3ID, null, "south")); 
							this.greenPieces[greenPieceCount].arrows[0].myOwner = this.greenPieces[greenPieceCount]; 
							this.greenPieces[greenPieceCount].arrows[1].myOwner = this.greenPieces[greenPieceCount]; 
							this.greenPieces[greenPieceCount].arrows[2].myOwner = this.greenPieces[greenPieceCount]; 
							
							greenPieceCount += 1; 
							
							$(nextCell).append(arrow1);
							$(nextCell).append(arrow2);
							$(nextCell).append(arrow3);
							$(nextCell).append(greenPiece); 
						} else if (inLastColumn) {
							nextCell.setAttribute("style", "background-image:url('" + this.greenGoalAddress + "');");
							nextCell.setAttribute("height", "100px");
							nextCell.setAttribute("width", "100px");
						} else {
							nextCell.setAttribute("style", "background-image:url('" + this.orangeSpaceAddress+ "');");
							nextCell.setAttribute("height", "100px");
							nextCell.setAttribute("width", "100px");
						}
					}	
					$(nextRow).append(nextCell);
				}
			}
		}
	
	function make2DArray (a) {
		for(var i = 0; i < a.length; i++) {
			a[i] = new Array(a.length); 
		}
		return a; 
	}
	
	function toggleNextPlayer() {
		if(this.currentPlayer == "green") {
			this.currentPlayer = "purple";
		} else if (this.currentPlayer == "purple") {
			this.currentPlayer = "green"; 
		} else {
			//console.error("currentPlayer held a value not equal to \"green\"/\"purple\"");  
		}
	}
	
	function hideGreenArrows() {
		for(var i = 0; i < this.greenPieces.length; i++) {
			if(this.greenPieces[i] != null) {
				this.greenPieces[i].hideArrows();
			}
		}
	}
	
	function hidePurpleArrows() {
		for(var i = 0; i < this.purplePieces.length; i++) {
			if(this.purplePieces[i] != null) {
				this.purplePieces[i].hideArrows();
			}
		}
	}
	
	function hideAllArrows() {
		this.hidePurpleArrows();
		this.hideGreenArrows(); 
	}
	
	function drawArrows() {
	/* A piece can move to any empty space (signified by null) or 
	 * to its goal area (signified by this.purpleGoalLocation/this.greenGoalLocation)
	 */ 
		this.currentPlayerCanMove = false; 
		if(this.currentPlayer == "green") {
			for(var i = 0; i < this.greenPieces.length; i++) {
				var piece = this.greenPieces[i];
				if(piece != null) {
					var row = this.greenPieces[i].myRow;
					var col = this.greenPieces[i].myCol; 
					if(this.piecesOnBoard[col][row-1] == this.emptyLocation || this.piecesOnBoard[col][row-1] == this.greenGoalLocation) { // check north of green piece
						piece.drawNorthArrow(); 
						this.currentPlayerCanMove = true; 
					} else {
						piece.hideNorthArrow(); 
					}
					if(this.piecesOnBoard[col][row+1] == this.emptyLocation || this.piecesOnBoard[col][row+1] == this.greenGoalLocation) { //check south of green piece
						piece.drawSouthArrow(); 
						this.currentPlayerCanMove = true; 
					} else {
						piece.hideSouthArrow(); 
					}
					if(this.piecesOnBoard[col+1][row] == this.emptyLocation || this.piecesOnBoard[col+1][row] == this.greenGoalLocation) { //check east of green piece
						piece.drawEastArrow(); 
						this.currentPlayerCanMove = true; 
					} else {
						piece.hideEastArrow(); 
					}
				}
			}
		} else if (this.currentPlayer = "purple") {
			for(var i = 0; i < this.purplePieces.length; i++) {
				var piece = this.purplePieces[i];
				if(piece != null) {
					var row = this.purplePieces[i].myRow;
					var col = this.purplePieces[i].myCol; 
					if(this.piecesOnBoard[col][row-1] == this.emptyLocation || this.piecesOnBoard[col][row-1] == this.purpleGoalLocation) { // check north of purple piece
						piece.drawNorthArrow(); 
						this.currentPlayerCanMove = true; 
					} else {
						piece.hideNorthArrow(); 
					}
					if(this.piecesOnBoard[col-1][row] == this.emptyLocation || this.piecesOnBoard[col][row+1] == this.purpleGoalLocation) { //check west of purple piece
						piece.drawWestArrow(); 
						this.currentPlayerCanMove = true; 
					} else {
						piece.hideWestArrow(); 
					}
					if(this.piecesOnBoard[col+1][row] == this.emptyLocation || this.piecesOnBoard[col+1][row] == this.purpleGoalLocation) { //check east of purple piece
						piece.drawEastArrow(); 
						this.currentPlayerCanMove = true; 
					} else {
						piece.hideEastArrow(); 
					}
				}
			}
		} else {
			//console.error("drawArrows handled an invalid value of currentPlayer"); 
		}
	}
	
	function currentPlayerWon() {
		if(this.currentPlayer == "green") {
			for(var i = 0; i < this.greenPieces.length; i++) {
				if(this.greenPieces[i] !== null) {
					return false;
				}
			}
			return true; 
		} else if (this.currentPlayer == "purple") {
			 for(var i = 0; i < this.purplePieces.length; i++) {
				if(this.purplePieces[i] !== null) {
					return false;
				}
			}
			return true; 
		} else {
			//console.error("currentPlayer held a value not equal to \"green\"/\"purple\"");  
		}
	}
	
	function updateBoardRepresentation(piece) {
		var tmp = piece.myCurrentSquare; 
		for(var i = 0; i < this.piecesOnBoard.length; i++) {
			for(var j = 0; j < this.piecesOnBoard[0].length; j++) {
				if(this.piecesOnBoard[i][j] == piece) {
					piece.myCurrentSquare = this.piecesOnBoard[piece.myCol][piece.myRow]; 
					this.piecesOnBoard[i][j] = tmp; 
					this.piecesOnBoard[piece.myCol][piece.myRow] = piece; 
					this.removePieceOnGoal(piece); 
					return; 
				}
			}
		}
	}
	
	function applyOffsetToAllArrows() {
		for(var i = 0; i < this.purplePieces.length; i++) {
			if(this.purplePieces[i] != null) {
				this.purplePieces[i].applyOffsetToArrows();
			}
		}
		for(var i = 0; i < this.greenPieces.length; i++) {
			if(this.greenPieces[i] != null) {
				this.greenPieces[i].applyOffsetToArrows();
			}
		}
	}
	
	function applyOffsetToAllPieces() {
		for(var i = 0; i < this.purplePieces.length; i++) {
			if(this.purplePieces[i] != null) {
				this.purplePieces[i].applyOffset();
			}
		}
		for(var i = 0; i < this.greenPieces.length; i++) {
			if(this.greenPieces[i] != null) {
				this.greenPieces[i].applyOffset();
			}
		}
	}
	
	function setAllArrowsClickResponse(fn) {
		for(var i = 0; i < this.purplePieces.length; i++) {
			if(this.purplePieces[i] == null) {
				//console.error("A piece was null in Board.setAllArrowsClickedResponse"); 
			} else {
				this.purplePieces[i].setArrowsClickResponse(fn);
			}
		}
		for(var i = 0; i < this.greenPieces.length; i++) {
			if(this.greenPieces[i] == null) {
				//console.error("A piece was null in Board.setAllArrowsClickedResponse"); 
			} else {
				this.greenPieces[i].setArrowsClickResponse(fn);
			}
		}
	}
	
	function setAllArrowsHoverResponse() {
		for(var i = 0; i < this.purplePieces.length; i++) {
			if(this.purplePieces[i] == null) {
				//console.error("A piece was null in Board.setAllArrowsHoverResponse"); 
			} else {
				this.purplePieces[i].setArrowsHoverResponse();
			}
		}
		for(var i = 0; i < this.greenPieces.length; i++) {
			if(this.greenPieces[i] == null) {
				//console.error("A piece was null in Board.setAllArrowsHoverResponse"); 
			} else {
				this.greenPieces[i].setArrowsHoverResponse();
			}
			
		}
	}
	
	function findPieceObject(arrowID) {
		//Manipulation of the arrowID to extract the id of the piece that the arrow belongs to 
		var temp = new Array();
		temp = arrowID.split('-');
		var pieceID = temp[0] + '-' + temp[1]; 
		var pieceColor = temp[0]; 

		if(pieceColor == this.greenPieceIDIdentifier) { //green piece
			for(var i = 0; i < this.greenPieces.length; i++) {
				if(this.greenPieces[i] !== null && this.greenPieces[i].myID == pieceID) {
					return this.greenPieces[i]; 
				}
			}
		} else if (pieceColor == this.purplePieceIDIdentifier){ //purple piece
			for(var i = 0; i < this.purplePieces.length; i++) {
				if(this.purplePieces[i] !== null && this.purplePieces[i].myID == pieceID) {
					return this.purplePieces[i]; 
				}
			}
		} else {
			//console.error("Board.findArrowObject(arrowID) did not extract a valid value for pieceColor"); 
		}
	}

	function removePieceOnGoal(piece) {
		if(piece.myCurrentSquare == this.greenGoalLocation) {
			this.removeGreenPiece(piece); 
		}
		if(piece.myCurrentSquare == this.purpleGoalLocation) {
			this.removePurplePiece(piece); 
		}
	}
	
	function showGameOverAlert() {
		var alertMsg = "Game Over.";
		if(this.currentPlayer == "green") {
			alertMsg = alertMsg + " Red player has won."; 
		} else if (this.currentPlayer == "purple") {
			alertMsg = alertMsg + " Blue player has won."; 
		} else {
			//console.error("currentPlayer held a value not equal to \"green\"/\"purple\"");  
		}
		alert(alertMsg);
	}
	
	function showPlayerTrappedAlert() {
		var alertMsg = null; 
		if(this.currentPlayer == "green") {
			alertMsg = 'Red player\'s pieces are trapped.  Red player\'s turn is skipped.'; 
		} else if (this.currentPlayer == "purple") {
			alertMsg = 'Blue player\'s pieces are trapped.  Blue player\'s turn is skipped.'; 
		} else {
			//console.error("currentPlayer held a value not equal to \"green\"/\"purple\"");  
		} 
		alert(alertMsg); 
	}
	
	function setupNextTurn() {
		if(this.currentPlayerWon()) {
			this.hideAllArrows();
			this.showGameOverAlert(); 
		} else {
			this.toggleNextPlayer(); 
			this.drawArrows(); 
			if(!this.currentPlayerCanMove) { 
				this.showPlayerTrappedAlert(); 
				this.toggleNextPlayer(); 
				this.drawArrows(); 
			}
		}
	}
	
	function movingIntoGoal(piece,arrow) {
		var rtn = false;
		if(piece.myPlayer == "green" && arrow.id.substring(arrow.id.length-2,arrow.id.length-1) == "E" && this.piecesOnBoard[piece.myCol+1][piece.myRow] == "GG") {
			rtn = true; 
		} else if (piece.myPlayer == "purple" && arrow.id.substring(arrow.id.length-2,arrow.id.length-1) == "N" && this.piecesOnBoard[piece.myCol][piece.myRow-1] == "PG"){
			rtn = true; 
		}
		return rtn; 
	}
	
	//For debugging purposes
	function printGreenPieces() {
		for(var i = 0; i < this.greenPieces.length; i++) {
			if(this.greenPieces[i] !== null) {
				//console.log(this.greenPieces[i]); 
			}
		}
	}
	
	//For debugging purposes
	function printPurplePieces() {
		for(var i = 0; i < this.purplePieces.length; i++) {
			if(this.purplePieces[i] !== null) {
				//console.log(this.purplePieces[i]); 	
			}
		}
	}
	
	//For debugging purposes
	function printPiecesOnBoard() {
		for(var i = 0; i < this.piecesOnBoard.length; i++) {
			for(var j = 0; j < this.piecesOnBoard.length; j++) {
				//console.log("Column: " + i + "||" +"Row: " + j); 
				//console.log(this.piecesOnBoard[i][j]);
			}
		}
		//console.log("------------------------------------------------------------------------------------"); 
	}
	
	//For debugging purposes
	function showPurpleArrows() {
		for(var i = 0; i < this.purplePieces.length; i++) {
			if(this.purplePieces[i] !== null) {
				this.purplePieces[i].showArrows();
			}
		}
	}
	
	//For debugging purposes
	function showGreenArrows() {
		for(var i = 0; i < this.greenPieces.length; i++) {
			if(this.greenPieces[i] !== null) {
				this.greenPieces[i].showArrows();
			}
		}
	}
	
	//For debugging purposes
	function showAllArrows() {
		this.showPurpleArrows();
		this.showGreenArrows(); 
	}
	
	//For debugging purposes
	function printSkinSet() {
		for(var i = 0; i < this.skinSet.length; i++) {
			//console.log(i + ":" + this.skinSet[i]); 
		}
	}
}
