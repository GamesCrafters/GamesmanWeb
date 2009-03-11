package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.newOskars;



public class ColorSpitter{
	public static String[][] solved_cube = {{"U","R","F"},{"U","F","L"},{"U","B","R"},{"U","L","B"},{"D","F","R"},{"D","L","F"},{"D","R","B"},{"D","B","L"}};
	public static String[][] spit_out_colors(int[] pieces){
		/**
		 * Take in an array of hashed pieces and return a String[][] containing the 
		 * stickers on each side.
		 */
		String[][] actual_colors = new String[8][];
		int location = 0;
		for(int piece : pieces){
			String[] current_chunk = new String[3];
            int real_piece = piece / 3;
            int rotations_from_orientation = piece % 3;
            current_chunk[0] = (solved_cube[real_piece][(0-rotations_from_orientation)%3]); //top piece
            current_chunk[1] = (solved_cube[real_piece][(1-rotations_from_orientation)%3]); //right piece
            current_chunk[2] = (solved_cube[real_piece][(2-rotations_from_orientation)%3]); //left piece
            actual_colors[location] = current_chunk;
            location++;
		}
		return actual_colors;
	}
	public static void main(String[] args){
		System.out.println("Debugging");
		int[] pieces = {9,6,3,0,12,15,18,21};
		String[][] current_state = spit_out_colors(pieces);
		String cube_string = "                                 ___________\n";
		cube_string += "                                 |     |    |\n";
        cube_string += "                    __________   |  "+current_state[2][1]+"  | "+current_state[3][2]+"  |\n";
        cube_string += "   /|              / "+current_state[3][0]+"  / "+current_state[2][0]+"  /|  |_____|____|\n";
        cube_string += "  / |             /____/____/ |  |     |    |\n";
        cube_string += " /| |            / "+current_state[1][0]+"  / "+current_state[0][0]+"  /| |  |  "+current_state[6][2]+"  | "+current_state[7][1]+"  |\n";
        cube_string += "/ |"+current_state[1][2]+"|           /____/____/ |"+current_state[2][2]+"|  |_____|____|\n";
        cube_string += "|"+current_state[3][1]+"| |          |     |    |"+current_state[0][1]+"| |     BACK\n";
        cube_string += "| |/|          |  "+current_state[1][1]+"  | "+current_state[0][2]+"  | |/|\n";
        cube_string += "|/|"+current_state[5][1]+"|          |_____|____|/|"+current_state[6][1]+"|\n";
        cube_string += "|"+current_state[7][2]+"| |          |     |    |"+current_state[4][2]+"| |\n";
        cube_string += "| |/           |  "+current_state[5][2]+"  | "+current_state[4][1]+"  | |/\n";
        cube_string += "|/LEFT         |_____|____|/\n\n\n";
        cube_string += "              __________\n";
        cube_string += "             / "+current_state[5][0]+"  / "+current_state[4][0]+"  /\n";
        cube_string += "            /____/____/\n";
        cube_string += "           / "+current_state[7][0]+"  / "+current_state[6][0]+"  /\n";
        cube_string += "          /____/____/\n";
        cube_string += "              DOWN\n";
        System.out.println(cube_string);
		
	}
}