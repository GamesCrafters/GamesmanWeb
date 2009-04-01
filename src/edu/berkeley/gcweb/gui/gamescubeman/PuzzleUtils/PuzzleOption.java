package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.util.ArrayList;

import javax.swing.JPanel;

public abstract class PuzzleOption<H> {
	private String name;
	
	public PuzzleOption(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
	//this could come from anywhere, possibly as an applet parameter or a url argument
	public abstract void setValue(String val);
	
	public abstract H getValue();
	public abstract JPanel getComponent();
	
	private ArrayList<PuzzleOptionChangeListener> listeners = new ArrayList<PuzzleOptionChangeListener>();
	
	public final void addChangeListener(PuzzleOptionChangeListener l) {
		listeners.add(l);
	}
	
	public final void fireOptionChanged() {
		for(PuzzleOptionChangeListener l : listeners)
			l.puzzleOptionChanged(this);
	}
	
	public abstract interface PuzzleOptionChangeListener {
		public abstract void puzzleOptionChanged(PuzzleOption<?> src);
	}
}
