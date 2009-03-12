package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.newOskars;
import java.util.LinkedList;
import java.util.HashMap;
import java.util.ArrayList;

class Solver{
	private static final int[] start = {0,8,4}; //I lifted the start and end positions from your code even though they aren't the ACTUAL positions, but whatever, yea?
	private static final int[] end = {6,2,2};
	//private static int[][] blocked_xz_face = {{3,0}, {1,1}, {2,1}, {3,1},{5,1}, {6,1}, {7,1}, {3,2}, {5,2}, {0,3}, {1,3}, {3,3}, {4,3}, {5,3}, {7,3}, {1,4}, {7,4}, {1,5}, {3,5}, {4,5},{5,5}, {6,5}, {7,5}, {1,6}, {5, 6}, {1,7}, {2,7}, {3,7}, {4,7}, {5,7}, {7,7}, {8,7}};  //copied and pasted from your code
	//private static int[][] blocked_yz_face = {{0,1}, {1,1}, {3,1}, {4,1}, {5,1}, {6,1}, {7,1}, {1,2}, {7,2}, {1,3}, {3,3}, {4,3}, {5,3}, {6,3}, {7,3}, {8,3}, {3,4}, {7,4}, {1,5}, {2,5}, {3,5}, {5,5}, {6,5}, {7,5}, {3,6}, {5,6}, {7,6}, {0,7}, {1,7}, {3,7}, {5,7}, {7,7}};
	//private static int[][] blocked_xy_face = {{3,0}, {1,1}, {2,1}, {3,1}, {4,1}, {5,1}, {7,1}, {8,1}, {7,2}, {1,3}, {2,3},{3,3}, {4,3}, {5,3}, {6,3}, {7,3}, {1,4}, {7,4}, {1,5}, {3,5}, {4,5}, {5,5}, {7,5}, {3,6}, {0,7}, {1,7}, {3,7}, {5,7}, {6,7}, {7,7}, {8,7}, {3,8}};
	//private static int[][] blocked_xz_face = {{1,0}, {7,0}, {1,1}, {2,1}, {3,1}, {5,1}, {7,1}, {5,2}, {1,3}, {3,3}, {4,3}, {5,3}, {6,3}, {7,3}, {1,4}, {3,4}, {1,5}, {3,5}, {5,5}, {6,5}, {7,5}, {1,6}, {3,6}, {5,6}, {1,7}, {2,7}, {3,7}, {4,7}, {5,7}, {6,7}, {7,7}, {3,8}};
	//private static int[][] blocked_yz_face = {{5,0}, {1,1}, {2,1}, {3,1}, {5,1}, {6,1}, {7,1}, {3,2}, {5,2}, {1,3}, {3,3}, {4,3}, {5,3}, {7,3}, {8,3}, {1,4}, {7,4}, {1,5}, {2,5}, {3,5}, {4,5}, {5,5}, {7,5}, {3,6}, {7,6}, {0,7}, {1,7}, {3,7}, {4,7}, {5,7}, {6,7}, {7,7}};
	//private static int[][] blocked_xy_face = {{1,0}, {7,0}, {1,1}, {2,1}, {3,1}, {4,1}, {5,1}, {7,1}, {3,2}, {7,2}, {1,3}, {3,3}, {5,3}, {7,3}, {1,4}, {3,4}, {5,4}, {0,5}, {1,5}, {3,5}, {5,5}, {6,5}, {7,5}, {8,5}, {1,6}, {3,6}, {1,7}, {3,7}, {4,7}, {5,7}, {7,7}, {7,8}};
	private static int[][] blocked_xz_face;
	private static int[][] blocked_xy_face;
	private static int[][] blocked_yz_face;
	
	
	private LinkedList<Node> queue;
	public  HashMap<Integer, Node> move_map;
	private class Node{
		public int[] board;  //the current board [x, y, z]
		ArrayList<int[]> moves; //possible moves such as [-1,0,0], [0,1,0], etc...
		public int remoteness; //the distance from the solution
		public Node(int[] this_board, int old_remoteness){
			remoteness = old_remoteness + 1;
			board = this_board;
			moves = generate_moves(this_board);
		}
		private ArrayList<int[]> generate_moves(int[] board){
			int[][] possible_moves = {{1,0,0}, {-1,0,0}, {0,1,0}, {0,-1,0}, {0,0,1}, {0,0,-1}};
			ArrayList<int[]> legal_moves = new ArrayList<int[]>();
			for (int[] possible : possible_moves){
				if (!is_illegal(possible))
					legal_moves.add(possible);
			}
			return legal_moves;
		}
		private boolean is_illegal(int[] move){
			int[] test_board = {board[0]+move[0], board[1]+move[1], board[2]+move[2]};
	        if (test_board[0] < 0)
	    	    return true;
	    	if (test_board[1] < 0)
	    	    return true;
	    	if (test_board[2] < 0)
	    	    return true;
	    	if (test_board[0] > 8)
	    	    return true;
	    	if (test_board[1] > 8) 
	    	    return true;
	    	if (test_board[2] > 8) 
	    	    return true;
	    	if (face_list_contains(test_board))
	    		return true;
	    	return false;
		}
	   private boolean face_list_contains(int[] board){
		   for (int[] blocked_face : Solver.blocked_xy_face){
			   if (blocked_face[0] == board[0] && blocked_face[1] == board[1])
				   return true;
		   }
		   for (int[] blocked_face : Solver.blocked_yz_face){
			   if (blocked_face[0] == board[1] && blocked_face[1] == board[2])
				   return true;
		   }
		   for (int[] blocked_face : Solver.blocked_xz_face){
			   if (blocked_face[0] == board[0] && blocked_face[1] == board[2])
				   return true;
		   }
		   return false;
	   }
	}
	/* SOLVER CODE BEGINS HERE */
	public Solver(CubeGen cube){
		//first we init by declaring the hashset and queue and cubefaces.
		//next we soooolve away
		
		blocked_xz_face = cube.Blue;
		blocked_xy_face = cube.Red;
		blocked_yz_face = cube.White;
		
		
		move_map = new HashMap<Integer, Node>();
		queue = new LinkedList<Node>();
		Node goal_node = new Node(Solver.end, -1); //we initalize at -1 so that the goal remoteness is 0
		queue.add(goal_node);
		solvin_thang();
	}
	private void solvin_thang(){
		//pop the first thing off the queue
		//check if its in the hashmap
		//if it is, just continue
		//otherwise, start by adding it to the hash map
		//then create nodes for each of its children not in the hash map
		//add those nodes to the queue
		while (!queue.isEmpty()){
			Node head = queue.removeFirst();
			int the_key = head.board[0]*100+head.board[1]*10+head.board[2];
			if (move_map.containsKey(the_key))
				continue;
			move_map.put(the_key, head);
			//System.out.println("New node found: (" + head.board[0]+","+head.board[1]+","+head.board[2]+")");
			for (int[] legal_move : head.moves){
				int[] new_board = {head.board[0] + legal_move[0], head.board[1] + legal_move[1], head.board[2] + legal_move[2]};
				int new_key = new_board[0]*100+new_board[1]*10+new_board[2];
				if (move_map.containsKey(new_key))
					continue;
				Node new_node = new Node(new_board, head.remoteness);
				queue.add(new_node);
			}
		}
	}
	
