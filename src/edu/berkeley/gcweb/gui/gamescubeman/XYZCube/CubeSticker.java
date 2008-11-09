package edu.berkeley.gcweb.gui.gamescubeman.XYZCube;

import java.awt.Color;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;

public class CubeSticker extends Polygon3D {
	private Face face;
	public void setFace(Face face) {
		this.face = face;
	}
	public Face getFace() {
		return face;
	}
	private static Color[] colorScheme;
	public static void setColorScheme(Color[] colors) {
		colorScheme = colors;
	}
	public Color getBorderColor() {
		return Color.BLACK;
	}
	public Color getFillColor() {
		Color c = null;
		if(colorScheme != null)
			c = colorScheme[face.index()];
		return c;
	}
	public CubeSticker clone() {
		CubeSticker clone = new CubeSticker();
		copyInto(clone);
		clone.face = face;
		return clone;
	}
}
