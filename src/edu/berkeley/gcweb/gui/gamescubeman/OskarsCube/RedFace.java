package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.OskarsCube;

import java.awt.Color;

import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.OskarsCube.PolygonCollection;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;

public class RedFace{
	PolygonCollection holder;
	public RedFace(CubeGen cube){
		//The red sides polygons go in here.
		Polygon3D red_border = new Polygon3D();
		red_border.setFillColor(Color.RED);
		red_border.addPoint(0, 0, 0);
		red_border.addPoint(0, -11, 0);
		red_border.addPoint(11, -11, 0);
		red_border.addPoint(11, 0, 0);
		red_border.addPoint(1, 0, 0);
		red_border.addPoint(1, -1, 0);
		red_border.addPoint(10,-1, 0);
		red_border.addPoint(10, -10, 0);
		red_border.addPoint(1, -10, 0);
		red_border.addPoint(1, 0, 0);
		
		Polygon3D green_dot = new Polygon3D();
		green_dot.setFillColor(Color.GREEN);
		//RED IS XY so pull 0 and 1 out of end
		int endx = cube.end[0];
		int endy = cube.end[1];
		green_dot.addPoint(endx +1,-(endy +1.5), 0);
		green_dot.addPoint(endx +1.5,-(endy +2), 0);
		green_dot.addPoint(endx +2,-(endy +1.5), 0);
		green_dot.addPoint(endx +1.5,-(endy+ 1), 0);
		
		int i;
		int x=0;
		int y=0;
		int z=0;
		Object[] input_array = new Polygon3D[34];
		for (i=0; i<32; i++) {
			Polygon3D square = new Polygon3D();
			square.setFillColor(Color.RED);
			x=cube.Red[i][0];
			y=cube.Red[i][1];
			square.addPoint(x+1,-( y+1), z);
			square.addPoint(x+2,-( y+1), z);
			square.addPoint(x+2,-( y+2), z);
			square.addPoint(x+1,-( y+2), z);
			input_array[i] = square;			
		}
		
		input_array[33]= red_border;
		input_array[32]= green_dot;
		
		//create array of polygons here
		//put them into holder

	
		holder = new PolygonCollection(input_array);
	}
	
	public PolygonCollection returnItem(){
		return holder;
	}
}