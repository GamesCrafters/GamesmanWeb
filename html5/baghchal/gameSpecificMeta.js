/**
WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE! WRITE YOUR CODE HERE!
*/

/**
You can use this as the main graphics function. It will call itself over and over every .01 seconds. Please try to make it to just display graphics based on data rather than manipulating data. Otherwise, it may have errors with screen size change and such.
*/
function drawInterface() {
    // This should be at the front of your code!
    interfacecxt.clearRect(0, 0, interfaceWidth, interfaceHeight);
    
    // YOUR CODE STARTS HERE
	// You MUST draw the interface based on the currentPosition variable for any none-permanent graphics! (Like piece locations and such)
	
    
    
    
    // YOUR CODE ENDS HERE
    /*
	I commented this out, because I decided that it wasn't really necessary to keep refreshing the page, when we only need to really change the page whenever we make a change to the board. Please let me know if you believe otherwise and confer with me! Sung Roa.
    // This should be at the bottom of your code!
	setTimeout("drawInterface()", 10);
	*/
}

/**
This is the function you will use to register clicks. The xPos and yPos are the coordinates of the mouse clicks, when the mouse is clicked.
*/
function clickFunction(xPos, yPos) {
    
}

/**
This is the function you will use to register mouse pressed down and let go. The xPos and yPos are the coordinates while such are happening.
*/
function downFunction(xPos, yPos) {

}
function upFunction(xPos, yPos) {

}

/**
This is the function you will use to initialize your game. It doesn't matter what you do in it, just please keep the position storage in there after you are done initializing. PLEASE Update current position whenever you call this with the boardstate!
*/
function initializeGame() {
	
	// This code should be at the bottom of the initializeGame.
	pushPosition(currentPosition);
}

/**
This is the function you will use to perform moves. It doesn't matter what you do in it, just please keep this position storage in there. You can also have any inputs that you want in perform move too. I just left it blank because I don't know what you guys want for specific games. PLEASE Update current position whenever you call this with the boardstate!
*/
function performMove() {
	
	
	// This code should be at the bottom of the perform move.
	drawInterface();
	storeCurrentPosition(currentPosition);
	redoMoves = new Array();
}
