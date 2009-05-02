package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import java.awt.Color;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;

public class BigRedAxis {
	public PolygonCollection holder;
	public PolygonCollection xyholder;
	public PolygonCollection yzholder;
	public PolygonCollection xzholder;
	public PolygonCollection towardW;
	public PolygonCollection towardB;
	public PolygonCollection towardR;
	public PolygonCollection awayW;
	public PolygonCollection awayB;
	public PolygonCollection awayR;
	

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
		double s = cube.boardsize +.5;
		/* These make the arrows, the side with green_b refers to the side with the arrow base */
		double[] green_a = new double[] {0,0,.5,.5,1,.5,.5};
		double[] green_b = new double[] {.25,.75,.75,1,.5,0,.25};
		
		Polygon3D yellowdot_w = new Polygon3D(); // THIS IS WHITE
		yellowdot_w.setFillColor(Color.yellow);
		yellowdot_w.addPoint(-s, y + s, z - s);
		yellowdot_w.addPoint(-s, y + s - 1, z - s);
		yellowdot_w.addPoint(-s, y + s - 1, z - s + 1);
		yellowdot_w.addPoint(-s, y + s, z - s + 1);
		
		Polygon3D greenarrow_w_tb = new Polygon3D();
		greenarrow_w_tb.setFillColor(Color.green);
		greenarrow_w_tb.addPoint(-s, y+s + green_a[0], z-s + green_b[0]);
		greenarrow_w_tb.addPoint(-s, y+s + green_a[1], z-s + green_b[1]);
		greenarrow_w_tb.addPoint(-s, y+s + green_a[2], z-s + green_b[2]);
		greenarrow_w_tb.addPoint(-s, y+s + green_a[3], z-s + green_b[3]);
		greenarrow_w_tb.addPoint(-s, y+s + green_a[4], z-s + green_b[4]);
		greenarrow_w_tb.addPoint(-s, y+s + green_a[5], z-s + green_b[5]);
		greenarrow_w_tb.addPoint(-s, y+s + green_a[6], z-s + green_b[6]);
		
		Polygon3D greenarrow_w_ab = new Polygon3D();
		greenarrow_w_ab.setFillColor(Color.green);
		greenarrow_w_ab.addPoint(-s, y+s-1 - green_a[0], z-s + green_b[0]);
		greenarrow_w_ab.addPoint(-s, y+s-1 - green_a[1], z-s + green_b[1]);
		greenarrow_w_ab.addPoint(-s, y+s-1 - green_a[2], z-s + green_b[2]);
		greenarrow_w_ab.addPoint(-s, y+s-1 - green_a[3], z-s + green_b[3]);
		greenarrow_w_ab.addPoint(-s, y+s-1 - green_a[4], z-s + green_b[4]);
		greenarrow_w_ab.addPoint(-s, y+s-1 - green_a[5], z-s + green_b[5]);
		greenarrow_w_ab.addPoint(-s, y+s-1 - green_a[6], z-s + green_b[6]);
		
		Polygon3D greenarrow_w_ar = new Polygon3D();
		greenarrow_w_ar.setFillColor(Color.green);
		greenarrow_w_ar.addPoint(-s, y+s-1 + green_b[0], z-s+1 + green_a[0]);
		greenarrow_w_ar.addPoint(-s, y+s-1 + green_b[1], z-s+1 + green_a[1]);
		greenarrow_w_ar.addPoint(-s, y+s-1 + green_b[2], z-s+1 + green_a[2]);
		greenarrow_w_ar.addPoint(-s, y+s-1 + green_b[3], z-s+1 + green_a[3]);
		greenarrow_w_ar.addPoint(-s, y+s-1 + green_b[4], z-s+1 + green_a[4]);
		greenarrow_w_ar.addPoint(-s, y+s-1 + green_b[5], z-s+1 + green_a[5]);
		greenarrow_w_ar.addPoint(-s, y+s-1 + green_b[6], z-s+1 + green_a[6]);
		
