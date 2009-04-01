package edu.berkeley.gcweb.gui.gamescubeman.OskarsCube;

import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
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
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

import netscape.javascript.JSObject;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Canvas3D;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.RotationMatrix;

@SuppressWarnings("serial")
public class OskarsCube extends JApplet implements KeyListener, ActionListener {
	private final static boolean USE_JAVA_SOLVER = true; // switch to false to
															// query legal moves
															// with the
															// javascript server
	private static final boolean display_remoteness_default = false;
	private static final boolean display_best_move_default = false;
	private static final boolean random_faces = true;
	private static final boolean display_number_viable_default = false;
	private static final boolean find_best_start_end_default = false; 
	private static final int facesize = 5;
	public static int acheivable;
	public static Solver solved_map;
	private MyShape cube;
	private Canvas3D canvas;
	public static JSObject jso;
	private JLabel remoteness;
	private JLabel best_move;
	private JLabel num_viable;
	private JButton resetViewButton;
	private JCheckBox display_best_move_box;
	private JCheckBox display_remoteness_box;
	private JCheckBox display_number_viable_box;
	private JCheckBox display_viable_insides_box;
	private CubeGen cubefaces;
	private Random random;

	public void init() {
		try {
			SwingUtilities.invokeAndWait(new Runnable() {
				public void run() {
					cubefaces = new CubeGen(0, 0, 0, find_best_start_end_default);
					if (random_faces == true) {
						random = new Random(); // can put seed here
						boolean validfaces = false;
						while (!validfaces) {
							int seed1 = random.nextInt();
							int seed2 = random.nextInt();// new randomint;
							int seed3 = random.nextInt();// new randomint;
							cubefaces = new CubeGen(seed1, seed2, seed3,
									find_best_start_end_default);
							validfaces = cubefaces.Valid;
						}
					}
					if (USE_JAVA_SOLVER)
						solved_map = new Solver(cubefaces);
					canvas = new Canvas3D();
					cube = new MyShape(0, 0, 50, cubefaces);
					cube.setCanvas(canvas);
					canvas.addShape3D(cube);
					canvas.addKeyListener(OskarsCube.this);
					JPanel full_panel = new JPanel();
					full_panel.setLayout(new BoxLayout(full_panel,
							BoxLayout.PAGE_AXIS));
					JPanel buttons = new JPanel();
					buttons.setLayout(new BoxLayout(buttons,
							BoxLayout.PAGE_AXIS));
					remoteness = new JLabel();
					display_viable_insides_box = new JCheckBox("Show Viable Insides");
					cube.setInteriorVisible(display_viable_insides_box.isSelected());
					display_viable_insides_box.setFocusable(false);
					display_viable_insides_box.addActionListener(OskarsCube.this);
					display_best_move_box = new JCheckBox("Show Best Move");
					display_best_move_box.setFocusable(false);
					display_best_move_box.addActionListener(OskarsCube.this);
					display_remoteness_box = new JCheckBox("Show Remoteness");
					display_remoteness_box.setFocusable(false);
					display_remoteness_box.addActionListener(OskarsCube.this);
					display_number_viable_box = new JCheckBox("Show Number Viable");
					display_number_viable_box.setFocusable(false);
					display_number_viable_box.addActionListener(OskarsCube.this);
					best_move = new JLabel();
					num_viable = new JLabel();
					remoteness.setText("The puzzle can be solved in " + (solved_map.getRemoteness(cubefaces.start) / 2 + " moves"));
					remoteness.setVisible(display_remoteness_default);
					best_move.setText("The best move is to slide " + solved_map.getBestMove(cubefaces.start));
					best_move.setVisible(display_best_move_default);
					num_viable.setText(acheivable + " positions are achievable and "+ (125 - acheivable) + " are not");
					num_viable.setVisible(display_number_viable_default);
					resetViewButton = new JButton("Reset View");
					resetViewButton.setMnemonic(KeyEvent.VK_R);
					resetViewButton.setFocusable(false);
					resetViewButton.addActionListener(OskarsCube.this);
					buttons.add(resetViewButton);
					buttons.add(remoteness);
					buttons.add(best_move);
					buttons.add(num_viable);
					buttons.add(display_viable_insides_box);
					buttons.add(display_number_viable_box);
					buttons.add(display_best_move_box);
					buttons.add(display_remoteness_box);
					full_panel.add(buttons);
					full_panel.add(canvas);
					getContentPane().add(full_panel);
					set_view();
					update_displays();

				}
			});
			// if (!USE_JAVA_SOLVER)
			// jso = JSObject.getWindow(this);
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	private void setBG_FG(JComponent comp, Color bg, Color fg) {
		if (comp instanceof JButton)
			return;
		comp.setBackground(bg);
		comp.setForeground(fg);
		for (Component child : comp.getComponents())  {
			if (child instanceof JComponent)
				setBG_FG((JComponent) child, bg, fg);
			else if (!(child instanceof JButton)) {
				child.setBackground(bg);
				child.setForeground(fg);
			}
		}
	}

	public String getBoardString() {
		MyShape piece_holder = (MyShape) cube;
		String position = Integer.toString(piece_holder.current_position[0]);
		position += Integer.toString(piece_holder.current_position[1]);
		position += Integer.toString(piece_holder.current_position[2]);
		return position;
	}

	private JPanel sideBySide(JComponent... cs) {
		JPanel p = new JPanel();
		p.setBackground(Color.WHITE);
		for (JComponent c : cs)
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
		if (arg0.getKeyCode() == KeyEvent.VK_D) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER) {
					valid = solved_map.isValidMove(holder.current_position,
							new int[] { 0, 1, 0 });
				} else {
					// Boolean js_call = (Boolean)
					// OskarsCube.jso.call("javaIsValidMove", new Object[]
					// {"010"});
					// valid = js_call.booleanValue();
					valid = true;
				}
				if (valid) {
					// if(!USE_JAVA_SOLVER)
					// OskarsCube.jso.call("javaDoMove", new Object[]{"010"});
					// holder.big_red_axis.holder.translate(0, -1, 0);
					holder.big_red_axis.xyholder.translate(0, -2, 0);
					holder.big_red_axis.xzholder.translate(0, -2, 0);
					holder.current_position[1] += 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if (arg0.getKeyCode() == KeyEvent.VK_E) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER)
					valid = solved_map.isValidMove(holder.current_position,
							new int[] { 0, -1, 0 });
				else {
					// Boolean js_call = (Boolean)
					// OskarsCube.jso.call("javaIsValidMove", new Object[]
					// {"0-10"});
					// valid = js_call.booleanValue();
					valid = true;
				}
				if (valid) {
					// if(!USE_JAVA_SOLVER)
					// OskarsCube.jso.call("javaDoMove", new Object[]{"0-10"});
					// holder.big_red_axis.holder.translate(0, 2, 0);
					holder.big_red_axis.xyholder.translate(0, 2, 0);
					holder.big_red_axis.xzholder.translate(0, 2, 0);
					holder.current_position[1] -= 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if (arg0.getKeyCode() == KeyEvent.VK_F) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER)
					valid = solved_map.isValidMove(holder.current_position,
							new int[] { 0, 0, 1 });
				else {
					// Boolean js_call = (Boolean)
					// OskarsCube.jso.call("javaIsValidMove", new Object[]
					// {"001"});
					// valid = js_call.booleanValue();
					valid = true;
				}
				if (valid) {
					// if(!USE_JAVA_SOLVER)
					// OskarsCube.jso.call("javaDoMove", new Object[]{"001"});
					// holder.big_red_axis.holder.translate(0, 0, -1);
					holder.big_red_axis.xyholder.translate(0, 0, 2);
					holder.big_red_axis.yzholder.translate(0, 0, 2);
					holder.current_position[2] += 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if (arg0.getKeyCode() == KeyEvent.VK_R) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER)
					valid = solved_map.isValidMove(holder.current_position,
							new int[] { 0, 0, -1 });
				else {
					// Boolean js_call = (Boolean)
					// OskarsCube.jso.call("javaIsValidMove", new Object[]
					// {"00-1"});
					// valid = js_call.booleanValue();
					valid = true;
				}
				if (valid) {
					// if(!USE_JAVA_SOLVER)
					// OskarsCube.jso.call("javaDoMove", new Object[]{"00-1"});
					// holder.big_red_axis.holder.translate(0, 0, 1);
					holder.big_red_axis.yzholder.translate(0, 0, -2);
					holder.big_red_axis.xyholder.translate(0, 0, -2);
					holder.current_position[2] -= 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if (arg0.getKeyCode() == KeyEvent.VK_S) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER)
					valid = solved_map.isValidMove(holder.current_position,
							new int[] { 1, 0, 0 });
				else {
					// Boolean js_call = (Boolean)
					// OskarsCube.jso.call("javaIsValidMove", new Object[]
					// {"100"});
					// valid = js_call.booleanValue();
					valid = true;
				}
				if (valid) {
					// if(!USE_JAVA_SOLVER)
					// OskarsCube.jso.call("javaDoMove", new Object[]{"100"});
					// holder.big_red_axis.holder.translate(1,0,0);
					holder.big_red_axis.yzholder.translate(2, 0, 0);
					holder.big_red_axis.xzholder.translate(2, 0, 0);
					holder.current_position[0] += 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if (arg0.getKeyCode() == KeyEvent.VK_W) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid;
				if (USE_JAVA_SOLVER)
					valid = solved_map.isValidMove(holder.current_position,
							new int[] { -1, 0, 0 });
				else {
					// Boolean js_call = (Boolean)
					// OskarsCube.jso.call("javaIsValidMove", new Object[]
					// {"-100"});
					// valid = js_call.booleanValue();
					valid = true;
				}
				if (valid) {
					// if(!USE_JAVA_SOLVER)
					// OskarsCube.jso.call("javaDoMove", new Object[]{"-100"});
					// holder.big_red_axis.holder.translate(-1, 0, 0);
					holder.big_red_axis.yzholder.translate(-2, 0, 0);
					holder.big_red_axis.xzholder.translate(-2, 0, 0);
					holder.current_position[0] -= 2;
				}
				canvas.fireCanvasChange();
			}
		}
		update_displays();
		MyShape holder = (MyShape) cube;
		// System.out.println("The stick is currently at (" +
		// holder.current_position[0] + "," + holder.current_position[1] + "," +
		// holder.current_position[2]+")");
	}

