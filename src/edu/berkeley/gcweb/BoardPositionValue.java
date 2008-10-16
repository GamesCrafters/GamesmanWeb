package edu.berkeley.gcweb;

public enum BoardPositionValue {
	UNDEFINED("UNDEFINED"), WIN("WIN"), LOSS("LOSS"), TIE("TIE"), ERROR("ERROR");
	
	private final String stringRepresentation;
	
	private BoardPositionValue(String str) {
	    stringRepresentation = str;
	}
	
	@Override
	public String toString() {
	    return stringRepresentation;
	}
}