	public boolean isValidMove(int[] board, int[] move){
		int key = board[0]*100+board[1]*10+board[2];
		if (move_map.containsKey(key)){
			for (int[] legal_move : move_map.get(key).moves){
				if (legal_move[0] == move[0] && legal_move[1] == move[1] && legal_move[2] == move[2])
					return true;
			}
		}
		return false;
	}
	
	public int getRemoteness(int[] board){
		int key = board[0]*100+board[1]*10+board[2];
		return move_map.get(key).remoteness;
	}
	
	public String getBestMove(int[] board){
		int key = board[0]*100+board[1]*10+board[2];
		int[] best_move = {-5,-5,-5};
		int least_remoteness = 99999999;
		for(int[] legal_move : move_map.get(key).moves){
			int[] new_board = {board[0]+legal_move[0], board[1]+legal_move[1], board[2]+legal_move[2]};
			int new_key = new_board[0]*100+new_board[1]*10+new_board[2];
			int new_remoteness = move_map.get(new_key).remoteness;
			if (new_remoteness < least_remoteness){
				least_remoteness = new_remoteness;
				best_move = legal_move;
			}
		}
		if (best_move[0] == 1 && best_move[1] == 0 && best_move[2] == 0)
			return "towards BLUE";
		if (best_move[0] == -1 && best_move[1] == 0 && best_move[2] == 0)
			return "away from BLUE";
		if (best_move[0] == 0 && best_move[1] == 1 && best_move[2] == 0)
			return "away from RED";
		if (best_move[0] == 0 && best_move[1] == -1 && best_move[2] == 0)
			return "towards RED";
		if (best_move[0] == 0 && best_move[1] == 0 && best_move[2] == 1)
			return "away from WHITE";
		if (best_move[0] == 0 && best_move[1] == 0 && best_move[2] == -1)
			return "towards WHITE";
		return "LEFT"; //whatever
	}
	public static void main(String[] args){
		//System.out.println("Starting Run");
		CubeGen cube = new CubeGen(0,0,0);
		Solver test = new Solver(cube);
		//if (test.move_map.containsKey(0))
		//	System.out.println("(0,0,0) is in the database");
		//System.out.println("Run Finished");
	}
}