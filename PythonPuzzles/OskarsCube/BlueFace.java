package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.newOskars;

import java.awt.Color;

import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.newOskars.PolygonCollection;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;

public class BlueFace{ // THE BLUE FACE IS XZ
	PolygonCollection holder;
	public BlueFace(CubeGen cube){
		//The blue sides polygons go in here.
		Polygon3D blue_border = new Polygon3D();
		blue_border.setFillColor(Color.BLUE);
		blue_border.addPoint(0, 0, 0);
		blue_border.addPoint(0,0, 11);
		blue_border.addPoint(11,0, 11);
		blue_border.addPoint(11, 0, 0);
		blue_border.addPoint(1, 0, 0);
		blue_border.addPoint(1,0, 1);
		blue_border.addPoint(10,0, 1);
		blue_border.addPoint(10,0, 10);
		blue_border.addPoint(1,0, 10);
		blue_border.addPoint(1,0, 0);
		
		Polygon3D green_dot = new Polygon3D();
		green_dot.setFillColor(Color.GREEN);
		//BLUE IS XZ so pull 0 and 2 out of end
		int endx = cube.end[0];
		int endz = cube.end[2];
		green_dot.addPoint(endx +1,0,(endz +1.5));
		green_dot.addPoint(endx +1.5,0, (endz +2));
		green_dot.addPoint(endx +2,0, (endz +1.5));
		green_dot.addPoint(endx +1.5,0,(endz+ 1));
		
		int i;
		int x=0;
		int y=0;
		int z=0;
		Object[] input_array = new Polygon3D[34];
		for (i=0; i<32; i++) {
			Polygon3D square = new Polygon3D();
			square.setFillColor(Color.BLUE);
			x=cube.Blue[i][0] +1;
			z=cube.Blue[i][1] +1;
			square.addPoint(x, -y, z);
			square.addPoint(x+1, -y, z);
			square.addPoint(x+1, -y, (z+1));
			square.addPoint(x, -y, (z+1));
			input_array[i] = square;			
		}
		
		input_array[33]= blue_border;
		input_array[32]= green_dot;
		
		//create array of polygons here
		//put them into holder

		holder = new PolygonCollection(input_array);
	}
	
	public PolygonCollection returnItem(){
		return holder;
	}
}