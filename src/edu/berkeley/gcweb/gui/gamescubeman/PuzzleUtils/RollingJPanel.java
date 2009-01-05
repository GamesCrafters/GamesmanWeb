package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.Cursor;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ContainerEvent;
import java.awt.event.ContainerListener;
import java.awt.event.MouseAdapter;

import javax.swing.JPanel;
import javax.swing.Timer;

public class RollingJPanel extends JPanel implements ActionListener {
	private Timer t;
	public RollingJPanel() {
		setOpaque(false);
		t = new Timer(10, this);
		super.setVisible(false);
		addMouseListener(new MouseAdapter() {}); //this is to prevent key presses from falling through the tab
		addContainerListener(new ContainerListener() {
			public void componentAdded(ContainerEvent e) {
			}
			public void componentRemoved(ContainerEvent e) {
				
			}
		});
	}
	
	private int preferredHeight;
	private double visible;
	private int direction;
	public void setVisible(boolean visible) {
		direction = visible ? 1 : -1;
		if(visible != isVisible()) {
			if(visible) {
				preferredHeight = Math.min(getPreferredSize().height, getParent().getHeight());
				super.setVisible(true);
			}
			else if(getParent() != null) getParent().setCursor(Cursor.getDefaultCursor());
			t.start();
		}
	}
	
	public void actionPerformed(ActionEvent e) {
		if(e.getSource() == t) {
			double increment = direction * Math.abs(preferredHeight - visible) / 5.;
			if(Math.round(increment) == 0)
				increment = direction;
			visible += increment;
			if(visible >= preferredHeight) {
				visible = preferredHeight;
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
}
