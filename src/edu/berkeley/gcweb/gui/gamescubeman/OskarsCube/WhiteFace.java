package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import java.awt.Color;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;

public class WhiteFace{
	PolygonCollection holder;
	public WhiteFace(){
		//the white sides polygons in here
		Polygon3D whitemaze = new Polygon3D ();
		whitemaze.setFillColor(Color.GRAY);
		whitemaze.addPoint(0, 0, 0);
		whitemaze.addPoint(0, -5, 0);
		whitemaze.addPoint(1, -5, 0);
		whitemaze.addPoint(1, -3, 0);
		whitemaze.addPoint(2, -3, 0);
		whitemaze.addPoint(2, -8, 0);
		whitemaze.addPoint(1, -8, 0);
		whitemaze.addPoint(1, -6, 0);
		whitemaze.addPoint(0, -6, 0);
		whitemaze.addPoint(0, -9, 0);
		whitemaze.addPoint(7, -9, 0);
		whitemaze.addPoint(7, -7, 0);
		whitemaze.addPoint(8, -7, 0);
		whitemaze.addPoint(8, -9, 0);
		whitemaze.addPoint(9, -9, 0);
		whitemaze.addPoint(9, -6, 0);
		whitemaze.addPoint(5, -6, 0);
		whitemaze.addPoint(5, -3, 0);
		whitemaze.addPoint(6, -3, 0);
		whitemaze.addPoint(6, -5, 0);
		whitemaze.addPoint(9, -5, 0);
		whitemaze.addPoint(9, 0, 0);
		whitemaze.addPoint(8, 0, 0);
		whitemaze.addPoint(8, -4, 0);
		whitemaze.addPoint(7, -4, 0);
		whitemaze.addPoint(7, 0, 0);
		whitemaze.addPoint(2, 0, 0);
		whitemaze.addPoint(2, -1, 0);
		whitemaze.addPoint(6, -1, 0);
		whitemaze.addPoint(6, -2, 0);
		whitemaze.addPoint(4, -2, 0);
		whitemaze.addPoint(4, -7, 0);
		whitemaze.addPoint(6, -7, 0);
		whitemaze.addPoint(6, -8, 0);
		whitemaze.addPoint(3, -8, 0);
		whitemaze.addPoint(3, -2, 0);
		whitemaze.addPoint(1, -2, 0);
		whitemaze.addPoint(1, 0, 0);
		
		Polygon3D white_border = new Polygon3D();
		white_border.setFillColor(Color.WHITE);
		white_border.addPoint(-1,0,0);
		white_border.addPoint(-1, 1, 0);
		white_border.addPoint(10, 1, 0);
		white_border.addPoint(10, -10, 0);
		white_border.addPoint(-1, -10, 0);
		white_border.addPoint(-1, 0, 0);
		white_border.addPoint(0, 0, 0);
		white_border.addPoint(0, -5, 0);
		white_border.addPoint(1, -5, 0);
		white_border.addPoint(1, -3, 0);
		white_border.addPoint(2, -3, 0);
		white_border.addPoint(2, -8, 0);
		white_border.addPoint(1, -8, 0);
		white_border.addPoint(1, -6, 0);
		white_border.addPoint(0, -6, 0);
		white_border.addPoint(0, -9, 0);
		white_border.addPoint(7, -9, 0);
		white_border.addPoint(7, -7, 0);
		white_border.addPoint(8, -7, 0);
		white_border.addPoint(8, -9, 0);
		white_border.addPoint(9, -9, 0);
		white_border.addPoint(9, -6, 0);
		white_border.addPoint(5, -6, 0);
		white_border.addPoint(5, -3, 0);
		white_border.addPoint(6, -3, 0);
		white_border.addPoint(6, -5, 0);
		white_border.addPoint(9, -5, 0);
		white_border.addPoint(9, 0, 0);
		white_border.addPoint(8, 0, 0);
		white_border.addPoint(8, -4, 0);
		white_border.addPoint(7, -4, 0);
		white_border.addPoint(7, 0, 0);
		white_border.addPoint(2, 0, 0);
		white_border.addPoint(2, -1, 0);
		white_border.addPoint(6, -1, 0);
		white_border.addPoint(6, -2, 0);
		white_border.addPoint(4, -2, 0);
		white_border.addPoint(4, -7, 0);
		white_border.addPoint(6, -7, 0);
		white_border.addPoint(6, -8, 0);
		white_border.addPoint(3, -8, 0);
		white_border.addPoint(3, -2, 0);
		white_border.addPoint(1, -2, 0);
		white_border.addPoint(1, 0, 0);
		Polygon3D[] input_array = {white_border/*, whitemaze*/};
		
		//create array of polygons here
		//put them into holder

		
		holder = new PolygonCollection(input_array);
	}
	
	public PolygonCollection returnItem(){
		return holder;
	}
}