package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Shape3D;

//import netscape.javascript.JSObject;

public class MyShape extends Shape3D {
	public BigRedAxis big_red_axis;
	public Faces cube_faces;
	public Interior interior;
	public int[] current_position;

	public MyShape(double x, double y, double z, CubeGen cube,
			Boolean show_interior) {
		super(x, y, z);
		current_position = new int[3];
		current_position[0] = cube.start[0];
		current_position[1] = cube.start[1];
		current_position[2] = cube.start[2];
		big_red_axis = new BigRedAxis(cube);
		interior = new Interior(OskarsCube.solved_map);
		OskarsCube.acheivable = interior.acheivable;
		Polygon3D[] interior_array = interior.extract();
		Polygon3D[] red_axis_array = big_red_axis.extract();
		for (int i = 0; i < red_axis_array.length; i++) {
			if (red_axis_array[i] != null)
				addPoly(red_axis_array[i]);
		}
		if (show_interior) {
			for (int i = 0; i < interior_array.length; i++) {
				if (interior_array[i] != null)
					addPoly(interior_array[i]);
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

}