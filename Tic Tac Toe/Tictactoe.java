//Tictactoe.java
import java.io.*;
public class Tictactoe {
    public final static int EMPTY = 0;
    public final static int BLACK = 1;
    public final static int WHITE = 2;
    private Board board = new Board();
    private BufferedReader bReader = new BufferedReader(new InputStreamReader(System.in));

    private void implement(String move, int color) {
        String[] coord = move.split(",");
        int x = Integer.parseInt(coord[0]), y = Integer.parseInt(coord[1]);
        board.add(x, y, color);
    }

    public static void main(String[] args) throws Exception {
        Tictactoe game = new Tictactoe();
        System.out.println("-----------");
        System.out.println("TIC TAC TOE");
        System.out.println("-----------");
        System.out.print("Please choose a color: ");
        System.out.flush();
        String color = game.bReader.readLine();
        String prompt = "Please make a move: ";
        int mycolor = WHITE, other = BLACK;
        if (color.equals("WHITE")) {
            mycolor = BLACK;
            other = WHITE;
            System.out.print(prompt);
            System.out.flush();
            String in = game.bReader.readLine();
            game.implement(in, other);
        }

        Player machine = new Player(mycolor, game.board);
        while (game.board.endgame() == -1) {
            machine.makeMove();
            System.out.print(prompt);
            System.out.flush();
            String in = game.bReader.readLine();
            game.implement(in, other);
        }
    }
}

