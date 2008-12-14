package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import java.awt.Color;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;

public class RedFace{
	PolygonCollection holder;
	public RedFace(){
		//the red sides polygons go in here
		Polygon3D redmaze = new Polygon3D();
		redmaze.setFillColor(Color.GRAY);
		redmaze.addPoint(0, -11, 0);
		redmaze.addPoint(0, -20, 0);
		redmaze.addPoint(3, -20, 0);
		redmaze.addPoint(3, -19, 0);
		redmaze.addPoint(1, -19, 0);
		redmaze.addPoint(1, -14, 0);
		redmaze.addPoint(2, -14, 0);
		redmaze.addPoint(2, -18, 0);
		redmaze.addPoint(3, -18, 0);
		redmaze.addPoint(3, -14, 0);
		redmaze.addPoint(5, -14, 0);
		redmaze.addPoint(5, -12, 0);
		redmaze.addPoint(6, -12, 0);
		redmaze.addPoint(6, -14, 0);
		redmaze.addPoint(8, -14, 0);
		redmaze.addPoint(8, -15, 0);
		redmaze.addPoint(4, -15, 0);
		redmaze.addPoint(4, -18, 0);
		redmaze.addPoint(5, -18, 0);
		redmaze.addPoint(5, -16, 0);
		redmaze.addPoint(8, -16, 0);
		redmaze.addPoint(8, -17, 0);
		redmaze.addPoint(6, -17, 0);
		redmaze.addPoint(6, -18, 0);
		redmaze.addPoint(8, -18, 0);
		redmaze.addPoint(8, -19, 0);
		redmaze.addPoint(4, -19, 0);
		redmaze.addPoint(4, -20, 0);
		redmaze.addPoint(9, -20, 0);
		redmaze.addPoint(9, -11, 0);
		redmaze.addPoint(8, -11, 0);
		redmaze.addPoint(8, -13, 0);
		redmaze.addPoint(7, -13, 0);
		redmaze.addPoint(7, -11, 0);
		redmaze.addPoint(2, -11, 0);
		redmaze.addPoint(2, -12, 0);
		redmaze.addPoint(4, -12, 0);
		redmaze.addPoint(4, -13, 0);
		redmaze.addPoint(1, -13, 0);
		redmaze.addPoint(1, -11, 0);
		
		Polygon3D red_border = new Polygon3D();
		red_border.setFillColor(Color.ORANGE);
		red_border.addPoint(0, -11, 0);
		red_border.addPoint(-1, -11, 0);
		red_border.addPoint(-1, -10, 0);
		red_border.addPoint(10, -10, 0);
		red_border.addPoint(10, -21, 0);
		red_border.addPoint(-1, -21, 0);
		red_border.addPoint(-1, -11, 0);
		red_border.addPoint(0, -11, 0);
		red_border.addPoint(0, -20, 0);
		red_border.addPoint(3, -20, 0);
		red_border.addPoint(3, -19, 0);
		red_border.addPoint(1, -19, 0);
		red_border.addPoint(1, -14, 0);
		red_border.addPoint(2, -14, 0);
		red_border.addPoint(2, -18, 0);
		red_border.addPoint(3, -18, 0);
		red_border.addPoint(3, -14, 0);
		red_border.addPoint(5, -14, 0);
		red_border.addPoint(5, -12, 0);
		red_border.addPoint(6, -12, 0);
		red_border.addPoint(6, -14, 0);
		red_border.addPoint(8, -14, 0);
		red_border.addPoint(8, -15, 0);
		red_border.addPoint(4, -15, 0);
		red_border.addPoint(4, -18, 0);
		red_border.addPoint(5, -18, 0);
		red_border.addPoint(5, -16, 0);
		red_border.addPoint(8, -16, 0);
		red_border.addPoint(8, -17, 0);
		red_border.addPoint(6, -17, 0);
		red_border.addPoint(6, -18, 0);
		red_border.addPoint(8, -18, 0);
		red_border.addPoint(8, -19, 0);
		red_border.addPoint(4, -19, 0);
		red_border.addPoint(4, -20, 0);
		red_border.addPoint(9, -20, 0);
		red_border.addPoint(9, -11, 0);
		red_border.addPoint(8, -11, 0);
		red_border.addPoint(8, -13, 0);
		red_border.addPoint(7, -13, 0);
		red_border.addPoint(7, -11, 0);
		red_border.addPoint(2, -11, 0);
		red_border.addPoint(2, -12, 0);
		red_border.addPoint(4, -12, 0);
		red_border.addPoint(4, -13, 0);
		red_border.addPoint(1, -13, 0);
		red_border.addPoint(1, -11, 0);
		
		Polygon3D[] input_array = {/*redmaze,*/ red_border};
		
		//create array of polygons here
		//put them into holder

	
		holder = new PolygonCollection(input_array);
	}
	
	public PolygonCollection returnItem(){
		return holder;
	}
}