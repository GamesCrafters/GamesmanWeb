package edu.berkeley.gcweb.gui.gamescubeman.XYZCube;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.swing.Timer;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.RotationMatrix;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Shape3D;

public class XYZCube extends Shape3D implements ActionListener {
	//We're representing a cube of size 2 units by 2 units by 2 units
	//centered at (0, 0, 4). The cube can occupy anything in the sphere of
	//diameter sqrt(1+1+1) ~= 1.73 < 3.
	private int[] dimensions;
	private double stickerGap = 0.1;
	public XYZCube(int dimX, int dimY, int dimZ) {
		super(0, 0, 4);
		setDimensions(dimX, dimY, dimZ);
	}
	public void setVoidCube(boolean voidCube) {
		//TODO - void cube!
	}
	public int[] getDimensions() {
		return dimensions;
	}
	public double getStickerGap() {
		return stickerGap;
	}
	//spacing can range from 0->.5
	public void setStickerGap(double spacing) {
		this.stickerGap = spacing;
		recompute();
	}

	public void setDimensions(int dimX, int dimY, int dimZ) {
		setDimensions(new int[] { dimX, dimY, dimZ });
	}
	public void setDimensions(int[] dims) {
		dimensions = dims;
		recompute();
	}
	
	private Timer turner = new Timer(10, this);
	private ArrayList<FaceTurn> turnQueue = new ArrayList<FaceTurn>();
	public void actionPerformed(ActionEvent e) {
		if(turnQueue.get(0).doMove()) { //finished animation
			fireStateChanged();
			turnQueue.remove(0);
			if(turnQueue.isEmpty())
				turner.stop();
		}
	}
	private class FaceTurn {
		private final int TURNING_RATE = 9*2; //this should be a factor of 90
		private int degreesLeft;
		private RotationMatrix rotation;
		private int[][][] stickers;
		//cwTurns = the number of turns cw (in 90 degree increments) we want to turn a face
		private int cwTurns; //1 -> cw; -1 -> ccw; 2 -> half turn
		private int legalTurns; //this depends on if the face is square or rectangular
		public FaceTurn(Face face, int layer, int amtCW) {
			cwTurns = amtCW;
			if(dimensions[face.widthAxis] != dimensions[face.heightAxis]) {
				if((cwTurns & 1) == 1)
					cwTurns = (cwTurns > 0) ? cwTurns + 1 : cwTurns - 1;
				legalTurns = cwTurns / 2;
			} else
				legalTurns = cwTurns;
			degreesLeft = 90*Math.abs(cwTurns);
			//multiply by -1 because the rotation matrix expects degrees ccw
			rotation = new RotationMatrix(face.axis, -1*(face.cw_cw ? 1 : -1)*Math.signum(amtCW)*TURNING_RATE);
			stickers = getLayerIndices(face, layer);
		}
		//this is useful for creating cube rotations
		private FaceTurn other;
		public FaceTurn mergeTurn(FaceTurn other) {
			this.other = other;
			return this;
		}
		//this will turn the stickers, and return true when the move animation has finished
		private boolean done = false;
		public boolean doMove() {
			if(!done) {
				degreesLeft -= TURNING_RATE;
				for(int i=0; i<stickers.length; i++)
					for(int[] index : stickers[i])
						cubeStickers[index[0]][index[1]][index[2]].rotate(rotation);

				done = degreesLeft <= 0;
				if(done) //updating internal representation
					for(int[][] cycleIndices : stickers)
						cycle(cubeStickers, cycleIndices, legalTurns);
			}
			if(other != null)
				done = other.doMove() && done;
			return done;
		}
	}

