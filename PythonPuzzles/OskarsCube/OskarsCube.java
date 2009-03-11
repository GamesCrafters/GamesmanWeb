package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.newOskars;

import java.util.Random;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.Label;
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
import java.awt.TextField;

//import netscape.javascript.JSObject;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Canvas3D;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.RotationMatrix;
import edu.berkeley.gcweb.gui.gamescubeman.OskarsCube.ThreeD.Shape3D;

@SuppressWarnings("serial")
public class OskarsCube extends JApplet implements KeyListener, ActionListener{
	private final static boolean USE_JAVA_SOLVER = true; //switch to false to query legal moves with the javascript server
	private boolean display_remoteness = true;
	private boolean display_best_move = true;
	private boolean random_faces = false;
	private boolean display_viable_insides = true;
	private boolean display_number_viable = true;
	public static int acheivable;
	public static Solver solved_map;
	private Shape3D cube;
	private Canvas3D canvas;
//	public static JSObject jso;
	public static Object jso;
	private JLabel remoteness;
	private JLabel best_move;
	private JLabel num_viable;
	private CubeGen cubefaces;
	private Random random;
	public void init() {
		try {
			SwingUtilities.invokeAndWait(new Runnable() {
				public void run() {
					cubefaces = new CubeGen(0,0,0);
					if (random_faces == true) {
						random = new Random();  //can put seed here
						boolean validfaces = false;
						while (!validfaces) {
							int seed1 = random.nextInt();
							int seed2 = random.nextInt();//new randomint;
							int seed3 = random.nextInt();//new randomint;
							cubefaces = new CubeGen(seed1,seed2,seed3);
							validfaces = cubefaces.Valid;
						}
					}
					if (USE_JAVA_SOLVER)
						solved_map = new Solver(cubefaces);
					canvas = new Canvas3D();
					cube = new MyShape(0, 0, 50, cubefaces, display_viable_insides);
					cube.setCanvas(canvas);
					canvas.addShape3D(cube);
					canvas.addKeyListener(OskarsCube.this);
					JPanel full_panel = new JPanel();
					full_panel.setLayout(new BoxLayout(full_panel, BoxLayout.PAGE_AXIS));
					JPanel buttons = new JPanel();
					buttons.setLayout(new BoxLayout(buttons, BoxLayout.PAGE_AXIS));
					remoteness = new JLabel();
					best_move = new JLabel();
					num_viable = new JLabel();
					JButton resetView = new JButton("Reset View");
					resetView.setMnemonic(KeyEvent.VK_R);
					resetView.setFocusable(false);
					resetView.addActionListener(OskarsCube.this);
					buttons.add(resetView);
					buttons.add(remoteness);
					buttons.add(best_move);
					buttons.add(num_viable);
					full_panel.add(buttons);
					full_panel.add(canvas);
					getContentPane().add(full_panel);
					set_view();
					update_displays();
					
					
				}
			});
//			if (!USE_JAVA_SOLVER)
//				jso = JSObject.getWindow(this);
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
	@Override
	public void keyPressed(KeyEvent arg0) {
		if(arg0.getKeyCode() == KeyEvent.VK_F){
			if (!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER){
					valid = solved_map.isValidMove(holder.current_position, new int[] {0,1,0});
				}
				else{
//					Boolean js_call = (Boolean) OskarsCube.jso.call("javaIsValidMove", new Object[] {"010"});
//					valid = js_call.booleanValue();
					valid = true;
				}
				if (valid){
//					if(!USE_JAVA_SOLVER)						
//						OskarsCube.jso.call("javaDoMove", new Object[]{"010"});
					//holder.big_red_axis.holder.translate(0, -1, 0);
					holder.big_red_axis.xyholder.translate(2, 0,0);
					holder.big_red_axis.xzholder.translate(2, 0,0);
					holder.current_position[1] += 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if(arg0.getKeyCode() == KeyEvent.VK_R){
			if (!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER)
					valid = solved_map.isValidMove(holder.current_position, new int[] {0,-1,0});
				else{
//					Boolean js_call = (Boolean) OskarsCube.jso.call("javaIsValidMove", new Object[] {"0-10"});
//					valid = js_call.booleanValue();
					valid = true;
				}
				if(valid){
//					if(!USE_JAVA_SOLVER)
//						OskarsCube.jso.call("javaDoMove", new Object[]{"0-10"});
					//holder.big_red_axis.holder.translate(0, 1, 0);
					holder.big_red_axis.xyholder.translate(-2, 0, 0);
					holder.big_red_axis.xzholder.translate(-2, 0, 0);
					holder.current_position[1] -= 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if(arg0.getKeyCode() == KeyEvent.VK_W){
			if(!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER)
					valid = solved_map.isValidMove(holder.current_position, new int[] {0, 0, 1});
				else{
//					Boolean js_call = (Boolean) OskarsCube.jso.call("javaIsValidMove", new Object[] {"001"});
//					valid = js_call.booleanValue();
					valid = true;
				}
				if(valid){
//					if(!USE_JAVA_SOLVER)
//						OskarsCube.jso.call("javaDoMove", new Object[]{"001"});
					//holder.big_red_axis.holder.translate(0, 0, -1);
					holder.big_red_axis.xyholder.translate(0, 2, 0);
					holder.big_red_axis.yzholder.translate(0, 2, 0);
					holder.current_position[2] += 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if(arg0.getKeyCode() == KeyEvent.VK_S){
			if(!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER)
					valid = solved_map.isValidMove(holder.current_position, new int[] {0,0,-1});
				else{
//					Boolean js_call = (Boolean) OskarsCube.jso.call("javaIsValidMove", new Object[] {"00-1"});
//					valid = js_call.booleanValue();
					valid = true;
				}
				if(valid){
//					if(!USE_JAVA_SOLVER)
//						OskarsCube.jso.call("javaDoMove", new Object[]{"00-1"});
					//holder.big_red_axis.holder.translate(0, 0, 1);
					holder.big_red_axis.yzholder.translate(0, -2, 0);
					holder.big_red_axis.xyholder.translate(0, -2, 0);
					holder.current_position[2] -= 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if(arg0.getKeyCode() == KeyEvent.VK_E){
			if(!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER)
					valid = solved_map.isValidMove(holder.current_position, new int[] {1,0,0});
				else{
//					Boolean js_call = (Boolean) OskarsCube.jso.call("javaIsValidMove", new Object[] {"100"});
//					valid = js_call.booleanValue();
					valid = true;
				}
				if(valid){
//					if(!USE_JAVA_SOLVER)
//						OskarsCube.jso.call("javaDoMove", new Object[]{"100"});
					//holder.big_red_axis.holder.translate(1,0,0);
					holder.big_red_axis.yzholder.translate(0, 0, 2);
					holder.big_red_axis.xzholder.translate(0, 0, 2);
					holder.current_position[0] += 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if(arg0.getKeyCode() == KeyEvent.VK_D){
			if(!movement_key_held){
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER)
					valid = solved_map.isValidMove(holder.current_position, new int[] {-1,0,0});
				else{
//					Boolean js_call = (Boolean) OskarsCube.jso.call("javaIsValidMove", new Object[] {"-100"});
//					valid = js_call.booleanValue();
					valid = true;
				}
				if(valid){
//					if(!USE_JAVA_SOLVER)
//						OskarsCube.jso.call("javaDoMove", new Object[]{"-100"});
					//holder.big_red_axis.holder.translate(-1, 0, 0);
					holder.big_red_axis.yzholder.translate(0, 0, -2);
					holder.big_red_axis.xzholder.translate(0, 0, -2);
					holder.current_position[0] -= 2;
				}
				canvas.fireCanvasChange();
			}
		}
		update_displays();
		MyShape holder = (MyShape) cube;
		System.out.println("The stick is currently at (" + holder.current_position[0] + "," + holder.current_position[1] + "," + holder.current_position[2]+")");
	}

	private void update_displays(){
		MyShape holder = (MyShape) cube;
		if(display_remoteness){
			remoteness.setText("The puzzle can be solved in " + (solved_map.getRemoteness(holder.current_position)/2 + " moves"));
			remoteness.setVisible(true);
		}else{
			remoteness.setVisible(false);
		}
		if(display_best_move){
			best_move.setText("The best move is to slide " + solved_map.getBestMove(holder.current_position));
			best_move.setVisible(true);
		}else{
			best_move.setVisible(false);
		}
		if(display_number_viable){
			num_viable.setText(acheivable + " positions are achievable and " + (125- acheivable) + " are not");
			num_viable.setVisible(true);
		}else{
			num_viable.setVisible(false);
		}
	}
	@Override
	public void keyReleased(KeyEvent e) {
		// TODO Auto-generated method stub
		movement_key_held = false;
	}
	@Override
	public void keyTyped(KeyEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void actionPerformed(ActionEvent arg0) {
		// TODO Auto-generated method stub
		set_view();
		/*first argument is x=0, y=1, z=2 axis to rotate
		 * Next argument is # of degree CCW.
		 */
		canvas.fireCanvasChange();
	}
	
	private void set_view(){
		cube.setRotation(new RotationMatrix(0, 0));
	}
	
	public void turnOnRemoteness(){
		display_remoteness = true;
		update_displays();
	}
	
	public void turnOffRemoteness(){
		display_remoteness = false;
		update_displays();
	}
	
	public void  turnOnBestMove(){
		display_best_move = true;
		update_displays();
	}
	
	public void turnOffBestMove(){
		display_best_move = false;
		update_displays();
	}
	public void turnOffRandomFaces(){
		random_faces = false;
		update_displays(); //Probably should make a new puzzle
	}
	public void turnOnRandomFaces(){
		random_faces = true;
		update_displays();//Probably should make a new puzzle
	}
}