		Polygon3D greenarrow_w_tr = new Polygon3D();
		greenarrow_w_tr.setFillColor(Color.green);
		greenarrow_w_tr.addPoint(-s, y+s-1 + green_b[0], z-s - green_a[0]);
		greenarrow_w_tr.addPoint(-s, y+s-1 + green_b[1], z-s - green_a[1]);
		greenarrow_w_tr.addPoint(-s, y+s-1 + green_b[2], z-s - green_a[2]);
		greenarrow_w_tr.addPoint(-s, y+s-1 + green_b[3], z-s - green_a[3]);
		greenarrow_w_tr.addPoint(-s, y+s-1 + green_b[4], z-s - green_a[4]);
		greenarrow_w_tr.addPoint(-s, y+s-1 + green_b[5], z-s - green_a[5]);
		greenarrow_w_tr.addPoint(-s, y+s-1 + green_b[6], z-s - green_a[6]);
		

		Polygon3D yellowdot_b = new Polygon3D(); // THIS IS BLUE
		yellowdot_b.setFillColor(Color.YELLOW);
		yellowdot_b.addPoint(x - s, s, z - s);
		yellowdot_b.addPoint(x - s + 1, s, z - s);
		yellowdot_b.addPoint(x - s + 1, s, z - s + 1);
		yellowdot_b.addPoint(x - s, s, z - s + 1);
		
		Polygon3D greenarrow_b_aw = new Polygon3D();
		greenarrow_b_aw.setFillColor(Color.green);
		greenarrow_b_aw.addPoint(x-s+1 + green_a[0],s, z-s + green_b[0]);
		greenarrow_b_aw.addPoint(x-s+1 + green_a[1],s, z-s + green_b[1]);
		greenarrow_b_aw.addPoint(x-s+1 + green_a[2],s, z-s + green_b[2]);
		greenarrow_b_aw.addPoint(x-s+1 + green_a[3],s, z-s + green_b[3]);
		greenarrow_b_aw.addPoint(x-s+1 + green_a[4],s, z-s + green_b[4]);
		greenarrow_b_aw.addPoint(x-s+1 + green_a[5],s, z-s + green_b[5]);
		greenarrow_b_aw.addPoint(x-s+1 + green_a[6],s, z-s + green_b[6]);
		
		Polygon3D greenarrow_b_tw = new Polygon3D();
		greenarrow_b_tw.setFillColor(Color.green);
		greenarrow_b_tw.addPoint(x-s - green_a[0],s, z-s + green_b[0]);
		greenarrow_b_tw.addPoint(x-s - green_a[1],s, z-s + green_b[1]);
		greenarrow_b_tw.addPoint(x-s - green_a[2],s, z-s + green_b[2]);
		greenarrow_b_tw.addPoint(x-s - green_a[3],s, z-s + green_b[3]);
		greenarrow_b_tw.addPoint(x-s - green_a[4],s, z-s + green_b[4]);
		greenarrow_b_tw.addPoint(x-s - green_a[5],s, z-s + green_b[5]);
		greenarrow_b_tw.addPoint(x-s - green_a[6],s, z-s + green_b[6]);
		
		Polygon3D greenarrow_b_ar = new Polygon3D();
		greenarrow_b_ar.setFillColor(Color.green);
		greenarrow_b_ar.addPoint(x-s + green_b[0],s, z-s+1 + green_a[0]);
		greenarrow_b_ar.addPoint(x-s + green_b[1],s, z-s+1 + green_a[1]);
		greenarrow_b_ar.addPoint(x-s + green_b[2],s, z-s+1 + green_a[2]);
		greenarrow_b_ar.addPoint(x-s + green_b[3],s, z-s+1 + green_a[3]);
		greenarrow_b_ar.addPoint(x-s + green_b[4],s, z-s+1 + green_a[4]);
		greenarrow_b_ar.addPoint(x-s + green_b[5],s, z-s+1 + green_a[5]);
		greenarrow_b_ar.addPoint(x-s + green_b[6],s, z-s+1 + green_a[6]);
		
