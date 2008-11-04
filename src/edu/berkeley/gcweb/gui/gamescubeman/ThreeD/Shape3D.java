package edu.berkeley.gcweb.gui.gamescubeman.ThreeD;

import java.util.ArrayList;

public abstract class Shape3D {
	protected double centerX, centerY, centerZ;
	public Shape3D(double x, double y, double z) {
		setCenter(x, y, z);
	}
	public double[] getCenter() {
		return new double[] { centerX, centerY, centerZ };
	}
	public void setCenter(double x, double y, double z) {
		centerX = x;
		centerY = y;
		centerZ = z;
	}
	private ArrayList<Polygon3D> polys = new ArrayList<Polygon3D>();
	protected void clearPolys() {
		polys.clear();
	}
	protected void addPoly(Polygon3D poly) {
		polys.add(poly);
	}
	
	//We're viewing this shape from the origin, looking down
	//the z-axis. It is up to the Shape3D subclass to ensure that our cube doesn't
	//intersect with the viewport (z=1)
	public ArrayList<Polygon3D> getPolygons() {
		ArrayList<Polygon3D> rendered = new ArrayList<Polygon3D>();
		for(Polygon3D poly : polys) {
			poly = poly.clone();
			poly.rotate(rotation);
			poly.translate(centerX, centerY, centerZ);
			rendered.add(poly);
		}
		return rendered;
	}

	private RotationMatrix rotation = new RotationMatrix();
	public void setRotation(RotationMatrix m) {
		if(m == null)
			rotation = new RotationMatrix();
		else
			rotation = m;
	}
	public void rotate(RotationMatrix m) {
		rotation = m.multiply(rotation);
	}
}
