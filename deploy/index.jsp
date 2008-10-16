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
%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en-US">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="description" content="Gamesman Web is a web-based remote Gamesman database.">
        <title>Gamesman Web</title>
        <style type="text/css"><!--
            * { margin: 0; padding: 0 }

            html { color: #006; background-color: #fff; font: 12px/1.5 Verdana, Geneva, Arial, Helvetica, sans-serif }
            body { width: 80%; margin: 0 auto }
            
            a { text-decoration: none }
            a:link { color: #003f87; border-bottom: 1px #003f87 dotted }
            a:visited { color: #66c; border-bottom: 1px #66c dotted }
            a[rel~=external]:visited:after { content: "\00A0\221A"; font-size: 0.75em } /* display a pseudo-checkmark after each visited link */
            a:hover { color: #fcd116; background-color: #5578c7; border-bottom: 1px #fcd116 solid }
            a:active { color: #fca; background-color: #5578c7; border-bottom: 1px #fca solid}
            
            h1 { font-size: 2em }
            h1 > a:link, h1 > a:visited, h1 > a:hover, h1 > a:active { color: inherit; background-color: inherit; border: inherit }
            h2 { font-size: 1.2em }
            h3 { font-size: 1.1em; margin-left: 1em }
            
            abbr { border-bottom-style: none }
            p, ul, ol, dl, form, table { margin: 1em }
            ul, ol { list-style-position: inside }
            
            label:after { content: ':' }
            fieldset { width: 40%; padding: 0.5em }
            table { border-collapse: collapse }
            td { padding: 0 0.5em; border: 1px #006 solid }
						
            #footer { border-top: 1px #006 solid; margin: 1em 0; padding: 1em 0; font-size: 0.75em }
            .footnote-flag { vertical-align: super; font-size: 0.75em } /* simulate a superscript effect */
            #footnotes { list-style-position: inside; margin-bottom: 1em }
            #footnotes *:target { background-color: #fd5 }
        --></style>
    </head>
    <body>
        <h1>Gamesman Web</h1>
        <table>
            <tr><th scope="col">Canonical Name</th><th scope="col">Internal Name</th></tr><%
String[] canonicalNames = gameDictionary.getCanonicalNames();
for (int i = 0; i < canonicalNames.length; i++) {
    String canonicalName = canonicalNames[i];
%>
            <tr><td><%= canonicalName %></td><td><%= gameDictionary.getInternalName(canonicalName) %></td></tr><%
}
%>
        </table>
        <h2>Name Lookups</h2>
        <form action="service/games/getInternalName" method="get">
            <fieldset>
                <legend>Canonical to Internal</legend>
                <p><label>Canonical name</label> <input name="name" size="16"></p>
                <p><button type="submit">Lookup Internal Name</button></p>
            </fieldset>
        </form>
        <form action="service/games/getCanonicalName" method="get">
            <fieldset>
                <legend>Internal to Canonical</legend>
                <p><label>Internal name</label> <input name="name" size="16"></p>
                <p><button type="submit">Lookup External Name</button></p>
            </fieldset>
        </form>
    </body>
</html>