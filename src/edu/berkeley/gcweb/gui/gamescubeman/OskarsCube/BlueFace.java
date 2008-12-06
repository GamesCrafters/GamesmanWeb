package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import java.awt.Color;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;

public class BlueFace{
	PolygonCollection holder;
	public BlueFace(){
		//The blue sides polygons go in here.
		Polygon3D bluemaze = new Polygon3D();
		bluemaze.setFillColor(Color.GRAY);
		bluemaze.addPoint(11, 0, 0);
		bluemaze.addPoint(11, -5, 0);
		bluemaze.addPoint(14, -5, 0);
		bluemaze.addPoint(14, -4, 0);
		bluemaze.addPoint(12, -4, 0);
		bluemaze.addPoint(12, -1, 0);
		bluemaze.addPoint(13, -1, 0);
		bluemaze.addPoint(13, -3, 0);
		bluemaze.addPoint(15, -3, 0);
		bluemaze.addPoint(15, -6, 0);
		bluemaze.addPoint(13, -6, 0);
		bluemaze.addPoint(13, -8, 0);
		bluemaze.addPoint(12, -8, 0);
		bluemaze.addPoint(12, -6, 0);
		bluemaze.addPoint(11, -6, 0);
		bluemaze.addPoint(11, -9, 0);
		bluemaze.addPoint(14, -9, 0);
		bluemaze.addPoint(14, -7, 0);
		bluemaze.addPoint(18, -7, 0);
		bluemaze.addPoint(18, -4, 0);
		bluemaze.addPoint(17, -4, 0);
		bluemaze.addPoint(17, -6, 0);
		bluemaze.addPoint(16, -6, 0);
		bluemaze.addPoint(16, -2, 0);
		bluemaze.addPoint(14, -2, 0);
		bluemaze.addPoint(14, -1, 0);
		bluemaze.addPoint(17, -1, 0);
		bluemaze.addPoint(17, -3, 0);
		bluemaze.addPoint(19, -3, 0);
		bluemaze.addPoint(19, -8, 0);
		bluemaze.addPoint(15, -8, 0);
		bluemaze.addPoint(15, -9, 0);
		bluemaze.addPoint(20, -9, 0);
		bluemaze.addPoint(20, 0, 0);
		bluemaze.addPoint(19, 0, 0);
		bluemaze.addPoint(19, -2, 0);
		bluemaze.addPoint(18, -2, 0);
		bluemaze.addPoint(18, 0, 0);
		
		Polygon3D blue_border = new Polygon3D();
		blue_border.setFillColor(Color.BLUE);
		blue_border.addPoint(11, 0, 0);
		blue_border.addPoint(10, 0, 0);
		blue_border.addPoint(10, 1, 0);
		blue_border.addPoint(21, 1, 0);
		blue_border.addPoint(21, -10, 0);
		blue_border.addPoint(10, -10, 0);
		blue_border.addPoint(10, 0, 0);
		blue_border.addPoint(11, 0, 0);
		blue_border.addPoint(11, -5, 0);
		blue_border.addPoint(14, -5, 0);
		blue_border.addPoint(14, -4, 0);
		blue_border.addPoint(12, -4, 0);
		blue_border.addPoint(12, -1, 0);
		blue_border.addPoint(13, -1, 0);
		blue_border.addPoint(13, -3, 0);
		blue_border.addPoint(15, -3, 0);
		blue_border.addPoint(15, -6, 0);
		blue_border.addPoint(13, -6, 0);
		blue_border.addPoint(13, -8, 0);
		blue_border.addPoint(12, -8, 0);
		blue_border.addPoint(12, -6, 0);
		blue_border.addPoint(11, -6, 0);
		blue_border.addPoint(11, -9, 0);
		blue_border.addPoint(14, -9, 0);
		blue_border.addPoint(14, -7, 0);
		blue_border.addPoint(18, -7, 0);
		blue_border.addPoint(18, -4, 0);
		blue_border.addPoint(17, -4, 0);
		blue_border.addPoint(17, -6, 0);
		blue_border.addPoint(16, -6, 0);
		blue_border.addPoint(16, -2, 0);
		blue_border.addPoint(14, -2, 0);
		blue_border.addPoint(14, -1, 0);
		blue_border.addPoint(17, -1, 0);
		blue_border.addPoint(17, -3, 0);
		blue_border.addPoint(19, -3, 0);
		blue_border.addPoint(19, -8, 0);
		blue_border.addPoint(15, -8, 0);
		blue_border.addPoint(15, -9, 0);
		blue_border.addPoint(20, -9, 0);
		blue_border.addPoint(20, 0, 0);
		blue_border.addPoint(19, 0, 0);
		blue_border.addPoint(19, -2, 0);
		blue_border.addPoint(18, -2, 0);
		blue_border.addPoint(18, 0, 0);
		
		
		Polygon3D[] input_array = {/*bluemaze,*/ blue_border};
		
		//create array of polygons here
		//put them into holder

		holder = new PolygonCollection(input_array);
	}
	
	public PolygonCollection returnItem(){
		return holder;
	}
}