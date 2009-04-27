package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Shape3D;

//import netscape.javascript.JSObject;

public class MyShape extends Shape3D {
	public BigRedAxis big_red_axis;
	public Faces cube_faces;
	public Interior interior;
	public int[] current_position;
	private Polygon3D[] interior_array;
	private Polygon3D[] intSol_array;
	public InteriorSolutionPath intSol;

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
		Polygon3D[] red_axis_array = big_red_axis.extract();
		for (int i = 0; i < red_axis_array.length; i++) {
			if (red_axis_array[i] != null)
				addPoly(red_axis_array[i]);
		}
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
		Polygon3D[] faces = cube_faces.extract();
		for (int i = 0; i < faces.length; i++) {
			if (faces[i] != null)
				addPoly(faces[i]);
		}
		fireCanvasChange();
	}
	public void setInteriorVisible(boolean visible) {
		for (int i = 0; i < interior_array.length; i++)
			if (interior_array[i] != null)
				interior_array[i].setVisible(visible);
	}
	public void setIntSolVisible(boolean visible) {
		for (int i = 0; i < intSol_array.length; i++)
			if (intSol_array[i] != null)
				intSol_array[i].setVisible(visible);
	}

}