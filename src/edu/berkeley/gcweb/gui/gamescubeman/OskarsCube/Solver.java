package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;

class Solver {
	public int[] start;
	public int[] end;
	private int[][] blocked_xz_face;
	private int[][] blocked_xy_face;
	private int[][] blocked_yz_face;
	public int boardsize = 5;

	private LinkedList<Node> queue;
	public HashMap<Integer, Node> move_map;
	public boolean[][][] seen;

	private class Node {
		public int[] board; // the current board [x, y, z]
		ArrayList<int[]> moves; // possible moves such as [-1,0,0], [0,1,0],
								// etc...
		public int remoteness; // the distance from the solution

		public Node(int[] this_board, int old_remoteness) {
			remoteness = old_remoteness + 1;
			board = this_board;
			moves = generate_moves(this_board);
		}

		private ArrayList<int[]> generate_moves(int[] board) {
			int[][] possible_moves = { { 1, 0, 0 }, { -1, 0, 0 }, { 0, 1, 0 },
					{ 0, -1, 0 }, { 0, 0, 1 }, { 0, 0, -1 } };
			ArrayList<int[]> legal_moves = new ArrayList<int[]>();
			for (int[] possible : possible_moves) {
				if (!is_illegal(possible))
					legal_moves.add(possible);
			}
			return legal_moves;
		}

		private boolean is_illegal(int[] move) {
			int[] test_board = { board[0] + move[0], board[1] + move[1],
					board[2] + move[2] };
			if (test_board[0] < 0)
				return true;
			if (test_board[1] < 0)
				return true;
			if (test_board[2] < 0)
				return true;
			if (test_board[0] > (boardsize-1)*2)
				return true;
			if (test_board[1] > (boardsize-1)*2)
				return true;
			if (test_board[2] > (boardsize-1)*2)
				return true;
			if (face_list_contains(test_board))
				return true;
			return false;
		}

		private boolean face_list_contains(int[] board) {
			for (int[] blocked_face : blocked_xy_face) {
				if (blocked_face[0] == board[0] && blocked_face[1] == board[1])
					return true;
			}
			for (int[] blocked_face : blocked_yz_face) {
				if (blocked_face[0] == board[1] && blocked_face[1] == board[2])
					return true;
			}
			for (int[] blocked_face : blocked_xz_face) {
				if (blocked_face[0] == board[0] && blocked_face[1] == board[2])
					return true;
			}
			return false;
		}
	}

	/* SOLVER CODE BEGINS HERE */
	public Solver(CubeGen cube) {
		
		System.out.println("Solving");
		
		int boardsize = cube.boardsize;
		
		blocked_xz_face = cube.Blue;
		blocked_xy_face = cube.Red;
		blocked_yz_face = cube.White;
		
		seen = new boolean[cube.boardsize][cube.boardsize][cube.boardsize];
		int a=0, b=0, c=0;
		for (a =0; a < boardsize; a++) {
			for (b=0; b < boardsize; b++) {
				for (c=0; c < boardsize; c++) {
					seen[a][b][c] =false;
				}
			}
		}
		
		start = cube.start;
		end = cube.end;
		
		
		
		move_map = new HashMap<Integer, Node>();
		queue = new LinkedList<Node>();
		Node goal_node = new Node(end, -1); // we initialize at -1 so that the
											// goal remoteness is 0
		queue.add(goal_node);
		solvin_thang();
		
		if (cube.findbest) {
			int xp, yp, zp;
			int xbests=0, ybests=0, zbests=0, xbeste=0, ybeste=0, zbeste=0;
			int maxoverallends = -2;
			int count=0;
			for (xp = 0; xp < boardsize; xp++) {
				for (yp = 0; yp < boardsize; yp++) {
					for (zp = 0; zp < boardsize; zp++) {
						if (seen[xp][yp][zp] == true) {
							continue;
						} else if (!cube.findbestc) {
							xp = boardsize;
							yp = boardsize;
							zp = boardsize;
						} else {
							end = new int[] { 2 * xp, 2 * yp, 2 * zp };
							count +=1;
						}
						int x, y, z, max;
						max = -2;
						int bx = 0, by = 0, bz = 0; //stores max remoteness for this start
						for (x = 0; x < boardsize; x++) {
							for (y = 0; y < boardsize; y++) {
								for (z = 0; z < boardsize; z++) {
									int[] temp = { 2 * x, 2 * y, 2 * z };
									if (move_map.containsKey(2 * x * boardsize*boardsize*4 + 2 * y * boardsize*2 + 2
											* z)) {
										seen[x][y][z] = true;
										if (getRemoteness(temp) > max) {
											max = getRemoteness(temp);
											bx = x;
											by = y;
											bz = z;
										}
									}
								}
							}
						}
						end = new int[] { 2 * bx, 2 * by, 2 * bz };
						move_map = new HashMap<Integer, Node>();
						queue = new LinkedList<Node>();
						goal_node = new Node(end, -1); // we initialize at -1 so that the
						// goal remoteness is 0
						//We then resolve from here to find the longest possible path
						queue.add(goal_node);
						solvin_thang();
						max = -2;
						int bpx = 0;
						int bpy = 0;
						int bpz = 0;
						for (x = 0; x < boardsize; x++) {
							for (y = 0; y < boardsize; y++) {
								for (z = 0; z < boardsize; z++) {
									int[] temp = { 2 * x, 2 * y, 2 * z };
									if (move_map.containsKey(2 * x * boardsize*boardsize*4 + 2 * y * boardsize*2 + 2* z))
										if (getRemoteness(temp) > max) {
											max = getRemoteness(temp);
											bpx = x;
											bpy = y;
											bpz = z;
										}
								}
							}
						}
						if (max > maxoverallends) {
							xbests = bx;
							ybests = by;
							zbests = bz;
							xbeste = bpx;
							ybeste = bpy;
							zbeste = bpz;
							maxoverallends = max;
							//System.out.println("(" + bx+ "," +by +"," + bz+ ") (" + bpx+ "," + bpy + "," + bpz + ")");
						}
					}
				}
			}
		
			end = new int[] { 2 * xbests, 2 * ybests, 2 * zbests };
			start = new int[] {2 * xbeste, 2 * ybeste, 2 * zbeste};
			//This start and end is the longest in this piece of the puzzle.
			cube.start = start;
			cube.end = end;
			move_map = new HashMap<Integer, Node>();
			queue = new LinkedList<Node>();
			goal_node = new Node(end, -1); // we initialize at -1 so that the
												// goal remoteness is 0
			queue.add(goal_node);
			solvin_thang();
			int[] temp = { 2 * xbeste, 2 * ybeste, 2 * zbeste };
			System.out.println("Searched " + count + " subcomponents, best remoteness " + maxoverallends/2);
		}

	}

