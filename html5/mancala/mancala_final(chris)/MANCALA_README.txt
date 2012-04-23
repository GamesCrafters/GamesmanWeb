MANCALA_README.txt
=====================
initializeGame()
1. Create array of pits, and add appropriate pebbles to each of the pits.
2. Set turn variable to PLAYER1
3. PLayer 1 pits start at index 0, then Player1 main pit, the player2 pits, then player2 main pit
4. Add default number of pebbles to each pit and 0 to main pits
5. Create new image for board and load image
6. Create buffer for double buffering strategy
7. Start moveLoop()

drawBufferToCanvas()
1. Finds ideal size and position for the board on the canvas, depending on the size of the canvas.
2. Draws to the board image to the buffer

drawBoardToBuffer()
1. Calls helper function drawPits() to draw the pits on the buffer

*For animation purposes, added drawBoardToBuffer
*Call drawBufferToCanvas(), this function does everything the same as drawBoard from before except it does not draw the stuff on the buffer
*To animate, call drawBoardToBuffer to draw the board and pits as normal, then draw on any location on the buffer, then call drawBufferToCanvas() so that your changes become visible on the gameInterface

drawPits()
1. Find pit size, and all relavent positioning information
2. Draw player1 and player2 main pits
3. Draw the rest of the pits

clickOp()
1. Uses four variables to figure out where the board is so it can figure out what to do accordingly
2. Checks that choice is valid, then calls clickHelper to move pits around clickHelper will change to something generic that moveLoop() can use

moveLoop()
1. If current turn is AI turn, perform move, otherwise, wait for click event
2. After click event is done, it should call moveLoop() again. If player is turned to AI, moveLoop should be called again

clickHelper()
1. When a pit is chosen, move pits around the mancala board
2. Perform animation for each chosen pit
3. Handle landing on a particular pit by changin turn or not changing turn. Call moveLoop() after
	