		Polygon3D greenarrow_b_tr = new Polygon3D();
		greenarrow_b_tr.setFillColor(Color.green);
		greenarrow_b_tr.addPoint(x-s+1 - green_b[0],s, z-s - green_a[0]);
		greenarrow_b_tr.addPoint(x-s+1 - green_b[1],s, z-s - green_a[1]);
		greenarrow_b_tr.addPoint(x-s+1 - green_b[2],s, z-s - green_a[2]);
		greenarrow_b_tr.addPoint(x-s+1 - green_b[3],s, z-s - green_a[3]);
		greenarrow_b_tr.addPoint(x-s+1 - green_b[4],s, z-s - green_a[4]);
		greenarrow_b_tr.addPoint(x-s+1 - green_b[5],s, z-s - green_a[5]);
		greenarrow_b_tr.addPoint(x-s+1 - green_b[6],s, z-s - green_a[6]);

		Polygon3D yellowdot_r = new Polygon3D();
		yellowdot_r.setFillColor(Color.YELLOW); // THIS IS RED
		yellowdot_r.addPoint(x - s, y + s, -s);
		yellowdot_r.addPoint(x - s + 1, y + s, -s);
		yellowdot_r.addPoint(x - s + 1, y + s - 1, -s);
		yellowdot_r.addPoint(x - s, y + s - 1, -s);
		
		Polygon3D greenarrow_r_aw = new Polygon3D();
		greenarrow_r_aw.setFillColor(Color.green);
		greenarrow_r_aw.addPoint(x-s+1 + green_a[0], y+s-1 + green_b[0], -s);
		greenarrow_r_aw.addPoint(x-s+1 + green_a[1], y+s-1 + green_b[1], -s);
		greenarrow_r_aw.addPoint(x-s+1 + green_a[2], y+s-1 + green_b[2], -s);
		greenarrow_r_aw.addPoint(x-s+1 + green_a[3], y+s-1 + green_b[3], -s);
		greenarrow_r_aw.addPoint(x-s+1 + green_a[4], y+s-1 + green_b[4], -s);
		greenarrow_r_aw.addPoint(x-s+1 + green_a[5], y+s-1 + green_b[5], -s);
		greenarrow_r_aw.addPoint(x-s+1 + green_a[6], y+s-1 + green_b[6], -s);
		
		Polygon3D greenarrow_r_tw = new Polygon3D();
		greenarrow_r_tw.setFillColor(Color.green);
		greenarrow_r_tw.addPoint(x-s - green_a[0], y+s-1 + green_b[0], -s);
		greenarrow_r_tw.addPoint(x-s - green_a[1], y+s-1 + green_b[1], -s);
		greenarrow_r_tw.addPoint(x-s - green_a[2], y+s-1 + green_b[2], -s);
		greenarrow_r_tw.addPoint(x-s - green_a[3], y+s-1 + green_b[3], -s);
		greenarrow_r_tw.addPoint(x-s - green_a[4], y+s-1 + green_b[4], -s);
		greenarrow_r_tw.addPoint(x-s - green_a[5], y+s-1 + green_b[5], -s);
		greenarrow_r_tw.addPoint(x-s - green_a[6], y+s-1 + green_b[6], -s);
		
		Polygon3D greenarrow_r_ab = new Polygon3D();
		greenarrow_r_ab.setFillColor(Color.green);
		greenarrow_r_ab.addPoint(x-s + green_b[0], y+s-1 - green_a[0], -s);
		greenarrow_r_ab.addPoint(x-s + green_b[1], y+s-1 - green_a[1], -s);
		greenarrow_r_ab.addPoint(x-s + green_b[2], y+s-1 - green_a[2], -s);
		greenarrow_r_ab.addPoint(x-s + green_b[3], y+s-1 - green_a[3], -s);
		greenarrow_r_ab.addPoint(x-s + green_b[4], y+s-1 - green_a[4], -s);
		greenarrow_r_ab.addPoint(x-s + green_b[5], y+s-1 - green_a[5], -s);
		greenarrow_r_ab.addPoint(x-s + green_b[6], y+s-1 - green_a[6], -s);
		
