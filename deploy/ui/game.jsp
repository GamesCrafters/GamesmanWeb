<%@ page import="edu.berkeley.gcweb.GameDictionary, java.io.*" %><%!
private GameDictionary gameDictionary;
private boolean debug = false;

public void jspInit() {
    ServletContext context = getServletConfig().getServletContext();
    try {
		if (debug) {
			throw new Exception(context.getResource("/WEB-INF/" +
			    context.getInitParameter("gameDictionary")).toString());
		}
		// TODO: memoization
        gameDictionary = new GameDictionary(context.getResource(
            "/WEB-INF/" + context.getInitParameter("gameDictionary")));
    } catch (Exception e) {
        throw new RuntimeException("An exception occurred during initialization: " +
            e.getMessage());
    }
}

void terminate(ServletRequest request, ServletResponse response) {
	/*
	try {
		request.getRequestDispatcher("/").forward(request, response);
	} catch (Exception e) {
		e.printStackTrace();
	}
	*/
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
String internalName = request.getParameter("game");
String canonicalName = gameDictionary.getCanonicalName(internalName)
// ensure that the puzzle is specified and registered by the dictionary servlet
if ((internalName == null) || (canonicalName == null)) {
	out.println("Terminating because internalname is "+internalName+" and canonincalName is "+canonicalName);
	terminate(request, response);
	return;
}
String uifile = gameDictionary.getUI(internalName);
// TODO: encode the HTML entities in the names
%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en-US"> 
  <head> 
    <title><%= canonicalName %> - Games - GamesmanWeb</title> 
    <!--[if lte IE 7]>
    <style type="text/css">
      html > body > .header > h1 { display: inline }
      #moves { position: relative; left: 3em }
    </style>
    <![endif]-->
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/game/gcweb.css">
    <link rel="stylesheet" href="styles/game/<%= uifile %>.css">
    <script type="text/javascript" src="js/game/jquery-1.3.2.min.js"></script>
    <script type="text/javascript" src="js/game/gcweb.js"></script>
    <script type="text/javascript" src="js/game/<%= uifile %>.js"></script>
    <script type="text/javascript">
	  $(document).ready(function() {
	    $("#moves").css("min-height", Math.max($("#moves").height(), $("#main").height()));
	  });
	</script>
  </head> 
  <body> 
        <p id="timer">&nbsp;</p>
        <p id="nr-moves">&nbsp;</p>
    <div class="header">
      <img src="images/gamescrafters-logo.png" alt="GamesCrafters">
      <h1>GamesmanWeb</h1> 
    </div>
    <div id="container"> 
      <!-- game commands --> 
      <div class="nav">
        <ul> 
          <li><a href="">Change Options</li>
          <li><a href="javascript:location.reload();">Reset Game</a></li>
        </ul>
        <h2>Display Options</h2>
        <ul id="options">
          <li><label><input type="checkbox" id="option-move-values"> Move-values</label></li>
          <li><label><input type="checkbox" id="option-predictions"> Predictions</label></li>
        </ul>
      </div> 
      <div id="main">
        <h1 id="gameheader"><%= canonicalName %></h1>
        <div id="game">
          <% dynamicInclude(out, "game/" + uifile); %>
        </div>
      </div> 
      <!-- sidebar --> 
      <div id="moves" class="aside">
        <div id="move-value-key">
          <h1>Move-value Key</h1>
          <table>
            <tr>
              <td><img src="images/win.png" alt="Green"></td><td><img src="images/tie.png" alt="Yellow"></td><td><img src="images/lose.png" alt="Red"></td>
            </tr>
            <tr>
              <td>winning move</td><td>cause a tie</td><td>losing move</td>
            </tr>
          </table>
        </div>
        <div id="prediction">
          <h1>Prediction</h1>
          <span>Game not started</span>
        </div>
      </div> 
    </div> 
    <!-- site footer --> 
    <div class="footer">
      <ul>
        <li>&copy; 2008-2009 <a href="http://gamescrafters.berkeley.edu" rel="external">GamesCrafters</a> and UC Regents</li>
      </ul>
    </div> 
  </body> 
</html> 
