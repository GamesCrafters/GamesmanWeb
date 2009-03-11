package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.newOskars;

import java.awt.Color;

import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;

public class BigRedAxis{
	public PolygonCollection holder;
	public PolygonCollection xyholder;
	public PolygonCollection yzholder;
	public PolygonCollection xzholder;
	/*public BigRedAxis(){
		PolygonCollection stick_1 = new Stick().returnItem();
		PolygonCollection stick_2 = new Stick().returnItem();
		PolygonCollection stick_3 = new Stick().returnItem();
		stick_1.rotate('x', 90);
		stick_1.translate(10, 10, -1);
		stick_2.rotate('y', 90);
		stick_3.translate(10, 0, -11);
		//rotate the sticks apropiately here
		Object[] input_array = {stick_1, stick_2, stick_3};
		holder = new PolygonCollection(input_array);
		holder.translate(-2, -1, -1);
		holder.translate(-8, -8, -4);
		holder.translate(-4.5, 4.5, 4.5);
		//now you can translate and rotate the group of polygons via holder
	}
	*/
	public BigRedAxis() { // O is (0,8,4), X is (6,2,2)  
		Polygon3D yellowdot1 = new Polygon3D();  //THIS IS WHITE
		yellowdot1.setFillColor(Color.yellow);
		yellowdot1.addPoint(3.5, -.5, 5.5);
		yellowdot1.addPoint(4.5, -.5, 5.5);
		yellowdot1.addPoint(4.5, .5, 5.5);
		yellowdot1.addPoint(3.5, .5, 5.5);
		/*Polygon3D yellowdot2 = new Polygon3D();
		yellowdot2.setFillColor(Color.YELLOW);
		yellowdot2.addPoint(0, 0, -11);
		yellowdot2.addPoint(1, 0, -11);
		yellowdot2.addPoint(1, -1, -11);
		yellowdot2.addPoint(0, -1, -11);
		*/
		Polygon3D yellowdot3 = new Polygon3D(); //THIS IS BLUE
		yellowdot3.setFillColor(Color.YELLOW);
		yellowdot3.addPoint(-5.5, -0.5, -4.5);
		yellowdot3.addPoint(-5.5, -0.5, -3.5);
		yellowdot3.addPoint(-5.5, .5, -3.5);
		yellowdot3.addPoint(-5.5, .5, -4.5);
		
		/*Polygon3D yellowdot4 = new Polygon3D();
		yellowdot4.setFillColor(Color.yellow);
		yellowdot4.addPoint(11, 0, 0);
		yellowdot4.addPoint(11, 0, -1);
		yellowdot4.addPoint(11, -1, -1);
		yellowdot4.addPoint(11, -1, 0);
		*/
		Polygon3D yellowdot5 = new Polygon3D();
		yellowdot5.setFillColor(Color.YELLOW);  //THIS IS RED
		yellowdot5.addPoint(3.5, -5.5, -4.5);
		yellowdot5.addPoint(4.5, -5.5, -4.5);
		yellowdot5.addPoint(4.5, -5.5, -3.5);
		yellowdot5.addPoint(3.5, -5.5, -3.5);
		
		/*Polygon3D yellowdot6 = new Polygon3D();
		yellowdot6.setFillColor(Color.YELLOW);
		yellowdot6.addPoint(0, -11, 0);
		yellowdot6.addPoint(1, -11, 0);
		yellowdot6.addPoint(1, -11, -1);
		yellowdot6.addPoint(0, -11, -1);
		*/
		Object[] input_array2 = {yellowdot1,  yellowdot3, yellowdot5/*, yellowdot4, yellowdot2, yellowdot6*/};
		Object[] input_array_xy = {yellowdot1/*, yellowdot2*/};
		Object[] input_array_yz = {yellowdot3/*, yellowdot4*/};
		Object[] input_array_xz = {yellowdot5/*, yellowdot6*/};
		holder = new PolygonCollection(input_array2);
		//holder2.translate(0, -8, -4};
		xyholder = new PolygonCollection(input_array_xy);
		yzholder = new PolygonCollection(input_array_yz);
		xzholder = new PolygonCollection(input_array_xz);
		
	}
	public Polygon3D[] extract(){
		return holder.extract_polygons();
		//return holder2.extract_polygons();
	}
}