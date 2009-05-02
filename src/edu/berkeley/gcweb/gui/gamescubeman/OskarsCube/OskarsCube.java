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
	private static final boolean find_best_start_end_default = true; 
	private static final int boardsize = 5;
	private static final int goalremoteness = 0;
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
	private JCheckBox display_solution_path_box;
	private CubeGen cubefaces;
	
	public void init() {
		try {
			SwingUtilities.invokeAndWait(new Runnable() {
				public void run() {
					
					cubefaces = new CubeGen(random_faces, find_best_start_end_default, boardsize);
					
					if (USE_JAVA_SOLVER)
						solved_map = new Solver(cubefaces);
					while(!(solved_map.move_map.containsKey(solved_map.end[0] * boardsize*boardsize*4 + solved_map.end[1] * boardsize*2 + solved_map.end[2]) && solved_map.move_map.containsKey(solved_map.start[0] * boardsize*boardsize*4 + solved_map.start[1]
						* boardsize*2 + solved_map.start[2]))) {
						System.out.println("failed");
						cubefaces = new CubeGen(random_faces, find_best_start_end_default, boardsize);
						solved_map = new Solver(cubefaces);
						
					}
					int tries =0;
					while (solved_map.getRemoteness(solved_map.start)/2 < goalremoteness) {
							System.out.println("failed " + tries + " " + solved_map.getRemoteness(solved_map.start) );
							cubefaces = new CubeGen(random_faces, find_best_start_end_default, boardsize);
							solved_map = new Solver(cubefaces);
							tries++;
					}
					int zoom = 25 + 2*(5-boardsize)*(5-boardsize);
					canvas = new Canvas3D();
					cube = new MyShape(0, 0, zoom, cubefaces);
					cube.setCanvas(canvas);
					canvas.addShape3D(cube);
					canvas.addKeyListener(OskarsCube.this);
					JPanel full_panel = new JPanel();
					full_panel.setLayout(new BoxLayout(full_panel,
							BoxLayout.PAGE_AXIS));
					JPanel buttons = new JPanel();
					buttons.setLayout(new BoxLayout(buttons,
							BoxLayout.PAGE_AXIS));
					
					best_move = new JLabel();
					num_viable = new JLabel();
					remoteness = new JLabel();
					display_viable_insides_box = new JCheckBox("Show Unachievable Insides");
					cube.setInteriorVisible(display_viable_insides_box.isSelected());
					display_viable_insides_box.setFocusable(false);
					display_viable_insides_box.addActionListener(OskarsCube.this);
					
					display_solution_path_box = new JCheckBox("Show Solution Path");
					cube.setIntSolVisible(display_solution_path_box.isSelected());
					display_solution_path_box.setFocusable(false);
					display_solution_path_box.addActionListener(OskarsCube.this);
					
					display_best_move_box = new JCheckBox("Show Best Move");
					display_best_move_box.setFocusable(false);
					display_best_move_box.addActionListener(OskarsCube.this);
					
					display_remoteness_box = new JCheckBox("Show Remoteness");
					display_remoteness_box.setFocusable(false);
					display_remoteness_box.addActionListener(OskarsCube.this);
					
					display_number_viable_box = new JCheckBox("Show Number Achievable");
					display_number_viable_box.setFocusable(false);
					display_number_viable_box.addActionListener(OskarsCube.this);
					
					if (solved_map.getRemoteness(cubefaces.start) !=0) {
						remoteness.setText("The puzzle can be solved in " + (solved_map.getRemoteness(cubefaces.start) / 2 + " moves"));
						remoteness.setVisible(display_remoteness_default);
						best_move.setText("The best move is to slide " + solved_map.getBestMove(cubefaces.start));
						best_move.setVisible(display_best_move_default);
					} else {
						remoteness.setText("The puzzle cannot be solved");
						remoteness.setVisible(display_remoteness_default);
						best_move.setText("There are no moves to win");
						best_move.setVisible(display_best_move_default);
						
					}
					num_viable.setText(acheivable + " positions are achievable and "+ (boardsize*boardsize*boardsize - acheivable) + " are not");
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
					buttons.add(display_solution_path_box);
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
	private int tW = KeyEvent.VK_W;
	private int aW = KeyEvent.VK_S;
	private int tB = KeyEvent.VK_E;
	private int aB = KeyEvent.VK_D;
	private int tR = KeyEvent.VK_R;
	private int aR = KeyEvent.VK_F;
	

	public void keyPressed(KeyEvent arg0) {
		if (arg0.getKeyCode() == aB) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid= solved_map.isValidMove(holder.current_position,
							new int[] { 0, 1, 0 });
				if (valid) {
					holder.big_red_axis.xyholder.translate(0, -2, 0);
					holder.big_red_axis.xzholder.translate(0, -2, 0);
					holder.current_position[1] += 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if (arg0.getKeyCode() == tB) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid = solved_map.isValidMove(holder.current_position,
							new int[] { 0, -1, 0 });
				if (valid) {
					holder.big_red_axis.xyholder.translate(0, 2, 0);
					holder.big_red_axis.xzholder.translate(0, 2, 0);
					holder.current_position[1] -= 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if (arg0.getKeyCode() == aR) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid = solved_map.isValidMove(holder.current_position,
							new int[] { 0, 0, 1 });
				if (valid) {
					holder.big_red_axis.xyholder.translate(0, 0, 2);
					holder.big_red_axis.yzholder.translate(0, 0, 2);
					holder.current_position[2] += 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if (arg0.getKeyCode() == tR) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid = solved_map.isValidMove(holder.current_position,
							new int[] { 0, 0, -1 });
				if (valid) {
					holder.big_red_axis.yzholder.translate(0, 0, -2);
					holder.big_red_axis.xyholder.translate(0, 0, -2);
					holder.current_position[2] -= 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if (arg0.getKeyCode() == aW) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid = solved_map.isValidMove(holder.current_position,
							new int[] { 1, 0, 0 });
				if (valid) {
					holder.big_red_axis.yzholder.translate(2, 0, 0);
					holder.big_red_axis.xzholder.translate(2, 0, 0);
					holder.current_position[0] += 2;
				}
				canvas.fireCanvasChange();
			}
		}
		if (arg0.getKeyCode() == tW) {
			if (!movement_key_held) {
				movement_key_held = true;
				MyShape holder = (MyShape) cube;
				boolean valid= solved_map.isValidMove(holder.current_position,
							new int[] { -1, 0, 0 });
				if (valid) {
					holder.big_red_axis.yzholder.translate(-2, 0, 0);
					holder.big_red_axis.xzholder.translate(-2, 0, 0);
					holder.current_position[0] -= 2;
				}
				canvas.fireCanvasChange();
			}
		}
		cube.setAwayBVisible(false);
		cube.setAwayRVisible(false);
		cube.setAwayWVisible(false);
		cube.setTowardBVisible(false);
		cube.setTowardRVisible(false);
		cube.setTowardWVisible(false);
		cube.setAwayRBVisible(false);
		cube.setAwayRRVisible(false);
		cube.setAwayRWVisible(false);
		cube.setTowardRBVisible(false);
		cube.setTowardRRVisible(false);
		cube.setTowardRWVisible(false);
		if(display_best_move_box.isSelected()) {
			if(solved_map.getBestMove(cube.current_position) == "away from RED") {
				cube.setAwayRVisible(true);
			} else if (solved_map.getBestMove(cube.current_position) == "towards RED") {
				cube.setTowardRVisible(true);
			}else if (solved_map.getBestMove(cube.current_position) == "away from BLUE") {
				cube.setAwayBVisible(true);
			}else if (solved_map.getBestMove(cube.current_position) == "towards BLUE") {
				cube.setTowardBVisible(true);
			}else if (solved_map.getBestMove(cube.current_position) == "towards WHITE") {
				cube.setTowardWVisible(true);
			} else {
				cube.setAwayWVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {0,0,1}) &&
					solved_map.getBestMove(cube.current_position) != "away from RED"	) {
				cube.setAwayRRVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {0,0,-1}) &&
					solved_map.getBestMove(cube.current_position) != "towards RED"	) {
				cube.setTowardRRVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {0,1,0}) &&
					solved_map.getBestMove(cube.current_position) != "away from BLUE"	) {
				cube.setAwayRBVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {0,-1,0}) &&
					solved_map.getBestMove(cube.current_position) != "towards BLUE"	) {
				cube.setTowardRBVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {1,0,0}) &&
					solved_map.getBestMove(cube.current_position) != "away from WHITE"	) {
				cube.setAwayRWVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {-1,0,0}) &&
					solved_map.getBestMove(cube.current_position) != "towards WHITE"	) {
				cube.setTowardRWVisible(true);
			}
			
		}
		canvas.fireCanvasChange();
		update_displays();
		MyShape holder = (MyShape) cube;
	}

	private void update_displays() {
		MyShape holder = (MyShape) cube;
		// catch if start or end is not valid.
		if (!(solved_map.move_map.containsKey(solved_map.end[0] * boardsize*boardsize*4
				+ solved_map.end[1] * boardsize*2 + solved_map.end[2]) && solved_map.move_map
				.containsKey(solved_map.start[0] * boardsize*boardsize*4 + solved_map.start[1]
						* boardsize*2 + solved_map.start[2]))) {
			System.out.println("Start or end are not achievable");
			return;
		}
		remoteness.setText("The puzzle can be solved in " + (solved_map.getRemoteness(holder.current_position) / 2 + " moves"));
		best_move.setText("The best move is to slide " + solved_map.getBestMove(holder.current_position));
		
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
			if(solved_map.getBestMove(cube.current_position) == "away from RED") {
				cube.setAwayRVisible(true);
			} else if (solved_map.getBestMove(cube.current_position) == "towards RED") {
				cube.setTowardRVisible(true);
			}else if (solved_map.getBestMove(cube.current_position) == "away from BLUE") {
				cube.setAwayBVisible(true);
			}else if (solved_map.getBestMove(cube.current_position) == "towards BLUE") {
				cube.setTowardBVisible(true);
			}else if (solved_map.getBestMove(cube.current_position) == "towards WHITE") {
				cube.setTowardWVisible(true);
			} else {
				cube.setAwayWVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {0,0,1}) &&
					solved_map.getBestMove(cube.current_position) != "away from RED"	) {
				cube.setAwayRRVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {0,0,-1}) &&
					solved_map.getBestMove(cube.current_position) != "towards RED"	) {
				cube.setTowardRRVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {0,1,0}) &&
					solved_map.getBestMove(cube.current_position) != "away from BLUE"	) {
				cube.setAwayRBVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {0,-1,0}) &&
					solved_map.getBestMove(cube.current_position) != "towards BLUE"	) {
				cube.setTowardRBVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {1,0,0}) &&
					solved_map.getBestMove(cube.current_position) != "away from WHITE"	) {
				cube.setAwayRWVisible(true);
			}
			if(solved_map.isValidMove(cube.current_position, new int[] {-1,0,0}) &&
					solved_map.getBestMove(cube.current_position) != "towards WHITE"	) {
				cube.setTowardRWVisible(true);
			}
			canvas.fireCanvasChange();
		} else if (e.getSource() == display_solution_path_box) {
			cube.setIntSolVisible(display_solution_path_box.isSelected());
			canvas.fireCanvasChange();
		}
		
	}

	private void set_view() {
		cube.setRotation(new RotationMatrix(0, 0));
	}
	
}
