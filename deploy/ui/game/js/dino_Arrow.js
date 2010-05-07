function Arrow(id, owner, direction) {
	//Public instance variables 
	this.myID = id; 
	this.myIDJQuery = '#' + this.myID; 
	this.myOwner = owner; 
	this.myDirection = direction; //Can hold the following string values: north, south, east, west
	this.offset = 50; //pixels 
	this.moveIncrement = 100; //pixels 
	
	//Public methods
	this.setClickResponse = setClickResponse;
	this.hide = hide;
	this.show = show; 
	this.toggle = toggle; 
	this.applyOffset = applyOffset; 
	this.drawSelf = drawSelf; 
	this.moveNorth = moveNorth;
	this.moveSouth = moveSouth;
	this.moveEast = moveEast; 
	this.moveWest = moveWest; 
	this.setHoverResponse = setHoverResponse;
	this.mouseHoverIn = mouseHoverIn;
	this.mouseHoverOut = mouseHoverOut; 
	
	//Ensure the id call finds the correct id
	function setClickResponse(fn) { 
		$(this.myIDJQuery).click(fn);
	}
	
	function setHoverResponse() {
		//$(this.myIDJQuery).hover(mouseHoverIn, mouseHoverOut); 
		//$(this.myIDJQuery).mouseover(mouseHoverIn); 
		//$(this.myIDJQuery).mouseout(mouseHoverOut); 
		$(this.myIDJQuery).hover(
			function () {
				//$(this).append($("<span> ***</span>"));
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
		//console.log("" + this.myIDJQuery); 
		//console.log("" + this.myID); 
		//alert(this.myID); 
		//alert(this.myIDJQuery); 
		var testStr = "#" + this.myID; 
		var src = $(testStr).attr("src").match(/[^\.]+/) + "over.png";
        $(testStr).attr("src", src);
	}
	
	function mouseHoverOut() {
		//console.log("" + this.myIDJQuery); 
		//console.log("" + this.myID); 
		//alert(this.myID); 
		//alert(this.myIDJQuery); 
		var testStr = "#" + this.myID; 
		var src = $(testStr).attr("src").replace("over", "");
		$(testStr).attr("src", src);
	}
	
	//Ensure the following functions remove the actual img tag from the html 
	function hide() {
		var el = document.getElementById(this.myID); 
		el.style.display = "none";
	}
	
	function show() {
		var el = document.getElementById(this.myID); 
		el.style.display = "";
	}
	
	//Just in case toggle is wiser to use 
	function toggle() {
		var el = document.getElementById(this.myID); 
		if (this.el.style.display != 'none' ) {
			el.style.display = 'none';
		}
		else {
			el.style.display = '';
		}
	}
	
	function applyOffset() {
		var el = document.getElementById(this.myID); 
		if(this.myDirection == "north") {
			var yPosAsString = $(this.myIDJQuery).css('top'); 
			var yPosNumVal = parseInt(yPosAsString.substring(0,yPosAsString.length-2));
			el.style.top = yPosNumVal - 37 + "px"; 
			
			var xPosAsString = $(this.myIDJQuery).css('left'); 
			var xPosNumVal = parseInt(xPosAsString.substring(0,xPosAsString.length-2));
			el.style.left = xPosNumVal + 31.5 + "px";
			
			//console.log("ID ==" + this.myID + "// valAsString==" + valAsString + "//numVal==" + "//el.style.top==" + el.style.top);
		} else if (this.myDirection == "south") {
			var yPosAsString = $(this.myIDJQuery).css('top'); 
			var yPosNumVal = parseInt(yPosAsString.substring(0,yPosAsString.length-2));
			el.style.top = yPosNumVal + 75 + "px"; 
			
			var xPosAsString = $(this.myIDJQuery).css('left'); 
			var xPosNumVal = parseInt(xPosAsString.substring(0,xPosAsString.length-2));
			el.style.left = xPosNumVal + 31.5 + "px";
			
			//console.log("ID ==" + this.myID + "// valAsString==" + valAsString + "//numVal==" + "//el.style.top==" + el.style.top);
		} else if(this.myDirection == "east") {
			var yPosAsString = $(this.myIDJQuery).css('top'); 
			var yPosNumVal = parseInt(yPosAsString.substring(0,yPosAsString.length-2));
			el.style.top = yPosNumVal + 31.5 + "px"; 
			
			var xPosAsString = $(this.myIDJQuery).css('left'); 
			var xPosNumVal = parseInt(xPosAsString.substring(0,xPosAsString.length-2));
			el.style.left = xPosNumVal + 85 + "px";
			
			//console.log("ID ==" + this.myID + "// valAsString==" + valAsString + "//numVal==" + "//el.style.left==" + el.style.top);
		} else if (this.myDirection == "west") {
			var yPosAsString = $(this.myIDJQuery).css('top'); 
			var yPosNumVal = parseInt(yPosAsString.substring(0,yPosAsString.length-2));
			el.style.top = yPosNumVal + 31.5 + "px"; 
			
			var xPosAsString = $(this.myIDJQuery).css('left'); 
			var xPosNumVal = parseInt(xPosAsString.substring(0,xPosAsString.length-2));
			el.style.left = xPosNumVal - 35 + "px";
			
			//console.log("ID ==" + this.myID + "// valAsString==" + valAsString + "//numVal==" + "//el.style.left==" + el.style.top);
		} else {
			//console.error("Invalid directional value in applyOffSet()"); 
		}
	}
	
	function drawSelf() {
		this.show(); 
	}
	
	function moveNorth() {
		// var el = document.getElementById(this.myID); 
		// var valAsString = $(this.myIDJQuery).css('top'); 
		// var numVal = parseInt(valAsString.substring(0,valAsString.length-2));
		// el.style.top = numVal - this.moveIncrement + "px"; 
		
		$(this.myIDJQuery).animate({top: "-=105px"}); 
		//alert("Moving " + this.myID + " north"); 
	}
	
	function moveSouth() {
		// var el = document.getElementById(this.myID); 
		// var valAsString = $(this.myIDJQuery).css('top'); 
		// var numVal = parseInt(valAsString.substring(0,valAsString.length-2));
		// el.style.top = numVal + this.moveIncrement + "px"; 
		
		$(this.myIDJQuery).animate({top: "+=105px"});
		//alert("Moving " + this.myID + " south"); 
	}
	
	function moveEast() {
		// var el = document.getElementById(this.myID); 
		// var valAsString = $(this.myIDJQuery).css('left'); 
		// var numVal = parseInt(valAsString.substring(0,valAsString.length-2));
		// el.style.left = numVal + this.moveIncrement + "px"; 
		
		$(this.myIDJQuery).animate({left: "+=100px"}); 
		//alert("Moving " + this.myID + " east"); 
	}
	
	function moveWest() {
		// var el = document.getElementById(this.myID); 
		// var valAsString = $(this.myIDJQuery).css('left'); 
		// var numVal = parseInt(valAsString.substring(0,valAsString.length-2));
		// el.style.left = numVal - this.moveIncrement + "px"; 
		
		$(this.myIDJQuery).animate({left: "-=100px"}); 
		//alert("Moving " + this.myID + " west"); 
	} 
	
}