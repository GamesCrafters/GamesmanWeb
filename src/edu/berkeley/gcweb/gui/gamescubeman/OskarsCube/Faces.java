package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import java.awt.Color;

import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.PolygonCollection;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;

public class Faces {
	PolygonCollection holder;

	public Faces(CubeGen cube) {
		PolygonCollection b_face = new BlueFace(cube).returnItem();
		PolygonCollection w_face = new WhiteFace(cube).returnItem();
		PolygonCollection r_face = new RedFace(cube).returnItem();
		// r_face.extract_polygons()[0].setFillColor(Color.RED);
		/*
		 * PolygonCollection r_face2 = new RedFace().returnItem();
		 * r_face2.extract_polygons()[0].setFillColor(Color.MAGENTA);
		 * PolygonCollection w_face2 = new WhiteFace().returnItem();
		 * w_face2.extract_polygons()[0].setFillColor(Color.GRAY);
		 * PolygonCollection b_face2 = new BlueFace().returnItem();
		 * b_face2.extract_polygons()[0].setFillColor(Color.CYAN);
		 */
		// rotate the faces here;
		// w_face.translate(0, 0, -11);
		// r_face.rotate('x', 90);
		// r_face.translate(0, 0, -11);
		// b_face.rotate('y', 270);
		// b_face.translate(0, 0, -11);
		// w_face.rotate('z', 180);
		// b_face.translate(-1, 0, 10);
		/*
		 * r_face2.rotate('x', 90); r_face2.translate(0, -10, 10);
		 * b_face2.rotate('y', 90); b_face2.translate(10, 0, 10);
		 */
		Object[] input_array = { b_face /* , b_face2 */, r_face, /* r_face2, */
				w_face /* , w_face2 */};
		holder = new PolygonCollection(input_array);
		holder.translate(-5.5, 5.5, -5.5);
	}

	public Polygon3D[] extract() {
		return holder.extract_polygons();
	}
}