package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;

public class BigRedAxis{
	public PolygonCollection holder;
	public BigRedAxis(){
		PolygonCollection stick_1 = new Stick().returnItem();
		PolygonCollection stick_2 = new Stick().returnItem();
		PolygonCollection stick_3 = new Stick().returnItem();
		stick_1.rotate('x', 90);
		stick_2.rotate('y', 90);
		//rotate the sticks appropiately here
		Object[] input_array = {stick_1, stick_2, stick_3};
		holder = new PolygonCollection(input_array);
		//now you can translate and rotate the group of polygons via holder
	}
	public Polygon3D[] extract(){
		return holder.extract_polygons();
	}
}