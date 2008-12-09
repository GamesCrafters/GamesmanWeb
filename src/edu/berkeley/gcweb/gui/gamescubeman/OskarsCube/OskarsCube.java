package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;
import java.util.HashSet;

import javax.swing.BoxLayout;
import javax.swing.ButtonGroup;
import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JSlider;
import javax.swing.JSpinner;
import javax.swing.JTextField;
import javax.swing.SpinnerNumberModel;
import javax.swing.SwingUtilities;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import netscape.javascript.JSObject;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Canvas3D;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Shape3D;

@SuppressWarnings("serial")
public class OskarsCube extends JApplet implements KeyListener{
	private Shape3D cube;
	private Canvas3D canvas;
	
	public static JSObject jso;
	
	public void init() {
		try {
			SwingUtilities.invokeAndWait(new Runnable() {
				public void run() {
					canvas = new Canvas3D();
					cube = new MyShape(0, 0, 50);
					cube.setCanvas(canvas);
					canvas.addShape3D(cube);
					canvas.addKeyListener(OskarsCube.this);
					getContentPane().add(canvas);
				}
			});
			jso = JSObject.getWindow(this);
//			jso.call("isValidMove", new Object[0]);
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}
	
	private void setBG_FG(JComponent comp, Color bg, Color fg) {
		if(comp instanceof JButton)
			return;
		comp.setBackground(bg);
		comp.setForeground(fg);
		for(Component child : comp.getComponents()) {
			if(child instanceof JComponent)
				setBG_FG((JComponent)child, bg, fg);
			else if(!(child instanceof JButton)) {
				child.setBackground(bg);
				child.setForeground(fg);
			}
		}
	}
	public String getBoardString(){
		MyShape piece_holder = (MyShape) cube;
		String position = Integer.toString(piece_holder.current_position[0]);
		position += Integer.toString(piece_holder.current_position[1]);
		position += Integer.toString(piece_holder.current_position[2]);
		return position;
	}
	private JPanel sideBySide(JComponent... cs) {
		JPanel p = new JPanel();
		p.setBackground(Color.WHITE);
		for(JComponent c : cs)
			p.add(c);
		return p;
	}
	public static void main(String[] args) {
		final OskarsCube a = new OskarsCube();
		a.init();
		a.setPreferredSize(new Dimension(4000, 5000));
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				JFrame f = new JFrame();
				f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
				JPanel pane = new JPanel();
				f.setContentPane(pane);
				f.add(a);
				f.pack();
				f.setVisible(true);
				a.canvas.requestFocusInWindow();
			}
		});
	}
	private boolean movement_key_held = false;

	public void keyPressed(KeyEvent arg0) {
		// TODO Auto-generated method stub
		if(arg0.getKeyCode() == KeyEvent.VK_W){
			if (!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				//check if the move is valid...
				Boolean valid = (Boolean) OskarsCube.jso.call("isValidMove", new Object[] {"010"});
				if (valid.booleanValue()){
					holder.big_red_axis.holder.translate(0, 1, 0);
					holder.current_position[1] += 1;
				}
				canvas.fireCanvasChange();
			}
		}
		if(arg0.getKeyCode() == KeyEvent.VK_S){
			if (!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				Boolean valid = (Boolean) OskarsCube.jso.call("isValidMove", new Object[] {"0-10"});
				if(valid.booleanValue()){
					holder.big_red_axis.holder.translate(0, -1, 0);
					holder.current_position[1] -= 1;
				}
				canvas.fireCanvasChange();
			}
		}
		if(arg0.getKeyCode() == KeyEvent.VK_A){
			if(!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				Boolean valid = (Boolean) OskarsCube.jso.call("isValidMove", new Object[] {"100"});
				if(valid.booleanValue()){
					holder.big_red_axis.holder.translate(1, 0, 0);
					holder.current_position[0] += 1;
				}
				canvas.fireCanvasChange();
			}
		}
		if(arg0.getKeyCode() == KeyEvent.VK_D){
			if(!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				Boolean valid = (Boolean) OskarsCube.jso.call("isValidMove", new Object[] {"-100"});
				if(valid.booleanValue()){
					holder.big_red_axis.holder.translate(-1, 0, 0);
					holder.current_position[0] -= 1;
				}
				canvas.fireCanvasChange();
			}
		}
		if(arg0.getKeyCode() == KeyEvent.VK_Q){
			if(!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				Boolean valid = (Boolean) OskarsCube.jso.call("isValidMove", new Object[] {"001"});
				if(valid.booleanValue()){
					holder.big_red_axis.holder.translate(0, 0, 1);
					holder.current_position[2] += 1;
				}
				canvas.fireCanvasChange();
			}
		}
		if(arg0.getKeyCode() == KeyEvent.VK_E){
			if(!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				Boolean valid = (Boolean) OskarsCube.jso.call("isValidMove", new Object[] {"00-1"});
				if(valid.booleanValue()){
					holder.big_red_axis.holder.translate(0, 0, -1);
					holder.current_position[2] -= 1;
				}
				canvas.fireCanvasChange();
			}
		}
	}

	public void keyReleased(KeyEvent e) {
		// TODO Auto-generated method stub
		movement_key_held = false;
	}

	public void keyTyped(KeyEvent e) {
		// TODO Auto-generated method stub
		
	}
}
