package edu.berkeley.gcweb.gui.gamescubeman.XYZCube;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.geom.Rectangle2D;
import java.util.ArrayList;

import javax.swing.JColorChooser;
import javax.swing.JComponent;
import javax.swing.Timer;

public class NColorChooser extends JComponent implements ActionListener, MouseMotionListener, MouseListener, ComponentListener {
	private Timer t;
	public NColorChooser() {
		t = new Timer(10, this);
		addMouseMotionListener(this);
		addComponentListener(this);
		addMouseListener(this);
	}
	
	private static final int HEIGHT = 50;
	private double visible;
	private int direction;
	public void setVisible(boolean visible) {
		direction = visible ? 1 : -1;
		if(visible != isVisible()) {
			if(visible) super.setVisible(true);
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
	}
	
	protected void paintComponent(Graphics g) {
		Graphics2D g2d = (Graphics2D) g;

		g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, .8f));
		g2d.setColor(Color.BLACK);
		g2d.fillRect(0, 0, getWidth(), getHeight());

		g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1f));
		for(int i = 0; i < colorRectangles.length; i++) {
			Rectangle2D r = colorRectangles[i];
			g2d.setColor(colors[i]);
			g2d.fill(r);
			g2d.setColor(Color.WHITE);
			g2d.draw(r);
		}
	}
	
	private Rectangle2D[] colorRectangles;
	private Color[] colors;
	public void setColors(Color[] colors) {
		this.colors = colors;
		recomputeRectangles();
		fireColorsChanged();
	}

	private void recomputeRectangles() {
		colorRectangles = new Rectangle2D[colors.length];
		double increment = (double) getWidth() / colors.length;
		double w = 0;
		for(int i = 0; i < colors.length; i++, w += increment)
			colorRectangles[i] = new Rectangle2D.Double(w + 10, 10, HEIGHT - 20, HEIGHT - 20);
	}

	public void mouseDragged(MouseEvent e) {
		repaint();
	}
	public void mouseMoved(MouseEvent e) {
		repaint();
	}
	public void componentHidden(ComponentEvent e) {
		
	}
	public void componentMoved(ComponentEvent e) {
		
	}
	public void componentResized(ComponentEvent e) {
		recomputeRectangles();
	}
	public void componentShown(ComponentEvent e) {
		
	}
	private int getSelectedIndex() {
		Point p = getMousePosition();
		if(p == null) return -1;
		for(int i = 0; i < colorRectangles.length; i++)
			if(colorRectangles[i].contains(p))
				return i;
		return -1;
	}
	public void mouseClicked(MouseEvent e) {
		int i = getSelectedIndex();
		if(i != -1) {
			Color c = JColorChooser.showDialog(this, "Choose new color", colors[i]);
			if(c != null) {
				colors[i] = c;
				fireColorsChanged();
			}
		}
	}
	public void mouseEntered(MouseEvent e) {}
	public void mouseExited(MouseEvent e) {}
	public void mousePressed(MouseEvent e) {}
	public void mouseReleased(MouseEvent e) {}
	
	private ArrayList<ColorChangeListener> listeners = new ArrayList<ColorChangeListener>();
	public void addColorChangeListener(ColorChangeListener l) {
		listeners.add(l);
	}
	private void fireColorsChanged() {
		for(ColorChangeListener l : listeners)
			l.colorsChanged(colors);
	}
	public interface ColorChangeListener {
		public void colorsChanged(Color[] colorScheme);
	}
}
