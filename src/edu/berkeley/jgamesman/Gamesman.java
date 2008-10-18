package edu.berkeley.jgamesman;

import java.net.URL;

import edu.berkeley.gcweb.InvalidBoardException;

class GamesmanC {
	static boolean inited = false;

	synchronized static protected native int[] getNextMoveValues(String board);
	synchronized static protected native int getMoveValue(String board);
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
			System.out.println(getMoveValue(boardstr));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	public static int[] getNextMoveValues(String board) throws InvalidBoardException {
		try {
			return GamesmanC.getNextMoveValues(board);
		} catch (IllegalArgumentException e) {
			throw new InvalidBoardException(e);
		}
	}
	
	public static int getMoveValue(String board) throws InvalidBoardException {
		try {
			return GamesmanC.getMoveValue(board);
		} catch (IllegalArgumentException e) {
			throw new InvalidBoardException(e);
		}
	}

	static {
	    URL jni = Gamesman.class.getClassLoader().getResource("GamesmanJNI.jnilib");
	    if (jni == null) {
	        System.out.println("can't find the jnilib");
	    } else {
	        System.out.println(jni.toExternalForm());
	    }
		String cwd = System.getProperty("user.dir");
		// For some reason, System.load requires an absolute path.
		System.load(cwd + "/GamesmanJNI.jnilib");
		GamesmanC.init();
	}
}
