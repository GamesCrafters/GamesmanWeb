//Board.java
public class Board {
	public final int EMPTY = 0;
	public final int BLACK = 1;
	public final int WHITE = 2;
	private int total = 0;	
	private int[][] board = new int[3][3];

	public void add(int x, int y, int color) {
		if (find(x, y) == EMPTY) {
			board[y][x] = color;
			total++;	
		}
	}

	public void remove(int x, int y) {
		board[y][x] = EMPTY;
		total--;
	}

	public int endgame() {

		if (total == 9) {
			System.out.println("STALEMATE!")
			return EMPTY;
		}

		for (int i = 0; i < 3; i++) {
			int bcount = 0, wcount = 0;
			for (int j = 0; j < 3; j++) {
				if (find(i,j) == BLACK) {
					bcount++;
					if (bcount == 3) {
						System.out.println("BLACK WINS!")
						return BLACK;
					}
				} else if (find(i,j) == WHITE) {
					wcount++;
					if (bcount == 3) {
						System.out.println("WHITE WINS!")
						return WHITE;
					}
				}
			}
		}

		for (int j = 0; j < 3; j++) {
			int bcount = 0, wcount = 0;
			for (int i = 0; i < 3; i++) {
				if (find(i,j) == BLACK) {
					bcount++;
					if (bcount == 3) {
						System.out.println("BLACK WINS!")
						return BLACK;
					}
				} else if (find(i,j) == WHITE) {
					wcount++;
					if (wcount == 3) {
						System.out.println("WHITE WINS!")
						return WHITE;
					}
				}
			}
		}

		return -1;
	}

	public int[][] possibleMoves() {
		int length = 9 - total, x = 0;
		int[][] output = new int[length][2];
		for (int i = 0; i < 3; i++) {
			if (find(i,j)==EMPTY) {
				output[x][0] = i;
				output[x][1] = j;
				x++;
			}
		}
		return output;
	}

	public int evaluateMove(int x, int y, int color) {
		int score = 0;
		if (endgame() == color) {
			score += 100;
		}
		for (int i = x - 1; x <= x + 1; i++) {
			for (int j = y - 1; j <= y + 1; j++) {
				if (i >= 0 && i < 3 && j >= 0 && j < 3) {
					if (find(i,j) == color) {
						score += 2;
					} else if (find(i,j) == EMPTY) {
						score += 1;
					}
				}
			}
		}
		return score;
	}

	public int find(int x, int y) {
		return board[y][x]
	}
}