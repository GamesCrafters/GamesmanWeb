package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Properties;

import javax.swing.Timer;

import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Shape3D;

public abstract class TwistyPuzzle extends Shape3D implements ActionListener {
	public TwistyPuzzle(double x, double y, double z) {
		super(x, y, z);
	}

	protected double stickerGap = getDefaultStickerGap();
	public double getStickerGap() {
		return stickerGap;
	}
	protected double getDefaultStickerGap() {
		return 0.1;
	}
	//spacing can range from 0->.5
	public void setStickerGap(double spacing) {
		this.stickerGap = spacing;
		createPolys(true);
	}

	public void resetPuzzle() {
		createPolys(false);
	}

	private ArrayList<PuzzleTurn> turns = new ArrayList<PuzzleTurn>();
	public ArrayList<PuzzleTurn> getTurnHistory() {
		return turns;
	}
	protected void appendTurn(PuzzleTurn nextTurn) {
		nextTurn.updateInternalRepresentation(false);
		PuzzleTurn lastTurn = turns.isEmpty() ? null : turns.remove(turns.size() - 1);
		PuzzleTurn newTurn = nextTurn.mergeTurn(lastTurn);
		if(newTurn == null) {
			turns.add(lastTurn);
			turns.add(nextTurn);
		} else if(!newTurn.isNullTurn())
			turns.add(newTurn);
		
		if(animationQueue.isEmpty())
			animationQueue.add(new TurnAnimation(this));
		TurnAnimation lastAnim = animationQueue.get(animationQueue.size() - 1);
		if(!lastAnim.mergeTurn(nextTurn))
			animationQueue.add(new TurnAnimation(this, nextTurn));
		turner.start();
	}
	
	private Timer turner = new Timer(10, this);
	private ArrayList<TurnAnimation> animationQueue = new ArrayList<TurnAnimation>();
	public void actionPerformed(ActionEvent e) {
		TurnAnimation anim = animationQueue.get(0);
		for(PuzzleTurn finished : anim.animate())
			fireStateChanged(finished);
		if(anim.isEmpty()) {
			animationQueue.remove(0);
			if(animationQueue.isEmpty())
				turner.stop();
		}
	}

	private int framesPerAnimation = 5; //this is the number of animations per turn (less -> faster animation)
	public int getMaxFramesPerAnimation() {
		return 20;
	}
	public int getFramesPerAnimation() {
		return framesPerAnimation;
	}
	public void setFramesPerAnimation(int newRate) {
		framesPerAnimation = newRate;
	}
	
	private ArrayList<PuzzleStateChangeListener> stateListeners = new ArrayList<PuzzleStateChangeListener>();
	public void addStateChangeListener(PuzzleStateChangeListener l) {
		stateListeners.add(l);
	}
	public void fireStateChanged(PuzzleTurn turn) {
		for(PuzzleStateChangeListener l : stateListeners)
			l.puzzleStateChanged(this, turn);
		fireCanvasChange();
	}

	private String variation;
	{
		String[] vars = getPuzzleVariations();
		if(vars != null && vars.length > 0)
			variation = vars[0];
	}
	public void setPuzzleVariation(String variation) {
		this.variation = variation;
	}
	public final String getPuzzleVariation() {
		return variation;
	}

	protected int[] dimensions = null;
	public int[] getDimensions() {
		return dimensions;
	}
	public void setDimensions(int dimX, int dimY, int dimZ) {
		setDimensions(new int[] { dimX, dimY, dimZ });
	}
	public void setDimensions(int[] dims) {
		dimensions = dims;
		createPolys(false);
	}
	
	//*** To implement a custom twisty puzzle, you must override the following methods and provide a noarg constructor *** 
	//something like a cuboid would have this, whereas square one wouldn't
	protected int[] getDefaultXYZDimensions() {
		return null;
	}
	protected String[] getPuzzleVariations() {
		return null;
	}
	protected void createPolys(boolean copyOld) {
		if(!copyOld) {
			turns.clear();
			animationQueue.clear();
			turner.stop();
		}
		clearPolys();
	}
	public abstract void scramble();
	public abstract boolean isSolved();
	public abstract HashMap<String, Color> getDefaultColorScheme();
	//this sets the default angle to view the puzzle from (using Shape3D's setRotation() method)
	public abstract void resetRotation();
	
	private Properties keyProps = new Properties();
	public Properties getKeyboardLayout() {
		return keyProps;
	}
	public void setKeyboardLayout(Properties props) {
		keyProps = props;
	}
	{
		try {
			keyProps.load(this.getClass().getResourceAsStream("keys.properties"));
		} catch(FileNotFoundException e) {
			e.printStackTrace();
		} catch(IOException e) {
			e.printStackTrace();
		} catch(NullPointerException e) {
			System.err.println("keys.properties not found!");
			e.printStackTrace();
		}
	}
	public final void doTurn(KeyEvent e) {
		String turn = (String) keyProps.get(""+e.getKeyChar());
		if(e.isAltDown() || turn == null) return;
		doTurn(turn);
	}
	//returns true if the String was recognized as a turn
	public abstract boolean doTurn(String turn);
	public abstract String getState();
}