	//needed because java's modulo is weird with negative values
	//assumes m > 0
	private static int modulo(int x, int m) {
		int y = x % m;
		if(y >= 0) return y;
		return y + m;
	}
	//offset indicates that new_polys[(i + offset) % polys.length] = old_polys[i] for all 0 <= i < polys.length
	private static <T> void cycle(T[][][] polys, int[][] indices, int offset) {
		T[][][] old_polys = Arrays.copyOf(polys, polys.length);
		for(int i = 0; i < old_polys.length; i++) { //making a deep copy of the original array
			old_polys[i] = Arrays.copyOf(polys[i], polys[i].length);
			for(int j = 0; j < old_polys[i].length; j++)
				old_polys[i][j] = Arrays.copyOf(polys[i][j], polys[i][j].length);
		}
		
		for(int c = 0; c < indices.length; c++) {
			int[] from = indices[c], to = indices[modulo(c+offset, indices.length)];
			polys[to[0]][to[1]][to[2]] = old_polys[from[0]][from[1]][from[2]];
		}
	}
	private int left, right;
	//TODO - improve hand indicators
	private void refreshHandPositions() {
//		for(Polygon3D[][] face : cubeStickers)
//			for(Polygon3D[] polys: face)
//				for(Polygon3D poly: polys)
//					poly.setOpacity(.8f);
//		int[][][] stickerCycles = getLayerIndices(Face.LEFT, left);
//		for(int[][] stickerCycle : stickerCycles) {
//			for(int[] stickers : stickerCycle) {
//				cubeStickers[stickers[0]][stickers[1]][stickers[2]].setOpacity(1f);
//			}
//		}
//		stickerCycles = getLayerIndices(Face.RIGHT, right);
//		for(int[][] stickerCycle : stickerCycles) {
//			for(int[] stickers : stickerCycle) {
//				cubeStickers[stickers[0]][stickers[1]][stickers[2]].setOpacity(1f);
//			}
//		}
	}
	public void updateHandPositions(int left, int right) {
		this.left = left;
		this.right = right;
		refreshHandPositions();
	}
	
