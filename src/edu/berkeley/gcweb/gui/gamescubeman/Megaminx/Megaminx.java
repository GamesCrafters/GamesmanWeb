package edu.berkeley.gcweb.gui.gamescubeman.Megaminx;

import static java.lang.Math.abs;
import static java.lang.Math.acos;
import static java.lang.Math.cos;
import static java.lang.Math.sin;
import static java.lang.Math.tan;
import static java.lang.Math.toDegrees;
import static java.lang.Math.toRadians;

import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Random;

import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.DoubleSliderOption;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleOption;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleSticker;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleTurn;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.SpinnerOption;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.TwistyPuzzle;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.Utils;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.PolygonCollection;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.RotationMatrix;

public class Megaminx extends TwistyPuzzle {

	public Megaminx() {
		super(0, 0, 4);
	}

	private PuzzleOption<Double> stickerGap = new DoubleSliderOption("gap", true, 30, 0, 100, 1000);
	private PuzzleOption<Double> cut_depth = new DoubleSliderOption("cut_depth", true, 50, 0, 100, 100);
	private PuzzleOption<Integer> layers = new SpinnerOption("layers", true, 1, 1, null, 1);
	
	@Override
	public ArrayList<PuzzleOption<?>> _getDefaultOptions() {
		ArrayList<PuzzleOption<?>> options = new ArrayList<PuzzleOption<?>>();
		options.add(stickerGap);
		options.add(cut_depth);
		options.add(layers);
		return options;
	}

	public void puzzleOptionChanged(PuzzleOption<?> src) {
		if(src == stickerGap || src == cut_depth) {
			createPolys(true);
			fireStateChanged(null);
		}
	}

	@Override
	public String getPuzzleName() {
		return "Megaminx";
	}

	@Override
	public String getState() {
		return "";
	}

	@Override
	public boolean isSolved() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public RotationMatrix getPreferredViewAngle() {
		return new RotationMatrix(0, -0.5*(180-toDegrees(adjAngleRad)));
	}

	@Override
	protected void _scramble() {
		Random r = new Random();
		for(int i = 0; i < 60; i++) {
			int axis = r.nextInt(FACES.length);
			int dir = r.nextInt(2)+1;
			if(r.nextBoolean()) dir = -dir; //clockwise or counterclockwise
			boolean wide = r.nextBoolean();
			appendTurn(new MegaminxTurn(axis, dir, false, wide));
		}
	}
	
	private static int[] enumerate(int count) {
		int[] temp = new int[count];
		for(int i = 0; i < count; i++)
			temp[i] = i;
		return temp;
	}

	private ArrayList<PolygonCollection<PuzzleSticker>> centerStickers, cornerStickers, edgeStickers;
	private int[] centerPermutation, cornerPermutation, edgePermutation, cornerOrientation, edgeOrientation;
	
	//this is the angle between adjacent faces
	//see this: http://members.tripod.com/~Paul_Kirby/Linear/dodoca.html
	private static final double adjAngleRad = 2*acos(0.5/sin(toRadians(72)));
	
