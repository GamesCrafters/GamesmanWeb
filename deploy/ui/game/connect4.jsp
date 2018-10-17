<%@ page import="java.io.*, java.util.*, java.util.regex.*" %>
<script type="text/javascript">
$(function() {
  function getInputInt(input) {
    var raw = parseInt(input.val());
    return raw > 0 ? raw : 1;
  }
  
  // Read the configuration values from the form when the user clicks Play.
  var form = $("#connect4-options");
  form.find("button").click(function() {
    var config = {
      width:   getInputInt(form.find("[name=width]")),
      height:  getInputInt(form.find("[name=height]")),
      options: { pieces: getInputInt(form.find("[name=pieces]")) }
    };

    var game = new ConnectFour(config);
    $("#game").empty().append(game.board);
    game.start();
  });
  
  // Fill in the form values whenever the user chooses a solved DB.
  $("#connect4-solved").change(function() {
    var json = "(" + $("#connect4-solved option:selected").val() + ")";
    var config = eval(json);
    for (var field in config) {
      form.find("[name=" + field + "]").val(config[field]);
    }
  }).change();
});
</script>

<div id="connect4-options">
<%
  // Inspect GamesmanJava to see which games have been solved.
  File solvedDirectory = new File("/home/gamescrafters/GamesmanJava/solved");
  final String regex = "connect4_width_(\\d+)_height_(\\d+)_pieces_(\\d+)\\.db";
  File[] solved = solvedDirectory.listFiles(new FilenameFilter() {
    public boolean accept(File dir, String name) {
      return Pattern.matches(regex, name);
    }
  });
  if (solved == null) {
%>
	<p>Cannot find <%= solvedDirectory %>!</p>
<%
  } else if(solved.length > 0) {
%>
  <h2>Solved Boards</h2>
  <p>
    We have <em>solved</em> some Connect Four boards, which means that at any
    point in the game, we're able to tell you which moves would lead you to
    a win, lose, or tie, and the fewest number of moves in which you can reach
    those results if you play optimally. 
  </p>
  <label>
    Boards we've solved:
    <select id="connect4-solved">
<%
    // Sort the databases from largest to smallest.
    Arrays.sort(solved, new Comparator<File>() {
      public int compare(File a, File b) {
        return b.getName().compareTo(a.getName());
      }
    });
    for (File s : solved) {
      Matcher matcher = Pattern.compile(regex).matcher(s.getName());
      if (matcher.matches()) {  // This had better be true.
        String rows = matcher.group(2);
        String columns = matcher.group(1);
        String pieces = matcher.group(3);
        String text = String.format("%s by %s with %s pieces in a row",
                                    columns, rows, pieces);
        String value = String.format("{width: %s, height: %s, pieces: %s}",
                                     columns, rows, pieces); 
%>
      <option value="<%= value %>"><%= text %></option>
<%
      }
    }  // End of printing the options for solved databases.
%>     
    </select>
  </label>
<% } %>
  <h2>Choose Your Board</h2>
  <table>
    <tr><th>Columns</th><th>Rows</th><th>In a Row</th></tr>
    <tr>
      <td><input name="width" size="3" value="7"></td>
      <td><input name="height" size="3" value="6"></td>
      <td><input name="pieces" size="3" value="4"></td>
    </tr>
  </table>
  <div id="connect4-play"><button type="button">Play!</button></div>
</div>
