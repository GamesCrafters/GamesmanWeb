package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.MouseWheelEvent;
import java.awt.event.MouseWheelListener;
import java.net.URLDecoder;
import java.util.Hashtable;

import javax.swing.BoxLayout;
import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JSlider;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import netscape.javascript.JSObject;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Canvas3D;

@SuppressWarnings("serial")
public class GamesCubeMan extends JApplet implements ChangeListener, ActionListener, PuzzleStateChangeListener, MouseWheelListener {
	private TwistyPuzzle puzzle;
	private PuzzleCanvas puzzleCanvas;
	private Canvas3D canvas;
	private JSlider scale, distance, turningRate;
	private JCheckBox antialiasing, showTurnHistory, freeRotation;
	private JCheckBox[] tabBoxes;
	private JCheckBox colorChooserCheckBox, optionsCheckBox, keysCheckBox;
	private RollingJPanel optionsPanel;
	private KeyCustomizerPanel keysPanel;
	private JButton resetView, scramble, resetPuzzle;
	private JTextField turnHistoryField;

	private String puzzle_class = "edu.berkeley.gcweb.gui.gamescubeman.Cuboid.Cuboid";
	private Color bg_color = Color.GRAY, fg_color = Color.WHITE;
	private boolean show_options = true, focus_indicator = true, draw_axis = false, free_rotation = true;
	private void parseParameters() {
		puzzle_class = getArgument("puzzle_class", puzzle_class);
		bg_color = getColor("bg_color", bg_color);
		fg_color = getColor("fg_color", fg_color);
		show_options = getBoolean("show_options", show_options);
		focus_indicator = getBoolean("focus_indicator", focus_indicator);
		draw_axis = getBoolean("draw_axis", draw_axis);
		free_rotation = getBoolean("free_rotation", free_rotation);
	}
	
	private String getArgument(String key, String def) {
		//anything specified in the url takes precedence
		String value = urlArguments.get(key);
		if(value != null)
			return value;
		try {
			value = getParameter(key);
			if(value != null)
				return value;
		} catch(NullPointerException e) {
			//this indicates that we're not running as an applet
		}
		return def;
	}
	
	private Color getColor(String key, Color def) {
		String val = getArgument(key, null);
		if(val == null)
			return def;
		try {
			return Color.decode(val);
		} catch(NumberFormatException e) {
			return def;
		}
	}
	
	private Boolean getBoolean(String key, boolean def) {
		return Utils.parseBoolean(getArgument(key, null), def);
	}
	
	public void paint(Graphics g) {
		super.paint(g);
		if(puzzle == null)
			g.drawString("Loading puzzle class: " + puzzle_class, 0, 20);
	}
	
