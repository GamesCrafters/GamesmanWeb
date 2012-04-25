function downFunction(xPos, yPos) {
	//revision plans create clickable areas.2
	n=-999;
	var x = xPos;
	var y = yPos;
	//console.log('( '+x+' , '+y+' )');
	//console.log('boardX: '+boardX);
	var s =boardX+boardWidth;
	//console.log('boardX+boardWidth: '+ s);

	//console.log('boardWidth: '+boardWidth);

	if((x>=boardX+optionsWidth && x<=boardX+boardWidth+optionsWidth) && (y>=boardY && y<=boardY+boardHeight)){
	
	//within the board
	var clickWidth = boardWidth/4;
	var clickSpan = clickWidth/2;

	for(int i=0;i<locations.length;i++){
		var xNode = boardX + (i%5)*pieceWidth;
		var yNode = boardY + Math.floor(i/5)*pieceHeight;

		var leftBound = xNode - clickSpan;
		var rightBound = xNode + clickSpan
		var upBound =  yNode - clickSpan;
		var downBound = ynode + clickSpan;

		if(x>leftBound && x<rightBound){
			if(y>upBound && y<downBound){
				n=i;
			}
		}


	}

	console.log("adding -1 to "+n);

	if(n!=-999){
		if(phaseOne){
		locations[n]=1;
		numGoats-=1;
		}
	}
	drawInterface();
	
	}else{
		//do other stuff here like clear selection
		console.log('outside board');
	}

	
}

function downFunction(xPos, yPos) {
	//revision plans create clickable areas.2

	var x = xPos;
	var y = yPos;
	//console.log('( '+x+' , '+y+' )');
	//console.log('boardX: '+boardX);
	var s =boardX+boardWidth;
	//console.log('boardX+boardWidth: '+ s);

	//console.log('boardWidth: '+boardWidth);

	if((x>=boardX+optionsWidth && x<=boardX+boardWidth+optionsWidth) && (y>=boardY && y<=boardY+boardHeight)){
	
	console.log("WITHIN BOARD!");
	console.log(x);
	console.log(y);
	
	x+= pieceWidth/2;
	y+= pieceHeight/2;
	x-=boardX;
	y-=boardY;
	x/=pieceWidth;//remainder n%5
	y/=pieceWidth;//quotirent n//5
	var n = y*5+x;
	 n-=4;

	n=Math.round(n);
	console.log("adding -1 to "+n);
	if(n<25 && n>=1){
		if(phaseOne){
		locations[n]=1;
		numGoats-=1;
		}
	}
	drawInterface();
	
	}else{
		//do other stuff here like clear selection
		console.log('outside board');
	}

	myTurn = !myTurn;
}