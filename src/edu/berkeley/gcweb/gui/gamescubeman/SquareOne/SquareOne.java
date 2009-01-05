package edu.berkeley.gcweb.gui.gamescubeman.SquareOne;

import java.awt.Color;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleSticker;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleTurn;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.TwistyPuzzle;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.Utils;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.PolygonCollection;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.RotationMatrix;

public class SquareOne extends TwistyPuzzle {
	public SquareOne() {
		super(0, 0, 4);
	}
	private static final String NORMAL = "Square 1", UNBANDAGED = "Unbandaged", SUPER = "Super";
	protected String[] getPuzzleVariations() {
		//http://twistypuzzles.com/forum/viewtopic.php?t=7493
		return new String[] { NORMAL, UNBANDAGED, SUPER };
	}
	public void setPuzzleVariation(String variation) {
		super.setPuzzleVariation(variation);
		//TODO - unbandaged square 1
		//TODO - super square 1
	}
	protected double getDefaultStickerGap() {
		return 0.05;
	}
	public void resetRotation() {
		setRotation(new RotationMatrix(0, -45).multiply(new RotationMatrix(1, -15)));
	}
	
	//these are the pieces on top arranged counterclockwise, and null if the second part of a corner
	//the bottom is the same as the top, but starting in the back, such that a slash turn will switch the 0th indices
	private PolygonCollection<PuzzleSticker>[] ogTopLayerPolys, ogBottomLayerPolys;
	private PolygonCollection<PuzzleSticker>[] topLayerPolys, bottomLayerPolys;
	private PolygonCollection<PuzzleSticker> leftHalfPolys, rightHalfPolys;
	private boolean[] topLayer, bottomLayer;
	//this keeps track of how many times the left and right halves have been twisted
	private boolean leftHalfEven, rightHalfEven;
	protected void createPolys(boolean copyOld) {
		super.createPolys(copyOld);
		
		double gap = super.getStickerGap();
		double sin15 = Math.sin(Math.toRadians(15));
		double sin30 = Math.sin(Math.toRadians(30));
		double tan37_5 = Math.tan(Math.toRadians(37.5));
		double layerHeight = 1/3. * 2;
		
		PolygonCollection<PuzzleSticker> topEdge = new PolygonCollection<PuzzleSticker>();
		PuzzleSticker sticker = new PuzzleSticker();
		sticker.addPoint(0, 1, gap/sin15);
		sticker.addPoint(-sin15+gap/tan37_5, 1, 1-gap);
		sticker.addPoint(sin15-gap/tan37_5, 1, 1-gap);
		topEdge.add(sticker);
		
		sticker = new PuzzleSticker();
		sticker.addPoint(-sin15+gap/tan37_5, 1-gap, 1);
		sticker.addPoint(sin15-gap/tan37_5, 1-gap, 1);
		sticker.addPoint(sin15-gap/tan37_5, 1-layerHeight+gap, 1);
		sticker.addPoint(-sin15+gap/tan37_5, 1-layerHeight+gap, 1);
		topEdge.add(sticker);
		
		PolygonCollection<PuzzleSticker> topCorner = new PolygonCollection<PuzzleSticker>();
		sticker = new PuzzleSticker();
		sticker.addPoint(gap/sin30/Math.sqrt(2), 1, gap/sin30/Math.sqrt(2));
		sticker.addPoint(sin15+gap*tan37_5, 1, 1-gap);
		sticker.addPoint(1-gap, 1, 1-gap);
		sticker.addPoint(1-gap, 1, sin15+gap*tan37_5);
		topCorner.add(sticker);
		
		//the sticker immediately clockwise of the U/D sticker
		sticker = new PuzzleSticker();
		sticker.addPoint(1, 1-gap, 1-gap);
		sticker.addPoint(1, 1-gap, sin15+gap*tan37_5);
		sticker.addPoint(1, 1-layerHeight+gap, sin15+gap*tan37_5);
		sticker.addPoint(1, 1-layerHeight+gap, 1-gap);
		topCorner.add(sticker);
		
		sticker = new PuzzleSticker();
		sticker.addPoint(sin15+gap*tan37_5, 1-gap, 1);
		sticker.addPoint(1-gap, 1-gap, 1);
		sticker.addPoint(1-gap, 1-layerHeight+gap, 1);
		sticker.addPoint(sin15+gap*tan37_5, 1-layerHeight+gap, 1);
		topCorner.add(sticker);

		PolygonCollection<PuzzleSticker> downEdge = topEdge.clone().mirror(1);
		PolygonCollection<PuzzleSticker> downCorner = topCorner.clone().mirror(1);
		downCorner.swap(1, 2); //we want to maintain our clockwise ordering (messed up by the mirroring)
		
		RotationMatrix cw90 = new RotationMatrix(1, -90);
		RotationMatrix ccw90 = new RotationMatrix(1, 90);
		topCorner.rotate(cw90, false).rotate(cw90, false);
		topEdge.rotate(cw90, false).rotate(cw90, false);
		downCorner.rotate(cw90, false);
		downEdge.rotate(cw90, false);
		
		RotationMatrix leftRotate = null, rightRotate = null;
		if(copyOld) {
			leftRotate = leftHalfPolys.getNetRotations();
			rightRotate = rightHalfPolys.getNetRotations();
		}
		
		leftHalfPolys = new PolygonCollection<PuzzleSticker>();
		sticker = new PuzzleSticker();
		sticker.addPoint(1-gap, -layerHeight/2.+gap, -1);
		sticker.addPoint(1-gap, layerHeight/2.-gap, -1);
		sticker.addPoint(sin15+gap*tan37_5, layerHeight/2.-gap, -1);
		sticker.addPoint(sin15+gap*tan37_5, -layerHeight/2.+gap, -1);
		leftHalfPolys.add(sticker);
		sticker = new PuzzleSticker();
		sticker.addPoint(1-gap, layerHeight/2.-gap, 1);
		sticker.addPoint(1-gap, -layerHeight/2.+gap, 1);
		sticker.addPoint(-sin15+gap/tan37_5, -layerHeight/2.+gap, 1);
		sticker.addPoint(-sin15+gap/tan37_5, layerHeight/2.-gap, 1);
		leftHalfPolys.add(sticker);
		sticker = new PuzzleSticker();
		sticker.addPoint(1, layerHeight/2.-gap, 1-gap);
		sticker.addPoint(1, -layerHeight/2.+gap, 1-gap);
		sticker.addPoint(1, -layerHeight/2.+gap, -1+gap);
		sticker.addPoint(1, layerHeight/2.-gap, -1+gap);
		leftHalfPolys.add(sticker);
		addPolys(leftHalfPolys);
		
		rightHalfPolys = leftHalfPolys.clone();
		rightHalfPolys.rotate(new RotationMatrix(0, 180), false);
		rightHalfPolys.mirror(0);
		addPolys(rightHalfPolys);
		
		topCorner.get(0).setFace("U");
		topEdge.get(0).setFace("U");
		downCorner.get(0).setFace("D");
		downEdge.get(0).setFace("D");
		
		leftHalfPolys.get(0).setFace("F");
		leftHalfPolys.get(1).setFace("B");
		leftHalfPolys.get(2).setFace("L");
		rightHalfPolys.get(0).setFace("B");
		rightHalfPolys.get(1).setFace("F");
		rightHalfPolys.get(2).setFace("R");
		
		ArrayList<PolygonCollection<PuzzleSticker>> top = new ArrayList<PolygonCollection<PuzzleSticker>>();
		ArrayList<PolygonCollection<PuzzleSticker>> down = new ArrayList<PolygonCollection<PuzzleSticker>>();
		String[] faces = { "F", "R", "B", "L" };
		for(int i=0; i<4; i++) {
			topEdge.get(1).setFace(faces[i]);
			topCorner.get(2).setFace(faces[i]);
			topCorner.get(1).setFace(faces[(i+1)%faces.length]);
			downEdge.get(1).setFace(faces[(faces.length-i+1)%faces.length]);
			downCorner.get(2).setFace(faces[(faces.length-i+2)%faces.length]);
			downCorner.get(1).setFace(faces[(faces.length-i+1)%faces.length]);
			
			top.add(topEdge);
			top.add(topCorner);
			top.add(null);
			
			down.add(downCorner);
			down.add(null);
			down.add(downEdge);
			
			addPolys(topEdge);
			addPolys(topCorner);
			addPolys(downCorner);
			addPolys(downEdge);
			topEdge = topEdge.clone().rotate(ccw90, false);
			topCorner = topCorner.clone().rotate(ccw90, false);
			downCorner = downCorner.clone().rotate(cw90, false);
			downEdge = downEdge.clone().rotate(cw90, false);
		}
		PolygonCollection<PuzzleSticker>[] oldTopLayer = topLayerPolys, oldBottomLayer = bottomLayerPolys;
		topLayerPolys = (PolygonCollection<PuzzleSticker>[]) top.toArray(new PolygonCollection[0]);
		bottomLayerPolys = (PolygonCollection<PuzzleSticker>[]) down.toArray(new PolygonCollection[0]);
		
		RotationMatrix m = new RotationMatrix(1, 15);
		for(PolygonCollection<PuzzleSticker> coll : topLayerPolys)
			if(coll != null)
				coll.rotate(m, false);
		for(PolygonCollection<PuzzleSticker> coll : bottomLayerPolys)
			if(coll != null)
				coll.rotate(m, false);
		leftHalfPolys.rotate(m, false);
		rightHalfPolys.rotate(m, false);

		PolygonCollection<PuzzleSticker>[] oldOgTopLayerPolys = ogTopLayerPolys, oldOgBottomLayerPolys = ogBottomLayerPolys;
		ogTopLayerPolys = Arrays.copyOf(topLayerPolys, topLayerPolys.length);
		ogBottomLayerPolys = Arrays.copyOf(bottomLayerPolys, bottomLayerPolys.length);
		if(copyOld) {
			//this is some nasty stuff to get the puzzle to not reset when the gap size is changed
			leftHalfPolys.rotate(leftRotate);
			rightHalfPolys.rotate(rightRotate);
			for(int i=0; i<ogTopLayerPolys.length; i++) {
				if(ogTopLayerPolys[i] != null) {
					ogTopLayerPolys[i].rotate(oldOgTopLayerPolys[i].getNetRotations());
					
					PolygonCollection<PuzzleSticker>[] searchLayer = oldTopLayer, destLayer = topLayerPolys;
					int currPosition;
					while((currPosition = Utils.indexOf(oldOgTopLayerPolys[i], searchLayer)) == -1) {
						searchLayer = oldBottomLayer; destLayer = bottomLayerPolys;
					}
					destLayer[currPosition] = ogTopLayerPolys[i];
					if(ogTopLayerPolys[(i+1)%ogTopLayerPolys.length] == null)
						destLayer[(currPosition+1)%destLayer.length] = null;
				}
				if(ogBottomLayerPolys[i] != null) {
					ogBottomLayerPolys[i].rotate(oldOgBottomLayerPolys[i].getNetRotations());
					
					int currPosition = -1;
					PolygonCollection<PuzzleSticker>[] searchLayer = oldTopLayer, destLayer = topLayerPolys;
					while((currPosition = Utils.indexOf(oldOgBottomLayerPolys[i], searchLayer)) == -1) {
						searchLayer = oldBottomLayer; destLayer = bottomLayerPolys;
					}
					destLayer[currPosition] = ogBottomLayerPolys[i];
					if(ogBottomLayerPolys[(i+1)%ogBottomLayerPolys.length] == null)
						destLayer[(currPosition+1)%destLayer.length] = null;
				}
			}
		}
		
		topLayer = new boolean[topLayerPolys.length];
		for(int i=0; i<topLayer.length; i++)
			topLayer[i] = (topLayerPolys[i] != null);
		bottomLayer = new boolean[bottomLayerPolys.length];
		for(int i=0; i<bottomLayer.length; i++)
			bottomLayer[i] = (bottomLayerPolys[i] != null);
		leftHalfEven = rightHalfEven = true;
		fireStateChanged(null);
	}
	