	//This returns an array of arrays of indices, where each element is an index of a sticker (represented as a 2 element array)
	//So for the R face, an [2][][2] array faces would be returned where where faces[0] is a 4 element array of all the R face stickers,
	//and faces[1] is a 6 element array of half the F, U, B, D stickers
	//The return value is structured like this to facilitate cycling stickers as necessary
	//TODO - would memoization be a good idea here?
	private int[][][] getLayerIndices(Face face, int layer) {
		int width = dimensions[face.widthAxis];
		int height = dimensions[face.heightAxis];
		int depth = dimensions[face.fixedAxis];
		if(layer >= depth)
			layer = depth - 1;
		else if(layer < 1)
			layer = 1;
		
		//each cycle is of 4 stickers if width == height, 2 stickers otherwise
		int cycleLength = (width == height) ? 4 : 2;
		int faceCycles = (int)Math.ceil((double)width*height/cycleLength);
		int layerCycles = 2*layer*(width + height)/cycleLength;
		int[][][] stickers = new int[faceCycles + layerCycles][cycleLength][3];

		int nthCycle = 0;
		boolean square = width == height;
		if(!square) { //half turn only
			for(int h = 0; h < height; h++) {
				int maxW = (int) Math.ceil(width / 2.);
				if((width & 1) == 1 && h >= Math.ceil(height / 2.))
					maxW--;
				for(int w = 0; w < maxW; w++) {
					stickers[nthCycle][0] = new int[] { face.index(), h, w };
					stickers[nthCycle][1] = new int[] { face.index(), height - 1 - h, width - 1 - w };
					nthCycle++;
				}
			}
		} else { //quarter turn legal
			for(int h = 0; h < Math.ceil(height / 2.); h++) {
				for(int w = 0; w < width / 2; w++) {
					stickers[nthCycle][0] = new int[] { face.index(), h, w };
					stickers[nthCycle][1] = new int[] { face.index(), w, height - 1 - h };
					stickers[nthCycle][2] = new int[] { face.index(), width - 1 - h, height - 1 - w };
					stickers[nthCycle][3] = new int[] { face.index(), width - 1 - w, h };
					if(!face.isFirstAxisClockwise)
						Collections.reverse(Arrays.asList(stickers[nthCycle]));
					nthCycle++;
				}
			}
			//we include the center of odd cubes here, so it gets animated
			if((width & 1) == 1)
				stickers[nthCycle++] = new int[][] { {face.index(), width / 2, width / 2} };
		}
		
		if(face == Face.RIGHT) {
			if(square) {
				for(int w = 0; w < width; w++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.FRONT.index(), w, l},
								{Face.UP.index(), w, l},
								{Face.BACK.index(), width - 1 - w, l},
								{Face.DOWN.index(), width - 1 - w, l} };
			} else {
				for(int h = 0; h < height; h++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.FRONT.index(), h, l},
								{Face.BACK.index(), height - 1 - h, l} };
				for(int w = 0; w < width; w++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.UP.index(), w, l},
								{Face.DOWN.index(), width - 1 - w, l} };
			}
		} else if(face == Face.LEFT) {
			if(square) {
				for(int l = 0; l < layer; l++)
					for(int w = 0; w < width; w++)
						stickers[nthCycle++] = new int[][] { {Face.UP.index(), w, depth - 1 - l},
							{Face.FRONT.index(), w, depth - 1 - l},
							{Face.DOWN.index(), height - 1 - w, depth - 1 - l},
							{Face.BACK.index(), height - 1 - w, depth - 1 - l} };
			} else {
				for(int h = 0; h < height; h++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.FRONT.index(), h, depth - 1 - l},
								{Face.BACK.index(), height - 1 - h, depth - 1 - l} };
				for(int w = 0; w < width; w++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.UP.index(), w, depth - 1 - l},
								{Face.DOWN.index(), width - 1 - w, depth - 1 - l} };
			}
		} else if(face == Face.FRONT) {
			if(square) {
				for(int l = 0; l < layer; l++)
					for(int w = 0; w < width; w++)
						stickers[nthCycle++] = new int[][] { {Face.UP.index(), l, w},
							{Face.RIGHT.index(), w, l},
							{Face.DOWN.index(), l, width - 1 - w},
							{Face.LEFT.index(), width - 1 - w, l} };
			} else {
				for(int h = 0; h < height; h++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.LEFT.index(), h, l},
								{Face.RIGHT.index(), height - 1 - h, l} };
				for(int w = 0; w < width; w++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.UP.index(), l, w},
								{Face.DOWN.index(), l, width - 1 - w} };
			}
		} else if(face == Face.BACK) {
			if(square) {
				for(int l = 0; l < layer; l++)
					for(int w = 0; w < width; w++)
						stickers[nthCycle++] = new int[][] { {Face.UP.index(), depth - 1 - l, w},
							{Face.LEFT.index(), width - 1 - w, depth - 1 - l},
							{Face.DOWN.index(), depth - 1 - l, width - 1 - w},
							{Face.RIGHT.index(), w, depth - 1 - l} };
			} else {
				for(int h = 0; h < height; h++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.LEFT.index(), h, depth - 1 - l},
								{Face.RIGHT.index(), height - 1 - h, depth - 1 - l} };
				for(int w = 0; w < width; w++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.UP.index(), depth - 1 - l, w},
								{Face.DOWN.index(), depth - 1 - l, width - 1 - w} };
			}
		} else if(face == Face.UP) {
			if(square) {
				for(int l = 0; l < layer; l++)
					for(int w = 0; w < width; w++)
						stickers[nthCycle++] = new int[][] { {Face.FRONT.index(), depth - 1 - l, w},
							{Face.LEFT.index(), depth - 1 - l, w},
							{Face.BACK.index(), depth - 1 - l, width - 1 - w},
							{Face.RIGHT.index(), depth - 1 - l, width - 1 - w} };
			} else {
				for(int h = 0; h < height; h++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.LEFT.index(), depth - 1 - l, h},
								{Face.RIGHT.index(), depth - 1 - l, height - 1 - h} };
				for(int w = 0; w < width; w++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.FRONT.index(), depth - 1 - l, w},
								{Face.BACK.index(), depth - 1 - l, width - 1 - w} };
			}
		} else if(face == Face.DOWN) {
			if(square) {
				for(int l = 0; l < layer; l++)
					for(int w = 0; w < width; w++)
						stickers[nthCycle++] = new int[][] { {Face.FRONT.index(), l, w},
							{Face.RIGHT.index(), l, width - 1 - w},
							{Face.BACK.index(), l, width - 1 - w},
							{Face.LEFT.index(), l, w} };
			} else {
				for(int h = 0; h < height; h++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.LEFT.index(), l, h},
								{Face.RIGHT.index(), l, height - 1 - h} };
				for(int w = 0; w < width; w++)
					for(int l = 0; l < layer; l++)
						stickers[nthCycle++] = new int[][] { {Face.FRONT.index(), l, w},
								{Face.BACK.index(), l, width - 1 - w} };
			}
		}
		
		return stickers;
	}
	public void doTurn(Face face, int layer, int cw) {
		turnQueue.add(new FaceTurn(face, layer, cw));
		turner.start();
	}
	public void doCubeRotation(Face face, int degrees) {
		turnQueue.add(new FaceTurn(face, dimensions[face.axis] - 1, degrees).mergeTurn(new FaceTurn(face.getOppositeFace(), 1, -degrees)));
		turner.start();
	}
	public static class Face {
		private static ArrayList<Face> faces = new ArrayList<Face>();
		public final static Face UP = new Face(1, true, 0, 2, Color.WHITE);
		public final static Face DOWN = new Face(UP, Color.YELLOW);
		public final static Face LEFT = new Face(0, true, 2, 1, Color.GREEN);
		public final static Face RIGHT = new Face(LEFT, Color.BLUE);
		public final static Face FRONT = new Face(2, false, 0, 1, Color.RED);
		public final static Face BACK = new Face(FRONT, Color.ORANGE);
		private int axis;
		//cw_cw is whether turning the face clockwise is the same as rotating clockwise about the axis
		private boolean cw_cw;
		//isClockwise indicates whether the first dimension is in the clockwise direction
		private boolean isFirstAxisClockwise = true;
		private int widthAxis, heightAxis, fixedAxis;
		private int index;
		private Color color;
		private Face(int axis, boolean cw_cw, int widthAxis, int heightAxis, Color color) {
			this.axis = axis;
			this.cw_cw = cw_cw;
			this.widthAxis = widthAxis;
			this.heightAxis = heightAxis;
			this.color = color;
			fixedAxis = 3 - widthAxis - heightAxis; //this is the missing number from 0, 1, 2
			index = faces.size();
			faces.add(this);
		}
		private Face opposite;
		private Face(Face opposite, Color color) {
			this(opposite.axis, !opposite.cw_cw, opposite.widthAxis, opposite.heightAxis, color);
			this.opposite = opposite;
			isFirstAxisClockwise = false;
			opposite.opposite = this;
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
		public Face getOppositeFace() {
			return opposite;
		}
	}
	
	private Polygon3D[][][] cubeStickers;
	private void recompute() {
		clearPolys();
		cubeStickers = new Polygon3D[6][][];
		double[] point = new double[3];
		Polygon3D sticker;
		double scale = 2. / (Math.max(Math.max(dimensions[0], dimensions[1]), dimensions[2]));

		for(Face f1 : Face.faces) {
			if(f1.cw_cw) continue;
			Face f2 = f1.opposite;
			int height = dimensions[f1.heightAxis];
			int width = dimensions[f1.widthAxis];
			int depth = dimensions[f1.fixedAxis];
			double halfHeight = height / 2.;
			double halfWidth = width / 2.;
			double halfDepth = depth / 2.;
			cubeStickers[f1.index()] = new Polygon3D[height][width];
			cubeStickers[f2.index()] = new Polygon3D[height][width];
			for(int h = 0; h < height; h++) {
				for(int w = 0; w < width; w++) {
					sticker = new Polygon3D();
					List<Double> spaces1 = Arrays.asList(stickerGap, 1 - stickerGap);
					List<Double> spaces2 = new ArrayList<Double>(spaces1);
					for(double hh : spaces1) {
						for(double ww : spaces2) {
							point[f1.heightAxis] = h + hh;
							point[f1.widthAxis] = w + ww;
							point[f1.fixedAxis] = 0;
							sticker.addPoint(point);
						}
						Collections.reverse(spaces2); //want to form a box, not an x
					}

					double[] translate = new double[3];
					translate[f1.widthAxis] = -halfWidth;
					translate[f1.heightAxis] = -halfHeight;
					translate[f1.fixedAxis] = -halfDepth;
					sticker.translate(translate).scale(scale, scale, scale);
					sticker.setColors(f1.color, Color.BLACK);
					cubeStickers[f1.index()][h][w] = sticker;
					addPoly(sticker);

					translate = new double[3];
					translate[f1.fixedAxis] = scale*depth;
					sticker = sticker.clone().translate(translate);
					sticker.setColors(f2.color, Color.BLACK);
					cubeStickers[f2.index()][h][w] = sticker;
					addPoly(sticker);
				}
			}
		}
		fireStateChanged();
	}
	private ArrayList<CubeStateChangeListener> stateListeners = new ArrayList<CubeStateChangeListener>();
	public void addStateChangeListener(CubeStateChangeListener l) {
		stateListeners.add(l);
	}
	//TODO - format string as python solver expects it
//    #Each face's stickers are defined in the following order:
//    # +---+---+
//    # |_3_|_2_|
//    # | 1 | 0 |
//    # +---+---+
//    values = { "F" : 0, "U" : 0, "R" : 0, "L" : 1, "B" : 2, "D" : 4}
//    """TODO - deal with corner 7 not being correct"""
//    #This method exists because python does not provide a way to have multiple constructors
//    def initializeCubeWithStickers(self, F="FFFF", U="UUUU", R="RRRR", L="LLLL", B="BBBB", D="DDDD"):
	public String getState() {
		for(Polygon3D[][] face : cubeStickers) {
			Color c = face[0][0].getFillColor();
			for(int i = 0; i < face.length; i++)
				for(int j = 0; j < face[i].length; j++)
					if(!face[i][j].getFillColor().equals(c))
						return "Not solved :-( " + System.currentTimeMillis();
		}
		return "Solved!";
	}
	private void fireStateChanged() {
		for(CubeStateChangeListener l : stateListeners)
			l.stateChanged(this);
	}
}