	@Override
	protected void _createPolys(boolean copyOld) {
		double gap = stickerGap.getValue();
		double rad = .8;
		double cutRad = cut_depth.getValue()*rad;
		int increment = 360/5;
		RotationMatrix m = new RotationMatrix(1, -increment);
		
		PolygonCollection<PuzzleSticker> face = new PolygonCollection<PuzzleSticker>();
		PuzzleSticker edge = new PuzzleSticker();
		PuzzleSticker corner = new PuzzleSticker();
		PuzzleSticker center = new PuzzleSticker();

		double cornerVertGap = gap/sin(toRadians(54));
		double cornerHorzGap = gap/sin(toRadians(36));
		double edgeVertGap = gap/sin(toRadians(54));
		double edgeHorzGap = cornerHorzGap;
		
		corner.addPoint(0, 0, cutRad+cornerVertGap);
		double x = (rad-cutRad)*tan(toRadians(36));
		corner.addPoint(-x+cornerHorzGap, 0, (cutRad+rad)/2.0);
		corner.addPoint(0, 0, rad-cornerVertGap);
		corner.addPoint(x-cornerHorzGap, 0, (cutRad+rad)/2.0);
		
		edge.addPoint(-edgeHorzGap, 0, cutRad);
		edge.addPoint(m.multiply(edgeHorzGap, 0, cutRad));
		edge.addPoint(m.multiply(x, 0, (cutRad+rad)/2.0 - edgeVertGap));
		edge.addPoint(-x, 0, (cutRad+rad)/2.0 - edgeVertGap);

		for(int degree = 0; degree < 360; degree += increment) {
			double r = toRadians(degree+90);
			center.addPoint((cutRad-cornerVertGap)*cos(r), 0, (cutRad-cornerVertGap)*sin(r));
			
			face.add(corner.clone());
			face.add(edge.clone());
			corner.rotate(m);
			edge.rotate(m);
		}
		face.add(center);
		
		ArrayList<PolygonCollection<PuzzleSticker>> topHalf = new ArrayList<PolygonCollection<PuzzleSticker>>();
		ArrayList<PolygonCollection<PuzzleSticker>> bottomHalf = new ArrayList<PolygonCollection<PuzzleSticker>>();
		
		double cos45 = cos(toRadians(45));
		//subtracting .018 because things don't quite add up, for whatever reason :/
		face.translate(0, sin(adjAngleRad/2.0)*rad*(cos45+cos(adjAngleRad/2.0)*(1+cos45)), 0);
		topHalf.add(face.clone());
		
		RotationMatrix halfIncrement = new RotationMatrix(1, increment / 2.0);
		face.rotate(halfIncrement);
		face.rotate(new RotationMatrix(0, -(180-toDegrees(adjAngleRad))));
		topHalf.add(face.clone());
		for(int i = 0; i < 5; i++) {
			face.rotate(m);
			topHalf.add(face.clone());
		}

		for(PolygonCollection<PuzzleSticker> f : topHalf) {
			PolygonCollection<PuzzleSticker> f2 = f.clone();
			f2.mirror(1);
			f2.rotate(halfIncrement);
			bottomHalf.add(f2);
		}

		//this is to order the faces according to ABCDEFabcdef
		ArrayList<PolygonCollection<PuzzleSticker>> faces = new ArrayList<PolygonCollection<PuzzleSticker>>();

		PolygonCollection<PuzzleSticker> Fface = topHalf.get(1);
		faces.add(Fface);
		PolygonCollection<PuzzleSticker> Uface = topHalf.get(0);
		faces.add(Uface);
		PolygonCollection<PuzzleSticker> Rface = topHalf.get(5);
		faces.add(Rface);
		PolygonCollection<PuzzleSticker> DRface = bottomHalf.get(1);
		faces.add(DRface);
		PolygonCollection<PuzzleSticker> DLface = bottomHalf.get(2);
		faces.add(DLface);
		PolygonCollection<PuzzleSticker> Lface = topHalf.get(2);
		faces.add(Lface);
		PolygonCollection<PuzzleSticker> Bface = bottomHalf.get(4);
		faces.add(Bface);
		PolygonCollection<PuzzleSticker> Dface = bottomHalf.get(0);
		faces.add(Dface);
		PolygonCollection<PuzzleSticker> BLDface = bottomHalf.get(3);
		faces.add(BLDface);
		PolygonCollection<PuzzleSticker> BLface = topHalf.get(3);
		faces.add(BLface);
		PolygonCollection<PuzzleSticker> BRface = topHalf.get(4);
		faces.add(BRface);
		PolygonCollection<PuzzleSticker> BRDface = bottomHalf.get(5);
		faces.add(BRDface);
		
		addPolys(Fface);
//		for(PolygonCollection<PuzzleSticker> f : faces)
//			addPolys(f);
	}
	
