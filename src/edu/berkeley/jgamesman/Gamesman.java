package edu.berkeley.jgamesman;

import java.net.URL;
import java.util.Map;

import edu.berkeley.gcweb.InvalidBoardException;

class GamesmanC {
	static boolean inited = false;

	synchronized static protected native int[] getNextMoveValues(String board);
	synchronized static protected native Map<String,String> getMoveValue(String board);
	synchronized static private native void initnative();
	synchronized static protected void init() {
		if (inited) {
			return;
		}
		inited = true;
		initnative();
	}
}

public class Gamesman {
	public static void main(String []args) {
		String boardstr = args[0].replace('-',' ');
		try {
			System.out.println(getMoveValue("ttt",3,3,boardstr));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	public static int[] getNextMoveValues(String game, int width, int height, String board) throws InvalidBoardException {
		try {
			return GamesmanC.getNextMoveValues(board);
		} catch (IllegalArgumentException e) {
			throw new InvalidBoardException(e);
		}
	}
	
	public static Map<String,String> getMoveValue(String game, int width, int height, String board) throws InvalidBoardException {
		try {
			return GamesmanC.getMoveValue(board);
		} catch (IllegalArgumentException e) {
			throw new InvalidBoardException(e);
		}
	}

	static {
	    URL jniLib = Gamesman.class.getClassLoader().getResource("GamesmanJNI.jnilib");
	    assert jniLib != null : "Cannot find JNI lib.";
		// For some reason, System.load requires an absolute path.
		System.load(jniLib.getPath());
		GamesmanC.init();
	}
}