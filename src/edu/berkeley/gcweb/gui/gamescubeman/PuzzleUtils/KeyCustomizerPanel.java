package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.Properties;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;

public class KeyCustomizerPanel extends RollingJPanel {
	//TODO - store in a cookie (and update html display)
	private TwistyPuzzle puzzle;
	private Properties keyLayoutBackup, keyLayout;
	private JPanel keyPanel;
	private JCheckBox caps;
	private JButton reset;
	
	private static final char[][] QWERTY_LOWER = {
		{ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' },
		{ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' },
		{ 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';' },
		{ 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/' },
	};
	private static final char[][] QWERTY_UPPER = {
		{ '!', '@', '#', '$', '%', '^', '&', '*', '(', ')' },
		{ 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P' },
		{ 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':' },
		{ 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?' },
	};
	private KeyEditor[][] keyEditors;
	public KeyCustomizerPanel(TwistyPuzzle twistyPuzzle) {
		puzzle = twistyPuzzle;
		keyLayout = puzzle.getKeyboardLayout();
		keyLayoutBackup = (Properties) keyLayout.clone();
		keyPanel = new JPanel();
		keyPanel.setLayout(new GridLayout(0, 1));
		keyEditors = new KeyEditor[QWERTY_LOWER.length][];
		for(int row=0; row<QWERTY_LOWER.length; row++) {
			keyEditors[row] = new KeyEditor[QWERTY_LOWER[row].length];
			JPanel rowPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 2, 2));
			keyPanel.add(rowPanel);
			rowPanel.add(new KeyEditor(row));
			for(int i=0; i<QWERTY_LOWER[row].length; i++) {
				keyEditors[row][i] = new KeyEditor();
				rowPanel.add(keyEditors[row][i]);
			}
			rowPanel.add(new KeyEditor(QWERTY_LOWER.length-row));
		}
		
		caps = new JCheckBox("CAPS");
		caps.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				keysChanged();
			}
		});
		
		reset = new JButton("Reset");
		reset.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				keyLayout = (Properties) keyLayoutBackup.clone();
				puzzle.setKeyboardLayout(keyLayout);
				keysChanged();
			}
		});
		
		setLayout(new BorderLayout());
		add(new JScrollPane(keyPanel), BorderLayout.CENTER);
		add(keyPanel, BorderLayout.CENTER);
		add(Utils.sideBySide(reset, caps), BorderLayout.PAGE_END);
		
		keysChanged();
	}
	private void keysChanged() {
		for(int row=0; row<keyEditors.length; row++)
			for(int i=0; i<keyEditors[row].length; i++) {
				char[][] qwerty = caps.isSelected() ? QWERTY_UPPER : QWERTY_LOWER;
				keyEditors[row][i].setKey(qwerty[row][i]+"");
				keyEditors[row][i].setTurn(keyLayout.getProperty(keyEditors[row][i].key));
			}
	}
	private class KeyEditor extends JPanel {
		private JLabel keyLabel, turnLabel;
		private JTextField editor;
		private String key, turn;
		public KeyEditor() {
			keyLabel = new JLabel();
			keyLabel.setFont(getFont().deriveFont(10f));
			turnLabel = new JLabel();
			editor = new JTextField(2);
			editor.setFont(getFont().deriveFont(10f));
			setEditing(false);
			editor.addFocusListener(new FocusAdapter() {
				public void focusLost(FocusEvent e) {
					setEditing(false);
				}
			});
			editor.addKeyListener(new KeyAdapter() {
				public void keyPressed(KeyEvent e) {
					if(e.getKeyCode() == KeyEvent.VK_ENTER) {
						String turn = editor.getText();
						keyLayout.setProperty(key, turn);
						setTurn(turn);
					} else if(e.getKeyCode() == KeyEvent.VK_ESCAPE)
						setEditing(false);
				}
			});
			
			setLayout(new BoxLayout(this, BoxLayout.PAGE_AXIS));
			JPanel test = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
			test.add(keyLabel);
			add(test);

			test = new JPanel();
			test.setLayout(new BoxLayout(test, BoxLayout.PAGE_AXIS));
			test.add(turnLabel);
			turnLabel.setAlignmentX(.5f);
			add(test);
			add(editor);
			
			updateBorder();
			addMouseListener(new MouseAdapter() {
				public void mouseEntered(MouseEvent e) {
					updateBorder();
				}
				public void mouseExited(MouseEvent e) {
					updateBorder();
				}
				public void mouseClicked(MouseEvent e) {
					setEditing(true);
				}
			});
		}
		public void setKey(String key) {
			this.key = key;
			setEditing(false);
		}
		public void setTurn(String turn) {
			this.turn = turn;
			setEditing(false);
		}
		private void setEditing(boolean editing) {
			updateBorder();
			setToolTipText(turn);
			keyLabel.setText(key);
			turnLabel.setText(turn);
			editor.setText(turn);
			keyLabel.setVisible(!editing);
			turnLabel.setVisible(!editing);
			editor.setVisible(editing);
			if(editing) {
				editor.requestFocusInWindow();
				editor.selectAll();
			}
		}
		private void updateBorder() {
			Color c;
			if(getMousePosition() != null)
				c = Color.WHITE;
			else
				c = Color.BLACK;
			setBorder(BorderFactory.createLineBorder(c));
		}
		private int row=-1; //this is used for spacing the keyboard
		public KeyEditor(int row) {
			this.row = row;
		}
		private static final int SIZE = 32;
		public Dimension getPreferredSize() {
			if(row != -1)
				return new Dimension(row*SIZE/2, SIZE);
			return new Dimension(SIZE, SIZE);
		}
	}
}
