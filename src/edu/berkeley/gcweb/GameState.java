package edu.berkeley.gcweb;

public enum GameState {
    UNDEFINED("UNDEFINED"), WIN("WIN"), LOSS("LOSS"), TIE("TIE"), ERROR("ERROR");
    
    private final String name;
    
    private GameState(String str) {
        name = str;
    }
    
    @Override
    public String toString() {
        return name;
    }
    
    public static GameState getStateByOrdinal(int ordinal) {
        GameState state;
        GameState[] states = GameState.values();
        if (ordinal < 0 || ordinal >= states.length) {
            state = ERROR;
        } else {
            state = states[ordinal];
        }
        return state;
    }
}
