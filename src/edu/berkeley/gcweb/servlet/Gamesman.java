package edu.berkeley.gcweb.servlet;

import java.io.*;
import java.net.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import edu.berkeley.gcweb.InvalidBoardException;

class Gamesman {
	private static JSONObject doQuery(String urlparams) throws UnknownHostException, IOException, JSONException {
		Socket conn = new Socket("patrickhorn.dyndns.org", 1055);
		PrintWriter out = new PrintWriter(conn.getOutputStream(), true);
		BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		out.println(urlparams);
		
		String resp = in.readLine();
		return new JSONObject(resp);
	}
	public static JSONObject getMoveValue(String game, int width, int height, String position) throws InvalidBoardException {
		try {
			return doQuery("method=getMoveValue;board="+URLEncoder.encode(position, "UTF-8"));
		} catch (Exception e) {
			throw new InvalidBoardException(e);
		}
	}
	public static JSONObject getNextMoveValues(String game, int width, int height, String position) throws InvalidBoardException {
		try {
			return doQuery("method=getNextMoveValues;board="+URLEncoder.encode(position, "UTF-8"));
		} catch (Exception e) {
			throw new InvalidBoardException(e);
		}
	}
}
