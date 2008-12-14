package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Shape3D;

public class MyShape extends Shape3D {
		public BigRedAxis big_red_axis;
		public Faces cube_faces;
		public int[] current_position;
		public MyShape(double x, double y, double z) {
			super(x, y, z);
			current_position = new int[3];
			current_position[0] = 0;
			current_position[1] = 0;
			current_position[2] = 0;
			big_red_axis = new BigRedAxis();
			Polygon3D[] red_axis_array = big_red_axis.extract();
			for (int i = 0; i < red_axis_array.length; i++){
				if(red_axis_array[i] != null)
					addPoly(red_axis_array[i]);
			}
			cube_faces = new Faces();
			Polygon3D[] faces = cube_faces.extract();
			for (int i = 0; i < faces.length; i++){
				if(faces[i] != null)
					addPoly(faces[i]);
			}
			
			fireCanvasChange();
		}
		
	}