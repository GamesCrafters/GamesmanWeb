package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
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
import java.util.Dictionary;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;

import javax.swing.JButton;
import javax.swing.JColorChooser;
import javax.swing.JComponent;
import javax.swing.JPanel;

public class NColorChooser extends RollingJPanel {
	private static final int PREFERRED_HEIGHT = 50;
	private JButton reset;
	private ColorBoxes boxes;
	private HashMap<String, Color> colors, backupColors;
	private JComponent paintCanvas;
	public NColorChooser(HashMap<String, Color> colorScheme, JComponent paintCanvas) {
		this.paintCanvas = paintCanvas;
		setLayout(new BorderLayout());
		setPreferredSize(new Dimension(100, PREFERRED_HEIGHT));
		setOpaque(true);
		
		reset = new JButton("Reset");
		reset.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				setColors(backupColors);
				boxes.refreshCursor();
			}
		});
		reset.setFocusable(false);
		reset.setBounds(0, 0, 40, 20);
		add(reset, BorderLayout.LINE_START);
		
		boxes = new ColorBoxes();
		add(boxes, BorderLayout.CENTER);
		
		backupColors = (HashMap<String, Color>) colorScheme.clone();
		colors = colorScheme;
		loadCookie();
		setColors(colors);
	}
	
	public void setVisible(boolean visible) {
		super.setVisible(visible);
		if(!visible)
			boxes.selectedFace = null;
		boxes.refreshCursor();
	}
	
	private class ColorBoxes extends JPanel implements MouseListener, MouseMotionListener, ComponentListener {
		public ColorBoxes() {
			addMouseListener(this);
			addMouseMotionListener(this);
			addComponentListener(this);
		}
		private HashMap<String, Rectangle2D> colorRectangles;
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

		private void recomputeRectangles() {
			colorRectangles = new HashMap<String, Rectangle2D>();
			double gap = (double) getWidth() / (colors.size()+1);
			double rectWidth = .6*PREFERRED_HEIGHT;
			double w = 0;
			for(String face : colors.keySet()) {
				w += gap;
				colorRectangles.put(face, new Rectangle2D.Double(w-rectWidth/2., (PREFERRED_HEIGHT-rectWidth)/2., rectWidth, rectWidth));
			}
		}
		private String getClickedFace() {
			Point p = getMousePosition();
			if(p == null) return null;
			for(String face : colorRectangles.keySet())
				if(colorRectangles.get(face).contains(p))
					return face;
			return null;
		}
		public void mouseDragged(MouseEvent e) {
			repaint();
		}
		public void mouseMoved(MouseEvent e) {
			repaint();
		}
		public void componentHidden(ComponentEvent e) {}
		public void componentMoved(ComponentEvent e) {}
		public void componentShown(ComponentEvent e) {}
		public void componentResized(ComponentEvent e) {
			boxes.recomputeRectangles();
		}
		
		private String selectedFace = null;
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
				selectedFace = face;
				refreshCursor();
			}
		}
		private void refreshCursor() {
			Cursor c = selectedFace == null ? Cursor.getDefaultCursor() : createCursor(colors.get(selectedFace));
			this.setCursor(c);
			paintCanvas.setCursor(c);
		}
		private static final int CURSOR_SIZE = 32;
		private Cursor createCursor(Color c) {
			BufferedImage buffer = new BufferedImage(CURSOR_SIZE, CURSOR_SIZE, BufferedImage.TYPE_INT_ARGB);
			Graphics2D g2d = (Graphics2D) buffer.createGraphics();
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
	}
	
	public void setColors(HashMap<String, Color> colors) {
		this.colors = colors;
		boxes.recomputeRectangles();
		fireColorsChanged();
	}
	
	private void loadCookie() {
		Dictionary<String, String> cookie = GamesCubeMan.cookies.getMap("colors");
		if(cookie != null) {
			colors = new HashMap<String, Color>();
			Enumeration<String> keys = cookie.keys();
			while(keys.hasMoreElements()) {
				String key = keys.nextElement();
				colors.put(key, Utils.stringToColor(cookie.get(key), true));
			}
		}
	}
	private void saveCookie() {
		Hashtable<Object, Object> map = new Hashtable<Object, Object>();
		for(String face : colors.keySet())
			map.put(face, Utils.colorToString(colors.get(face)));
		GamesCubeMan.cookies.setMap("colors", map);
	}

	public String getSelectedFace() {
		return boxes.selectedFace;
	}
	
	private ArrayList<ColorChangeListener> listeners = new ArrayList<ColorChangeListener>();
	public void addColorChangeListener(ColorChangeListener l) {
		listeners.add(l);
		l.colorsChanged(colors);
	}
	private void fireColorsChanged() {
		saveCookie();
		for(ColorChangeListener l : listeners)
			l.colorsChanged(colors);
	}

	public interface ColorChangeListener {
		public void colorsChanged(HashMap<String, Color> colorScheme);
	}
}
