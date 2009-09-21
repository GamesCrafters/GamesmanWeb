package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.swing.JCheckBox;
import javax.swing.Timer;

import edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils.PuzzleOption.PuzzleOptionChangeListener;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.RotationMatrix;
import edu.berkeley.gcweb.gui.gamescubeman.ThreeD.Shape3D;

public abstract class TwistyPuzzle extends Shape3D implements ActionListener, PuzzleStateChangeListener, PuzzleOptionChangeListener {
	public TwistyPuzzle(double x, double y, double z) {
		super(x, y, z);
		addStateChangeListener(this);
	}

	public void resetPuzzle() {
		scrambling = false;
		resetTimer();
		createPolys(false);
		fireStateChanged(null);
	}

	private ArrayList<PuzzleTurn> turns = new ArrayList<PuzzleTurn>();
	public ArrayList<PuzzleTurn> getTurnHistory() {
		return turns;
	}
	protected void appendTurn(PuzzleTurn nextTurn) {
		nextTurn.updateInternalRepresentation(false);
		PuzzleTurn lastTurn = turns.isEmpty() ? null : turns.remove(turns.size() - 1);
		PuzzleTurn newTurn = lastTurn == null ? nextTurn : nextTurn.mergeTurn(lastTurn);
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
		if(e.getSource() == turner) {
			TurnAnimation anim = animationQueue.get(0);
			//this is to detect when scrambling is finished
			if(anim == END_SCRAMBLING) {
				scrambling = false;
				startInspection();
			}
			for(PuzzleTurn finished : anim.animate())
				fireStateChanged(finished);
			if(anim.isEmpty()) {
				animationQueue.remove(0);
				if(animationQueue.isEmpty())
					turner.stop();
			}
		} else if(e.getSource() == timer) {
			updateTimeDisplay();
		}
	}
	
	private void updateTimeDisplay() {
		canvas.setDisplayString(isInspecting() ? Color.RED : Color.BLACK, getTime());
		canvas.repaint();
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

	private final TurnAnimation END_SCRAMBLING = new TurnAnimation(this);
	private boolean scrambling = false;
	public final void scramble() {
		resetPuzzle();
		scrambling = true;
		_scramble();
		animationQueue.add(END_SCRAMBLING);
	}
	
	public final void createPolys(boolean copyOld) {
		if(!copyOld) {
			turns.clear();
			animationQueue.clear();
			turner.stop();
		}
		clearPolys();
		_createPolys(copyOld);
	}
	
	private SliderOption frames_animation = new SliderOption("frames/animation", true, 5, 1, 20);
	
	public int getFramesPerAnimation() {
		return frames_animation.getValue();
	}
	
	public final List<PuzzleOption<?>> getDefaultOptions() {
		List<PuzzleOption<?>> options = _getDefaultOptions();
		options.add(0, frames_animation);
		return options;
	}
	
	//*** To implement a custom twisty puzzle, you must override the following methods and provide a noarg constructor ***
	protected abstract String getPuzzleName();
	
	protected abstract void _createPolys(boolean copyOld);
	protected abstract void _scramble();
	protected abstract boolean _doTurn(String turn);
	
	public abstract List<PuzzleOption<?>> _getDefaultOptions();

	public abstract String getState();
	public abstract boolean isSolved();
	public abstract HashMap<String, Color> getDefaultColorScheme();
	//this should set the default angle to view the puzzle from (using Shape3D's setRotation() method)
	public abstract RotationMatrix getPreferredViewAngle();
	
	public JCheckBox puzzleOption() {
		return null;
	}
	
	//*** END TWISTY PUZZLE IMPLEMENTATION ***
	
	private KeyCustomizerPanel keyPanel;
	public void setKeyCustomizerPanel(KeyCustomizerPanel keyPanel) {
		this.keyPanel = keyPanel;
	}
	public final void doTurn(KeyEvent e) {
		if(keyPanel != null)
			doTurn(keyPanel.getTurnForKey(e));
	}
	public void puzzleStateChanged(TwistyPuzzle src, PuzzleTurn turn) {
		//this will start the timer if we're currently inspecting
		if(!scrambling && isInspecting() && turn != null && !turn.isInspectionLegal())
			start = System.currentTimeMillis() - INSPECTION_TIME*1000;
		if(src.isSolved() && isTiming())
			stopTimer();
	}
	private static final int INSPECTION_TIME = 15;
	private static final DecimalFormat df = new DecimalFormat("0.00");
	private String getTime() {
		if(start == -1)
			return "";
		if(isInspecting())
			return "" + (int)Math.ceil(getCountdownSeconds());
		return "" + df.format(getElapsedTime()/1000.);
	}
	private long start = -1, stop = -1;
	private void stopTimer() {
		if(!isTiming()) return;
		stop = System.currentTimeMillis();
		timer.stop();
		updateTimeDisplay();
	}
	private long getElapsedTime() {
		if(start == -1) return 0;
		long time = stop;
		if(stop == -1)
			time = System.currentTimeMillis();
		return time - start - 1000*INSPECTION_TIME;
	}
	private double getCountdownSeconds() {
		return -getElapsedTime()/1000.;
	}
	private boolean isTiming() {
		return start != -1 && stop == -1;
	}
	private boolean isInspecting() {
		return start != -1 && getCountdownSeconds() > 0;
	}
	private void startInspection() {
		start = System.currentTimeMillis();
		stop = -1;
		timer.start();
	}
	private void resetTimer() {
		stop = start = -1;
		timer.stop();
		updateTimeDisplay();
	}
	private Timer timer = new Timer(100, this);
	//returns true if the String was recognized as a turn
	public final boolean doTurn(String turn) {
		if(turn == null || scrambling) return false;
		if(turn.equals("scramble")) {
			
			scramble();
			return true;
		}
		return _doTurn(turn);
	}
	public void piecePicker(){
		return;
	}
	
	public boolean piecePickerSupport(){
		//if 2x2x2 return true
		return false;
	}
}
