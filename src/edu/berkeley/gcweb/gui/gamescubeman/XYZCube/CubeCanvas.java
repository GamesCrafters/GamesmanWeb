package edu.berkeley.gcweb.gui.gamescubeman.XYZCube;

import java.awt.Color;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Properties;

import javax.swing.JLayeredPane;
import javax.swing.JPanel;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Canvas3D;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Canvas3D.PolyClickListener;
import edu.berkeley.gcweb.gui.gamescubeman.XYZCube.NColorChooser.ColorChangeListener;

public class CubeCanvas extends JLayeredPane implements KeyListener, ColorChangeListener, PolyClickListener {
	private static Properties keyProps = new Properties();
	{
		try {
			keyProps.load(CubeCanvas.class.getResourceAsStream("keys.properties"));
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	private static File root;
	public static File getRootDirectory() {
		if (root == null) {
			try {
				root = new File(CubeCanvas.class.getProtectionDomain().getCodeSource().getLocation().toURI());
				if(root.isFile())
					root = root.getParentFile();
			} catch (URISyntaxException e) {
				e.printStackTrace();
			}
		}
		return root;
	}
	
	private XYZCube cube;
	private Canvas3D canvas;
	private NColorChooser colorChooser;
	private JPanel cubeOptions;
	public CubeCanvas(XYZCube cube, JPanel options) {
		this.cube = cube;
		canvas = new Canvas3D();
		canvas.addKeyListener(this);
		canvas.addPolyClickListener(this);
		canvas.addShape3D(cube);
		this.cubeOptions = options;
		
		this.add(canvas, new Integer(0));
		colorChooser = new NColorChooser();
		colorChooser.addColorChangeListener(this);
		ArrayList<Color> colors = new ArrayList<Color>();
		for(Face f : Face.faces)
			colors.add(f.getColor());
		colorChooser.setColors(colors.toArray(new Color[0]));
		colorChooser.setVisible(false);
		this.add(colorChooser, new Integer(1));
		this.add(cubeOptions, new Integer(1));
		this.addComponentListener(new ComponentAdapter() {
			public void componentResized(ComponentEvent e) {
				canvas.setBounds(0, 0, e.getComponent().getWidth(), e.getComponent().getHeight());
			}
		});
	}
	
	private boolean colorEditing;
	public boolean isColorEditing() {
		return colorEditing;
	}
	public void setOptionsVisible(boolean colorEditing) {
		cubeOptions.setVisible(colorEditing);
	}
	public void setColorEditing(boolean colorEditing) {
		canvas.setColorEditing(colorEditing);
		colorChooser.setVisible(colorEditing);
	}
	
	public void colorsChanged(Color[] colorScheme) {
		CubeSticker.setColorScheme(colorScheme);
	}
	
	public Canvas3D getCanvas() {
		return canvas;
	}
	
	//TODO - undo-redo
	//TODO - bounds on left hand & right hand, and some visual indicator of where they are
	public void keyPressed(KeyEvent e) {
		String turn = (String) keyProps.get(""+e.getKeyChar());
		if(e.isAltDown() || turn == null) return;
		cube.doTurn(turn);
	}
	public void keyReleased(KeyEvent e) {}
	public void keyTyped(KeyEvent e) {
	}
	
	public void polyClicked(Polygon3D clicked) {
		CubeSticker sticker = (CubeSticker) clicked;
		if(colorChooser.getSelectedFace() != null) {
			sticker.setFace(colorChooser.getSelectedFace());
			cube.fireStateChanged(null);
		}
	}
}
