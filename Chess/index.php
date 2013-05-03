<html>
<head>

    <script language="JavaScript" src="jscript.js"></script>

   
	
	<style type="text/css">

.button {
    width: 155px;
    height: 17px;
    font-family: verdana, arial, helvetica, sans-serif;
    text-align: center;
    vertical-align: middle;
    font-size: 11px; font-weight: bold; color: #455D7F; border: 1px solid #CCD2DC;
    background: #E7F1FF;
    cursor: pointer;
}

.info {
    font-family: verdana, arial, helvetica, sans-serif;
    text-align: left;
    vertical-align: middle;
    font-size: 11px;
    color: #455D7F;
    cursor: default;
}

.choiceOn {
    width: 100px;
    height: 17px;
    font-family: verdana, arial, helvetica, sans-serif;
    text-align: center;
    vertical-align: middle;
    font-size: 11px;
    font-weight: bold;
    color: #E7F1FF;
    border: 1px solid #CCD2DC;
    background: #455D7F;
    cursor: pointer;
}

.choiceOff {
    width: 100px;
    height: 17px;
    font-family: verdana, arial, helvetica, sans-serif;
    text-align: center;
    vertical-align: middle;
    font-size: 11px;
    font-weight: bold;
    color: #455D7F;
    border: 1px solid #CCD2DC;
    background: #E7F1FF;
    cursor: pointer;
}


</style>

	<script language="JavaScript">
	
	self.focus();
	
	function fx() {return false;}

function enmouse(b) {
	window.onmousedown = b ? null : fx;
	window.onmouseup = b ? null : fx;
	window.onclick = b ? null : fx;
}	
enmouse(false);

	</script>

</head>

<body onload="javascript:setTimeout('buildIt()',5);" onkeyup="keypress(event);">
<!-- Canvas for arrows -->
<canvas id="canvas" width="1000" height="1000"  style = "position: absolute; top: 10; left: 0; z-index: 5; pointer-events: none"></canvas>

<canvas id="picvas" width="1000" height="1000"  style = "position: absolute; top: 10; left: 0; z-index: 6; pointer-events: none"></canvas>

<div class="info" style="position:absolute; left:0; top:550;" >FEN:</div>
<div id="info" class="info" onmouseover="enmouse(true);" onmouseout="enmouse(false);" style="position:absolute; left:30; top:550;" ></input></div>


<!-- CREATING THE BUTTONS-->
<div class="button" style="position:absolute; left:650; top:618;" onmouseover="over(this);" onmouseout="leave(this);" onclick="flip();" >Flip Board</div>

<div class="button" style="position:absolute; left:650; top:645;" onmouseover="over(this);" onmouseout="leave(this);" onclick="inputfen();" >Input FEN</div>

<div class="button" style="position:absolute; left:650; top:672;" onmouseover="over(this);" onmouseout="leave(this);" onclick="takeback();" >Back</div>


</body>

</html>

