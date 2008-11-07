package edu.berkeley.gcweb.gui.gamescubeman.ThreeD;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;

public class RotationMatrix {
	private int SIZE = 3;
	private double[][] data;
	public RotationMatrix() {
		 data = new double[SIZE][SIZE];
		 for(int j = 0; j < SIZE; j++)
			 data[j][j] = 1; //constructing the identity matrix
	}
	private RotationMatrix(double[][] data) {
		this.data = data;
	}
	public RotationMatrix(int axis, double degreesCCW) {
		this.data = new double[SIZE][SIZE];
		ArrayList<Integer> rows = new ArrayList<Integer>(Arrays.asList(0, 1, 2));
		rows.remove(new Integer(axis));
		double sin = (axis == 1 ? -1 : 1) * Math.sin(Math.toRadians(degreesCCW));
		double cos = Math.cos(Math.toRadians(degreesCCW));
		for(int c = 0; c < SIZE; c++) {
			if(c == axis) {
				data[c][c] = 1;
			} else {
				data[rows.get(0)][c] = cos;
				data[rows.get(1)][c] = sin;
				double s = sin;
				sin = cos;
				cos = -s;
			}
		}
	}
	public RotationMatrix multiply(RotationMatrix m) {
		int matchingSide = this.data[0].length;
		if(matchingSide != m.data.length)
			return null;
		RotationMatrix result = new RotationMatrix(new double[this.data.length][m.data[0].length]);
		for(int i=0; i<result.data.length; i++) {
			for(int j=0; j<result.data[0].length; j++) {
				double dot = 0;
				for(int ch=0; ch<matchingSide; ch++)
					dot += this.data[i][ch] * m.data[ch][j];
				result.data[i][j] = dot;
			}
		}
		return result;
	}
	public double[] multiply(double[] point) {
		return transpose(multiply(new RotationMatrix(transpose(new double[][]{point}))).data)[0];
	}
	private double[][] transpose(double[][] m) {
		double[][] t = new double[m[0].length][m.length];
		for(int i=0; i<t.length; i++)
			for(int j=0; j<t[0].length; j++)
				t[i][j] = m[j][i];
		return t;
	}
	public boolean isIdentity() {
		for(int i=0; i<data.length; i++)
			for(int j=0; j<data[i].length; j++)
				if((i==j && data[i][j] != 1) || (i!=j && data[i][j] != 0))
					return false;
		return true;
	}
	private static final DecimalFormat df = new DecimalFormat("0.000");
	public String toString(double[][] data) {
		StringBuffer sb = new StringBuffer();
		for(int i=0; i<data.length; i++) {
			for(int j=0; j<data[0].length; j++)
				sb.append("  " + df.format(data[i][j]));
			sb.append("\n");
		}
		return "[" + sb.toString().substring(1, sb.length() - 1) + " ]\n";
	}
	public String toString() {
		return toString(data);
	}
}
