package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.Color;
import java.util.HashMap;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;

public class PuzzleSticker extends Polygon3D {
	public PuzzleSticker() {}
	private String face;
	public void setFace(String face) {
		this.face = face;
	}
	public String getFace() {
		return face;
	}
	private static HashMap<String, Color> colorScheme;
	public static void setColorScheme(HashMap<String, Color> colors) {
		colorScheme = colors;
	}
	public Color getBorderColor() {
		return Color.BLACK;
	}
	public Color getFillColor() {
		Color c = null;
		if(colorScheme != null)
			c = colorScheme.get(face);
		return c;
	}
	public PuzzleSticker clone() {
		PuzzleSticker clone = new PuzzleSticker();
		copyInto(clone);
		clone.face = face;
		return clone;
	}
	public String toString() {
		return face;
	}
}