	//to make things easier, we are only looking for face to start with the actual face
	private static int getAxis(String face) {
		int matchLength = -1, match = -1;
		for(int c = 0; c < FACES.length; c++) {
			if(face.startsWith(FACES[c]) && FACES[c].length() > matchLength) {
				matchLength = FACES[c].length();
				match = c;
			}
		}
		return match;
	}
	private static final String[] FACES = { "F", "U", "R",   "DR", "DL", "L", //faces on the front 
											"B", "D", "BLD", "BL", "BR", "BRD" }; //and the faces directly opposite them
	@Override
	protected boolean _doTurn(String turn) {
		boolean cubeRotation = turn.startsWith("[");
		int axis, dir;
		if(cubeRotation) {
			axis = getAxis(turn.substring(1));
			turn = turn.substring(FACES[axis].length() + 2);
		} else {
			axis = getAxis(turn);
			turn = turn.substring(FACES[axis].length());
		}
		if(axis == -1)
			return false;
		
		boolean wide = turn.startsWith("w");
		if(wide)
			turn = turn.substring(1);
		
		boolean ccw = turn.indexOf('\'') != -1;
		turn = turn.replaceAll("'", "");
		if(turn.length() == 0)
			dir = 1;
		else
			dir = Integer.parseInt(turn);
		if(ccw)
			dir = -dir;
		
		appendTurn(new MegaminxTurn(axis, dir, cubeRotation, wide));
		return true;
	}

	@Override
	public HashMap<String, Color> getDefaultColorScheme() {
		HashMap<String, Color> colorScheme = new HashMap<String, Color>();
		colorScheme.put("F", Color.GRAY.brighter());
		colorScheme.put("U", Color.WHITE);
		colorScheme.put("R", new Color(102, 0, 102)); //purple
		colorScheme.put("DR", Color.ORANGE.darker());
		colorScheme.put("DL", Color.PINK);
		colorScheme.put("L", Color.GREEN);
		colorScheme.put("B", Color.YELLOW);
		colorScheme.put("D", Color.BLUE);
		colorScheme.put("BLD", Color.RED);
		colorScheme.put("BL", Color.ORANGE); //this is actually a pretty light orange, using .brighter() makes it yellow
		colorScheme.put("BR", Color.BLUE.darker().darker());
		colorScheme.put("BRD", new Color(0, 255, 204)); //light blue
		return colorScheme;
	}
	
	class MegaminxTurn extends PuzzleTurn {
		private int axis, dir, frames;
		private boolean wide, cubeRotation;
		private RotationMatrix rotate;
		private ArrayList<int[]> edgeCycles, cornerCycles, centerCycles;
		private ArrayList<Integer> activeEdges, activeCorners, activeCenters;
		public MegaminxTurn(int axis, int dir, boolean cubeRotation, boolean wide) {
			if(cubeRotation && wide) throw new RuntimeException();
			
			this.axis = axis;
			this.dir = dir;
			this.cubeRotation = cubeRotation;
			this.wide = wide;
			frames = getFramesPerAnimation();
			rotate = getRotationMatrix(axis, -dir*(360.0/5.0)/frames);
			
			edgeCycles = new ArrayList<int[]>();
			cornerCycles = new ArrayList<int[]>();
			centerCycles = new ArrayList<int[]>();
			
			addCycles(axis, false, wide);
			if(cubeRotation) {
				int opAxis = Utils.modulo(axis+6, FACES.length);
				addCycles(opAxis, true, true);
			}
			
			activeEdges = new ArrayList<Integer>();
			activeCorners = new ArrayList<Integer>();
			activeCenters = new ArrayList<Integer>();
			for(int[] cycle : edgeCycles)
				for(int i : cycle)
					activeEdges.add(edgePermutation[i]);
			for(int[] cycle : cornerCycles)
				for(int i : cycle)
					activeCorners.add(cornerPermutation[i]);
			for(int[] cycle : centerCycles)
				for(int i : cycle)
					activeCenters.add(centerPermutation[i]);
		}
		