	private void solvin_thang() {
		// pop the first thing off the queue
		// check if its in the hashmap
		// if it is, just continue
		// otherwise, start by adding it to the hash map
		// then create nodes for each of its children not in the hash map
		// add those nodes to the queue
		while (!queue.isEmpty()) {
			Node head = queue.removeFirst();
			int the_key = head.board[0] * boardsize*boardsize*4 + head.board[1] * boardsize*2
					+ head.board[2];
			if (move_map.containsKey(the_key))
				continue;
			move_map.put(the_key, head);
			for (int[] legal_move : head.moves) {
				int[] new_board = { head.board[0] + legal_move[0],
						head.board[1] + legal_move[1],
						head.board[2] + legal_move[2] };
				int new_key = new_board[0] * boardsize*boardsize*4 + new_board[1] * boardsize*2
						+ new_board[2];
				if (move_map.containsKey(new_key))
					continue;
				Node new_node = new Node(new_board, head.remoteness);
				queue.add(new_node);
			}
		}
	}

	public boolean isValidMove(int[] board, int[] move) {
		int key = board[0] * boardsize*boardsize*4 + board[1] * boardsize*2 + board[2];
		if (move_map.containsKey(key)) {
			for (int[] legal_move : move_map.get(key).moves) {
				if (legal_move[0] == move[0] && legal_move[1] == move[1]
						&& legal_move[2] == move[2])
					return true;
			}
		}
		return false;
	}

	public int getRemoteness(int[] board) {
		int key = board[0] * boardsize*boardsize*4 + board[1] * boardsize*2 + board[2];
		if(move_map.containsKey(key)) {
			return move_map.get(key).remoteness;
		}
		return 0;
	}

	public int[] getNextBestMove(int[] board) {
		int key = board[0] * boardsize*boardsize*4 + board[1] * boardsize*2 + board[2];
		int[] best_move = { -5, -5, -5 };
		int least_remoteness = 99999999;
		for (int[] legal_move : move_map.get(key).moves) {
			int[] new_board = { board[0] + legal_move[0],
					board[1] + legal_move[1], board[2] + legal_move[2] };
			int new_key = new_board[0] * boardsize*boardsize*4 + new_board[1] *  boardsize*2 + new_board[2];
			int new_remoteness = move_map.get(new_key).remoteness;
			if (new_remoteness < least_remoteness) {
				least_remoteness = new_remoteness;
				best_move = legal_move;
			}
		}
		return best_move;
	}
	
	public String getBestMove(int[] board) {
		int key = board[0] * boardsize*boardsize*4 + board[1] * boardsize*2 + board[2];
		int[] best_move = { -5, -5, -5 };
		int least_remoteness = 99999999;
		for (int[] legal_move : move_map.get(key).moves) {
			int[] new_board = { board[0] + legal_move[0],
					board[1] + legal_move[1], board[2] + legal_move[2] };
			int new_key = new_board[0] * boardsize*boardsize*4 + new_board[1] *  boardsize*2 + new_board[2];
			int new_remoteness = move_map.get(new_key).remoteness;
			if (new_remoteness < least_remoteness) {
				least_remoteness = new_remoteness;
				best_move = legal_move;
			}
		}
		if (best_move[0] == 1 && best_move[1] == 0 && best_move[2] == 0)
			return "away from WHITE";
		if (best_move[0] == -1 && best_move[1] == 0 && best_move[2] == 0)
			return "towards WHITE";
		if (best_move[0] == 0 && best_move[1] == 1 && best_move[2] == 0)
			return "away from BLUE";
		if (best_move[0] == 0 && best_move[1] == -1 && best_move[2] == 0)
			return "towards BLUE";
		if (best_move[0] == 0 && best_move[1] == 0 && best_move[2] == 1)
			return "away from RED";
		if (best_move[0] == 0 && best_move[1] == 0 && best_move[2] == -1)
			return "towards RED";
		return "LEFT"; //This means failure
	}

	public static void main(String[] args) {
	
		CubeGen cube = new CubeGen(false, false, false, 5);
		Solver test = new Solver(cube);
		
	}
}