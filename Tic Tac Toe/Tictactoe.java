//Tictactoe.java
import java.io.*;
public class Tictactoe {
	public final int EMPTY = 0;
	public final int BLACK = 1;
	public final int WHITE = 2;
	private Board board = new Board();
	private BufferedReader bReader = new BufferedReader(new InputStreamReader(System.in));

	private void implement(String move, int color) {
		String[] coord = move.split(",");
		int x = Integer.parseInt(coord[0]), y = Integer.parseInt(coord[1]);
		board.add(x, y, color);
	}

	public static void main(String[] args) {
		Tictactoe game = new Tictactoe();
		System.out.println("TIC TAC TOE");
		System.out.println("Please choose a color: ")
		System.out.flush();
		String color = bReader.readLine();
		String prompt = "Please make a move: ";
		int mycolor = WHITE;
		if (color.equals("WHITE") {
			mycolor = BLACK;
			System.out.print(prompt);
			System.out.flush();
			String in = bReader.readLine();
			game.implement(in);
		}

		Player machine = new Player(mycolor, board)
		while (game.board.endgame() == -1) {
			machine.makeMove();
			System.out.print(prompt);
			System.out.flush();
			String in = bReader.readLine();
			game.implement(in);
		}
	}
}

