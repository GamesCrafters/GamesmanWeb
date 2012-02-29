function GCConnection(name, notifierClass){
  this.gameName = name;
  this.height = 0;
  this.width = 0;
  this.misere = false;
  this.pieces = 0;
  this.notifier = notifierClass;
  this.baseUrl = "http://nyc.cs.berkeley.edu:8080/gcweb/service/" + 
                 "gamesman/puzzles/";

  this.setBoardHeight = function(height){
    this.height = height;
  }

  this.getBoardHeight = function(){
    return this.height;
  }

  this.setBoardWidth = function(width){
    this.width = width;
  }

  this.getBoardWidth = function(){
    return this.width;
  }

  this.setMisere = function(misere){
    this.misere = misere;
  }

  this.getMisere = function(){
    return this.misere;
  }

  this.setPieces = function(pieces){
    this.pieces = pieces;
  }

  this.setDrawProcedure = function(draw){
    this.draw = draw;
  }

  this.getUrlTail = function(board){
    return ";width=" + this.width + ";height=" + this.height + 
           ";pieces=" + this.pieces + ";board=" + escape(board);
  }
  this.getBoardValues = function(board, notifier){
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

  this.getPossibleMoves = function(board, notifier){
    requestUrl = this.baseUrl + this.gameName + "/getNextMoveValues" +
                 this.getUrlTail(board)
    $.ajax({
      url: requestUrl,
      dataType: "json",
      success: function(data){
        notifier(data)
      }
    });
  }

  this.storeBoardValue = function(value){
    this.value = value
    this.getPossibleMoves(value['response']['board'], this.storePossibleMoves)
  }

  this.storePossibleMoves = function(moves){
    this.moves = moves;
    retval = Object();
    retval.value = this.value
    retval.moves = this.moves
    this.notifier.draw(retval)
  }

  this.makeMove = function(board){
    this.getBoardValues(board, this.storeBoardValue)
  }
}

function tttNotify(){
  this.draw = function(data){
    alert(JSON.stringify(data))
  }
}

function loadBoard(){
  notifier = new tttNotify()
  data = new GCConnection("ttt", notifier);
  data.setBoardHeight(3);
  data.setBoardWidth(3);
  data.getPossibleMoves("         ", 
    function(d){ 
      data.makeMove(d['response'][0]['board'])
    }
  );
}
