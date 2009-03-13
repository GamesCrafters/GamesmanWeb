package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.OskarsCube;

import java.awt.Color;

import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.OskarsCube.PolygonCollection;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;

public class WhiteFace{
	PolygonCollection holder;
	public WhiteFace(CubeGen cube){
		
		//The white sides polygons go in here.
		Polygon3D white_border = new Polygon3D();
		white_border.setFillColor(Color.WHITE);
		white_border.addPoint(0,0, 0);
		white_border.addPoint(0,0, 11);
		white_border.addPoint(0,-11, 11);
		white_border.addPoint(0,-11, 0);
		white_border.addPoint(0,-1, 0);
		white_border.addPoint(0,-1, 1);
		white_border.addPoint(0,-10, 1);
		white_border.addPoint(0,-10,10);
		white_border.addPoint(0,-1, 10);
		white_border.addPoint(0,-1, 0);
		
		Polygon3D green_dot = new Polygon3D();
		green_dot.setFillColor(Color.GREEN);
		//WHITE IS YZ so pull 1 and 2 out of end
		int endy = cube.end[1];
		int endz = cube.end[2];
		green_dot.addPoint(0,-(endy +1),(endz +1.5));
		green_dot.addPoint(0,-(endy +1.5), (endz +2));
		green_dot.addPoint(0,-(endy +2), (endz +1.5));
		green_dot.addPoint(0,-(endy +1.5),(endz+ 1));
		
		int i;
		int x=0;
		int y=0;
		int z=0;
		Object[] input_array = new Polygon3D[34];
		for (i=0; i<32; i++) {
			Polygon3D square = new Polygon3D();
			square.setFillColor(Color.WHITE);
			y=cube.White[i][0];
			z=cube.White[i][1];
			square.addPoint(x,-( y+1),( z+1));
			square.addPoint(x,-( y+1),( z+2));
			square.addPoint(x,-( y+2),( z+2));
			square.addPoint(x,-( y+2),( z+1));
			input_array[i] = square;			
		}
		
		input_array[33]= white_border;
		input_array[32]= green_dot;
		
		//create array of polygons here
		//put them into holder


		
		holder = new PolygonCollection(input_array);
	}
	
	public PolygonCollection returnItem(){
		return holder;
	}
}