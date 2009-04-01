package edu.berkeley.gcweb.gui.gamescubeman.Pyraminx;

import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;

import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.DoubleSliderOption;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleOption;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleSticker;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleTurn;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.TwistyPuzzle;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.Utils;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.PolygonCollection;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.RotationMatrix;

public class Pyraminx extends TwistyPuzzle {
	public Pyraminx() {
		super(0, 0, 4);
	}
	//NOTE: there's a big difference between the notation used for turns and the notation used for faces
	public HashMap<String, Color> getDefaultColorScheme() {
		HashMap<String, Color> colors = new HashMap<String, Color>();
		colors.put("F", Color.RED);
		colors.put("L", Color.GREEN);
		colors.put("R", Color.BLUE);
		colors.put("D", Color.YELLOW);
		return colors;
	}
	public String getPuzzleName() {
		return "Pyraminx";
	}

	public String getState() {
		// TODO - make this work with cube rotations and sticker changes
		return Utils.join(",", edgeLocations.toArray()) + ";"
				+ Utils.join(",", edgeOrientations.toArray()) + ";"
				+ Utils.join(",", centerOrientations.toArray());
	}

	public boolean isSolved() {
		for(int i=0; i<edgeLocations.size(); i++)
			if(i != edgeLocations.get(i) || edgeOrientations.get(i) != 0)
				return false;
		for(int i=0; i<centerOrientations.size(); i++)
			if(centerOrientations.get(i) != 0 || tipOrientations.get(i) != 0)
				return false;
		return true;
	}

	private PuzzleOption<Double> gap = new DoubleSliderOption("gap", 10, 0, 50, 100);

	@Override
	public PuzzleOption<?>[] getDefaultOptions() {
		return new PuzzleOption<?>[] { gap };
	}
	
	public void puzzleOptionChanged(PuzzleOption<?> src) {
		if(src == gap) {
			createPolys(true);
			fireStateChanged(null);
		}
	}
	
	@Override
	public RotationMatrix getPreferredViewAngle() {
		return new RotationMatrix();
//		setRotation(new RotationMatrix(0, faceDegree).multiply(new RotationMatrix(1, 60)));
	}
	
	protected void _scramble() {
		// TODO more valid scrambles?
		Random r = new Random();
		for(int i=0; i<25; i++) {
			int axis = r.nextInt(4);
			int dir = r.nextInt(2)+1;
			int layer = r.nextInt(2)+1;
			appendTurn(new PyraminxTurn(axis, dir, layer));
		}
	}
	
	private ArrayList<PolygonCollection<PuzzleSticker>> tips = null;
	private ArrayList<PolygonCollection<PuzzleSticker>> centers = null;
	private ArrayList<PolygonCollection<PuzzleSticker>> edges = null;
	private ArrayList<Integer> edgeLocations;
	private ArrayList<Integer> edgeOrientations;
	private ArrayList<Integer> tipOrientations;
	private ArrayList<Integer> centerOrientations;
	
