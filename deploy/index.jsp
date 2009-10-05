<%@ page import="edu.berkeley.gcweb.*" %><%!
private GameDictionary gameDictionary;

public void jspInit() {
    ServletContext context = getServletConfig().getServletContext();
    try {
        gameDictionary = new GameDictionary(context.getResource(
            "/WEB-INF/" + context.getInitParameter("gameDictionary")));
    } catch (Exception e) {
        throw new RuntimeException("An exception occurred during initialization: " + e.getMessage());
    }
}
%><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="description" content="Gamesman Web is a web-based remote Gamesman database.">
	<title>Gamesman Web</title>
        <link rel="stylesheet" type="text/css" media="screen" href="ui/styles/index.css" />
</head>
<body>
   <div id="container">
    <img id="logo" src="ui/images/logo.png" name="logo">
        <div id="game-list-container">
            <div id="game-list">
<%
    String[] canonicalNames = gameDictionary.getCanonicalNames();
    for (int i = 0; i < canonicalNames.length; i++) {
        String canonicalName = canonicalNames[i];
        String internalName = gameDictionary.getInternalName(canonicalName);
        boolean puzz = gameDictionary.getIsPuzzle(internalName);
        boolean visible = gameDictionary.getIsVisible(internalName);
        if (visible) {
            if (puzz) { %>
            <a href="ui/puzzle.jsp?puzzle=<%= internalName %>">
<%          } else { %>
    		<a href="ui/game.jsp?game=<%= internalName %>">
<%          } %>
                <img src="ui/images/<%= internalName %>.png">
                <span><%= canonicalName %></span>
            </a>
<%
        }
    }
%>
</div>
</div>
</div>
</body>
</html>