	private void update_displays() {
		MyShape holder = (MyShape) cube;
		// catch if start or end is not valid.
		if (!(solved_map.move_map.containsKey(solved_map.end[0] * 100
				+ solved_map.end[1] * 10 + solved_map.end[2]) && solved_map.move_map
				.containsKey(solved_map.start[0] * 100 + solved_map.start[1]
						* 10 + solved_map.start[2]))) {
			System.out.println("Start or end are not achievable");
			return;
		}
		/*
		if (display_remoteness) {
			remoteness
					.setText("The puzzle can be solved in "
							+ (solved_map
									.getRemoteness(holder.current_position) / 2 + " moves"));
			remoteness.setVisible(true);
		} else {
			remoteness.setVisible(false);
		}
		if (display_best_move) {
			best_move.setText("The best move is to slide "
					+ solved_map.getBestMove(holder.current_position));
			best_move.setVisible(true);
		} else {
			best_move.setVisible(false);
		}
		if (display_number_viable) {
			num_viable.setText(acheivable + " positions are achievable and "
					+ (125 - acheivable) + " are not");
			num_viable.setVisible(true);
		} else {
			num_viable.setVisible(false);
		}
		*/
	}

	public void keyReleased(KeyEvent e) {
		// TODO Auto-generated method stub
		movement_key_held = false;
	}

	public void keyTyped(KeyEvent e) {
		// TODO Auto-generated method stub

	}

	public void actionPerformed(ActionEvent e) {
		if (e.getSource() == resetViewButton) {
			set_view();
			canvas.fireCanvasChange();
		} else if (e.getSource() == display_viable_insides_box) {
			cube.setInteriorVisible(display_viable_insides_box.isSelected());
			canvas.fireCanvasChange();
		} else if (e.getSource() == display_number_viable_box) {
			num_viable.setVisible(display_number_viable_box.isSelected());
			canvas.fireCanvasChange();
		} else if (e.getSource() == display_remoteness_box) {
			remoteness.setVisible(display_remoteness_box.isSelected());
			canvas.fireCanvasChange();
		} else if (e.getSource() == display_best_move_box) {
			best_move.setVisible(display_best_move_box.isSelected());
			canvas.fireCanvasChange();
		}
		
		
	}

	private void set_view() {
		cube.setRotation(new RotationMatrix(0, 0));
	}
	
}
