var ctx;
var canvas;
var xpos, ypos;
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var gradient = 1;
var radius = 50;
	function draw() {
		canvas = document.getElementById('myCanvas');
		ctx = canvas.getContext('2d');
		
		canvas.width = (window.innerWidth-canvas.offsetTop)*.9999;
        canvas.height = (window.innerHeight-canvas.offsetTop)*.9999;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
		
		var hmid = canvasHeight/2;
		var wmid = canvasWidth/2;
		
		//draws background
		ctx.strokeStyle = "rgba(100,10,255,1)";
		ctx.fillStyle = "rgba(50,50,255,1)";
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		
		//draw circle gradients	
		var radgrad = ctx.createRadialGradient(wmid,hmid,10,wmid,hmid,250);
		radgrad.addColorStop(1, 'rgba(50,50,255,1)');
		radgrad.addColorStop(0.9, '#3366FF');
		radgrad.addColorStop(.5, '#33CCCC');
		radgrad.addColorStop(0, '#33CCFF');
		ctx.fillStyle = radgrad;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		
		gamesScroll();
		
	}
	$(document).ready(draw);
	$(window).resize(draw);
	
var gamesctx = document.getElementById('Games').getContext('2d');
	
	function gamesScroll() {
		//will end up in games.drawNow()
	ctx.fillStyle = "rgb(200,0,0)";  
    ctx.fillRect ((canvasWidth/2-canvas.offsetTop)*.93, (canvasHeight/2-canvas.offsetTop)*.88, 110, 100);
		games.drawNow();
	
}
	
	
		
var games = new Image();
games.src = 'testpng.png';
games.drawNow = function() {
	ctx.fillStyle = "rgb(200,0,0)";  
    ctx.fillRect (canvasWidth/2, canvasHeight/2, 55, 50); 
};


function clickOptions(e) {
	xPos = e.clientX;
	yPos = e.clientY;
}

function mouseDown(e) {
	xPos = e.clientX;
	yPos = e.clientY;
}

function mouseUp(e) {
	xPos = e.clientX;
	yPos = e.clientY;
}
