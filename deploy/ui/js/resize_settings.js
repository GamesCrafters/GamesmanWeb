var textBox = document.getElementById("textBox");
var handleRight = document.getElementById("handleRight");
var handleCorner = document.getElementById("handleCorner");
var handleBottom = document.getElementById("handleBottom");
var textDiv = document.getElementById("textDiv");
var myApplet = document.getElementById("cube");
var minSize = 55;
new dragObject(handleRight, null, new Position(minSize, 0), new Position(1500, 0), null, RightMove, null, false);
new dragObject(handleBottom, null, new Position(0, minSize), new Position(0, 1500), null, BottomMove, null, false);
new dragObject(handleCorner, null, new Position(minSize, minSize), new Position(1500, 1500), null, CornerMove, null, false);

function BottomMove(newPos, element, delta)
{
  DoHeight(newPos.Y, element, delta);
}

function RightMove(newPos, element, delta)
{
  DoWidth(newPos.X, element, delta);
}

function CornerMove(newPos, element, delta)
{
  DoHeight(newPos.Y, element, delta);
  DoWidth(newPos.X, element, delta);
}

function DoHeight(y, element, delta)
{
  textDiv.style.height = (y + 5) + 'px';

  handleCorner.style.top = y + 'px';
  handleRight.style.height = y + 'px';
  handleBottom.style.top = y + 'px';
  
  textBox.style.height = (y - 5) + 'px';
  
  myApplet.height = y;
  myApplet.style.height = y + 'px';
}

function DoWidth(x, element, delta) {
	//this is to deal w/ horizontal centering,
	//unfortunately it doesn't work when the centered element "hits" something
	x += delta;
	if(x < minSize) return;
	textDiv.style.width = (x + 5) + 'px';

	handleCorner.style.left = x + 'px';
	handleRight.style.left = x + 'px';
	handleBottom.style.width = x + 'px';

	textBox.style.width = (x - 5) + 'px';

	myApplet.width = x - 5;
	myApplet.style.width = x + 'px';
}
