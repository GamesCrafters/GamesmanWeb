package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.OskarsCube;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.PolygonCollection;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.Stick;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Polygon3D;

public class Interior {

	// the viable positions, and unviable ones appear inside
	public PolygonCollection holder;

	public Interior(Solver solved) {
		int x, y, z;
		int countgreen = 0;
		int countred = 0;
		Object[] input_array = new PolygonCollection[125];
		for (x = 0; x < 5; x++) {
			for (y = 0; y < 5; y++) {
				for (z = 0; z < 5; z++) {
					PolygonCollection cube;
					if (solved.move_map.containsKey(100 * 2 * x + 10 * 2 * y
							+ 2 * z)) {
						// cube = new Stick(1,1).returnItem();
						countgreen += 1;
						// cube.translate(2*x,2*y, 2*z);
						// int a = x*25 + y*5 + z;
						// input_array[a] = cube;
					} else {
						cube = new Stick(1).returnItem();
						countred += 1;
						cube.translate(2 * x, 2 * y, 2 * z);
						int a = x * 25 + y * 5 + z;
						input_array[a] = cube;
					}

				}
			}
		}
		holder = new PolygonCollection(input_array);
		holder.translate(-4.5, -4.5, -4.5);
		// System.out.println("viable: " + countgreen + " unviable: " +
		// countred);
		acheivable = countgreen;
	}

	public Polygon3D[] extract() {
		return holder.extract_polygons();
	}

	public int acheivable;
}
