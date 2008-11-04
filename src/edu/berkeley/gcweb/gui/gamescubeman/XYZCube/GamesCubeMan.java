package edu.berkeley.gcweb.gui.gamescubeman.XYZCube;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.Random;

import javax.swing.BoxLayout;
import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JSlider;
import javax.swing.JSpinner;
import javax.swing.JTextField;
import javax.swing.SpinnerNumberModel;
import javax.swing.SwingUtilities;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Canvas3D;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.RotationMatrix;

import netscape.javascript.JSObject;

@SuppressWarnings("serial")
public class GamesCubeMan extends JApplet implements ChangeListener, KeyListener, ActionListener, CubeStateChangeListener {
	private XYZCube cube;
	private Canvas3D canvas;
	private JSlider scale, distance, gap;
	private JSpinner[] dimensions;
	private JCheckBox antialiasing;
	private JButton resetView, scramble, resetCube;
	private JTextField stateField;
	
	private JSObject jso;
	public void init() {
		try {
			SwingUtilities.invokeAndWait(new Runnable() {
				public void run() {
					cube = new XYZCube(2, 2, 2);
					cube.setStickerGap(0);
					cube.addStateChangeListener(GamesCubeMan.this);
					canvas = new Canvas3D();
					canvas.addKeyListener(GamesCubeMan.this);
					canvas.addShape3D(cube);
					resetRotation();
					
					JPanel buttons = new JPanel();
					buttons.setLayout(new BoxLayout(buttons, BoxLayout.PAGE_AXIS));
					
					resetView = new JButton("Reset View");
					resetView.setMnemonic(KeyEvent.VK_R);
					resetView.setFocusable(false);
					resetView.addActionListener(GamesCubeMan.this);
					buttons.add(resetView);
					
					resetCube = new JButton("Reset Cube");
					resetCube.setFocusable(false);
					resetCube.addActionListener(GamesCubeMan.this);
					buttons.add(resetCube);
					
					scramble = new JButton("Scramble");
					scramble.setMnemonic(KeyEvent.VK_S);
					scramble.setFocusable(false);
					scramble.addActionListener(GamesCubeMan.this);
					buttons.add(scramble);
					
					antialiasing = new JCheckBox("Antialiasing", canvas.isAntialiasing());
					antialiasing.setMnemonic(KeyEvent.VK_A);
					antialiasing.setFocusable(false);
					antialiasing.addActionListener(GamesCubeMan.this);
					buttons.add(antialiasing);
					
					JPanel sliders = new JPanel();
					sliders.setLayout(new BoxLayout(sliders, BoxLayout.PAGE_AXIS));
					
					distance = new JSlider(4, 20, (int) (cube.getCenter()[2]));
					distance.setFocusable(false);
					distance.addChangeListener(GamesCubeMan.this);
					sliders.add(sideBySide(new JLabel("Distance"), distance));
					
					scale = new JSlider(0, 10000, canvas.getScale());
					scale.setFocusable(false);
					scale.addChangeListener(GamesCubeMan.this);
					sliders.add(sideBySide(new JLabel("Scale"), scale));
					
					int[] dim = cube.getDimensions();
					dimensions = new JSpinner[dim.length];
					JPanel dims = new JPanel();
					for(int ch = 0; ch < dimensions.length; ch++) {
						dimensions[ch] = new JSpinner(new SpinnerNumberModel(dim[ch], 1, null, 1));
						((JSpinner.NumberEditor)dimensions[ch].getEditor()).getTextField().setFocusable(false);
						dimensions[ch].getEditor().setFocusable(false);
						dimensions[ch].addChangeListener(GamesCubeMan.this);
						if(ch != 0)
							dims.add(new JLabel("x"));
						dims.add(dimensions[ch]);
					}
					sliders.add(dims);
					
					gap = new JSlider(0, 50, (int)(100*cube.getStickerGap()));
					gap.setFocusable(false);
					gap.addChangeListener(GamesCubeMan.this);
					sliders.add(sideBySide(new JLabel("Gap"), gap));
					
					JPanel topHalf = new JPanel(new BorderLayout());
					topHalf.add(sideBySide(buttons, sliders), BorderLayout.PAGE_START);
					
					stateField = new JTextField(cube.getState());
					topHalf.add(stateField, BorderLayout.CENTER);

					JPanel pane = new JPanel(new BorderLayout());
					setContentPane(pane);
					
					pane.add(topHalf, BorderLayout.PAGE_START);
					pane.add(canvas, BorderLayout.CENTER);
					canvas.requestFocusInWindow();
					
					setBG(pane, Color.WHITE);
				}
			});
//			jso = JSObject.getWindow(this);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private void setBG(JComponent comp, Color c) {
		comp.setBackground(c);
		for(Component child : comp.getComponents()) {
			if(child instanceof JComponent)
				setBG((JComponent)child, c);
			else
				child.setBackground(c);
		}
	}
	
	private JPanel sideBySide(JComponent... cs) {
		JPanel p = new JPanel();
		p.setBackground(Color.WHITE);
		for(JComponent c : cs)
			p.add(c);
		return p;
	}
	
	private boolean green = false;
	public void touch() {
		if(jso != null)
//			jso.eval("update('hooow');"); //this and the next line are equivalent
			jso.call("update", new Object[] {"hiya"});
		green = !green;
//		cube.setBackground(green ? Color.GREEN : Color.WHITE);
//		cube.repaint();
	}

	public void stateChanged(ChangeEvent e) {
		Object src = e.getSource();
		if(src == gap) {
			cube.setStickerGap(gap.getValue() / 100.);
		} else if(src == distance) {
			double[] center = cube.getCenter();
			center[2] = distance.getValue();
			cube.setCenter(center[0], center[1], center[2]);
		} else if(src == scale) {
			canvas.setScale(scale.getValue());
		} else if(src instanceof JSpinner) {
			cube.setDimensions((Integer) dimensions[0].getValue(), (Integer) dimensions[1].getValue(), (Integer) dimensions[2].getValue());
		} 
	}

	//TODO - undo-redo
	//TODO - bounds on left hand & right hand, and some visual indicator of where they are
	private int rightHand = 1, leftHand = 1;
	public void keyPressed(KeyEvent e) {
		if(e.isAltDown()) return;
		int rightHand = this.rightHand;
		int leftHand = this.leftHand;
		int layer = 1;
		if(e.isShiftDown()) {
			rightHand++;
			leftHand++;
			layer++;
		}
		int leftRightWidth = cube.getDimensions()[XYZCube.Face.RIGHT.getWidthAxis()];
		switch(e.getKeyCode()) {
		//hand position changes
		case KeyEvent.VK_8:
			if(rightHand > 1)
				this.rightHand--;
			break;
		case KeyEvent.VK_7:
			if(rightHand < leftRightWidth - 1)
				this.rightHand++;
			break;
		case KeyEvent.VK_4:
			if(leftHand > 1)
				this.leftHand--;
			break;
		case KeyEvent.VK_5:
			if(leftHand < leftRightWidth - 1)
				this.leftHand++;
			break;
		//reggie turns
		case KeyEvent.VK_I:
			cube.doTurn(XYZCube.Face.RIGHT, rightHand, 1);
			break;
		case KeyEvent.VK_K:
			cube.doTurn(XYZCube.Face.RIGHT, rightHand, -1);
			break;
		case KeyEvent.VK_D:
			cube.doTurn(XYZCube.Face.LEFT, leftHand, 1);
			break;
		case KeyEvent.VK_E:
			cube.doTurn(XYZCube.Face.LEFT, leftHand, -1);
			break;
		case KeyEvent.VK_J:
			cube.doTurn(XYZCube.Face.UP, layer, 1);
			break;
		case KeyEvent.VK_F:
			cube.doTurn(XYZCube.Face.UP, layer, -1);
			break;
		case KeyEvent.VK_W:
			cube.doTurn(XYZCube.Face.BACK, layer, 1);
			break;
		case KeyEvent.VK_O:
			cube.doTurn(XYZCube.Face.BACK, layer, -1);
			break;
		case KeyEvent.VK_S:
			cube.doTurn(XYZCube.Face.DOWN, layer, 1);
			break;
		case KeyEvent.VK_L:
			cube.doTurn(XYZCube.Face.DOWN, layer, -1);
			break;
		case KeyEvent.VK_H:
			cube.doTurn(XYZCube.Face.FRONT, layer, 1);
			break;
		case KeyEvent.VK_G:
			cube.doTurn(XYZCube.Face.FRONT, layer, -1);
			break;
		//double layer turns
		case KeyEvent.VK_R:
			cube.doTurn(XYZCube.Face.LEFT, 2, -1);
			break;
		case KeyEvent.VK_C:
			cube.doTurn(XYZCube.Face.LEFT, 2, 1);
			break;
		case KeyEvent.VK_U:
			cube.doTurn(XYZCube.Face.RIGHT, 2, 1);
			break;
		case KeyEvent.VK_M:
			cube.doTurn(XYZCube.Face.RIGHT, 2, -1);
			break;
		//cube rotations
		case KeyEvent.VK_SEMICOLON:
			cube.doCubeRotation(XYZCube.Face.UP, 1);
			break;
		case KeyEvent.VK_A:
			cube.doCubeRotation(XYZCube.Face.UP, -1);
			break;
		case KeyEvent.VK_Y:
		case KeyEvent.VK_T:
			cube.doCubeRotation(XYZCube.Face.RIGHT, 1);
			break;
		case KeyEvent.VK_N:
		case KeyEvent.VK_V:
			cube.doCubeRotation(XYZCube.Face.RIGHT, -1);
			break;
		case KeyEvent.VK_P:
			cube.doCubeRotation(XYZCube.Face.FRONT, 1);
			break;
		case KeyEvent.VK_Q:
			cube.doCubeRotation(XYZCube.Face.FRONT, -1);
			break;
		}
		cube.updateHandPositions(this.leftHand, this.rightHand);
	}
	public void keyReleased(KeyEvent e) {}
	public void keyTyped(KeyEvent e) {}

	public void actionPerformed(ActionEvent e) {
		if(e.getSource() == resetView)
			resetRotation();
		else if(e.getSource() == scramble) {
			XYZCube.Face[] faces = XYZCube.Face.faces();
			Random r = new Random();
			//TODO - scrambling not good for a 2x3x5?
			for(int ch = 0; ch < 5*cube.getDimensions()[0]; ch++)
				cube.doTurn(faces[r.nextInt(faces.length)], r.nextInt(Math.max(1, cube.getDimensions()[0]-1))+1, (r.nextInt(2)+1));
		} else if(e.getSource() == resetCube)
			cube.setDimensions(cube.getDimensions());
		else if(e.getSource() == antialiasing)
			canvas.setAntialiasing(antialiasing.isSelected());
	}

	private void resetRotation() {
		cube.setRotation(new RotationMatrix(0, -45));
		canvas.mousePressed(null);
	}

	public void stateChanged(XYZCube src) {
		stateField.setText(src.getState());
	}
}
