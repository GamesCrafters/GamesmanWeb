package edu.berkeley.gcweb.gui.gamescubeman.XYZCube;

import java.awt.Cursor;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;

import javax.swing.JPanel;
import javax.swing.Timer;

public class RollingJPanel extends JPanel implements ActionListener {
	private Timer t;
	public RollingJPanel() {
		setOpaque(false);
		t = new Timer(10, this);
		super.setVisible(false);
		addMouseListener(new MouseAdapter() {});
	}
	
	private static final int HEIGHT = 150;
	private double visible;
	private int direction;
	public void setVisible(boolean visible) {
		direction = visible ? 1 : -1;
		if(visible != isVisible()) {
			if(visible) super.setVisible(true);
			else if(getParent() != null) getParent().setCursor(Cursor.getDefaultCursor());
			t.start();
		}
	}
	
	public void actionPerformed(ActionEvent e) {
		double increment = direction * Math.abs(HEIGHT - visible) / 5.;
		if(Math.round(increment) == 0)
			increment = direction;
		visible += increment;
		if(visible >= HEIGHT) {
			visible = HEIGHT;
			t.stop();
		} else if(visible <= 0) {
			visible = 0;
			t.stop();
			super.setVisible(false);
		}
		setBounds(0, 0, getParent().getWidth(), (int) visible);
		validate();
	}
}