	private class SquareOneTurn extends PuzzleTurn {
		private int top, down;
		//secondLayer will be used for a super square one
		private boolean secondLayer;
		public SquareOneTurn(int topPieces, int bottomPieces, boolean secondLayer) {
			this.top = topPieces;
			this.down = bottomPieces;
			this.secondLayer = secondLayer;
		}
		//this is a slash
		private boolean slash, leftSlash;
		public SquareOneTurn(boolean left) {
			slash = true;
			leftSlash = left;
		}
		private int frames = -1;
		private RotationMatrix topRotationMatrix, downRotationMatrix, slashMatrix;
		public boolean animateMove() {
			if(frames == -1) {
				frames = getFramesPerAnimation();
				if(slash) {
					slashMatrix = new RotationMatrix(0, 180./frames);
				} else {
					topRotationMatrix = new RotationMatrix(1, -top*30./frames);
					downRotationMatrix = new RotationMatrix(1, down*30./frames);
				}
			}
			if(slash) {
				int start = leftSlash ? 6 : 0;
				for(int i = start; i < start+6; i++) {
					if(topLayerPolys[i] != null)
						topLayerPolys[i].rotate(slashMatrix);
					if(bottomLayerPolys[i] != null)
						bottomLayerPolys[i].rotate(slashMatrix);
				}
				if(leftSlash)
					leftHalfPolys.rotate(slashMatrix);
				else
					rightHalfPolys.rotate(slashMatrix);
			} else {
				for(PolygonCollection<PuzzleSticker> piece : topLayerPolys)
					if(piece != null)
						piece.rotate(topRotationMatrix);
				for(PolygonCollection<PuzzleSticker> piece : bottomLayerPolys)
					if(piece != null)
						piece.rotate(downRotationMatrix);
			}
			return --frames == 0;
		}
		public void updateInternalRepresentation(boolean polygons) {
			if(slash) {
				int start = leftSlash ? 6 : 0;
				for(int i = start; i < start+6; i++) {
					if(polygons) {
						PolygonCollection<PuzzleSticker> temp = topLayerPolys[i];
						topLayerPolys[i] = bottomLayerPolys[i];
						bottomLayerPolys[i] = temp;
					} else {
						boolean temp = topLayer[i];
						topLayer[i] = bottomLayer[i];
						bottomLayer[i] = temp;
					}
				}
				if(!polygons) {
					if(leftSlash)
						leftHalfEven = !leftHalfEven;
					else
						rightHalfEven = !rightHalfEven;
				}
			} else {
				if(polygons) {
					PolygonCollection<PuzzleSticker>[] topLayerCopy = Arrays.copyOf(topLayerPolys, topLayerPolys.length);
					PolygonCollection<PuzzleSticker>[] bottomLayerCopy = Arrays.copyOf(bottomLayerPolys, bottomLayerPolys.length);
					for(int i=0; i<topLayerCopy.length; i++) {
						topLayerPolys[i] = topLayerCopy[Utils.modulo(i + top, topLayerCopy.length)];
						bottomLayerPolys[i] = bottomLayerCopy[Utils.modulo(i + down, bottomLayerCopy.length)];
					}
				} else {
					boolean[] topLayerCopy = Arrays.copyOf(topLayer, topLayer.length);
					boolean[] bottomLayerCopy = Arrays.copyOf(bottomLayer, bottomLayer.length);
					for(int i=0; i<topLayerCopy.length; i++) {
						topLayer[i] = topLayerCopy[Utils.modulo(i + top, topLayerCopy.length)];
						bottomLayer[i] = bottomLayerCopy[Utils.modulo(i + down, bottomLayerCopy.length)];
					}
				}
			}
		}
		public boolean isAnimationMergeble(PuzzleTurn o) {
			SquareOneTurn other = (SquareOneTurn) o;
			return this.slash == other.slash && this.leftSlash != other.leftSlash || //we can animate a left & right slash simultaneously
				!this.slash && !other.slash && (this.top == 0 || other.top == 0); //we can animate turning the top/bottom simultaneously (regardless of layer)
			//TODO - this doesn't quite work for super sq1
		}
		public boolean isNullTurn() {
			return slash == false && top == 0 && down == 0;
		}
		public PuzzleTurn mergeTurn(PuzzleTurn o) {
			SquareOneTurn other = (SquareOneTurn) o;
			if(o == null || o.isNullTurn()) return this;
			if(this.isNullTurn()) return o;
			if(this.slash && other.slash) {
				if(this.leftSlash == other.leftSlash)
					return new SquareOneTurn(0, 0, false); //this is no turn
				return null; //or could merge this into an x2?
			} else if(this.slash ^ other.slash)
				return null; //can't merge a slash with a top/bottom turn
			else if(this.secondLayer != other.secondLayer)
				return null; //can't merge second layer turns w/ first layer turns
			//if we made it to here, we're merging top/bottom turns in the same layer
			return new SquareOneTurn(this.top + other.top, this.down + other.down, this.secondLayer);
		}
		public String toString() {
			if(slash)
				return leftSlash ? "\\" : "/";
			String turns = top + ", " + down;
			if(secondLayer)
				turns = "[" + turns + "]";
			else
				turns = "(" + turns + ")";
			return turns;
		}
	}

