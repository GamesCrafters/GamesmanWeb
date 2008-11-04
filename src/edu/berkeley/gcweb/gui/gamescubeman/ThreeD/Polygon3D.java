package edu.berkeley.gcweb.gui.gamescubeman.ThreeD;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Shape;
import java.awt.geom.GeneralPath;
import java.util.ArrayList;

public class Polygon3D implements Comparable<Polygon3D> {
	public Polygon3D() {
		setColors(null, Color.BLACK);
	}
	private AlphaComposite ac; { setOpacity(1); }
	public void setOpacity(float opacity) {
		ac = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, opacity);
	}
	public AlphaComposite getOpacity() {
		return ac;
	}
	private Color fillColor, borderColor; //null means transparent
	public void setColors(Color fill, Color border) {
		fillColor = fill;
		borderColor = border;
	}
	public Color getFillColor() {
		return fillColor;
	}
	public Color getBorderColor() {
		return borderColor;
	}
	
	public Polygon3D clone() {
		Polygon3D poly = new Polygon3D();
		poly.setColors(fillColor, borderColor);
		poly.ac = this.ac;
		for(double[] point : points)
			poly.addPoint(point[0], point[1], point[2]);
		return poly;
	}
	
	private ArrayList<double[]> points;
	public void addPoint(double x, double y, double z) {
		if(points == null)
			points = new ArrayList<double[]>();
		points.add(new double[] { x, y, z });
	}
	public void addPoint(double[] point) {
		addPoint(point[0], point[1], point[2]);
	}
	private double aveZ() {
		double sum = 0;
		for(double[] p : points)
			sum += p[2];
		return sum / points.size();
	}

	public void rotate(RotationMatrix m) {
		for(int i = 0; i < points.size(); i++)
			points.set(i, m.multiply(points.get(i)));
	}
	
	public Polygon3D scale(double x, double y, double z) {
		for(double[] p : points) {
			p[0] *= x;
			p[1] *= y;
			p[2] *= z;
		}
		return this;
	}
	public Polygon3D translate(double x, double y, double z) {
		for(double[] p : points) {
			p[0] += x;
			p[1] += y;
			p[2] += z;
		}
		return this;
	}
	public Polygon3D translate(double[] amt) {
		return translate(amt[0], amt[1], amt[2]);
	}
	
	public Shape projectXYPlane(double z, double scale) {
		GeneralPath poly = new GeneralPath();
		for(double[] p : points) {
			double x = scale*p[0]*z/p[2];
			double y = scale*p[1]*z/p[2];
			if(poly.getCurrentPoint() == null)
				poly.moveTo(x, y);
			else
				poly.lineTo(x, y);
		}
		poly.closePath();
		return poly;
	}
	
	public String toString() {
		StringBuffer sb = new StringBuffer();
		for(double[] p : points) {
			sb.append(" -> (" + p[0] + "," + p[1] + "," + p[2] + ")");
		}
		return sb.substring(4);
	}

	//higher Z -> lower value
	public int compareTo(Polygon3D p) {
		double diff = this.aveZ() - p.aveZ();
		if(diff < 0)
			return 1;
		if(diff > 0)
			return -1;
		return 0;
	}
}