		private void addCycles(int axis, boolean reverse, boolean wide) {
			ArrayList<int[]> newEdgeCycles = new ArrayList<int[]>();
			ArrayList<int[]> newCornerCycles = new ArrayList<int[]>();
			ArrayList<int[]> newCenterCycles = new ArrayList<int[]>();
			if(wide) {
				String f = FACES[axis % 6];
				if(f.equals("F")) {
					newCenterCycles.add(new int[] { 1, 2, 3, 4, 5 });
					newCenterCycles.add(new int[] { 7, 8, 9, 10, 11 });
					newEdgeCycles.add(new int[] { 5, 6, 7, 8, 9 });
					newEdgeCycles.add(new int[] { 10, 12, 14, 16, 18 });
					newEdgeCycles.add(new int[] { 11, 13, 15, 17, 19 });
					newEdgeCycles.add(new int[] { 20, 21, 22, 23, 24 });
					newCornerCycles.add(new int[] { 6, 8, 10, 12, 14 });
					newCornerCycles.add(new int[] { 7, 9, 11, 13, 5 });
				} else if(f.equals("U")) {
					newCenterCycles.add(new int[] { 0, 5, 9, 10, 2 });
					newCenterCycles.add(new int[] { 3, 4, 8, 6, 11 });
					newEdgeCycles.add(new int[] { 1, 4, 19, 20, 12 });
					newEdgeCycles.add(new int[] { 2, 9, 24, 26, 13 });
					newEdgeCycles.add(new int[] { 3, 18, 25, 21, 7 });
					newEdgeCycles.add(new int[] { 8, 17, 29, 27, 14 });
					newCornerCycles.add(new int[] { 4, 14, 15, 8, 2 });
					newCornerCycles.add(new int[] { 3, 13, 19, 16, 9 });
				} else if(f.equals("R")) {
					newCenterCycles.add(new int[] { 0, 1, 10, 11, 3 });
					newCenterCycles.add(new int[] { 5, 9, 6, 7, 4 });
					newEdgeCycles.add(new int[] { 0, 11, 21, 14, 2 });
					newEdgeCycles.add(new int[] { 4, 10, 26, 22, 8 });
					newEdgeCycles.add(new int[] { 5, 20, 27, 15, 3 });
					newEdgeCycles.add(new int[] { 19, 25, 28, 16, 9 });
					newCornerCycles.add(new int[] { 0, 6, 16, 10, 3 });
					newCornerCycles.add(new int[] { 4, 5, 15, 17, 11 });
				} else if(f.equals("DR")) {
					newCenterCycles.add(new int[] { 0, 2, 11, 7, 4 });
					newCenterCycles.add(new int[] { 5, 1, 10, 6, 8 });
					newEdgeCycles.add(new int[] { 3, 1, 13, 22, 16 });
					newEdgeCycles.add(new int[] { 0, 12, 27, 23, 9 });
					newEdgeCycles.add(new int[] { 4, 6, 21, 28, 17 });
					newEdgeCycles.add(new int[] { 5, 11, 26, 29, 18 });
					newCornerCycles.add(new int[] { 1, 8, 17, 12, 4 });
					newCornerCycles.add(new int[] { 0, 7, 16, 18, 13 });
				} else if(f.equals("DL")) { 
					newCenterCycles.add(new int[] { 0, 3, 7, 8, 5 });
					newCenterCycles.add(new int[] { 1, 2, 11, 6, 9 });
					newEdgeCycles.add(new int[] { 4, 2, 15, 23, 18 });
					newEdgeCycles.add(new int[] { 0, 7, 22, 29, 19 });
					newEdgeCycles.add(new int[] { 1, 14, 28, 24, 5 });
					newEdgeCycles.add(new int[] { 10, 6, 13, 27, 25 });
					newCornerCycles.add(new int[] { 0, 2, 10, 18, 14 });
					newCornerCycles.add(new int[] { 1, 9, 17, 19, 5 });
				} else if(f.equals("L")) {
					newCenterCycles.add(new int[] { 1, 0, 4, 8, 9 });
					newCenterCycles.add(new int[] { 2, 3, 7, 6, 10 });
					newEdgeCycles.add(new int[] { 0, 3, 17, 24, 10 });
					newEdgeCycles.add(new int[] { 6, 2, 16, 29, 20 });
					newEdgeCycles.add(new int[] { 11, 1, 8, 23, 25 });
					newEdgeCycles.add(new int[] { 7, 15, 28, 26, 12 });
					newCornerCycles.add(new int[] { 6, 1, 3, 12, 19 });
					newCornerCycles.add(new int[] { 7, 2, 11, 18, 15 });
				} else {
					throw new RuntimeException();
				}
				//if we're actually doing the opposing turn, we need to invert this stuff
				if(axis >= 6) {
					for(int[] cycle : newEdgeCycles)
						Utils.reverse(cycle);
					for(int[] cycle : newCornerCycles)
						Utils.reverse(cycle);
					for(int[] cycle : newCenterCycles)
						Utils.reverse(cycle);
				}
			}

			//these are the pieces in the single layer
			newCenterCycles.add(new int[] { axis });
			String f = FACES[axis];
			if(f.equals("F")) {
				newEdgeCycles.add(new int[] { 0, 1, 2, 3, 4 });
				newCornerCycles.add(new int[] { 0, 1, 2, 3, 4 });
			} else if(f.equals("U")) {
				newEdgeCycles.add(new int[] { 0, 5, 10, 11, 6 });
				newCornerCycles.add(new int[] { 0, 5, 6, 7, 1 });
			} else if(f.equals("R")) {
				newEdgeCycles.add(new int[] { 1, 6, 12, 13, 7 });
				newCornerCycles.add(new int[] { 2, 1, 7, 8, 9 });
			} else if(f.equals("DR")) {
				newEdgeCycles.add(new int[] { 2, 7, 14, 15, 8 });
				newCornerCycles.add(new int[] { 2, 9, 10, 11, 3 });
			} else if(f.equals("DL")) {
				newEdgeCycles.add(new int[] { 9, 3, 8, 16, 17 });
				newCornerCycles.add(new int[] { 4, 3, 11, 12, 13 });
			} else if(f.equals("L")) {
				newEdgeCycles.add(new int[] { 5, 4, 9, 18, 19 });
				newCornerCycles.add(new int[] { 5, 0, 4, 13, 14 });
			} else if(f.equals("B")) {
				newEdgeCycles.add(new int[] { 28, 27, 26, 25, 29 });
				newCornerCycles.add(new int[] { 18, 17, 16, 15, 19 });
			} else if(f.equals("D")) {
				newEdgeCycles.add(new int[] { 15, 22, 28, 23, 16 });
				newCornerCycles.add(new int[] { 11, 10, 17, 18, 12 });
			} else if(f.equals("BLD")) {
				newEdgeCycles.add(new int[] { 23, 29, 24, 18, 17 });
				newCornerCycles.add(new int[] { 12, 18, 19, 14, 13 });
			} else if(f.equals("BL")) {
				newEdgeCycles.add(new int[] { 24, 25, 20, 10, 19 });
				newCornerCycles.add(new int[] { 19, 15, 6, 5, 14 });
			} else if(f.equals("BR")) {
				newEdgeCycles.add(new int[] { 21, 12, 11, 20, 26 });
				newCornerCycles.add(new int[] { 16, 8, 7, 6, 15 });
			} else if(f.equals("BRD")) {
				newEdgeCycles.add(new int[] { 22, 14, 13, 21, 27 });
				newCornerCycles.add(new int[] { 10, 9, 8, 16, 17 });
			} else {
				throw new RuntimeException();
			}
			
			if(reverse) {
				for(int[] cycle : newEdgeCycles)
					Utils.reverse(cycle);
				for(int[] cycle : newCornerCycles)
					Utils.reverse(cycle);
				for(int[] cycle : newCenterCycles)
					Utils.reverse(cycle);
			}
			edgeCycles.addAll(newEdgeCycles);
			cornerCycles.addAll(newCornerCycles);
			centerCycles.addAll(newCenterCycles);
		}