		Polygon3D greenarrow_r_tb = new Polygon3D();
		greenarrow_r_tb.setFillColor(Color.green);
		greenarrow_r_tb.addPoint(x-s + green_b[0], y+s + green_a[0], -s);
		greenarrow_r_tb.addPoint(x-s + green_b[1], y+s + green_a[1], -s);
		greenarrow_r_tb.addPoint(x-s + green_b[2], y+s + green_a[2], -s);
		greenarrow_r_tb.addPoint(x-s + green_b[3], y+s + green_a[3], -s);
		greenarrow_r_tb.addPoint(x-s + green_b[4], y+s + green_a[4], -s);
		greenarrow_r_tb.addPoint(x-s + green_b[5], y+s + green_a[5], -s);
		greenarrow_r_tb.addPoint(x-s + green_b[6], y+s + green_a[6], -s);

		Object[] input_array = { yellowdot_w, yellowdot_b, yellowdot_r,greenarrow_w_tb,greenarrow_w_ab,greenarrow_w_ar,greenarrow_w_tr
				,greenarrow_b_tr,greenarrow_b_aw,greenarrow_b_ar,greenarrow_b_tw
				,greenarrow_r_tb,greenarrow_r_ab,greenarrow_r_tw,greenarrow_r_aw};
		Object[] input_array_xy = { yellowdot_w,greenarrow_w_tb,greenarrow_w_ab,greenarrow_w_ar,greenarrow_w_tr };
		Object[] input_array_yz = { yellowdot_b ,greenarrow_b_tr,greenarrow_b_aw,greenarrow_b_ar,greenarrow_b_tw};
		Object[] input_array_xz = { yellowdot_r, greenarrow_r_tb,greenarrow_r_ab,greenarrow_r_tw,greenarrow_r_aw};
		Object[] input_array_tw = {greenarrow_b_tw,greenarrow_r_tw};
		Object[] input_array_tb = {greenarrow_w_tb,greenarrow_r_tb};
		Object[] input_array_tr = {greenarrow_b_tr,greenarrow_w_tr};
		Object[] input_array_aw = {greenarrow_b_aw,greenarrow_r_aw};
		Object[] input_array_ar = {greenarrow_b_ar,greenarrow_w_ar};
		Object[] input_array_ab = {greenarrow_w_ab,greenarrow_r_ab};
		
		holder = new PolygonCollection(input_array);
		xyholder = new PolygonCollection(input_array_xy);
		yzholder = new PolygonCollection(input_array_yz);
		xzholder = new PolygonCollection(input_array_xz);
		towardW = new PolygonCollection(input_array_tw);
		towardB = new PolygonCollection(input_array_tb);
		towardR = new PolygonCollection(input_array_tr);
		awayW = new PolygonCollection(input_array_aw);
		awayR = new PolygonCollection(input_array_ar);
		awayB = new PolygonCollection(input_array_ab);
		

	}

	public Polygon3D[] extract() {
		return holder.extract_polygons();
	}
	public Polygon3D[] extractTW() {
		return towardW.extract_polygons();
	}
	public Polygon3D[] extractTR() {
		return towardR.extract_polygons();
	}
	public Polygon3D[] extractTB() {
		return towardB.extract_polygons();
	}
	public Polygon3D[] extractAW() {
		return awayW.extract_polygons();
	}
	public Polygon3D[] extractAR() {
		return awayR.extract_polygons();
	}
	public Polygon3D[] extractAB() {
		return awayB.extract_polygons();
	}
}