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
import java.util.Arrays;

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
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Canvas3D;

@SuppressWarnings("serial")
public class GamesCubeMan extends JApplet implements ChangeListener, ActionListener, PuzzleStateChangeListener {
	private TwistyPuzzle puzzle;
	private PuzzleCanvas puzzleCanvas;
	private Canvas3D canvas;
	private JSlider scale, distance, gap, turningRate;
	private JSpinner[] dimensions;
	private JCheckBox antialiasing, showTurnHistory, freeRotation;
	private JCheckBox[] tabBoxes;
	private JCheckBox colorChooserCheckBox, optionsCheckBox, keysCheckBox;
	private RollingJPanel optionsPanel, keysPanel;
	private JButton resetView, scramble, resetPuzzle;
	private JTextField turnHistoryField;
	private JRadioButton[] variationButtons;
	
	private String puzzleClassName = "edu.berkeley.gcweb.gui.gamescubeman.Cuboid.Cuboid";
	private int size_x = -1, size_y = -1, size_z = -1;
	private Color bg_color = Color.GRAY, fg_color = Color.WHITE;
	private boolean resizable = true, focus_indicator = true, draw_axis = false, free_rotation = true;
	private void parseParameters() {
		try {
			puzzleClassName = getParameter("puzzle_class");
		} catch(NullPointerException e) {
			//this indicates that we're not running as an applet
			return;
		}
		try {
			size_x = Integer.parseInt(getParameter("size_x"));
		} catch(Exception e) {}
		try {
			size_y = Integer.parseInt(getParameter("size_y"));
		} catch(Exception e) {}
		try {
			size_z = Integer.parseInt(getParameter("size_z"));
		} catch(Exception e) {}
		try {
			bg_color = Color.decode(getParameter("bg_color"));
		} catch(Exception e) {}
		try {
			fg_color = Color.decode(getParameter("fg_color"));
		} catch(Exception e) {}
		resizable = parseBoolean(getParameter("resizable"), resizable);
		focus_indicator = parseBoolean(getParameter("focus_indicator"), focus_indicator);
		draw_axis = parseBoolean(getParameter("draw_axis"), draw_axis);
		free_rotation = parseBoolean(getParameter("free_rotation"), free_rotation);
	}
	
	private Boolean parseBoolean(String s, boolean def) {
		if(s == null)
			return def;
		if(s.equalsIgnoreCase("true"))
			return true;
		else if(s.equalsIgnoreCase("false"))
			return false;
		return def;
	}
	
	public void paint(Graphics g) {
		if(puzzle == null)
			g.drawString("Loading puzzle class: " + puzzleClassName, 0, 20);
	}
	