		private RotationMatrix getRotationMatrix(int axis, double amtCCW) {
			double x, y, z;
			String f = FACES[axis % 6];
			if(f.equals("F")) {
				x = 0;
				y = tan(adjAngleRad - toRadians(90));
				z = -1;
			} else if(f.equals("U")) {
				x = z = 0;
				y = 1;
			} else if(f.equals("R")) {
				x = -cos(toRadians(18));
				y = tan(adjAngleRad - toRadians(90));
				z = -sin(toRadians(18));
			} else if(f.equals("DR")) {
				x = -cos(toRadians(54));
				y = -tan(adjAngleRad - toRadians(90));
				z = -sin(toRadians(54));
			} else if(f.equals("DL")) {
				x = cos(toRadians(54));
				y = -tan(adjAngleRad - toRadians(90));
				z = -sin(toRadians(54));
			} else if(f.equals("L")) {
				x = cos(toRadians(18));
				y = tan(adjAngleRad - toRadians(90));
				z = -sin(toRadians(18));
			} else {
				throw new RuntimeException();
			}
			if(axis >= 6)
				amtCCW = -amtCCW;
			return new RotationMatrix(x, y, z, amtCCW);
		}
		
		@Override
		public boolean animateMove() {
			rotatePieces(activeEdges, edgeStickers, rotate);
			rotatePieces(activeCorners, cornerStickers, rotate);
			rotatePieces(activeCenters, centerStickers, rotate);
			return --frames == 0;
		}
		
