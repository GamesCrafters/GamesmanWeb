function Arrow(id, owner, direction) {
	//Public instance variables 
	
	this.myID = id; 
	this.myIDJQuery = '#' + this.myID; 
	this.myOwner = owner; 
	this.myDirection = direction; //Can hold the following string values: north, south, east, west
	this.moveIncrement = 100; // Measured in pixels 
	
	//Public methods
	
	//Hide/show methods
	this.hide = hide;
	this.show = show; 
	this.drawSelf = drawSelf; 
	
	//Initialization methods
	this.applyOffset = applyOffset; 
	
	//Movement methods
	this.moveNorth = moveNorth;
	this.moveSouth = moveSouth;
	this.moveEast = moveEast; 
	this.moveWest = moveWest; 
	
	//Event handlers
	this.setClickResponse = setClickResponse;
	this.setHoverResponse = setHoverResponse;
	this.mouseHoverIn = mouseHoverIn;
	this.mouseHoverOut = mouseHoverOut; 
	
	function setClickResponse(fn) { 
		$(this.myIDJQuery).click(fn);
	}
	
	function setHoverResponse() {
		$(this.myIDJQuery).hover(
			function () {
				var src = $(this).attr("src").match(/[^\.]+/) + "over.png";
				$(this).attr("src", src);
			}, 
			function () {
				$(this).find("span:last").remove();
				var src = $(this).attr("src").replace("over", "");
				$(this).attr("src", src);
			}
		);
	} 
	
	function mouseHoverIn() {
		var testStr = "#" + this.myID; 
		var src = $(testStr).attr("src").match(/[^\.]+/) + "over.png";
        $(testStr).attr("src", src);
	}
	
	function mouseHoverOut() {
		var testStr = "#" + this.myID; 
		var src = $(testStr).attr("src").replace("over", "");
		$(testStr).attr("src", src);
	}
	
	function hide() {
		var el = document.getElementById(this.myID); 
		el.style.display = "none";
	}
	
	function show() {
		var el = document.getElementById(this.myID); 
		el.style.display = "";
	}
	
	function applyOffset() {
	var el = document.getElementById(this.myID); 
		if(this.myDirection == "north") {
			var yPosAsString = $(this.myIDJQuery).css('top'); 
			var yPosNumVal = parseInt(yPosAsString.substring(0,yPosAsString.length-2));
			el.style.top = yPosNumVal - 7 - 75 + "px"; 
			
			var xPosAsString = $(this.myIDJQuery).css('left'); 
			var xPosNumVal = parseInt(xPosAsString.substring(0,xPosAsString.length-2));
			el.style.left = xPosNumVal + 32 + "px";
			
		} else if (this.myDirection == "south") {
			var yPosAsString = $(this.myIDJQuery).css('top'); 
			var yPosNumVal = parseInt(yPosAsString.substring(0,yPosAsString.length-2));
			el.style.top = yPosNumVal - 7 + 25 + "px"; 
			
			var xPosAsString = $(this.myIDJQuery).css('left'); 
			var xPosNumVal = parseInt(xPosAsString.substring(0,xPosAsString.length-2));
			el.style.left = xPosNumVal + 32 + "px";

		} else if(this.myDirection == "east") {
			var yPosAsString = $(this.myIDJQuery).css('top'); 
			var yPosNumVal = parseInt(yPosAsString.substring(0,yPosAsString.length-2));
			el.style.top = yPosNumVal - 7 - 12.5 + "px"; 
			
			var xPosAsString = $(this.myIDJQuery).css('left'); 
			var xPosNumVal = parseInt(xPosAsString.substring(0,xPosAsString.length-2));
			el.style.left = xPosNumVal + 75 + "px";

		} else if (this.myDirection == "west") {
			var yPosAsString = $(this.myIDJQuery).css('top'); 
			var yPosNumVal = parseInt(yPosAsString.substring(0,yPosAsString.length-2));
			el.style.top = yPosNumVal - 7 - 12.5 + "px"; 
			
			var xPosAsString = $(this.myIDJQuery).css('left'); 
			var xPosNumVal = parseInt(xPosAsString.substring(0,xPosAsString.length-2));
			el.style.left = xPosNumVal - 32.5 + "px";
			
		} else {
			//console.error("Invalid directional value in applyOffSet()"); 
		}
	}
	
	function drawSelf() {
		this.show(); 
	}
	
	function moveNorth() {
		$(this.myIDJQuery).animate({top: "-="+this.moveIncrement+"px"}); 
	}
	
	function moveSouth() {
		$(this.myIDJQuery).animate({top: "+="+this.moveIncrement+"px"});
	}
	
	function moveEast() {
		$(this.myIDJQuery).animate({left: "+="+this.moveIncrement+"px"}); 
	}
	
	function moveWest() {
		$(this.myIDJQuery).animate({left: "-="+this.moveIncrement+"px"}); 
	} 
}