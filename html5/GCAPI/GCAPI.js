function Game(name, parameters, notifierClass, board){
  this.gameName = name;
  this.params = parameters;
  this.notifier = notifierClass;
  this.previousBoards = Array();
  this.nextBoards = Array();
  this.currentBoard = board;
  this.baseUrl = "http://nyc.cs.berkeley.edu:8080/gcweb/service/" + 
                 "gamesman/puzzles/";
}

Game.prototype.setDrawProcedure = function(draw){
  this.draw = draw;
}

Game.prototype.getUrlTail = function(board){
  retval = ""
  for(key in this.params){
    retval += ";" + key + "=" + this.params[key]
  }
  retval += ";board=" + escape(board);
  return retval
}

Game.prototype.getBoardValues = function(board, notifier){
  requestUrl = this.baseUrl + this.gameName + "/getMoveValue" +
               this.getUrlTail(board)
  $.ajax({
    url: requestUrl,
    dataType: "json",
    success: function(data){
      notifier(data)
    },
  });
}

Game.prototype.getPossibleMoves = function(board, notifier){
  requestUrl = this.baseUrl + this.gameName + "/getNextMoveValues" +
               this.getUrlTail(board)
  $.ajax({
    url: requestUrl,
    dataType: "json",
    success: function(data){
      retval = Array()
      if(data.status == "ok"){
        notifier(data.response)
      }else{
        notifier(data)
      }
    }
  });
}

Game.prototype.undo = function(){
  if(this.previousBoards.length > 0){
    this.nextBoards.push(this.currentBoard);
    this.currentBoard = this.previousBoards.pop();
    this.updateBoard();
  }
}

Game.prototype.redo = function(){
  if(this.nextBoards.length > 0){
    this.previousBoards.push(this.currentBoard);
    this.currentBoard = this.nextBoards.pop();
    this.updateBoard();
  }
}

Game.prototype.startGame = function(){
  this.updateBoard();
}

Game.prototype.makeMove = function(move){
  this.previousBoards.push(this.currentBoard);
  this.currentBoard = move.board;
  this.updateBoard();
}

Game.prototype.updateBoard = function(){
  this.notifier.drawBoard(this.currentBoard);
  this.getPossibleMoves(this.currentBoard, this.notifier.drawMoves);
}
