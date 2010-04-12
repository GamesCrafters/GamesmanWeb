package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import javax.swing.SwingUtilities;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Canvas3D;

public class OskarsSolved {
	private int min_remoteness = 50;
	
	private CubeGen cubefaces;
	private Solver solve;

	public OskarsSolved(int blue, int white, int red, int tosolve, boolean random, String filename) {
		if (!random) {
			for(int r = red; r < red + tosolve; r++) {
				for(int w = white; w < white + tosolve; w++) {
					for(int b = blue; b < blue + tosolve; b++) {
						cubefaces = new CubeGen(r,w,b);
						if(cubefaces.original) {
							solve = new Solver(cubefaces);
							if (cubefaces.remoteness > min_remoteness) {
								found_one(b,w,r, cubefaces.remoteness, cubefaces.subcomponents, cubefaces.bushiness, cubefaces.branches, cubefaces.brfactor, cubefaces.maxbrfactor, cubefaces.turns, cubefaces.planeTurns, cubefaces.alleys[0], cubefaces.sumlindistance, cubefaces.sumsoldistance);
								
							}
						}
							
					}
				}
			}
		} else {
			for (int i = 0; i < tosolve; i++) {
				cubefaces = new CubeGen(true,true,true, 5);
				solve = new Solver(cubefaces);
				if (cubefaces.remoteness > min_remoteness) {
					found_one(cubefaces.BlueInt, cubefaces.WhiteInt, cubefaces.RedInt, cubefaces.remoteness, cubefaces.subcomponents, cubefaces.bushiness, cubefaces.branches, cubefaces.brfactor, cubefaces.maxbrfactor, cubefaces.turns, cubefaces.planeTurns, cubefaces.alleys[0], cubefaces.sumlindistance, cubefaces.sumsoldistance);
					
				}
			}
		}
	}
	public static void main(String[] args) {
		OskarsSolved osolve = new OskarsSolved(0,0,0,1200000, true, "default"); //600000 4 hours
		//OskarsSolved osolve = new OskarsSolved(0,0,0,1000, false, "default");
	}
		
			
			
					
					
				
	private void found_one(int red, int white, int blue, int remoteness, int subcomponents, int bushiness, int branches, int branchbydeg, int maxbranch, int turns, int notplaneturns, int alleys, int lindist, int soldist) {
		String tout = red + "\t" + white + "\t" + blue + "\t" + remoteness + "\t" + subcomponents + "\t" + bushiness + "\t" + branches + "\t" + branchbydeg + "\t" + maxbranch + "\t" + turns + "\t" + notplaneturns + "\t" + alleys + "\t" + lindist + "\t" + soldist; 
		System.out.println(tout);
	}	
		
}