	private static double sin60 = Math.sin(Math.toRadians(60));
	private static double sin30 = Math.sin(Math.toRadians(30));
	private static double cos30 = Math.cos(Math.toRadians(30));
	private static double faceDegree = Math.toDegrees(1/(4*cos30*cos30));
	private static final double stickerLen = .8;
	private double halfSticker = stickerLen / 2.0;
	private double stickerHeight = sin60*stickerLen;
	private double radius = 2*stickerHeight;
	private double layerHeight = Math.cos(Math.toRadians(faceDegree)) * stickerHeight;
	private double puzzleHeight = 3*layerHeight;
	private double centerHeight = (puzzleHeight - radius*radius/2.0)/2.0;
	protected void _createPolys(boolean copyOld) {
		PuzzleSticker ts = new PuzzleSticker();
		double stickerGap = gap.getValue();
		ts.addPoint(0, stickerHeight - stickerGap, 0);
		ts.addPoint(halfSticker - stickerGap*cos30, stickerGap*sin30, 0);
		ts.addPoint(-halfSticker + stickerGap*cos30, stickerGap*sin30, 0);
		
		PuzzleSticker cs = ts.clone();
		cs.rotate(new RotationMatrix(2, 180));
		
		PuzzleSticker es = ts.clone();
		es.translate(-halfSticker, -stickerHeight, 0);
		
		PolygonCollection<PuzzleSticker> facePolys = new PolygonCollection<PuzzleSticker>();
		facePolys.add(ts);
		facePolys.add(cs);
		facePolys.add(es);
		RotationMatrix third = new RotationMatrix(2, 360/3);
		facePolys.translate(0, stickerHeight, 0);
		for(int i = 0; i < 2; i++) {
			(ts = ts.clone()).rotate(third);
			(cs = cs.clone()).rotate(third);
			(es = es.clone()).rotate(third);
			facePolys.add(ts);
			facePolys.add(cs);
			facePolys.add(es);
		}
		facePolys.translate(0, -2*stickerHeight, 0);
		
		PolygonCollection<PuzzleSticker> bottom = facePolys.clone();
		bottom.rotate(new RotationMatrix(0, 90));
		bottom.translate(0, -3*layerHeight, 2*stickerHeight);
		for(PuzzleSticker ps : bottom)
			ps.setFace("D");
		addPolys(bottom);
		facePolys.rotate(new RotationMatrix(0, faceDegree));
		facePolys.translate(0, 3*layerHeight-centerHeight, 0);
		bottom.translate(0, 3*layerHeight-centerHeight, 0);
		
		ArrayList<PolygonCollection<PuzzleSticker>> ogTips = tips;
		ArrayList<PolygonCollection<PuzzleSticker>> ogCenters = centers;
		ArrayList<PolygonCollection<PuzzleSticker>> ogEdges = edges;
		tips = new ArrayList<PolygonCollection<PuzzleSticker>>();
		centers = new ArrayList<PolygonCollection<PuzzleSticker>>();
		edges = new ArrayList<PolygonCollection<PuzzleSticker>>();
		
		ArrayList<Integer> ogEdgeLocations = edgeLocations;
		ArrayList<Integer> ogEdgeOrientations = edgeOrientations;
		ArrayList<Integer> ogTipOrientations = tipOrientations;
		ArrayList<Integer> ogCenterOrientations = centerOrientations;
		edgeLocations = new ArrayList<Integer>();
		edgeOrientations = new ArrayList<Integer>();
		tipOrientations = new ArrayList<Integer>();
		centerOrientations = new ArrayList<Integer>();
		for(int i=0; i<4; i++) {
			tips.add(new PolygonCollection<PuzzleSticker>());
			centers.add(new PolygonCollection<PuzzleSticker>());
			tipOrientations.add(0); centerOrientations.add(0);
		}
		for(int i=0; i<6; i++) {
			edges.add(new PolygonCollection<PuzzleSticker>());
			edgeLocations.add(i);
			edgeOrientations.add(0);
		}
		//the elements of facePolys should be as follows
		//	      /\
		//	     /0_\
		//	    /\1 /\
		//	   /8_\/2_\
		//	  /\7 /\4 /\
		//	 /6_\/5_\/_3\

		tips.get(RIGHT).add(bottom.get(3));
		tips.get(LEFT).add(bottom.get(6));
		tips.get(BACK).add(bottom.get(0));
		centers.get(RIGHT).add(bottom.get(4));
		centers.get(LEFT).add(bottom.get(7));
		centers.get(BACK).add(bottom.get(1));
		edges.get(3).add(bottom.get(5));
		edges.get(4).add(bottom.get(8));
		edges.get(5).add(bottom.get(2));
		String[] faces = new String[] { "F", "R", "L" };
		for(int i=0; i<faces.length; i++) {
			String face = faces[i];
			facePolys = facePolys.clone();
			for(PuzzleSticker ps : facePolys)
				ps.setFace(face);
			addPolys(facePolys);
			tips.get(UP).add(facePolys.get(0));
			centers.get(UP).add(facePolys.get(1));
			int leftCenter = -1, rightCenter = -1, leftEdge = -1, rightEdge = -1, bottomEdge = -1;
			if(face.equals("F")) {
				leftCenter = LEFT;
				rightCenter = RIGHT;
				leftEdge = 1;
				rightEdge = 0;
				bottomEdge = 3;
			} else if(face.equals("R")) {
				leftCenter = RIGHT;
				rightCenter = BACK;
				leftEdge = 0;
				rightEdge = 2;
				bottomEdge = 5;
			} else if(face.equals("L")) {
				leftCenter = BACK;
				rightCenter = LEFT;
				leftEdge = 2;
				rightEdge = 1;
				bottomEdge = 4;
			}
			tips.get(leftCenter).add(facePolys.get(6));
			tips.get(rightCenter).add(facePolys.get(3));
			centers.get(leftCenter).add(facePolys.get(7));
			centers.get(rightCenter).add(facePolys.get(4));
			edges.get(leftEdge).add(facePolys.get(8));
			edges.get(rightEdge).add(facePolys.get(2));
			edges.get(bottomEdge).add(facePolys.get(5));
			if(i != 0) //we don't want to rotate the front
				facePolys.rotate(new RotationMatrix(1, 360/3), false);
		}
		if(copyOld) {
			for(int i=0; i<ogTips.size(); i++) {
				tips.get(i).rotate(ogTips.get(i).getNetRotations());
			}
			for(int i=0; i<ogCenters.size(); i++) {
				centers.get(i).rotate(ogCenters.get(i).getNetRotations());
			}
			for(int i=0; i<ogEdges.size(); i++) {
				edges.get(i).rotate(ogEdges.get(i).getNetRotations());
			}
			edgeLocations = ogEdgeLocations;
			edgeOrientations = ogEdgeOrientations;
			tipOrientations = ogTipOrientations;
			centerOrientations = ogCenterOrientations;
		}
	}
	
