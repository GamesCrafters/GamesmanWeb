package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Shape3D;
import java.awt.Color;
import java.util.ArrayList;

public class MyShape extends Shape3D {
	public BigRedAxis big_red_axis;
	public Faces cube_faces;
	public Interior interior;
	public int[] current_position;
	private Polygon3D[] interior_array;
	private Polygon3D[] intSol_array;
	public InteriorSolutionPath intSol;
	private Polygon3D[] awayW;
	private Polygon3D[] towardW;
	private Polygon3D[] awayR;
	private Polygon3D[] towardR;
	private Polygon3D[] awayB;
	private Polygon3D[] towardB;
	private Polygon3D[] secondFaces;
	private Polygon3D[] secondFacesFaces;
	
	public ArrayList<Polygon3D> getPolygons() {
		ArrayList<Polygon3D> rendered = new ArrayList<Polygon3D>();
		for(Polygon3D poly : polys) {
			if(!poly.isVisible()) continue;
			poly = poly.clone();
			poly.rotate(rotation);
			poly.translate(centerX, centerY, centerZ);
			//This is for OskarsCube top-down view for perspective.
			poly.scale(.5, .5, 1);
			rendered.add(poly);
		}
		return rendered;
	}
	
	public MyShape(double x, double y, double z, CubeGen cube) {
		super(x, y, z);
		current_position = new int[3];
		current_position[0] = cube.start[0];
		current_position[1] = cube.start[1];
		current_position[2] = cube.start[2];
		big_red_axis = new BigRedAxis(cube);
		interior = new Interior(OskarsCube.solved_map, cube);
		intSol = new InteriorSolutionPath(OskarsCube.solved_map, cube);
		OskarsCube.acheivable = interior.acheivable;
		interior_array = interior.extract();
		intSol_array = intSol.extract();
		awayW= big_red_axis.extractAW();
		awayR= big_red_axis.extractAR();
		awayB= big_red_axis.extractAB();
		towardW = big_red_axis.extractTW();
		towardB = big_red_axis.extractTB();
		towardR = big_red_axis.extractTR();
		secondFaces = big_red_axis.extractSF();

		Polygon3D[] red_axis_array = big_red_axis.extract();
		for (int i = 0; i < red_axis_array.length; i++) {
			if (red_axis_array[i] != null)
				addPoly(red_axis_array[i]);
		}
		/*Polygon3D[] red_axis_array2 = big_red_axis.extract_stick();
		for (int i = 0; i < red_axis_array2.length; i++) {
			if (red_axis_array2[i] != null)
				addPoly(red_axis_array2[i]);
		}
		*/
		for (int i = 0; i < interior_array.length; i++) {
			if (interior_array[i] != null) {
				interior_array[i].setVisible(false);
				addPoly(interior_array[i]);
			}
		}
		for (int i = 0; i < intSol_array.length; i++) {
			if (intSol_array[i] != null) {
				intSol_array[i].setVisible(false);
				addPoly(intSol_array[i]);
			}
		}
		cube_faces = new Faces(cube);
		secondFacesFaces = cube_faces.extract_sf();
		Polygon3D[] faces = cube_faces.extract();
		for (int i = 0; i < faces.length; i++) {
			if (faces[i] != null)
				addPoly(faces[i]);
		}
		setAwayWVisible(false, false, false);
		setAwayBVisible(false, false, false);
		setAwayRVisible(false, false, false);
		setTowardWVisible(false, false, false);
		setTowardRVisible(false, false, false);
		setTowardBVisible(false, false, false);
		fireCanvasChange();
	}
	public void setInteriorVisible(boolean visible) {
		for (int i = 0; i < interior_array.length; i++)
			if (interior_array[i] != null)
				interior_array[i].setVisible(visible);
	}
	public void setIntSolVisible(boolean visible) {
		for (int i = 0; i < intSol_array.length; i++)
			if (intSol_array[i] != null) {
				intSol_array[i].setVisible(visible);
				if (intSol_array[i].getFillColor() != Color.yellow) {
					intSol_array[i].setOpacity((float) .1);
					//intSol_array[i].setVisible(false);
					
				}
				intSol_array[i].setBorderColor(Color.GRAY);
			}
		
	}
	public void setAwayWVisible(boolean best, boolean visible, boolean color) {
		Color col = Color.cyan;
		if(best && color)
			col = Color.green;
		if(!best && color) 
			col = Color.red;
		for (int i = 0; i < awayW.length; i++)
			if (awayW[i] != null) {
				awayW[i].setFillColor(col);
				awayW[i].setVisible(visible);
			}
	}
	public void setAwayRVisible(boolean best, boolean visible, boolean color) {
		Color col = Color.cyan;
		if(best && color)
			col = Color.green;
		if(!best && color) 
			col = Color.red;
		for (int i = 0; i < awayR.length; i++)
			if (awayR[i] != null) {
				awayR[i].setVisible(visible);
				awayR[i].setFillColor(col);
			}
	}
	public void setAwayBVisible(boolean best, boolean visible, boolean color) {
		Color col = Color.cyan;
		if(best && color)
			col = Color.green;
		if(!best && color) 
			col = Color.red;
		for (int i = 0; i < awayB.length; i++)
			if (awayB[i] != null) {
				awayB[i].setFillColor(col);
				awayB[i].setVisible(visible);
			}
	}
	public void setTowardWVisible(boolean best, boolean visible, boolean color) {
		Color col = Color.cyan;
		if(best && color)
			col = Color.green;
		if(!best && color) 
			col = Color.red;
		for (int i = 0; i < towardW.length; i++)
			if (towardW[i] != null) {
				towardW[i].setVisible(visible);
				towardW[i].setFillColor(col);
			}
	}
	public void setTowardBVisible(boolean best, boolean visible, boolean color) {
		Color col = Color.cyan;
		if(best && color)
			col = Color.green;
		if(!best && color) 
			col = Color.red;
		for (int i = 0; i < towardB.length; i++)
			if (towardB[i] != null) {
				towardB[i].setVisible(visible);
				towardB[i].setFillColor(col);
			}
	}
	public void setTowardRVisible(boolean best, boolean visible, boolean color) {
		Color col = Color.cyan;
		if(best && color)
			col = Color.green;
		if(!best && color) 
			col = Color.red;
		for (int i = 0; i < towardR.length; i++)
			if (towardR[i] != null) {
				towardR[i].setVisible(visible);
				towardR[i].setFillColor(col);
			}
	}
	public void setSecondFacesVisible(boolean visible) {
		for (int i = 0; i < secondFaces.length; i++) {
			if (secondFaces[i] != null) {
				secondFaces[i].setVisible(visible);
			}
		}
		for (int i=0; i< secondFacesFaces.length; i++) {
			if (secondFacesFaces[i] != null) {
				secondFacesFaces[i].setVisible(visible);
			}
		}
	
	
	}

}