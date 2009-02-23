package edu.berkeley.gcweb.gui.gamescubeman.Pyraminx;

import java.awt.Color;
import java.util.ArrayList;
import java.util.HashMap;

import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.Faces;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleSticker;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleTurn;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.TurnAnimation;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.TwistyPuzzle;
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
		// TODO Auto-generated method stub
		return "";
	}

	public boolean isSolved() {
		// TODO Auto-generated method stub
		return false;
	}

	public void resetRotation() {
		setRotation(new RotationMatrix());
//		setRotation(new RotationMatrix(0, faceDegree).multiply(new RotationMatrix(1, 60)));
	}

	protected void scramble2() {
		// TODO Auto-generated method stub

	}
	
	//the tips will be ordered U, L, R, B
	private ArrayList<PolygonCollection<PuzzleSticker>> tips = new ArrayList<PolygonCollection<PuzzleSticker>>();
	private double sin60 = Math.sin(Math.toRadians(60));
	private double sin30 = Math.sin(Math.toRadians(30));
	private double cos60 = Math.cos(Math.toRadians(60));
	private double cos30 = Math.cos(Math.toRadians(30));
	private double faceDegree = Math.toDegrees(1/(4*cos30*cos30))+.3;
	protected void createPolys2(boolean copyOld) {
		double stickerLen = .8;
		double halfSticker = stickerLen / 2.0;
		double stickerHeight = sin60*stickerLen;
		double radius = 2*stickerHeight;
		//huh .... adding .5 here just seems to work, doesn't make any sense
		double layerHeight = Math.cos(Math.toRadians(faceDegree)) * stickerHeight;
		
		PuzzleSticker ts = new PuzzleSticker();
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
		ts.setBorderColor(Color.GREEN);
		addPoly(ts);
//		RotationMatrix third = new RotationMatrix(2, 360/3);
//		facePolys.translate(0, stickerHeight, 0);
//		for(int i = 0; i < 2; i++) {
//			(ts = ts.clone()).rotate(third);
//			(cs = cs.clone()).rotate(third);
//			(es = es.clone()).rotate(third);
//			facePolys.add(ts);
//			facePolys.add(cs);
//			facePolys.add(es);
//		}
//		facePolys.translate(0, -2*stickerHeight, 0);
		//the elements of facePolys should be as follows
		//		       / \
		//		      / 0 \
		//		     /_____\
		//		    / \ 1 / \
		//		   /_5_\ /_2_\
		//		  /\ 4 / \ 7 /\
		//		 /3_\ /_8_\ /_6\
//		addPolys(facePolys);
//		PolygonCollection<PuzzleSticker> bottom = facePolys.clone();
//		bottom.rotate(new RotationMatrix(0, 90));
//		bottom.translate(0, -3*layerHeight, 2*stickerHeight);
//		for(PuzzleSticker ps : bottom)
//			ps.setFace("D");
//		addPolys(bottom);
//		facePolys.rotate(new RotationMatrix(0, faceDegree));
//		facePolys.translate(0, 2*layerHeight, 0);
//		bottom.translate(0, 2*layerHeight, 0);
//		for(String face : new String[] {"F", "R", "L"}) {
//			for(PuzzleSticker ps : facePolys)
//				ps.setFace(face);
//			addPolys(facePolys.clone());
//			facePolys.rotate(new RotationMatrix(1, 360/3), false);
//		}
	}
	
	protected boolean doTurn2(String turn) {
		appendTurn(new PyraminxTurn());
		return true;
	}
	
	private class PyraminxTurn extends PuzzleTurn {
		public PyraminxTurn() {
			
		}
		
		public boolean animateMove() {
			// TODO Auto-generated method stub
			return false;
		}

		public boolean isAnimationMergeble(PuzzleTurn other) {
			// TODO Auto-generated method stub
			return false;
		}

		public boolean isInspectionLegal() {
			// TODO Auto-generated method stub
			return false;
		}

		public boolean isNullTurn() {
			// TODO Auto-generated method stub
			return false;
		}

		public PuzzleTurn mergeTurn(PuzzleTurn other) {
			// TODO Auto-generated method stub
			return null;
		}

		public String toString() {
			// TODO Auto-generated method stub
			return "HIYA";
		}

		public void updateInternalRepresentation(boolean polygons) {
			// TODO Auto-generated method stub
			
		}
	}
}
