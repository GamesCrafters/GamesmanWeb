public class Player {

	public final int EMPTY = 0;
	public final int BLACK = 1;
	public final int WHITE = 2;
	private int color;
	private Board board;
	private int opponent;

	public Player(color, board) {
		this.color = color;
		this.board = board;
		this.opponent = BLACK;
		if (color == BLACK) {
			this.opponent = WHITE;
		}
	}

	public int[] chooseMove(int alpha, int beta, int depth, boolean ally) {
		int[] out = new int[3], moves[] = board.possibleMoves();
		int best = 0;
		for (int i = 0; i < moves.length; i++) {
			int x = moves[i][0], y = moves[i][1];
			board.add(x,y,color);
			if (depth > 1) {
				Player foe = new Player(opponent, board)
				int[] reply = foe.chooseMove(alpha, beta, depth - 1, !ally);
			} else {
				reply[0] = x;
				reply[1] = y;
				reply[2] = evaluateBoard(color);
			}
			board.remove(x,y); 
			if (ally && reply[2] > alpha) {
				out = reply;
				alpha = reply[2];
			} else if (!ally && reply[2] < beta) {
				out = reply;
				beta = reply[2];
			}

			if (alpha >= beta) {
				return out;
			} 
		}
		return out;
	}

	public void makeMove() {
		int[] move = chooseMove(Integer.MIN_VALUE, Integer.MAX_VALUE, 3, true);
		int x = move[0], y = move[1];
		board.add(x,y);
		System.out.println("Machine player makes move:(")
		System.out.print(x);
		System.out.print(", ");
		System.out.print(y);
		System.out.println(").");
	}
}