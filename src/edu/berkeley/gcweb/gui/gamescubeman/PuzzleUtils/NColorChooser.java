package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.HashMap;

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
		selectedFace = null;
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
	}
	
	protected void paintComponent(Graphics g) {
		Graphics2D g2d = (Graphics2D) g;

		g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, .8f));
		g2d.setColor(Color.BLACK);
		g2d.fillRect(0, 0, getWidth(), getHeight());

		g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1f));
		for(String face : colorRectangles.keySet()) {
			Rectangle2D r = colorRectangles.get(face);
			g2d.setColor(colors.get(face));
			g2d.fill(r);
			g2d.setColor(Color.WHITE);
			g2d.draw(r);
		}
	}
	
	private HashMap<String, Rectangle2D> colorRectangles;
	private HashMap<String, Color> colors;
	public void setColors(HashMap<String, Color> colors) {
		this.colors = colors;
		recomputeRectangles();
		fireColorsChanged();
	}

	private void recomputeRectangles() {
		colorRectangles = new HashMap<String, Rectangle2D>();
		double gap = (double) getWidth() / (colors.size()+1);
		double rectWidth = .6*HEIGHT;
		double w = 0;
		for(String face : colors.keySet()) {
			w += gap;
			colorRectangles.put(face, new Rectangle2D.Double(w-rectWidth/2., (HEIGHT-rectWidth)/2., rectWidth, rectWidth));
		}
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
	public void componentShown(ComponentEvent e) {}
	
	private String selectedFace = null;
	public String getSelectedFace() {
		return selectedFace;
	}
	private String getClickedFace() {
		Point p = getMousePosition();
		if(p == null) return null;
		for(String face : colorRectangles.keySet())
			if(colorRectangles.get(face).contains(p))
				return face;
		return null;
	}
	public void mouseClicked(MouseEvent e) {
		String face = getClickedFace();
		if(face != null) {
			if(e.getClickCount() == 2) {
				Color c = JColorChooser.showDialog(this, "Choose new color", colors.get(face));
				if(c != null) {
					colors.put(face, c);
					fireColorsChanged();
				}
			}
			getParent().setCursor(createCursor(colors.get(face)));
			selectedFace = face;
		}
	}
	private static final int CURSOR_SIZE = 32;
	private Cursor createCursor(Color c) {
		BufferedImage buffer = new BufferedImage(CURSOR_SIZE, CURSOR_SIZE, BufferedImage.TYPE_INT_ARGB);
		Graphics2D g2d = (Graphics2D) buffer.createGraphics();
//		g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
		g2d.setColor(c);
		g2d.fillRect(0, 0, CURSOR_SIZE, CURSOR_SIZE);
		g2d.setColor(Color.BLACK);
		g2d.setStroke(new BasicStroke(10));
		g2d.drawLine(0, 0, CURSOR_SIZE, 0);
		g2d.drawLine(0, 0, 0, CURSOR_SIZE);
		Toolkit tool = Toolkit.getDefaultToolkit();
		return tool.createCustomCursor(buffer, new Point(0, 0), "bucket");
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
		public void colorsChanged(HashMap<String, Color> colorScheme);
	}
}
