package edu.berkeley.gcweb.servlet;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.xml.parsers.ParserConfigurationException;
import edu.berkeley.gcweb.GameDictionary;

@Path("/games")
public class GameDetailsServlet {

    @Context
    private static ServletContext servletContext;
    private static GameDictionary gameDictionary;

    @GET @Path("/getInternalName")
    @Produces("text/plain")
    public String getInternalName(@QueryParam("name") String name) {
        String internalName = getGameDictionary().getInternalName(name);
        return (internalName == null) ? "" : internalName;
    }

    @GET @Path("/getCanonicalName")
    @Produces("text/plain")
    public String getCanonicalName(@QueryParam("name") String name) {
        String canonicalName = getGameDictionary().getCanonicalName(name);
        return (canonicalName == null) ? "" : canonicalName;
    }

    public static synchronized GameDictionary getGameDictionary() {
        if (gameDictionary == null) {
            try {
                URL xmlFile = servletContext.getResource(
                    "/WEB-INF/" + servletContext.getInitParameter("gameDictionary"));
                gameDictionary = new GameDictionary(xmlFile);
            } catch (MalformedURLException e) {
                System.err.println(e.getMessage());
            } catch (ParserConfigurationException e) {
                System.err.println(e.getMessage());
            } catch (IOException e) {
                System.err.println(e.getMessage());
            }
        }
        return gameDictionary;
    }
}
