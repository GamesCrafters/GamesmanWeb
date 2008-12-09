package edu.berkeley.gcweb.gui.gamescubeman.XYZCube;

public class FaceLayerTurn {
	private Face f;
	public int layer;
	private int cw;
	public FaceLayerTurn(Face f, int layer, int cw) {
		this.f = f;
		this.layer = layer;
		this.cw = cw;
		modCW();
	}
	public boolean isMergeable(FaceLayerTurn other) {
		return other.f == f && layer == other.layer;
	}
	//returns true if the turn is completely cancelled
	public boolean merge(FaceLayerTurn other) {
		cw += other.cw;
		modCW();
		return cw == 0;
	}
	public Face getFace() {
		return f;
	}
	private void modCW() {
		//this'll work so long as cw isn't too negative
		cw = (4 + cw) % 4;
		if(cw == 3) cw = -1;
	}
	public String toString() {
		String face = "" + f.getFaceName();
		if(layer == -1) {
			face = "" + "xyz".charAt(f.getRotationAxis());
		} else if(layer == 2)
			face = face.toLowerCase();
		else if(layer > 2)
			face = layer + " " + face;
		return face + XYZCube.DIRECTION_TURN.get(cw);
	}
}