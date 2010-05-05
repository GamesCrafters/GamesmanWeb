<script type="text/javascript">
  $(function() {
    // Attach an event listener to the options menu.
    var targetSelector = $('#gc1210-target');
    targetSelector.change(function(evt) {
      var target = Math.round(targetSelector.find('option:selected').val());
      if (target <= 0) {
        GCWeb.alert('You must play to a positive number, not ' + target + '!');
      } else {
        newGame(target);
      }
    });

    // Clear any current game and set up a new one.
    function newGame(target) {
      var container = $('#gc1210-game').empty();
      var game = new OneTwoTen(target);
      container.append(game.board);
      game.start();
    }
    
    targetSelector.trigger('change');
  });
</script>

<div id="gc1210-options">
  <label>What number would you like to count up to?
    <select id="gc1210-target">
<%
  int max = 50, selected = 10;
  for (int i = 1; i <= max; i++) {
    String attributes = " value=\"" + i + "\"";
    if (i == selected) {
      attributes += " selected=\"selected\"";
    }
    out.println("      <option" + attributes + ">" + i + "</option>");
  }
%>    </select>
  </label> (Choosing a new number will reset the game.)
</div>

<div id="gc1210-game"></div>
