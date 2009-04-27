package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;

public class InteriorSolutionPath {
	
	
	public PolygonCollection holder;
	
	//This class generates the solution path in the interior of the cube
	public InteriorSolutionPath(Solver solved, CubeGen gened) {
		
		int remoteness = solved.getRemoteness(solved.start)/2;
		int boardsize = gened.boardsize;
		int[] current = solved.start;
		int crem = 0;
		Object[] input_array = new PolygonCollection[4*remoteness];
		while (crem < remoteness) {
			int[] nmove = solved.getNextBestMove(current);
			PolygonCollection cube1= new Stick(1,1).returnItem();
			PolygonCollection cube2= new Stick(1,1).returnItem();
			
			cube1.translate(current[0] + nmove[0],current[1]+ nmove[1],current[2]+nmove[2]);
			cube2.translate(current[0], current[1],current[2]);
			input_array[2*crem] = cube1;
			input_array[2*crem+1] =cube2;
			int[] next = {current[0]+2*nmove[0], current[1]+2*nmove[1],current[2]+2*nmove[2]};
			current = next;
			crem++;
		}
		//Note the end square never gets added so fix that
		PolygonCollection cubefinal = new Stick(1,1).returnItem();
		cubefinal.translate(current[0], current[1], current[2]);
		input_array[crem*2] = cubefinal;
		
		
		
		holder = new PolygonCollection(input_array);
		holder.translate(-boardsize+.5, -boardsize+.5, -boardsize+.5);
	}

	
	public Polygon3D[] extract() {
		return holder.extract_polygons();
	}
	
}


