package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;

public class Faces{
	PolygonCollection holder;
	public Faces(){
		PolygonCollection b_face = new BlueFace().returnItem();
		PolygonCollection b_face2 = new BlueFace().returnItem();
		PolygonCollection r_face = new RedFace().returnItem();
		PolygonCollection r_face2 = new RedFace().returnItem();
		PolygonCollection w_face = new WhiteFace().returnItem();
		PolygonCollection w_face2 = new WhiteFace().returnItem();
		PolygonCollection stick = new Stick(5).returnItem();
		//rotate the faces appropiately here;
		w_face.translate(0, 0, -11);
		r_face.rotate('x', 90);
		r_face.translate(0, 1, 10);
		r_face2.rotate('x', 90);
		r_face2.translate(0, -10, 10);
		b_face.rotate('y', 90);
		b_face.translate(-1, 0, 10);
		b_face2.rotate('y', 90);
		b_face2.translate(10, 0, 10);
		Object[] input_array = {b_face, b_face2, r_face, r_face2, w_face, w_face2, stick};
		holder = new PolygonCollection(input_array);
		//now you can translate and rotate the group of polygons via holder
		//now you can translate and rotate the group of polygons via holder
		//holder.rotate('y', -30);
		//holder.rotate('x', -30);
		//holder.translate(-5, 0, 3);
	}
	public Polygon3D[] extract(){
		return holder.extract_polygons();
	}
}