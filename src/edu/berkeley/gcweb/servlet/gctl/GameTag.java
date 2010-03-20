package edu.berkeley.gcweb.servlet.gctl;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

import javax.servlet.jsp.tagext.TagSupport;

import org.json.JSONObject;

import edu.berkeley.gcweb.GameDictionary;

public class GameTag extends TagSupport {

	private GameDictionary dictionary;
	private String canonicalName;

	public void setCanonicalName(String name) {
		canonicalName = name;
	}

	public String getCanonicalName() {
		return canonicalName;
	}

	public void setDictionary(GameDictionary gd) {
		dictionary = gd;
	}

	public GameDictionary getDictionary() {
		return dictionary;
	}

	protected void println(String s) {
		try {
			pageContext.getOut().println(s);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static boolean isOnline(String internalName) {
		boolean alive = false;
		String uri = "http://127.0.0.1:8080/gcweb/service/gamesman/puzzles/"
				+ internalName + "/isAlive";
		try {
			InputStream in = new URL(uri).openStream();
			BufferedReader reader = new BufferedReader(
					new InputStreamReader(in));
			StringBuilder message = new StringBuilder();
			String line = reader.readLine();
			while (line != null) {
				message.append(line);
				line = reader.readLine();
			}
			in.close();

			JSONObject response = new JSONObject(message.toString());
			if (response.getString("status").equalsIgnoreCase("ok")) {
				alive = response.getJSONObject("response").getBoolean("alive");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return alive;
	}

	@Override
	public int doStartTag() {
		GameDictionary gd = getDictionary();
		String canonicalName = getCanonicalName();
		String internalName = gd.getInternalName(canonicalName);
		boolean isPuzzle = gd.getIsPuzzle(internalName);
		boolean isVisible = gd.getIsVisible(internalName);
		boolean isOnline = isOnline(internalName);
//		File iconFile = new File("/deploy/ui/images/" + internalName + ".png");
		File iconFile = new File(pageContext.getServletContext().getRealPath("/ui/images/" + internalName + ".png"));
		if (isVisible && iconFile.exists()) {
			String gameUri = String.format("ui/%1$s.jsp?%1$s=%2$s",
					isPuzzle ? "puzzle" : "game", internalName);
			String onlineImage = "ui/images/"
					+ (isOnline ? "online" : "offline") + ".png";
			String onlineStatus = isOnline ? "Online" : "Offline";

			println("<a href=\"" + gameUri + "\">");
			println("  <img src=\"ui/images/" + internalName
					+ ".png\" alt=\"Play " + internalName + "\">");
			println("  <span>");
			println("<img src=\"" + onlineImage + "\" alt=\"" + onlineStatus
					+ "\">");
			println("    " + canonicalName);
			println("  </span>");
			println("</a>");
		}
		return SKIP_BODY;
	}
}
