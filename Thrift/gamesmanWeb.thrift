
enum PortMapping {
    GAMESMANJAVA = 4242,
    #PYTHONPUZZLES = 1942,
    #GAMESMANPLUSMINUS = 2779
}

enum BoardPositionValue {
    UNDEFINED,
    WIN,
    LOSS,
    TIE,
    ERROR
}


enum GameState {
    UNDEFINED,
    WIN,
    LOSS,
    TIE,
    ERROR

}



/**
 *  An object that directly maps to the JSON string to be returned by the GamesmanWeb server
 */
struct GamestateResponse {
    /**
     *  If getMoveValue() is called, we use the following 3 fields
     */ 
    1: optional string board
    2: optional i32 remoteness
    3: optional string value
    

    /**
     *  If getNextMoveValues() is called, we use the following field
     */ 

    4: optional string move
    
    /**
     *  For certain games, we may also need to set the following fields
     */ 
    5: optional i32 score
} 

struct GetNextMoveResponse {
    1: string status
    2: optional list<GamestateResponse> response
    3: optional string message
}

struct GetMoveResponse {
    1: string status
    2: optional GamestateResponse response
    3: optional string message
}

service GamestateRequestHandler {

    GetNextMoveResponse getNextMoveValues(string gameName, string configuration)

    GetMoveResponse getMoveValue(string gameName, string configuration)

}


