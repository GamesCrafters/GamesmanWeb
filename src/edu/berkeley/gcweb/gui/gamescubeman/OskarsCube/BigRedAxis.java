package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import java.awt.Color;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;

public class BigRedAxis {
	public PolygonCollection holder;
	public PolygonCollection xyholder;
	public PolygonCollection yzholder;
	public PolygonCollection xzholder;

	/*
	 * public BigRedAxis(CubeGen cube){ PolygonCollection stick_1 = new
	 * Stick().returnItem(); PolygonCollection stick_2 = new
	 * Stick().returnItem(); PolygonCollection stick_3 = new
	 * Stick().returnItem(); stick_1.rotate('x', 90); stick_1.translate(10, 10,
	 * -1); stick_2.rotate('y', 90); stick_3.translate(10, 0, -11); //rotate the
	 * sticks here Object[] input_array = {stick_1, stick_2, stick_3}; holder =
	 * new PolygonCollection(input_array); holder.translate(-14.5, 3.5, -3.5);
	 * holder.translate(cube.start[0], -cube.start[1], cube.start[2]); }
	 */
	public BigRedAxis(CubeGen cube) {
		int x = cube.start[0] + 1;
		int y = -cube.start[1] - 1;
		int z = cube.start[2] + 1;
		double s = 5.5;

		Polygon3D yellowdot1 = new Polygon3D(); // THIS IS WHITE
		yellowdot1.setFillColor(Color.yellow);
		yellowdot1.addPoint(-s, y + s, z - s);
		yellowdot1.addPoint(-s, y + s - 1, z - s);
		yellowdot1.addPoint(-s, y + s - 1, z - s + 1);
		yellowdot1.addPoint(-s, y + s, z - s + 1);

		Polygon3D yellowdot3 = new Polygon3D(); // THIS IS BLUE
		yellowdot3.setFillColor(Color.YELLOW);
		yellowdot3.addPoint(x - s, s, z - s);
		yellowdot3.addPoint(x - s + 1, s, z - s);
		yellowdot3.addPoint(x - s + 1, s, z - s + 1);
		yellowdot3.addPoint(x - s, s, z - s + 1);

		Polygon3D yellowdot5 = new Polygon3D();
		yellowdot5.setFillColor(Color.YELLOW); // THIS IS RED
		yellowdot5.addPoint(x - s, y + s, -s);
		yellowdot5.addPoint(x - s + 1, y + s, -s);
		yellowdot5.addPoint(x - s + 1, y + s - 1, -s);
		yellowdot5.addPoint(x - s, y + s - 1, -s);

		Object[] input_array = { yellowdot1, yellowdot3, yellowdot5 };
		Object[] input_array_xy = { yellowdot1 };
		Object[] input_array_yz = { yellowdot3 };
		Object[] input_array_xz = { yellowdot5 };
		holder = new PolygonCollection(input_array);
		xyholder = new PolygonCollection(input_array_xy);
		yzholder = new PolygonCollection(input_array_yz);
		xzholder = new PolygonCollection(input_array_xz);

	}

	public Polygon3D[] extract() {
		return holder.extract_polygons();
		// return holder2.extract_polygons();
	}
}