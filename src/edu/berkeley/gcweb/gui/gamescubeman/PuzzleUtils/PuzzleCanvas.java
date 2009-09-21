package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.Color;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.HashMap;

import javax.swing.JLayeredPane;
import javax.swing.JPanel;

import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.NColorChooser.ColorChangeListener;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Canvas3D;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Polygon3D;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Canvas3D.PolyClickListener;

public class PuzzleCanvas extends JLayeredPane implements KeyListener, ColorChangeListener, PolyClickListener {
	private TwistyPuzzle puzzle;
	private Canvas3D canvas;
	private NColorChooser colorChooser;
	public PuzzleCanvas(AppletSettings settings, TwistyPuzzle puzzle, JPanel... options) {
		this.puzzle = puzzle;
		canvas = new Canvas3D();
		canvas.addKeyListener(this);
		canvas.addPolyClickListener(this);
		canvas.addShape3D(puzzle);
		
		this.add(canvas, new Integer(0));
		colorChooser = new NColorChooser(settings, puzzle.getDefaultColorScheme(), canvas);
		colorChooser.addColorChangeListener(this);
		colorChooser.setVisible(false);
		this.add(colorChooser, new Integer(1));
		for(JPanel p : options)
			this.add(p, new Integer(1));
		this.addComponentListener(new ComponentAdapter() {
			public void componentResized(ComponentEvent e) {
				canvas.setBounds(0, 0, e.getComponent().getWidth(), e.getComponent().getHeight());
			}
		});
	}
	
	public void setColorEditing(boolean colorEditing) {
		canvas.setColorEditing(colorEditing);
		colorChooser.setVisible(colorEditing);
	}
	
	public void colorsChanged(HashMap<String, Color> colorScheme) {
		PuzzleSticker.setColorScheme(colorScheme);
		canvas.fireCanvasChange();
	}
	
	public Canvas3D getCanvas() {
		return canvas;
	}
	
	//TODO - undo-redo
	//TODO - bounds on left hand & right hand, and some visual indicator of where they are
	public void keyPressed(KeyEvent e) {
		puzzle.doTurn(e);
	}
	public void keyReleased(KeyEvent e) {}
	public void keyTyped(KeyEvent e) {
	}
	
	public void polyClicked(Polygon3D clicked) {
		PuzzleSticker sticker = (PuzzleSticker) clicked;
		if(colorChooser.getSelectedFace() != null) {
			sticker.setFace(colorChooser.getSelectedFace());
			puzzle.fireStateChanged(null);
		}
	}
	
}
