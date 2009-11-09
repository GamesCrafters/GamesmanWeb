package edu.berkeley.gcweb.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.Socket;
import java.net.URL;
import java.net.URLEncoder;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriInfo;

import org.json.JSONException;
import org.json.JSONObject;

import edu.berkeley.gcweb.GameDictionary;
import edu.berkeley.gcweb.GameState;

import org.apache.thrift.TException;
import org.apache.thrift.TSerializer;
import org.apache.thrift.protocol.*;
import org.apache.thrift.server.TThreadPoolServer;
import org.apache.thrift.transport.*;


import edu.berkeley.gcweb.servlet.thrift.GamestateRequestHandler;
import edu.berkeley.gcweb.servlet.thrift.GetMoveResponse;
import edu.berkeley.gcweb.servlet.thrift.GetNextMoveResponse;



import java.io.*;
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
    	String json = null;

    	Socket socket = getGameConnectionInfo(puzzle, json);
    	
    	TTransport transport = new TSocket(socket.getInetAddress().getHostAddress(), socket.getPort());
    	
		if (json != null) {
    		return json;
    	}
    	
    	TProtocol protocol = new TBinaryProtocol(transport);
    	
    	GetMoveResponse response;
    	try {
    		transport.open();
    		GamestateRequestHandler.Client request = new GamestateRequestHandler.Client(protocol); 
            // return client.getMoveValue(puzzle, createMatrixParameterString(uri));        
    		
            response = request.getMoveValue(puzzle, createMatrixParameterString(uri));
            
            if (response != null) {
            	//response = client.getMoveValue(puzzle, createMatrixParameterString(uri));
            	TSerializer serializer = new TSerializer(new TSimpleJSONProtocol.Factory());
                json = serializer.toString(response);
            } else {
            	
            	// generate error message
            }
		} catch (TException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		if (json == null) {
			response = new GetMoveResponse("error");
			response.setMessage("No response from server");
			TSerializer serializer = new TSerializer(new TSimpleJSONProtocol.Factory());
            try {
				json = serializer.toString(response);
			} catch (TException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
    	
    	
        
        return json;
    }

    @GET @Path("/{puzzle}/getNextMoveValues")
    @Produces("text/plain")
    public String getNextMoveValues(@PathParam("puzzle") String puzzle,
                                    @Context UriInfo uri) {
    	String json = null;

    	Socket socket = getGameConnectionInfo(puzzle, json);
    	
    	TTransport transport = new TSocket(socket.getInetAddress().getHostAddress(), socket.getPort());
    	
		if (json != null) {
    		return json;
    	}
    	
    	TProtocol protocol = new TBinaryProtocol(transport);
    	
    	GetNextMoveResponse response;
    	try {
    		transport.open();
    		GamestateRequestHandler.Client request = new GamestateRequestHandler.Client(protocol); 
            // return client.getMoveValue(puzzle, createMatrixParameterString(uri));        
    		
            response = request.getNextMoveValues(puzzle, createMatrixParameterString(uri));
            
            if (response != null) {
            	//response = client.getMoveValue(puzzle, createMatrixParameterString(uri));
            	TSerializer serializer = new TSerializer(new TSimpleJSONProtocol.Factory());
                json = serializer.toString(response);
            } else {
            	
            	// generate error message
            }
		} catch (TException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		if (json == null) {
			response = new GetNextMoveResponse("error");
			response.setMessage("No response from server");
			TSerializer serializer = new TSerializer(new TSimpleJSONProtocol.Factory());
            try {
				json = serializer.toString(response);
			} catch (TException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		

        return json;  
    	/*
        String params = ";method=getNextMoveValues" +
            createMatrixParameterString(uri);
        return executeRemoteQuery(puzzle, params);
        */
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
    /**
     *  Calls connectToRemove to check if the request is sane... IE:
     * 		- the game is in our dictionary 
     * 		- the server port mapping is in our dictionary (or whatever connecToRemote does) 
     * 		- generate error string into response if bad things happen
     *  At the same time,  
     */
    private Socket getGameConnectionInfo(String gameName, String response) {
    	//String response = null;
    	Socket conn = null;
        
    	try {
            // create a new TCP socket connection to the server
            conn = connectToRemote(gameName);
        
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
        return conn;
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
