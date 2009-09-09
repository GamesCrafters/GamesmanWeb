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

import javax.swing.BoxLayout;
import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JRadioButton;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

import netscape.javascript.JSObject;
import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleOption.PuzzleOptionChangeListener;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Canvas3D;

@SuppressWarnings("serial")
public class GamesCubeMan extends JApplet implements ActionListener, PuzzleStateChangeListener, MouseWheelListener {
	private TwistyPuzzle puzzle;
	private PuzzleCanvas puzzleCanvas;
	private Canvas3D canvas;
	private JCheckBox[] tabBoxes;
	private JCheckBox colorChooserCheckBox, optionsCheckBox, keysCheckBox;
	private RollingJPanel optionsPanel;
	private KeyCustomizerPanel keysPanel;
	private JButton resetView, scramble, resetPuzzle;
	private JTextField turnHistoryField;

	
	private String puzzle_class = "edu.berkeley.gcweb.gui.gamescubeman.Cuboid.Cuboid";
	
	private ColorOption bg_color = new ColorOption("bg_color", false, Color.GRAY);
	private ColorOption fg_color = new ColorOption("fg_color", false, Color.WHITE);
	private CheckBoxOption show_options = new CheckBoxOption("show_options", false, true);
	private CheckBoxOption focus_indicator = new CheckBoxOption("focus_indicator", true, true);
	private CheckBoxOption draw_axis = new CheckBoxOption("draw_axis", false, false);
	private CheckBoxOption free_rotation = new CheckBoxOption("free_rotation", true, true);
	private CheckBoxOption antialiasing = new CheckBoxOption("antialiasing", true, true);
	private CheckBoxOption show_history = new CheckBoxOption("show_history", true, false);
	private SliderOption scale = new SliderOption("scale", true, (int) Canvas3D.DEFAULT_SCALE, 0, 10000);
	private SliderOption distance = new SliderOption("distance", true, 4, 4, 100);
	
	public void paint(Graphics g) {
		super.paint(g);
		if(puzzle == null)
			g.drawString("Loading puzzle class: " + puzzle_class, 0, 20);
	}
	
	private JSObject jso;
	private AppletSettings settings = new AppletSettings(this, null); //this is a just a default until we can load the url arguments
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
						settings = new AppletSettings(GamesCubeMan.this, jso);
					} catch(Exception e) {
						e.printStackTrace();
					}
					
					try {
						puzzle_class = settings.get("puzzle_class", puzzle_class);
						Class<? extends TwistyPuzzle> puzzleClass = Class.forName(puzzle_class).asSubclass(TwistyPuzzle.class);
						puzzle = puzzleClass.getConstructor().newInstance();
						settings.loadCookies(puzzle.getPuzzleName());
					} catch (Exception e) {
						System.err.println("Error loading puzzle class " + puzzle_class);
						e.printStackTrace();
						return;
					}
					
					optionsPanel = new RollingJPanel();
					optionsPanel.setLayout(new BoxLayout(optionsPanel, BoxLayout.PAGE_AXIS));
					keysPanel = new KeyCustomizerPanel(puzzle, settings);
					
					puzzle.addStateChangeListener(GamesCubeMan.this);

					puzzleCanvas = new PuzzleCanvas(settings, puzzle, optionsPanel, keysPanel);
					canvas = puzzleCanvas.getCanvas();
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


					PuzzleOptionChangeListener pl = new PuzzleOptionChangeListener() {
						public void puzzleOptionChanged(PuzzleOption<?> src) {
							if(src != null)
								settings.set(src.getName(), src.valueToString());

							canvas.setFocusIndicator(focus_indicator.getValue());
							canvas.setDrawAxis(draw_axis.getValue());
							canvas.setFreeRotation(free_rotation.getValue());
							turnHistoryField.setVisible(show_history.getValue());
							GamesCubeMan.this.validate();
							canvas.setAntialiasing(antialiasing.getValue());
							canvas.setFreeRotation(free_rotation.getValue());
							double[] center = puzzle.getCenter();
							puzzle.setCenter(center[0], center[1], distance.getValue());
							canvas.setScale(scale.getValue());
						}
					};
					
					PuzzleOption<?>[] options = new PuzzleOption<?>[] { bg_color, fg_color, show_options, focus_indicator, draw_axis, free_rotation, antialiasing, show_history, scale, distance };
					for(PuzzleOption<?> option : options) {
						String val = settings.get(option.getName(), null);
						if(val != null)
							option.setValue(val);
						option.addChangeListener(pl);
					}
					if(show_options.getValue()) {
						optionsPanel.add(Utils.sideBySide(antialiasing.getComponent(), show_history.getComponent(), free_rotation.getComponent()));
						optionsPanel.add(Utils.sideBySide(scale.getComponent(), distance.getComponent()));
					}
					
					for(PuzzleOption<?> option : puzzle.getDefaultOptions()) {
						if(show_options.getValue() && option.isGuifiable())
							optionsPanel.add(option.getComponent());
						String val = settings.get(option.getName(), null);
						if(val != null)
							option.setValue(val);
						option.addChangeListener(puzzle);
						option.addChangeListener(pl);
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
					topHalf.add(turnHistoryField, BorderLayout.CENTER);

					JPanel pane = new JPanel(new BorderLayout());
					setContentPane(pane);
					
					pane.add(topHalf, BorderLayout.PAGE_START);
					pane.add(puzzleCanvas, BorderLayout.CENTER);
					canvas.requestFocusInWindow();
					
					setMouseWheelListener(pane, GamesCubeMan.this);
					setBG_FG(pane, bg_color.getValue(), fg_color.getValue());
					pl.puzzleOptionChanged(null);
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

	public void actionPerformed(ActionEvent e) {
		if(e.getSource() == resetView)
			resetRotation();
		else if(e.getSource() == scramble)
			puzzle.scramble();
		else if(e.getSource() == resetPuzzle)
			puzzle.resetPuzzle();
		else if(Utils.indexOf(e.getSource(), tabBoxes) != -1) {
			for(JCheckBox box : tabBoxes)
				if(box != e.getSource())
					box.setSelected(false);
			puzzleCanvas.setColorEditing(colorChooserCheckBox.isSelected());
			optionsPanel.setVisible(optionsCheckBox.isSelected());
			keysPanel.setVisible(keysCheckBox.isSelected());
		} else
			throw new RuntimeException();
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
					try {
						jso.call("puzzleStateChanged", new Object[] { turn, src.getState() });
					} catch (Exception e) {}
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
