<%@ page import="java.net.URL,
    	         java.io.File, java.io.IOException,
                 javax.xml.parsers.ParserConfigurationException,
                 edu.berkeley.gcweb.GameDictionary" %>
<%@ taglib uri="/WEB-INF/tld/gctl.tld" prefix="gc" %>
<%!
private GameDictionary gameDictionary;

/**
 * Initializes the resources used by this JSP. This function runs
 * before other code in the page.
 */
public void jspInit() {
    ServletContext context = getServletConfig().getServletContext();
    try {
        URL dictionaryFile = context.getResource(
            "/WEB-INF/" + context.getInitParameter("gameDictionary"));
        gameDictionary = new GameDictionary(dictionaryFile);
    } catch (ParserConfigurationException e) {
        throw new RuntimeException(e);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}
%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="description" content="Gamesman Web is a Web-based remote Gamesman database.">
    <title>Gamesman Web</title>
    <link rel="stylesheet" type="text/css" href="ui/styles/index.css" />
  </head>
  <body>
    <div id="container">
      <img id="logo" src="ui/images/logo.png" alt="GamesCrafters">
      <div id="game-list-container">
        <div id="game-list">
<% for (String canonicalName : gameDictionary.getCanonicalNames()) { %>
          <gc:game canonicalName="<%= canonicalName %>"
	           dictionary="<%= gameDictionary %>"/>
<% } %>
          <a href="http://nyc.cs.berkeley.edu/gui/4to0.html">
            <img src="http://nyc.cs.berkeley.edu/gui/web_hi_res_512.png" alt="Play 4to0" width="128">
            <span>
              <img src="ui/images/online.png" alt="Online">
              10 to 0
            </span>
          </a>
        </div>
      </div>
    </div>
  </body>
</html>
