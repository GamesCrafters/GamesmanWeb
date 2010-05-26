	<div id="board-options">
	<form><label for="board_size">Board size: </label><select name="board_size" id="board_size" /></select> <input type="button" value="Start!" /></form>
	</div>
	<script type="text/javascript">
	var solvedBoards = [4];
	for (var i = 0; i < solvedBoards.length; i++) {
		$('#board-options select').append($('<option value="'+solvedBoards[i]+'">'+solvedBoards[i]+'x'+solvedBoards[i]+'</option>'));
	}
	$('#board-options input').click(function() {
		var game = new Connections({size: $('#board-options select').val()*2-1});
		TURN = 0;
		game.start();
	});
	</script>

	<table id="board">
	</table>

	<p id="whoseTurn"></p>
