	<div id="options">
	<form><label for="board_size">Board size: </label><select name="board_size" id="board_size" /></select> <input type="button" value="Start!" /></form>
	</div>
	<script type="text/javascript">
	for (var i = 3; i < 10; i++) {
		$('#options select').append($('<option value="'+i+'">'+i+'x'+i+'</option>'));
	}
	$('#options input').click(function() {
		var game = new Connections({size: $('#options select').val()*2-1});
		game.start();
		game.displayMoveValues();
		game.displayPrediction();
	});
	</script>

	<table id="board">
	</table>
