package edu.berkeley.gcweb.gui.gamescubeman.ThreeD;
import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Composite;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.RenderingHints;
import java.awt.Shape;
import java.awt.Stroke;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.geom.AffineTransform;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;

import javax.swing.JComponent;
import javax.swing.Timer;

@SuppressWarnings("serial")
public class Canvas3D extends JComponent implements KeyListener, ActionListener, MouseListener, MouseMotionListener {
	private static final double VIEWPORT = 1;
	private int SCALE = 400;
	private Timer t;
	public Canvas3D() {
		setFocusable(true);
		setOpaque(true);
		addKeyListener(this);
		addMouseListener(this);
		addMouseMotionListener(this);
		t = new Timer(10, this);
		t.start();
	}
	
	public int getScale() {
		return SCALE;
	}
	public void setScale(int scale) {
		SCALE = scale;
		repaint();
	}
	
	public void actionPerformed(ActionEvent e) {
		int x = 0, y = 0;
		if(keys.contains(KeyEvent.VK_LEFT))
			y--;
		if(keys.contains(KeyEvent.VK_RIGHT))
			y++;
		if(keys.contains(KeyEvent.VK_UP))
			x++;
		if(keys.contains(KeyEvent.VK_DOWN))
			x--;
		RotationMatrix temp = rotationRate.multiply(new RotationMatrix(0, x).multiply(new RotationMatrix(1, y)));
		for(Shape3D s : shapes)
			s.rotate(temp);
		repaint();
	}

	private RotationMatrix rotationRate = new RotationMatrix();
	private Point old;
	private long lastDrag;
	private HashSet<Integer> keys = new HashSet<Integer>();
	public void keyPressed(KeyEvent e) {
		keys.add(e.getKeyCode());
	}
	public void keyReleased(KeyEvent e) {
		keys.remove(e.getKeyCode());
	}
	public void keyTyped(KeyEvent e) {}
	public void mouseClicked(MouseEvent e) {
		requestFocusInWindow();
	}
	public void mouseEntered(MouseEvent e) {}
	public void mouseExited(MouseEvent e) {}
	public void mousePressed(MouseEvent e) {
		rotationRate = new RotationMatrix();
	}
	public void mouseReleased(MouseEvent e) {
		if(System.currentTimeMillis() - lastDrag > 100)
			mousePressed(null);
		t.start();
	}
	public void mouseDragged(MouseEvent e) {
		t.stop();
		lastDrag = System.currentTimeMillis();
		double deltaX = e.getX() - old.x;
		double deltaY = e.getY() - old.y;
		rotationRate = new RotationMatrix(1, deltaX).multiply(new RotationMatrix(0, -deltaY));
		old = e.getPoint();

		RotationMatrix m = new RotationMatrix();
		m = m.multiply(new RotationMatrix(1, deltaX).multiply(new RotationMatrix(0, -deltaY)));
		for(Shape3D s : shapes)
			s.rotate(m);
		repaint();
	}
	public void mouseMoved(MouseEvent e) {
		old = e.getPoint();
	}

	private ArrayList<Shape3D> shapes = new ArrayList<Shape3D>();
	public void addShape3D(Shape3D s) {
		shapes.add(s);
	}

	private boolean antialiasing = true;
	public void setAntialiasing(boolean aa) {
		 antialiasing = aa;
	}
	public boolean isAntialiasing() {
		return antialiasing;
	}
	
	protected void paintComponent(Graphics g) {
		if(isOpaque()) {
			g.setColor(getBackground());
			g.fillRect(0, 0, getWidth(), getHeight());
		}
		Graphics2D g2d = (Graphics2D) g;

		if(!isFocusOwner()) {
			AlphaComposite ac = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.3f);
			g2d.setComposite(ac);
		}
		Stroke oldStroke = g2d.getStroke();
		RenderingHints oldHints = g2d.getRenderingHints();
		g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, antialiasing ? RenderingHints.VALUE_ANTIALIAS_ON : RenderingHints.VALUE_ANTIALIAS_OFF);
		g2d.setStroke(new BasicStroke(2, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
		
		AffineTransform toCartesian = new AffineTransform();
		toCartesian.translate(getWidth() / 2, getHeight() / 2);
		toCartesian.rotate(Math.toRadians(180));
		g2d.transform(toCartesian);
		
		g2d.setColor(Color.BLUE); //draw the axis
		g2d.drawLine(0, -getHeight() / 2, 0, getHeight() / 2);
		g2d.drawLine(-getWidth() / 2, 0, getWidth() / 2, 0);
		
		g2d.setColor(Color.BLACK);
		
		//TODO - deal with z ordering! break everything into triangles?
		//TODO - buffer somehow?
		for(Shape3D s : shapes) {
			ArrayList<Polygon3D> polys = s.getPolygons();
			Collections.sort(polys);
			for(Polygon3D poly : polys) {
				Shape proj = poly.projectXYPlane(VIEWPORT, SCALE);
				if(poly.getFillColor() != null) {
					g2d.setColor(poly.getFillColor());
					Composite oldComposite = g2d.getComposite();
					g2d.setComposite(poly.getOpacity());
					g2d.fill(proj);
					g2d.setComposite(oldComposite);
				}
				if(poly.getBorderColor() != null) {
					g2d.setColor(poly.getBorderColor());
					g2d.draw(proj);
				}
			}
		}
		
		g2d.setRenderingHints(oldHints);
		g2d.setStroke(oldStroke);
	}
}
