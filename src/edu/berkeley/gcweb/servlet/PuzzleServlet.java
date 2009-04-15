package edu.berkeley.gcweb.servlet;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.Socket;
import java.net.URLEncoder;
import java.net.URL;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriInfo;
import javax.servlet.ServletContext;

import org.json.JSONException;
import org.json.JSONObject;

import edu.berkeley.gcweb.GameDictionary;

/**
 * A thin servlet that connects to a data source to retrieve puzzle move
 * information and return it to the client as a JSON-formatted string.
 * 
 * This implementation uses TCP sockets to connect to a remote Python server.
 * @author Ide
 */
@Path("/gamesman/puzzles")
public class PuzzleServlet {
    
    @Context
    private static ServletContext servletContext; // why do I need this?
    
    @GET @Path("/{puzzle}/getMoveValue")
    @Produces("text/plain")
    public String getMoveValue(@PathParam("puzzle") String puzzle,
                               @Context UriInfo uri) {
        String params = ";method=getMoveValue" + createMatrixParameterString(uri);
        return executeRemoteQuery(puzzle, params);
    }

    @GET @Path("/{puzzle}/getNextMoveValues")
    @Produces("text/plain")
    public String getNextMoveValues(@PathParam("puzzle") String puzzle,
                                    @Context UriInfo uri) {
        
        String params = ";method=getNextMoveValues" +
            createMatrixParameterString(uri);
        return executeRemoteQuery(puzzle, params);
    }
    
    private Socket connectToRemote(String gameName) throws IOException {
        GameDictionary.GameInfo inf;
        try {
            URL xmlFile = servletContext.getResource(
                    "/WEB-INF/" + servletContext.getInitParameter("gameDictionary"));
            GameDictionary gameDictionary = new GameDictionary(xmlFile);
            inf = gameDictionary.getGameInfo(gameName);
        }
        catch (Exception e) {
            throw new RuntimeException("unable to make dictionary");
        }
        if (inf == null) {
            throw new RuntimeException("unknown game "+gameName+"!");
        }
        Socket sock = inf.connectRandom();
        if (sock == null) {
            throw new RuntimeException("no hosts defined for "+gameName+"!");
        }
        return sock;
    }
    
    private String executeRemoteQuery(String gamename, String message) {
        String response = null;
        Socket conn = null;
        try {
            message += ";game=" + URLEncoder.encode(gamename, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            System.err.println("Failed to URL-encode the gamename " + gamename + ".");
            e.printStackTrace();
        }
        try {
            // create a new TCP socket connection to the server
            conn = connectToRemote(gamename);
            BufferedReader in = new BufferedReader(
                new InputStreamReader(conn.getInputStream()));
            PrintWriter out = new PrintWriter(conn.getOutputStream(), true);
            
            out.println(message);
            response = in.readLine();
            
            conn.close();
        } catch (Exception e) {
            System.out.println(e);
            try {
                StringWriter sw = new StringWriter();
                e.printStackTrace(new PrintWriter(sw));
                JSONObject json = new JSONObject();
                //json.put("exception", e.getClass().toString());
                //json.put("stacktrace", sw.toString());
                json.put("status", "error");
                json.put("message", e.getMessage() != null ? e.getMessage() : e.toString());
                response = json.toString(4);
            } catch (JSONException je) {
                response = "{status: 'error', message: 'A JSON error occurred while handling an exception.'}";
            }
        }
        return response;
    }
    
    /**
     * Returns a URL-encoded query string containing matrix parameters and
     * their respective arguments. If there are no matrix parameters, an
     * empty string is returned.
     * @param uri the UriInfo object from which the parameters will be obtained
     * @return a string of URL-encoded matrix parameters and arguments
     */
    public static String createMatrixParameterString(UriInfo uri) {
        StringBuilder buffer = new StringBuilder();
        MultivaluedMap<String, String> parameters =
            GamesmanServlet.getMatrixParameters(uri);
        if (parameters != null) {
            for (String key : parameters.keySet()) {
                for (String value : parameters.get(key)) {
                    try {
                        buffer.append(";" + URLEncoder.encode(key, "UTF-8") +
                            "=" + URLEncoder.encode(value, "UTF-8"));
                    } catch (UnsupportedEncodingException e) {
                        System.err.println("Failed to URL-encode the key value pair for " +
                            key + "=" + value + ".");
                        e.printStackTrace();
                    }
                }
            }
        }
        return buffer.toString();
    }
}
