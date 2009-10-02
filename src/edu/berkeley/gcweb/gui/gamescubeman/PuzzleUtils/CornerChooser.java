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
import java.awt.geom.AffineTransform;
import java.awt.geom.GeneralPath;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.HashMap;

import javax.swing.JButton;
import javax.swing.JColorChooser;
import javax.swing.JComponent;
import javax.swing.JPanel;

public class CornerChooser extends RollingJPanel implements MouseListener, MouseMotionListener, ComponentListener{
	private static final int PREFERRED_HEIGHT = 50;
	private static final int STICKER_LENGTH = (int) (.3* PREFERRED_HEIGHT);
	private HashMap<String, Color> colors;
	private JComponent paintCanvas;
	private AppletSettings settings;
	private HashMap<GeneralPath, Color[]> StickerColor;
	private Color[] selectedCorner = new Color[3];
	//private HashMap<GeneralPath, >
	
	public CornerChooser(AppletSettings settings, HashMap<String, Color> colorScheme, JComponent paintCanvas) {
		this.paintCanvas = paintCanvas;
		this.settings = settings;
		setLayout(new BorderLayout());
		setPreferredSize(new Dimension(100, PREFERRED_HEIGHT));
		setOpaque(true);
		colors = colorScheme;
		//setColors(colors);
		GeneralPath p = new GeneralPath();
		addMouseListener(this);
		addMouseMotionListener(this);
		addComponentListener(this);
		setOpaque(true);
	}
	private GeneralPath drawSticker(Graphics2D g2d, float x, float y, double theta, Color c){
		GeneralPath p = new GeneralPath();
		p.moveTo(x,y);
		double t =Math.sin((Math.PI)/3);
		float a = (float) (STICKER_LENGTH*Math.sin(Math.PI/3*2));
		float b = (float) (STICKER_LENGTH*Math.sin(Math.PI/3));
		p.lineTo((float)(x-STICKER_LENGTH*Math.cos(Math.PI/6)),(float)(y-STICKER_LENGTH*Math.sin(Math.PI/6)));
		p.lineTo((float)(x),(float)(y-2*STICKER_LENGTH*Math.sin(Math.PI/6)));
		p.lineTo((float)(x+STICKER_LENGTH*Math.cos(Math.PI/6)),(float)(y-STICKER_LENGTH*Math.sin(Math.PI/6)));
		p.closePath();
		p.transform(AffineTransform.getRotateInstance(theta, x, y));
		g2d.setColor(c);
		g2d.fill(p);
		g2d.setColor(Color.WHITE);
		g2d.draw(p);
		
		return p;
	}
	private void drawCorner(Graphics2D g2d, float x, float y, Color a, Color b, Color c){
		GeneralPath p;
		Color[] stickers = new Color[3];
		stickers[0]=a;
		stickers[1]=b;
		stickers[2]=c;
		p=drawSticker(g2d,x,y,0,a);
		StickerColor.put(p, stickers);
		p=drawSticker(g2d,x,y,Math.PI/3*2,b);
		StickerColor.put(p, stickers);
		p=drawSticker(g2d,x,y,Math.PI/3*4,c);
		StickerColor.put(p, stickers);
		
		
	}
	protected void paintComponent(Graphics g) {
		StickerColor = new HashMap<GeneralPath, Color[]>();
		
		Graphics2D g2d = (Graphics2D) g;
		if(isOpaque()) {
			g2d.setColor(Color.BLACK);
			g2d.fillRect(0, 0, getWidth(), getHeight());
		}
		double gap = (double) getWidth() / 9;
		int x = 30;
		drawCorner(g2d,x,PREFERRED_HEIGHT/2,colors.get("U"),colors.get("F"),colors.get("L"));
		x +=STICKER_LENGTH+gap;
		drawCorner(g2d,x,PREFERRED_HEIGHT/2,colors.get("R"),colors.get("F"),colors.get("U"));
		x +=STICKER_LENGTH+gap;
		drawCorner(g2d,x,PREFERRED_HEIGHT/2,colors.get("D"),colors.get("F"),colors.get("R"));
		x +=STICKER_LENGTH+gap;
		drawCorner(g2d,x,PREFERRED_HEIGHT/2,colors.get("L"),colors.get("F"),colors.get("D"));
		x +=STICKER_LENGTH+gap;
		drawCorner(g2d,x,PREFERRED_HEIGHT/2,colors.get("U"),colors.get("L"),colors.get("B"));
		x +=STICKER_LENGTH+gap;
		drawCorner(g2d,x,PREFERRED_HEIGHT/2,colors.get("R"),colors.get("U"),colors.get("B"));
		x +=STICKER_LENGTH+gap;
		drawCorner(g2d,x,PREFERRED_HEIGHT/2,colors.get("D"),colors.get("R"),colors.get("B"));
		x +=STICKER_LENGTH+gap;
		drawCorner(g2d,x,PREFERRED_HEIGHT/2,colors.get("L"),colors.get("D"),colors.get("B"));
		
		
	}
	private void recomputeStickers() {
		
	}
	private Color[] getClickedFace() {
		Point p = getMousePosition();
		System.out.println(p);
		if(p == null) return null;
		for(GeneralPath face : StickerColor.keySet())
			if(face.contains(p)){
				System.out.println(StickerColor.get(face));
				return StickerColor.get(face);
			}
		return null;
	}
	
	private void refreshCursor() {
		Cursor c = selectedCorner == null ? Cursor.getDefaultCursor() : createCursor(selectedCorner);
		this.setCursor(c);
		paintCanvas.setCursor(c);
		repaint();
	}
	
	private static final int CURSOR_SIZE = 32;
	private Cursor createCursor(Color[] c) {
		BufferedImage buffer = new BufferedImage((int) (2*CURSOR_SIZE*Math.cos(Math.PI/6)), (int) (3*CURSOR_SIZE*Math.sin(Math.PI/6)), BufferedImage.TYPE_INT_ARGB);
		Graphics2D g2d = (Graphics2D) buffer.createGraphics();
		
		drawCorner(g2d, (float)(CURSOR_SIZE*Math.cos(Math.PI/6)), (float)(CURSOR_SIZE*Math.sin(Math.PI/6)), c[0], c[1], c[2]);
		
		Toolkit tool = Toolkit.getDefaultToolkit();
		return tool.createCustomCursor(buffer, new Point(0, 0), "bucket");
	}

	public void mouseClicked(MouseEvent e) {
		Color[] face = getClickedFace();
		if(face != null) {
			selectedCorner = face;
			refreshCursor();
		}
	}
	public void mouseEntered(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}
	public void mouseExited(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}
	public void mousePressed(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}
	public void mouseReleased(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}
	public void mouseDragged(MouseEvent e) {
		repaint();
	}
	public void mouseMoved(MouseEvent e) {
		repaint();
	}
	public void componentHidden(ComponentEvent e) {}
	public void componentMoved(ComponentEvent e) {}
	public void componentResized(ComponentEvent e) {}
	public void componentShown(ComponentEvent e) {}
	
}
	