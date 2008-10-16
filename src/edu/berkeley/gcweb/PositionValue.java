package edu.berkeley.gcweb;

public class PositionValue {
    private GameState gameState;
    private boolean visited;
    private byte mex;
    private byte remoteness;
    
    public PositionValue() {
        this(GameState.UNDEFINED, false, (byte)0, (byte)0);
    }
    
    public PositionValue(GameState state, boolean visited, 
                         byte mex, byte remoteness) {
        setGameState(state);
        setVisited(visited);
        setMex(mex);
        setRemoteness(remoteness);
    }
    
    @Override
    public String toString() {
        return getClass().getCanonicalName() +
            "{gameState: " + getGameState() + "; visited: " + isVisited() +
            "; mex: " + getMex() + "; remoteness: " + getRemoteness() + "}";
    }

    public GameState getGameState() {
        return gameState;
    }

    public void setGameState(GameState gameState) {
        this.gameState = gameState;
    }

    public boolean isVisited() {
        return visited;
    }

    public void setVisited(boolean visited) {
        this.visited = visited;
    }

    public byte getMex() {
        return mex;
    }

    public void setMex(byte mex) {
        this.mex = mex;
    }

    public byte getRemoteness() {
        return remoteness;
    }

    public void setRemoteness(byte remoteness) {
        this.remoteness = remoteness;
    }
}
