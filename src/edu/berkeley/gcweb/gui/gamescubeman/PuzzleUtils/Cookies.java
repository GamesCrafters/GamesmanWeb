package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.util.Calendar;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

import netscape.javascript.JSObject;

public class Cookies {
	private static String expires;
	{
		//set the cookie to expire in 1 year
		Calendar c = Calendar.getInstance();
		c.add(Calendar.YEAR, 1);
		expires = "expires=" + c.getTime().toString() + ";";
	}
	private HashMap<String, String> cookieCache = new HashMap<String, String>();
	public Cookies() {}
	
	private String category=""; //this allows duplicate keys under different categories
	private JSObject document;
	public Cookies(JSObject jso) {
		document = (JSObject) jso.getMember("document");

		//parse all the unexpired cookies
		for(String keyVal : ((String) document.getMember("cookie")).split(" *; *")) {
			String[] key_val = keyVal.split("=");
			if(key_val.length == 2)
				cookieCache.put(key_val[0], key_val[1]);
		}
	}
	public void setCategory(String category) {
		this.category = category + "_";
	}
	private static String escape(String s) {
		StringBuffer sb = new StringBuffer();
		for(int i=0; i<s.length(); i++) {
			char c = s.charAt(i);
			if(c == '\\')
				sb.append("\\\\");
			else if(c == '=')
				sb.append("\\e");
			else if(c == ';')
				sb.append("\\s");
			else
				sb.append(c);
		}
		return sb.toString();
	}
	private static String unescape(String s) {
		if(s == null) return null;
		StringBuffer sb = new StringBuffer();
		for(int i=0; i<s.length(); i++) {
			char c = s.charAt(i);
			if(c == '\\') {
				if(i == s.length())
					return null;
				c = s.charAt(++i);
				if(c == 'e') c = '=';
				else if(c == 's') c = ';';
				sb.append(c);
			} else
				sb.append(c);
		}
		return sb.toString();
	}
	
	public String get(String key) {
		return unescape(cookieCache.get(escape(category + key)));
	}
	public void set(String key, String value) {
		key = escape(category + key);
		value = escape(value);
		cookieCache.put(key, value);
		if(document != null)
			document.setMember("cookie", key + "=" + value + ";" + expires);
	}
	
	public Dictionary<String, String> getMap(String key) {
		Hashtable<String, String> map = new Hashtable<String, String>();
		String cookie = get(key);
		if(cookie == null) return null;
		for(String keyVal : cookie.split("\f")) {
			String[] key_val = keyVal.split("=");
			if(key_val.length != 2) {
				System.err.println("Expected key=value not found in " + keyVal);
				return null;
			}
			map.put(key_val[0], key_val[1]);
		}
		return map;
	}
	public void setMap(String key, Map<Object, Object> map) {
		StringBuffer sb = new StringBuffer();
		for(Map.Entry<Object, Object> entry : map.entrySet())
			sb.append(entry.getKey() + "=" + entry.getValue() + "\f");
		set(key, sb.toString());
	}
}
