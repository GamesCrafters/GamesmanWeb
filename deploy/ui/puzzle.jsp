<%@ page import="edu.berkeley.gcweb.servlet.GameDetailsServlet, java.io.*" %>
<%!
void terminate(ServletRequest request, ServletResponse response) {
	try {
		request.getRequestDispatcher("/").forward(request, response);
	} catch (Exception e) {
		e.printStackTrace();
	}
}

void dynamicInclude(JspWriter out, String internalName) {
	try {
		BufferedReader in = new BufferedReader(internalName + ".html");
		String line = in.readLine();
		while (line != null) {
			out.println(line);
			line = in.readLine();
		}
		in.close();
	} catch (IOException e) {
		out.println("An error occurred while importing the code for " + internalName + ".");
	}
}
%>
<%
String internalName = request.getParameter("puzzle");
String canonicalName = GameDetailsServlet.getGameDictionary().getCanonicalName(internalName);
// ensure that the puzzle is specified and registered by the dictionary servlet
if ((internalName == null) || (canonicalName == null)) {
	terminate(request, response);
}
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en-US"> 
  <head> 
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
    <title><%= canonicalName %> - Puzzles - GamesmanWeb</title> 
    <!--[if lte IE 7]>
    <style type="text/css">
      html > body > .header > h1 { display: inline }
      #moves { position: relative; left: 3em }
    </style>
    <![endif]-->
    <link rel="stylesheet" href="styles/style.css">
    <script type="text/javascript" src="js/jquery-1.2.6.min.js"></script>
    <script type="text/javascript" src="js/gcweb.js"></script>
  </head> 
  <body> 
    <div class="header">
      <img src="images/gamescrafters-logo.png" alt="GamesCrafters">
      <h1>GamesmanWeb</h1> 
    </div>
    <div id="container"> 
      <!-- game commands --> 
      <div class="nav">
        <ul> 
          <li><a href="#">New Game</a></li>
          <!--<li><a href="#">Rules</a></li>
          <li><a href="#">Load Game</a></li>
          <li><a href="#">Save Game</a></li>
          <li><a href="#">Quit</a></li>-->
        </ul>
        <h2>Display Options</h2>
        <ul id="options">
          <li><label><input type="checkbox" id="option-move-values"> Move-values</label></li>
          <li><label><input type="checkbox" id="option-move-value-history"> Move-value History</label></li>
          <li><label><input type="checkbox" id="option-predictions"> Predictions</label></li>
          <!--<li><label><input type="checkbox" id="option-move-remoteness"> Move Remoteness</label></li>-->
        </ul>
      </div> 
      <div id="main">
        <h1></h1>
        <div id="game">
        </div>
      </div> 
      <!-- sidebar --> 
      <div id="moves" class="aside">
        <div id="prediction">
          <h1>Prediction</h1>
          <span>Game not started</span>
        </div>
        <div id="move-value-key">
          <h1>Move-value Key</h1>
          <table>
            <tr>
              <td><img src="images/win.png" alt="Green"></td><td><img src="images/tie.png" alt="Yellow"></td><td><img src="images/lose.png" alt="Red"></td>
            </tr>
            <tr>
              <td>to win</td><td>to tie</td><td>to lose</td>
            </tr>
          </table>
        </div>
        <div id="move-value-history">
          <h1>Move-value History</h1>
          <div id="history-tree">
          </div>
        </div>
      </div> 
    </div> 
    <!-- site footer --> 
    <div class="footer">
      <ul>
        <li>&copy; 2008 <a href="http://gamescrafters.berkeley.edu" rel="external">GamesCrafters</a> and UC Regents</li>
      </ul>
    </div> 
  </body> 
</html> 