package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.Color;
import java.awt.GridLayout;
import java.io.File;
import java.lang.reflect.Array;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Random;

import javax.swing.BoxLayout;
import javax.swing.JComponent;
import javax.swing.JPanel;

public class Utils {
	private static File root;
	public static File getRootDirectory() {
		if (root == null) {
			try {
				root = new File(Utils.class.getProtectionDomain().getCodeSource().getLocation().toURI());
				if(root.isFile())
					root = root.getParentFile();
			} catch (URISyntaxException e) {
				e.printStackTrace();
			}
		}
		return root;
	}

	//needed because java's modulo is weird with negative values
	//assumes m > 0
	public static int modulo(int x, int m) {
		int y = x % m;
		if(y >= 0) return y;
		return y + m;
	}
	
	public static int max(int... a) {
		int max = a[0];
		for(int i : a)
			if(i > max)
				max = i;
		return max;
	}
	
	public static<P> void swap(ArrayList<P> a, int i, int j) {
		P temp = a.get(i);
		a.set(i, a.get(j));
		a.set(j, temp);
	}
	
	public static<H> H[] copyOf(H[] arr, int len) {
		int nonNullIndex = -1;
		for(int i=0; i < arr.length; i++)
			if(arr[i] != null) {
				nonNullIndex = i;
				break;
			}
		ArrayList<H> list = new ArrayList<H>();
		for(int i=0; i<len; i++) list.add(null);
		H[] copy = (H[]) list.toArray((H[]) Array.newInstance(arr[nonNullIndex].getClass(), 0));
		for(int i=0; i<len; i++)
			copy[i] = arr[i];
		return copy;
	}
	
	public static String join(String join, int[] os) {
		String temp = "";
		for(int o : os)
			temp += join + o;
		if(temp.length() == 0) return temp;
		return temp.substring(join.length());
	}
	public static String join(String join, Object[] os) {
		String temp = "";
		for(Object o : os)
			temp += join + o.toString();
		if(temp.length() == 0) return temp;
		return temp.substring(join.length());
	}
	public static<H> H moduloAcces(H[] arr, int i) {
		return arr[modulo(i, arr.length)];
	}
	public static int indexOf(Object o, Object[] arr) {
		for(int i=0; arr != null && i<arr.length; i++)
			if(arr[i] == o)
				return i;
		return -1;
	}
	
	public static void reverse(int[] arr) {
		for(int left=0, right=arr.length-1; left<right; left++, right--) {
			// exchange the first and last
			int temp = arr[left]; arr[left] = arr[right]; arr[right] = temp;
		}
	}
	
	public static void reverse(Object[] arr) {
		for(int left=0, right=arr.length-1; left<right; left++, right--) {
			// exchange the first and last
			Object temp = arr[left]; arr[left] = arr[right]; arr[right] = temp;
		}
	}
	
	private static final Random r = new Random();
	public static<H> H choose(ArrayList<H> arr) {
		return arr.get(r.nextInt(arr.size()));
	}

	public static JPanel sideBySide(JComponent... cs) {
		return sideBySide(false, cs);
	}
	public static JPanel sideBySide(boolean resize, JComponent... cs) {
		JPanel p = new JPanel();
		if(resize)
			p.setLayout(new GridLayout(1, 0));
		else
			p.setLayout(new BoxLayout(p, BoxLayout.LINE_AXIS));
		p.setBackground(Color.WHITE);
		for(JComponent c : cs)
			p.add(c);
		return p;
	}
	
	public static String colorToString(Color c) {
		if(c == null)
			return "";
		return padWith0s(Integer.toHexString(c.getRGB() & 0xffffff));
	}
	private static String padWith0s(String s) {
		int pad = 6 - s.length();
		if(pad > 0) {
			for(int i = 0; i < pad; i++)
				s = "0" + s;
		}
		return s;
	}
	public static Color stringToColor(String s, boolean nullIfInvalid) {
		try {
			return new Color(Integer.parseInt(s, 16));
		} catch(Exception e) {
			return nullIfInvalid ? null : Color.WHITE;
		}
	}
	
	public static boolean parseBoolean(String val, boolean def) {
		if(val == null)
			return def;
		if(val.equalsIgnoreCase("true"))
			return true;
		else if(val.equalsIgnoreCase("false"))
			return false;
		return def;
	
	}
}
