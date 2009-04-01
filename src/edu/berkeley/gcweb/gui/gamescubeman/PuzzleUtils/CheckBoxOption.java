package edu.berkeley.gcweb.gui.gamescubeman.PuzzleUtils;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JCheckBox;
import javax.swing.JPanel;

public class CheckBoxOption extends PuzzleOption<Boolean> implements ActionListener {
	private JPanel pane;
	private JCheckBox slider;
	public CheckBoxOption(String name, Boolean def) {
		super(name);
		
		slider = new JCheckBox(name, def);
		slider.setFocusable(false);
		slider.addActionListener(this);
		
		pane = new JPanel();
		pane.add(slider);
	}
	
	@Override
	public JPanel getComponent() {
		return pane;
	}

	@Override
	public Boolean getValue() {
		return slider.isSelected();
	}

	@Override
	public void setValue(String val) {
		slider.setSelected(Utils.parseBoolean(val, slider.isSelected()));
	}
	
	public void actionPerformed(ActionEvent e) {
		fireOptionChanged();
	}
}
