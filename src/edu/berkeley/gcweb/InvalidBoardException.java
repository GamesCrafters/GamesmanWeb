package edu.berkeley.gcweb;

public class InvalidBoardException extends Exception {
    private static final long serialVersionUID = 20080413L;
    
    public InvalidBoardException() {
        super();
    }
    
	public InvalidBoardException(String message) {
		super(message);
	}
	
	public InvalidBoardException(String message, Throwable cause) {
	    super(message, cause);
	}
	
	public InvalidBoardException(Throwable cause) {
        super(cause);
    }
}