	//TODO - do puzzle rotations! how?
	protected boolean _doTurn(String turn) {
		boolean ccw = turn.endsWith("'");
		if(ccw)	turn = turn.substring(0, turn.length()-1);
		if(turn.length() != 1) return false;
		char face = turn.charAt(0);
		boolean twoLayer = Character.isUpperCase(face);
		if(twoLayer) face = Character.toLowerCase(face);
		int axis;
		if(face == 'u') {
			axis = UP;
		} else if(face == 'r') {
			axis = RIGHT;
		} else if(face == 'l') {
			axis = LEFT;
		} else if(face == 'b') {
			axis = BACK;
		} else {
			return false;
		}
		appendTurn(new PyraminxTurn(axis, ccw ? -1 : 1, twoLayer ? 2 : 1));
		return true;
	}
	
	private static final String AXES="URLB";
	private static final int UP=0, RIGHT=1, LEFT=2, BACK=3;
	private class PyraminxTurn extends PuzzleTurn {
		private int axis, dir, layer;
		public PyraminxTurn(int axis, int dir, int layer) {
			this.axis = axis;
			dir = Utils.modulo(dir, 3);
			if(dir == 2) dir = -1;
			this.dir = dir;
			this.layer = layer;
			
			frames = getFramesPerAnimation();
			double degree = -dir*360/3.0/frames;
			if(axis == UP) {
				rotation = new RotationMatrix(1, degree);
				edgeIndices = new Integer[] { 0, 1, 2 };
			} else if(axis == LEFT) {
				rotation = new RotationMatrix(sin60*radius, -centerHeight, -stickerHeight, degree);
				edgeIndices = new Integer[] { 3, 4, 1 };
			} else if(axis == RIGHT) {
				rotation = new RotationMatrix(-sin60*radius, -centerHeight, -stickerHeight, degree);
				edgeIndices = new Integer[] { 3, 0, 5 };
			} else if(axis == BACK) {
				rotation = new RotationMatrix(0, -centerHeight, radius, degree);
				edgeIndices = new Integer[] { 2, 4, 5 };
			}
		}
		
		private int frames = -1;
		private RotationMatrix rotation;
		private Integer[] edgeIndices;
		public boolean animateMove() {
			tips.get(axis).rotate(rotation);
			if(layer > 1) {
				//need to do the centers and edges, too
				centers.get(axis).rotate(rotation);
				for(int i : edgeIndices)
					edges.get(edgeLocations.get(i)).rotate(rotation);
			}
			return --frames == 0;
		}

		public boolean isAnimationMergeble(PuzzleTurn other) {
			PyraminxTurn o = (PyraminxTurn) other;
			return this.axis == o.axis || this.layer == 1 || o.layer == 1;
		}
		public boolean isInspectionLegal() {
			return false;
		}
		public boolean isNullTurn() {
			return dir == 0;
		}
		public PuzzleTurn mergeTurn(PuzzleTurn other) {
			PyraminxTurn o = (PyraminxTurn) other;
			if(o.axis == this.axis && o.layer == this.layer) {
				return new PyraminxTurn(this.axis, this.dir + o.dir, this.layer);
			}
			return null;
		}
		public String toString() {
			char face = AXES.charAt(axis);
			if(layer == 1) face = Character.toLowerCase(face);
			else if(layer == 2) face = Character.toUpperCase(face);
			return face + ((dir == -1) ? "'" : "");
		}
		//TODO - i'm thinking that it would be better to never update the internal representation of the polygons
		public void updateInternalRepresentation(boolean polygons) {
			if(polygons) {
				if(layer > 1) {
					cycle(edgeLocations, edgeIndices, dir);
					centerOrientations.set(axis, Utils.modulo(centerOrientations.get(axis) + dir, 3));
					cycle(edgeOrientations, edgeIndices, dir);
					//NOTE: we're updating the orientations *after* their permutations have been updated
					if(axis == LEFT || axis == RIGHT) {
						//these twists don't affect edge orientation
					} else {
						int edge1 = -1, edge2 = -1;
						if(axis == BACK) {
							if(dir == -1) {
								edge1 = 4;
								edge2 = 5;
							} else if(dir == 1) {
								edge1 = 5;
								edge2 = 2;
							}
						} else if(axis == UP) {
							if(dir == -1) {
								edge1 = 0;
								edge2 = 1;
							} else if(dir == 1) {
								edge1 = 1;
								edge2 = 2;
							}
						}
						edgeOrientations.set(edge1, 1-edgeOrientations.get(edge1));
						edgeOrientations.set(edge2, 1-edgeOrientations.get(edge2));
					}
				}
				tipOrientations.set(axis, Utils.modulo(tipOrientations.get(axis) + dir, 3));
			}
		}
		private void cycle(ArrayList<Integer> arr, Integer[] indices, int offset) {
			ArrayList<Integer> clone = new ArrayList<Integer>(arr);
			for(int i=0; i<indices.length; i++) {
				arr.set(Utils.moduloAcces(indices, i+offset), clone.get(indices[i])); 
			}
		}
	}
}
