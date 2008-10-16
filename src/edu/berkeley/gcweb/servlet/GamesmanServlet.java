package edu.berkeley.gcweb.servlet;

import java.util.Arrays;
import java.util.List;

import javax.ws.rs.*;
import javax.ws.rs.core.*;

@Path("/gamesman")
public class GamesmanServlet {
    
    @GET @Path("/{game}/getMoveValue")
    @Produces("text/plain")
    public String getMoveValue(@PathParam("game") String game,
                               @MatrixParam("width") int width,
                               @MatrixParam("height") int height,
                               @MatrixParam("position") String position,
                               @Context UriInfo uri) {
        return "hello";
    }
    
    /**
     * Handles requests in the form of:
     *   /gamesman/{game}/getNextMoveValues;width={width};height={height};
     *                                     position={position};
     *                                     opt0={opt0};...;optN={optN}
     * @param game the internal name of the game; for example, "ttt"
     * @param option the number specifying the variant of the game
     * @param hash the hash of the game's current position
     * @return A list JSON-encoded move-values. Each move-value object will
     *         contain the hash of the position that it represents, the
     *         win-loss-tie value, the remoteness, and either the win-by value
     *         or the mex value, depending on the game.
     */
    @GET @Path("/{game}/getNextMoveValues")
    @Produces("text/plain")
    public String getNextMoveValues(@PathParam("game") String game,
                                    @MatrixParam("width") int width,
                                    @MatrixParam("height") int height,
                                    @MatrixParam("position") String position,
                                    @Context UriInfo uri) {
        
        StringBuilder response = new StringBuilder();
        response.append(
            "Request {\n" +
            "  width = " + width + ";\n" +
            "  height = " + height + ";\n" +
            "  position = " + position + ";\n"
        );
        
        List<String> standard = Arrays.asList(new String[]{"width", "height", "position"});
        MultivaluedMap<String, String> params = getMatrixParameters(uri);
        for (String param : params.keySet()) {
            if (standard.contains(param)) {
                continue;
            }
            
            response.append("  " + param + " = ");
            List<String> values = params.get(param);
            if (values.isEmpty()) {
                response.append("<null>;\n");
            } else if (values.size() == 1) {
                response.append(values.get(0) + ";\n");
            } else {
                response.append(values.toString() + ";\n");
            }
        }
        
        response.append("}\n");
        return response.toString();
    }
    
    private MultivaluedMap<String, String> getMatrixParameters(UriInfo uri) {
        MultivaluedMap<String, String> parameters;
        List<PathSegment> segments = uri.getPathSegments();
        if (segments.isEmpty()) {
            parameters = null;
        } else {
            // all path segments should share the same matrix parameters
            PathSegment tailSegment = segments.get(segments.size() - 1);
            parameters = tailSegment.getMatrixParameters();
        }
        return parameters;
    }
}