	private Pattern turnPattern = Pattern.compile("(-?\\d*), *(-?\\d*)");
	public boolean doTurn(String turn) {
		Matcher m;
		SquareOneTurn s1turn = null;
		if(turn.equals("/"))
			s1turn = new SquareOneTurn(false);
		else if(turn.equals("\\"))
			s1turn = new SquareOneTurn(true);
		else if((m=turnPattern.matcher(turn)).find()) {
			int top = Integer.parseInt(m.group(1));
			int bottom = Integer.parseInt(m.group(2));
			s1turn = new SquareOneTurn(top, bottom, turn.charAt(0) == '[');
		} else if(turn.equals("x")) {
			//TODO - do proper cube rotations?
			appendTurn(new SquareOneTurn(true));
			appendTurn(new SquareOneTurn(false));
			return true;
		} else
			return false;
		if(s1turn.slash && !isSlashLegal())
			return false;
		appendTurn(s1turn);
		return true;
	}
	
	private boolean isSlashLegal() {
		return topLayer[0] && topLayer[6] && bottomLayer[0] && bottomLayer[6];
	}

	public String getState() {
		return null;
	}

	public boolean isSolved() {
		return false;
	}

	//TODO - better scramble...
	public void scramble() {
		Random r = new Random();
		for(int i=0; i<25; i++) {
			int t = r.nextInt(3);
			if(t == 0) {
				doTurn("/");
			} else {
				t = r.nextInt(22);
				do {
					if(t <= 10)
						doTurn("(0," + (t+1) + ")");
					else
						doTurn("(" + (t-10) + ",0)");
				} while(!isSlashLegal());
			}
		}
	}
	public HashMap<String, Color> getDefaultColorScheme() {
		HashMap<String, Color> colors = new HashMap<String, Color>();
		colors.put("F", Color.RED);
		colors.put("U", Color.YELLOW);
		colors.put("R", Color.GREEN);
		colors.put("B", Color.ORANGE);
		colors.put("L", Color.BLUE);
		colors.put("D", Color.WHITE);
		return colors;
	}
}
