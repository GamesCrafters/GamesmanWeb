package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import java.awt.Color;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;

public class Stick{
	PolygonCollection holder;
	public Stick(){
		//polygons for an individual stick go in here
		//create array of polygons here
		//put them into holder
		Polygon3D cap_1 = new Polygon3D();
		cap_1.setFillColor(Color.RED);
		cap_1.addPoint(0, 0, 0);
		cap_1.addPoint(1, 0, 0);
		cap_1.addPoint(1, 1, 0);
		cap_1.addPoint(0, 1, 0);
		Polygon3D top_long = new Polygon3D();
		top_long.setFillColor(Color.RED);
		top_long.addPoint(0, 1, 0);
		top_long.addPoint(1, 1, 0);
		top_long.addPoint(1, 1, 10);
		top_long.addPoint(0, 1, 10);
		Polygon3D left_long = new Polygon3D();
		left_long.setFillColor(Color.RED);
		left_long.addPoint(0, 0, 0);
		left_long.addPoint(0, 1, 0);
		left_long.addPoint(0, 1, 10);
		left_long.addPoint(0, 0, 10);
		Polygon3D right_long = new Polygon3D();
		right_long.setFillColor(Color.RED);
		right_long.addPoint(1, 0, 0);
		right_long.addPoint(1, 1, 0);
		right_long.addPoint(1, 1, 10);
		right_long.addPoint(1, 0, 10);
		Polygon3D bottom_long = new Polygon3D ();
		bottom_long.setFillColor(Color.RED);
		bottom_long.addPoint(0, 0, 0);
		bottom_long.addPoint(0, 0, 10);
		bottom_long.addPoint(1, 0, 10);
		bottom_long.addPoint(1, 0, 0);
		Polygon3D cap2 = new Polygon3D ();
		cap2.setFillColor(Color.RED);
		cap2.addPoint(0, 0, 10);
		cap2.addPoint(0, 1, 10);
		cap2.addPoint(1, 1, 10);
		cap2.addPoint(1, 0, 10);
		Polygon3D[] input_array = {cap_1, top_long, left_long,right_long,bottom_long,cap2};
		holder = new PolygonCollection(input_array);
	}
	
	public Stick(int length){
		Polygon3D cap_1 = new Polygon3D();
		cap_1.setFillColor(Color.RED);
		cap_1.addPoint(0, 0, 0);
		cap_1.addPoint(1, 0, 0);
		cap_1.addPoint(1, 1, 0);
		cap_1.addPoint(0, 1, 0);
		Polygon3D top_long = new Polygon3D();
		top_long.setFillColor(Color.RED);
		top_long.addPoint(0, 1, 0);
		top_long.addPoint(1, 1, 0);
		top_long.addPoint(1, 1, length);
		top_long.addPoint(0, 1, length);
		Polygon3D left_long = new Polygon3D();
		left_long.setFillColor(Color.RED);
		left_long.addPoint(0, 0, 0);
		left_long.addPoint(0, 1, 0);
		left_long.addPoint(0, 1, length);
		left_long.addPoint(0, 0, length);
		Polygon3D right_long = new Polygon3D();
		right_long.setFillColor(Color.RED);
		right_long.addPoint(1, 0, 0);
		right_long.addPoint(1, 1, 0);
		right_long.addPoint(1, 1, length);
		right_long.addPoint(1, 0, length);
		Polygon3D bottom_long = new Polygon3D ();
		bottom_long.setFillColor(Color.RED);
		bottom_long.addPoint(0, 0, 0);
		bottom_long.addPoint(0, 0, length);
		bottom_long.addPoint(1, 0, length);
		bottom_long.addPoint(1, 0, 0);
		Polygon3D cap2 = new Polygon3D ();
		cap2.setFillColor(Color.RED);
		cap2.addPoint(0, 0, length);
		cap2.addPoint(0, 1, length);
		cap2.addPoint(1, 1, length);
		cap2.addPoint(1, 0, length);
		Polygon3D[] input_array = {cap_1, top_long, left_long,right_long,bottom_long,cap2};
		holder = new PolygonCollection(input_array);		
	}
	
	public PolygonCollection returnItem(){
		return holder;
	}
}