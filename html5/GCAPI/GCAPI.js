function Game(name, height, width, notifierClass, board){
  this.gameName = name;
  this.height = height;
  this.width = width;
  this.misere = false;
  this.pieces = 0;
  this.notifier = notifierClass;
  this.previousBoards = Array();
  this.nextBoards = Array();
  this.currentBoard = board;
  this.baseUrl = "http://nyc.cs.berkeley.edu:8080/gcweb/service/" + 
                 "gamesman/puzzles/";
}

Game.prototype.setBoardHeight = function(height){
  this.height = height;
}

Game.prototype.getBoardHeight = function(){
  return this.height;
}

Game.prototype.setBoardWidth = function(width){
  this.width = width;
}

Game.prototype.getBoardWidth = function(){
  return this.width;
}

Game.prototype.setMisere = function(misere){
  this.misere = misere;
}

Game.prototype.getMisere = function(){
  return this.misere;
}

Game.prototype.setPieces = function(pieces){
  this.pieces = pieces;
}

Game.prototype.setDrawProcedure = function(draw){
  this.draw = draw;
}

Game.prototype.getUrlTail = function(board){
  return ";width=" + this.width + ";height=" + this.height + 
         ";pieces=" + this.pieces + ";board=" + escape(board);
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
  // Undo here
}

Game.prototype.redo = function(){
  // redo here.
}

Game.prototype.startGame = function(){
  this.notifier.drawBoard(this.currentBoard)
  this.getPossibleMoves(this.currentBoard, this.notifier.drawMoves)
}

function TTTNotify(canvas){
  this.canvas = canvas;
}

TTTNotify.prototype.drawBoard = function(board){
}

TTTNotify.prototype.drawMoves = function(data){
  alert(JSON.stringify(data))
}

function loadBoard(){
  notifier = new TTTNotify()
  data = new Game("ttt", 3, 3, notifier, "         ");
  data.startGame()
}
