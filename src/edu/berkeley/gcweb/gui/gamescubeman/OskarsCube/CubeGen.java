package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.OskarsCube;

public class CubeGen {
	
	public CubeGen(int seed1, int seed2, int seed3, boolean findbest) {
		this.findbest = findbest;
		if(seed1 == 0 & seed2== 0 & seed3 ==0) {
			//set to classic board
			Blue = blocked_xz_face;
			White = blocked_yz_face;
			Red = blocked_xy_face;
			
		} else {
		//else we generate the appropriate board if legal
		Blue = intToSet(seed1);
		White = intToSet(seed2);
		Red = intToSet(seed3);
		}
		
		Valid = legalBoard(Blue) & legalBoard(White) & legalBoard(Red);
		if (Valid & seed1 != 0 & seed2 != 0 & seed3 !=0) {
			System.out.println("Board Generated: " + seed1 + " " + seed2 + " " + seed3);
		}
	}
	
	private int[][] intToSet(int seed) {
		//alg from int to face
		//for any two bits 00 is [ -], 01 is [ ' ], 10 is [- ], 11 is [ , ] ie arc from 0 to e^(i*pi/2x)
		int[][] face = new int[32][2];
		int i=0;
		for (; i<16; i++) {
			int horz =1;
			int vert =1;
			int temp = (seed << 2*i) >> (30 -2*i);
			if (temp >= 1) {
				horz = -1* horz;
				vert = -1* vert;
			}
			if (temp % 2 == 0) {
				vert =0;
			} else horz =0;
			face[i][0]= 2*(i/4) + 1 + horz;
			face[i][1]= 2*(i%4) + 1 + vert;
		}
		for(i=0; i<16; i++) {
			face[16+i][0]= Standard[i][0];
			face[16+i][1]= Standard[i][1];
		}
		
		return face;
	}
	
	private boolean legalBoard(int[][] face) {
		//check if legal board
		//two properties
		//one, no value repeats:
		int i;
		int j=1;
		for(i=0;i<17; i++) {
			for (j=i+1; j<17; j++) {
				if (face[i][0]== face[j][0] && face[i][1]== face[j][1]) {
					return false;
				}
			}
		}
		//two, no squares ie floating pieces
		
		return true;
	}
	
	public int[][] Blue;
	public int[][] White;
	public int[][] Red;
	public boolean Valid;
	public int[][] Standard = {{1,1}, {1,3}, {1,5}, {1,7}, {3,1}, {3,3}, {3,5}, {3,7}, {5,1}, {5,3}, {5,5}, {5,7}, {7,1}, {7,3}, {7,5}, {7,7}};
	
	
	//private static int[][] blocked_xz_face = {{1,0}, {7,0}, {1,1}, {2,1}, {3,1}, {5,1}, {7,1}, {5,2}, {1,3}, {3,3}, {4,3}, {5,3}, {6,3}, {7,3}, {1,4}, {3,4}, {1,5}, {3,5}, {5,5}, {6,5}, {7,5}, {1,6}, {3,6}, {5,6}, {1,7}, {2,7}, {3,7}, {4,7}, {5,7}, {6,7}, {7,7}, {3,8}};
	//private static int[][] blocked_yz_face = {{5,0}, {1,1}, {2,1}, {3,1}, {5,1}, {6,1}, {7,1}, {3,2}, {5,2}, {1,3}, {3,3}, {4,3}, {5,3}, {7,3}, {8,3}, {1,4}, {7,4}, {1,5}, {2,5}, {3,5}, {4,5}, {5,5}, {7,5}, {3,6}, {7,6}, {0,7}, {1,7}, {3,7}, {4,7}, {5,7}, {6,7}, {7,7}};
	//private static int[][] blocked_xy_face = {{1,0}, {7,0}, {1,1}, {2,1}, {3,1}, {4,1}, {5,1}, {7,1}, {3,2}, {7,2}, {1,3}, {3,3}, {5,3}, {7,3}, {1,4}, {3,4}, {5,4}, {0,5}, {1,5}, {3,5}, {5,5}, {6,5}, {7,5}, {8,5}, {1,6}, {3,6}, {1,7}, {3,7}, {4,7}, {5,7}, {7,7}, {7,8}};
	
	private static int[][] blocked_xz_face = {{0,5},{1,2},{1,6},{2,3},{2,5},{3,4},{3,8},{4,1},{4,7},{5,2},{5,4},{6,3},{6,7},{7,0},{7,4},{7,6},
		{1,1}, {1,3}, {1,5}, {1,7}, {3,1}, {3,3}, {3,5}, {3,7}, {5,1}, {5,3}, {5,5}, {5,7}, {7,1}, {7,3}, {7,5}, {7,7}};
	private static int[][] blocked_yz_face = {{0,5},{1,0},{1,2},{1,8},{2,5},{3,4},{4,1},{4,7},{5,2},{5,4},{5,6},{6,1},{7,0},{7,4},{7,6},{8,5},
		{1,1}, {1,3}, {1,5}, {1,7}, {3,1}, {3,3}, {3,5}, {3,7}, {5,1}, {5,3}, {5,5}, {5,7}, {7,1}, {7,3}, {7,5}, {7,7}};
	private static int[][] blocked_xy_face = {{0,1},{0,7},{1,6},{2,3},{3,2},{3,4},{4,5},{4,7},{5,2},{6,3},{6,5},{6,7},{7,2},{7,4},{7,6},{8,5},
		{1,1}, {1,3}, {1,5}, {1,7}, {3,1}, {3,3}, {3,5}, {3,7}, {5,1}, {5,3}, {5,5}, {5,7}, {7,1}, {7,3}, {7,5}, {7,7}};

	
	/*private int[][] stardardBlocked(int n) {
		//returns the odd blocked squares on an n x n board
		int[][] standard = new int[(n/2)*(n/2)][];
		int i=0;
		int j=0;
		for(i=0; i< n/2 +1; i+=1) {
			for(j=0; j< n/2 + 1; j+=1) {
				standard[n/2*i +j][0] = 2*i +1;
				standard[n/2*i +j][0] = 2*j +1;
			}
		}
		return standard;
	}
	*/
	
	public int[] start = {2,2,2};
	public int[] end = {4,8,8};
	public boolean findbest = false;
	
	
}
