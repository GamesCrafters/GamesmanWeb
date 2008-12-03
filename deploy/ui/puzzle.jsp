<%@ page import="edu.berkeley.gcweb.GameDictionary, java.io.*" %><%!
private GameDictionary gameDictionary;
private boolean debug = false;

public void jspInit() {
    ServletContext context = getServletConfig().getServletContext();
    try {
		if (debug) {
			throw new Exception(context.getResource("/WEB-INF/" + context.getInitParameter("gameDictionary")).toString());
		}
		// TODO: memoization
        gameDictionary = new GameDictionary(context.getResource(
            "/WEB-INF/" + context.getInitParameter("gameDictionary")));
    } catch (Exception e) {
        throw new RuntimeException("An exception occurred during initialization: " + e.getMessage());
    }
}

void terminate(ServletRequest request, ServletResponse response) {
	try {
		request.getRequestDispatcher("/").forward(request, response);
	} catch (Exception e) {
		e.printStackTrace();
	}
}

void dynamicInclude(JspWriter out, String internalName) {
	ServletContext context = getServletConfig().getServletContext();
	String path = "/ui/" + internalName + ".html";
	try {
		InputStream htmlStream = context.getResourceAsStream(path);
		if (htmlStream == null) {
			throw new IOException("File at " + context.getRealPath(path) + " not found.");
		} else {
			BufferedReader in = new BufferedReader(new InputStreamReader(htmlStream));
			String line = in.readLine();
			while (line != null) {
				out.println(line);
				line = in.readLine();
			}
			in.close();
		}
	} catch (IOException e) {
		try {
			out.println(e.getMessage());
		} catch (IOException ioe) { }
	}
}
%><%
String internalName = request.getParameter("puzzle");
String canonicalName = gameDictionary.getCanonicalName(internalName);
// ensure that the puzzle is specified and registered by the dictionary servlet
if ((internalName == null) || (canonicalName == null)) {
	terminate(request, response);
}
// TODO: encode the HTML entities in the names
%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
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
    <link rel="stylesheet" href="styles/<%= internalName %>.css">
    <script type="text/javascript" src="js/jquery-1.2.6.min.js"></script>
    <script type="text/javascript" src="js/gcweb.js"></script>
    <script type="text/javascript" src="js/<%= internalName %>.js"></script>
    <script type="text/javascript">
	  $(document).ready(function() {
	    $("#moves").css("min-height", Math.max($("#moves").height(), $("#main").height()));
	  });
	</script>
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
          <li><a href="">New Puzzle</a></li>
          <!--<li><a href="#">Rules</a></li>
          <li><a href="#">Load Puzzle</a></li>
          <li><a href="#">Save Puzzle</a></li>
          <li><a href="#">Game Selection</a></li>-->
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
        <h1><%= canonicalName %></h1>
        <div id="game">
          <% dynamicInclude(out, internalName); %>
        </div>
      </div> 
      <!-- sidebar --> 
      <div id="moves" class="aside">
        <div id="prediction">
          <h1>Prediction</h1>
          <span>Puzzle not started</span>
        </div>
        <div id="move-value-key">
          <h1>Move-value Key</h1>
          <table>
            <tr>
              <td><img src="images/win.png" alt="Green"></td><td><img src="images/tie.png" alt="Yellow"></td><td><img src="images/lose.png" alt="Red"></td>
            </tr>
            <tr>
              <td>to move towards solution</td><td>to maintain remoteness</td><td>to move away from solution</td>
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