	private JSObject jso;
	private Hashtable<String, String> urlArguments = new Hashtable<String, String>();;
	public static Cookies cookies = new Cookies();
	public void init() {
		addFocusListener(new FocusListener() {
			public void focusGained(FocusEvent e) {
				canvas.requestFocusInWindow();
			}
			public void focusLost(FocusEvent e) {}
		});
		try {
			SwingUtilities.invokeAndWait(new Runnable() {
				public void run() {
					try {
						jso = JSObject.getWindow(GamesCubeMan.this);
						cookies = new Cookies(jso);
						
						//this will read the arguments passed via the url
						String argString = ((String) ((JSObject) jso.getMember("location")).getMember("search"));
						if(argString.length() > 0) {
							argString = argString.substring(1);
							for(String param : argString.split("&")) {
								String[] key_val = param.split("=");
								if(key_val.length != 2) throw new Exception("Expected key=value not found in " + param);
								urlArguments.put(URLDecoder.decode(key_val[0], "utf-8"), URLDecoder.decode(key_val[1], "utf-8"));
							}
						}
					} catch(Exception e) {
						e.printStackTrace();
					}
					parseParameters();
					
					try {
						Class<? extends TwistyPuzzle> puzzleClass = Class.forName(puzzle_class).asSubclass(TwistyPuzzle.class);
						puzzle = puzzleClass.getConstructor().newInstance();
						cookies.setCategory(puzzle.getPuzzleName());
					} catch (Exception e) {
						System.err.println("Error loading puzzle class " + puzzle_class);
						e.printStackTrace();
						return;
					}
					
					optionsPanel = new RollingJPanel();
					optionsPanel.setLayout(new BoxLayout(optionsPanel, BoxLayout.PAGE_AXIS));
					keysPanel = new KeyCustomizerPanel(puzzle);
					
					puzzle.addStateChangeListener(GamesCubeMan.this);

					puzzleCanvas = new PuzzleCanvas(puzzle, optionsPanel, keysPanel);
					canvas = puzzleCanvas.getCanvas();
					canvas.setFocusIndicator(focus_indicator);
					canvas.setDrawAxis(draw_axis);
					resetRotation();
					
					resetView = new JButton("Reset View");
					resetView.setToolTipText(resetView.getText());
					resetView.setMnemonic(KeyEvent.VK_R);
					resetView.setFocusable(false);
					resetView.addActionListener(GamesCubeMan.this);
					
					resetPuzzle = new JButton("Reset Puzzle");
					resetPuzzle.setToolTipText(resetPuzzle.getText());
					resetPuzzle.setFocusable(false);
					resetPuzzle.addActionListener(GamesCubeMan.this);
					
					scramble = new JButton("Scramble");
					scramble.setToolTipText(scramble.getText());
					scramble.setMnemonic(KeyEvent.VK_S);
					scramble.setFocusable(false);
					scramble.addActionListener(GamesCubeMan.this);
					
					colorChooserCheckBox = new JCheckBox("Choose colors", false);
					colorChooserCheckBox.setMnemonic(KeyEvent.VK_C);
					colorChooserCheckBox.setFocusable(false);
					colorChooserCheckBox.addActionListener(GamesCubeMan.this);
					
					optionsCheckBox = new JCheckBox("Options", false);
					optionsCheckBox.setMnemonic(KeyEvent.VK_O);
					optionsCheckBox.setFocusable(false);
					optionsCheckBox.addActionListener(GamesCubeMan.this);
					
					keysCheckBox = new JCheckBox("Keys", false);
					keysCheckBox.setMnemonic(KeyEvent.VK_K);
					keysCheckBox.setFocusable(false);
					keysCheckBox.addActionListener(GamesCubeMan.this);
					
					distance = new JSlider(4, 200, (int) (puzzle.getCenter()[2]));
					distance.setFocusable(false);
					distance.addChangeListener(GamesCubeMan.this);
					
					antialiasing = new JCheckBox("Antialiasing", canvas.isAntialiasing());
					antialiasing.setMnemonic(KeyEvent.VK_A);
					antialiasing.setFocusable(false);
					antialiasing.addActionListener(GamesCubeMan.this);
					
					showTurnHistory = new JCheckBox("Show history", false);
					showTurnHistory.setFocusable(false);
					showTurnHistory.addActionListener(GamesCubeMan.this);
					
					freeRotation = new JCheckBox("Free rotation", free_rotation);
					freeRotation.setFocusable(false);
					freeRotation.addActionListener(GamesCubeMan.this);
					canvas.setFreeRotation(free_rotation);
					optionsPanel.add(Utils.sideBySide(antialiasing, showTurnHistory, freeRotation));
					
					turningRate = new JSlider(1, puzzle.getMaxFramesPerAnimation(), puzzle.getFramesPerAnimation());
					turningRate.setMajorTickSpacing(1);
					turningRate.setMinorTickSpacing(1);
					turningRate.setPaintTicks(true);
					turningRate.setFocusable(false);
					turningRate.addChangeListener(GamesCubeMan.this);
					optionsPanel.add(Utils.sideBySide(new JLabel("Frames/Animation"), turningRate));
					
					scale = new JSlider(0, 10000, (int) canvas.getScale());
					scale.setFocusable(false);
					scale.addChangeListener(GamesCubeMan.this);
					optionsPanel.add(Utils.sideBySide(new JLabel("Scale"), scale, new JLabel("Distance"), distance));

					for(PuzzleOption<?> option : puzzle.getDefaultOptions()) {
						String override = getArgument(option.getName(), null);
						if(override != null)
							option.setValue(override);
						if(show_options)
							optionsPanel.add(option.getComponent());
						option.addChangeListener(puzzle);
					}
					
					//now that all the options have been set, we can create the puzzle!
					puzzle.createPolys(false);
					
					JPanel topHalf = new JPanel(new BorderLayout());
					
					tabBoxes = new JCheckBox[] { colorChooserCheckBox, optionsCheckBox, keysCheckBox };
					JPanel tabs = new JPanel();
					tabs.setLayout(new BoxLayout(tabs, BoxLayout.PAGE_AXIS));
					tabs.add(Utils.sideBySide(true, resetView, resetPuzzle, scramble));
					tabs.add(Utils.sideBySide(false, colorChooserCheckBox, optionsCheckBox, keysCheckBox));
					topHalf.add(tabs, BorderLayout.PAGE_START);
					
					turnHistoryField = new JTextField();
					turnHistoryField.setEditable(false);
					turnHistoryField.setVisible(showTurnHistory.isSelected());
					topHalf.add(turnHistoryField, BorderLayout.CENTER);

					JPanel pane = new JPanel(new BorderLayout());
					setContentPane(pane);
					
					pane.add(topHalf, BorderLayout.PAGE_START);
					pane.add(puzzleCanvas, BorderLayout.CENTER);
					canvas.requestFocusInWindow();
					
					setMouseWheelListener(pane, GamesCubeMan.this);
					setBG_FG(pane, bg_color, fg_color);
				}
			});
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}
	
	private void setMouseWheelListener(JComponent comp, MouseWheelListener l) {
		comp.addMouseWheelListener(l);
		for(Component child : comp.getComponents()) {
			if(child instanceof JComponent)
				setMouseWheelListener((JComponent)child, l);
			else {
				child.addMouseWheelListener(l);
			}
		}
	}
	
	private void setBG_FG(JComponent comp, Color bg, Color fg) {
		if(comp instanceof JButton)
			return;
		comp.setBackground(bg);
		//we want to set the background of the jradiobuttons,
		//but the foreground determines the selected button, so
		//we don't want to set it to white (which isn't visible)
		if(comp instanceof JRadioButton)
			return;
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

	public void stateChanged(ChangeEvent e) {
		Object src = e.getSource();
		if(src == distance) {
			double[] center = puzzle.getCenter();
			center[2] = distance.getValue();
			puzzle.setCenter(center[0], center[1], center[2]);
		} else if(src == scale) {
			canvas.setScale(scale.getValue());
		} else if(e.getSource() == turningRate) {
			puzzle.setFramesPerAnimation(turningRate.getValue());
		}
	}

	public void actionPerformed(ActionEvent e) {
		if(e.getSource() == resetView)
			resetRotation();
		else if(e.getSource() == scramble)
			puzzle.scramble();
		else if(e.getSource() == resetPuzzle)
			puzzle.resetPuzzle();
		else if(e.getSource() == antialiasing)
			canvas.setAntialiasing(antialiasing.isSelected());
		else if(e.getSource() == freeRotation) {
			canvas.setFreeRotation(freeRotation.isSelected());
			resetRotation();
		} else if(Utils.indexOf(e.getSource(), tabBoxes) != -1) {
			for(JCheckBox box : tabBoxes)
				if(box != e.getSource())
					box.setSelected(false);
			puzzleCanvas.setColorEditing(colorChooserCheckBox.isSelected());
			optionsPanel.setVisible(optionsCheckBox.isSelected());
			keysPanel.setVisible(keysCheckBox.isSelected());
		} else if(e.getSource() == showTurnHistory) {
			turnHistoryField.setVisible(showTurnHistory.isSelected());
			this.validate();
		}
	}

	private void resetRotation() {
		puzzle.setRotation(puzzle.getPreferredViewAngle());
		//stop any rotations
		canvas.mousePressed(null);
	}
	
	public String getBoardString() {
		return puzzle.getState();
	}
	
	public boolean doMove(String move) {
		return puzzle.doTurn(move);
	}

	public void puzzleStateChanged(final TwistyPuzzle src, final PuzzleTurn turn) {
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				String hist = Utils.join(" ", src.getTurnHistory().toArray());
				//this check reduces flickering
				if(!hist.equals(turnHistoryField.getText()))
					turnHistoryField.setText(hist);
			}
		});
		if(jso != null) {
			new Thread() {
				public void run() {
					//we do this in a separate thread because the call() method will
					//hang for the javascript
					jso.call("puzzleStateChanged", new Object[] { turn, src.getState() });
				}
			}.start();
		}
	}
	
	public static void main(String[] args) {
		final GamesCubeMan a = new GamesCubeMan();
		a.init();
		a.setPreferredSize(new Dimension(400, 500));
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				JFrame f = new JFrame();
				f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
				JPanel pane = new JPanel();
				f.setContentPane(pane);
				f.add(a);
				f.pack();
				f.setVisible(true);
				if(a.canvas != null)
					a.canvas.requestFocusInWindow();
			}
		});
	}
	
	public void mouseWheelMoved(MouseWheelEvent e) {
		try {
			jso.eval("window.scrollBy(0, " + (e.getUnitsToScroll() * 50) + ")");
		} catch(Exception ex) {
			ex.printStackTrace();
		}
	}
}