	private JSObject jso;
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
					parseParameters();
					try {
						Class<? extends TwistyPuzzle> puzzleClass = Class.forName(puzzleClassName).asSubclass(TwistyPuzzle.class);
						puzzle = puzzleClass.getConstructor().newInstance();
					} catch (Exception e) {
						System.err.println("Error loading puzzle class " + puzzleClassName);
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
					
					optionsPanel.add(Utils.sideBySide(new JLabel("Distance"), distance, antialiasing));
					
					showTurnHistory = new JCheckBox("Show history", false);
					showTurnHistory.setFocusable(false);
					showTurnHistory.addActionListener(GamesCubeMan.this);
					
					scale = new JSlider(0, 10000, (int) canvas.getScale());
					scale.setFocusable(false);
					scale.addChangeListener(GamesCubeMan.this);
					optionsPanel.add(Utils.sideBySide(new JLabel("Scale"), scale, showTurnHistory));
					
					if(size_x != -1)
						puzzle.setDimensions(size_x, size_y, size_z);
					else //this'll even force dimensionless puzzles to draw their polys
						puzzle.setDimensions(puzzle.getDefaultXYZDimensions()); 
					if(puzzle.getDefaultXYZDimensions() != null) {
						int[] dim = puzzle.getDimensions();
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
						if(resizable)
							optionsPanel.add(dims);
					}
					
					freeRotation = new JCheckBox("Free rotation", free_rotation);
					freeRotation.setFocusable(false);
					freeRotation.addActionListener(GamesCubeMan.this);
					canvas.setFreeRotation(free_rotation);
					
					gap = new JSlider(0, 100, (int)(200*puzzle.getStickerGap()));
					gap.setFocusable(false);
					gap.addChangeListener(GamesCubeMan.this);
					optionsPanel.add(Utils.sideBySide(new JLabel("Gap"), gap, freeRotation));
					
					turningRate = new JSlider(1, puzzle.getMaxFramesPerAnimation(), puzzle.getFramesPerAnimation());
					turningRate.setMajorTickSpacing(1);
					turningRate.setMinorTickSpacing(1);
					turningRate.setPaintTicks(true);
					turningRate.setFocusable(false);
					turningRate.addChangeListener(GamesCubeMan.this);
					optionsPanel.add(Utils.sideBySide(new JLabel("Frames/Animation"), turningRate));
					
					ButtonGroup g = new ButtonGroup();
					String[] vars = puzzle.getPuzzleVariations();
					if(vars != null) {
						variationButtons = new JRadioButton[vars.length];
						for(int i = 0; i < variationButtons.length; i++) {
							variationButtons[i] = new JRadioButton(vars[i].toString(), vars[i].equals(puzzle.getPuzzleVariation()));
							variationButtons[i].setActionCommand(""+i);
							variationButtons[i].setFocusable(false);
							variationButtons[i].addActionListener(GamesCubeMan.this);
							g.add(variationButtons[i]);
						}
						if(resizable)
							optionsPanel.add(Utils.sideBySide(variationButtons));
					}
					
					JPanel topHalf = new JPanel(new BorderLayout());
					
					tabBoxes = Arrays.asList(colorChooserCheckBox, optionsCheckBox, keysCheckBox).toArray(new JCheckBox[0]);
					JPanel tabs = new JPanel();
					tabs.setLayout(new BoxLayout(tabs, BoxLayout.PAGE_AXIS));
					tabs.add(Utils.sideBySide(true, resetView, resetPuzzle, scramble));
					tabs.add(Utils.sideBySide(false, colorChooserCheckBox, optionsCheckBox, keysCheckBox));
					topHalf.add(tabs, BorderLayout.PAGE_START);
					
					turnHistoryField = new JTextField();
					turnHistoryField.setVisible(showTurnHistory.isSelected());
					topHalf.add(turnHistoryField, BorderLayout.CENTER);

					JPanel pane = new JPanel(new BorderLayout());
					setContentPane(pane);
					
					pane.add(topHalf, BorderLayout.PAGE_START);
					pane.add(puzzleCanvas, BorderLayout.CENTER);
					canvas.requestFocusInWindow();
					
					setBG_FG(pane, bg_color, fg_color);
				}
			});
			jso = JSObject.getWindow(this);
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

	public void stateChanged(ChangeEvent e) {
		Object src = e.getSource();
		if(src == gap) {
			puzzle.setStickerGap(gap.getValue() / 200.);
		} else if(src == distance) {
			double[] center = puzzle.getCenter();
			center[2] = distance.getValue();
			puzzle.setCenter(center[0], center[1], center[2]);
		} else if(src == scale) {
			canvas.setScale(scale.getValue());
		} else if(e.getSource() == turningRate) {
			puzzle.setFramesPerAnimation(turningRate.getValue());
		} else if(src instanceof JSpinner) {
			//TODO - the next 2 calls should be merged/figure out a solution to the dimensions issue
			puzzle.setDimensions((Integer) dimensions[0].getValue(), (Integer) dimensions[1].getValue(), (Integer) dimensions[2].getValue());
			puzzle.setPuzzleVariation(getSelectedVariation());
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
		} else if(e.getSource() instanceof JRadioButton)
			puzzle.setPuzzleVariation(getSelectedVariation());
	}
	private String getSelectedVariation() {
		for(int i = 0; i < variationButtons.length; i++)
			if(variationButtons[i].isSelected())
				return puzzle.getPuzzleVariations()[i];
		return null;
	}

	private void resetRotation() {
		puzzle.resetRotation();
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
}
