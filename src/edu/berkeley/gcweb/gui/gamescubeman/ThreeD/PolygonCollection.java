package edu.berkeley.gcweb.gui.gamescubeman.ThreeD;

import java.util.ArrayList;

public class PolygonCollection<P extends Polygon3D> extends ArrayList<P> {
	public PolygonCollection() {}
	public PolygonCollection<P> clone() {
		PolygonCollection<P> clone = new PolygonCollection<P>();
		for(P poly : this)
			clone.add((P) poly.clone());
		return clone;
	}
	private RotationMatrix netRotations = new RotationMatrix();
	public RotationMatrix getNetRotations() {
		return netRotations;
	}
	public PolygonCollection<P> rotate(RotationMatrix m) {
		return rotate(m, true);
	}
	public PolygonCollection<P> rotate(RotationMatrix m, boolean storeRotation) {
		if(storeRotation)
			netRotations = m.multiply(netRotations);
		for(P poly : this)
			poly.rotate(m);
		return this;
	}
	public PolygonCollection<P> scale(double x, double y, double z) {
		for(P poly : this)
			poly.scale(x, y, z);
		return this;
	}
	public PolygonCollection<P> translate(double x, double y, double z) {
		for(P poly : this)
			poly.translate(x, y, z);
		return this;
	}
	public PolygonCollection<P> mirror(int axis) {
		for(P poly : this)
			poly.mirror(axis);
		return this;
	}
	public void swap(int index1, int index2) {
		P temp = get(index1);
		set(index1, get(index2));
		set(index2, temp);
	}
}
