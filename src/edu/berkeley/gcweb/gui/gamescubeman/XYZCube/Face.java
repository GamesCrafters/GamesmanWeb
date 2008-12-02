package edu.berkeley.gcweb.gui.gamescubeman.XYZCube;

import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;

public class Face {
	private static HashMap<Character, Face> namesFaces = new HashMap<Character, Face>();
	public static ArrayList<Face> faces = new ArrayList<Face>();
	public final static Face UP = new Face('U', 1, true, 0, 2, Color.WHITE);
	public final static Face DOWN = new Face('D', UP, Color.YELLOW);
	public final static Face LEFT = new Face('L', 0, true, 2, 1, Color.GREEN);
	public final static Face RIGHT = new Face('R', LEFT, Color.BLUE);
	public final static Face FRONT = new Face('F', 2, false, 0, 1, Color.RED);
	public final static Face BACK = new Face('B', FRONT, Color.ORANGE);
	//cw_cw is whether turning the face clockwise is the same as rotating clockwise about the axis
	private boolean cw_cw;
	//isClockwise indicates whether the first dimension is in the clockwise direction
	private boolean isFirstAxisClockwise = true;
	private int rotationAxis, widthAxis, heightAxis;
	private int index;
	private Color color;
	private char faceName;
	private Face(char faceName, int rotationAxis, boolean cw_cw, int widthAxis, int heightAxis, Color color) {
		this.faceName = faceName;
		namesFaces.put(faceName, this);
		this.rotationAxis = rotationAxis;
		this.cw_cw = cw_cw;
		this.widthAxis = widthAxis;
		this.heightAxis = heightAxis;
		this.color = color;
		index = faces.size();
		faces.add(this);
	}
	private Face opposite;
	private Face(char faceName, Face opposite, Color color) {
		this(faceName, opposite.rotationAxis, !opposite.cw_cw, opposite.widthAxis, opposite.heightAxis, color);
		this.opposite = opposite;
		isFirstAxisClockwise = false;
		opposite.opposite = this;
	}
	public String toString() {
		return "" + getFaceName();
	}
	public char getFaceName() {
		return faceName;
	}
	public static Face decodeFace(char face) {
		return namesFaces.get(Character.toUpperCase(face));
	}
	public static Face decodeCubeRotation(char face) {
		switch(face) {
		case 'x':
			return RIGHT;
		case 'y':
			return UP;
		case 'z':
			return FRONT;
		default:
			return null;
		}
	}
	public static Face[] faces() {
		return faces.toArray(new Face[0]);
	}
	public int index() {
		return index;
	}
	public int getWidthAxis() {
		return widthAxis;
	}
	public int getHeightAxis() {
		return heightAxis;
	}
	public int getRotationAxis() {
		return rotationAxis;
	}
	public Face getOppositeFace() {
		return opposite;
	}
	public Color getColor() {
		return color;
	}
	public boolean isFirstAxisClockwise() {
		return isFirstAxisClockwise;
	}
	public boolean isCWWithAxis() {
		return cw_cw;
	}
}