		private void rotatePieces(ArrayList<Integer> indices, ArrayList<PolygonCollection<PuzzleSticker>> pieces, RotationMatrix m) {
			for(Integer i : indices)
				pieces.get(i).rotate(m);
		}

		@Override
		public boolean isAnimationMergeble(PuzzleTurn other) {
			MegaminxTurn o = (MegaminxTurn) other;
			return isDisjoint(edgeCycles, o.edgeCycles) && isDisjoint(cornerCycles, o.cornerCycles) && isDisjoint(centerCycles, o.centerCycles);
		}
		
		private boolean isDisjoint(ArrayList<int[]> a1, ArrayList<int[]> a2) {
			HashSet<Integer> seen = new HashSet<Integer>();
			for(int[] c : a1)
				for(int i : c)
					seen.add(i);
			for(int[] c : a2)
				for(int i : c)
					if(seen.contains(i))
						return false;
			
			return true;
		}

		@Override
		public boolean isInspectionLegal() {
			return cubeRotation;
		}

		@Override
		public boolean isNullTurn() {
			return dir == 0;
		}

		@Override
		public PuzzleTurn mergeTurn(PuzzleTurn other) {
			MegaminxTurn o = (MegaminxTurn) other;
			if(axis == o.axis && wide == o.wide && cubeRotation == o.cubeRotation) {
				int newDir = Utils.modulo(dir + o.dir, 5);
				if(newDir >= 3)
					newDir -= 5;
				return new MegaminxTurn(axis, newDir, cubeRotation, wide);
			}
			return null;
		}

		@Override
		public String toString() {
			String turn = FACES[axis];
			if(cubeRotation)
				turn = "[" + turn + "]";
			if(wide)
				turn += "w";
			if(abs(dir) != 1)
				turn += abs(dir);
			if(dir < 0)
				turn += "'";
			return turn;
		}

		@Override
		public void updateInternalRepresentation(boolean polygons) {
			// TODO this method shouldn't need an argument...
			// just fix sq1!
			if(!polygons) {
				cycle(edgePermutation, edgeCycles, dir);
				cycle(cornerPermutation, cornerCycles, dir);
				cycle(centerPermutation, centerCycles, dir);
				//TODO - update eo & cp!
			}
		}
		
		private void cycle(int[] arr, ArrayList<int[]> cycles, int dir) {
			int[] copy = arr.clone();
			for(int c = 0; c < cycles.size(); c++)
				for(int i = 0; i < cycles.get(c).length; i++)
					arr[cycles.get(c)[Utils.modulo(i + dir, cycles.get(c).length)]] = copy[cycles.get(c)[i]];
		}
	}
}
