function GCConnection(name){
  this.gameName = name;

  this.setGameName = function(name, notifierClass){
    this.gameName = name;
    this.height = 0;
    this.width = 0;
    this.misere = false;
    this.pieces = 0;
    this.notifier = notifierClass;
    this.baseUrl = "http://nyc.cs.berkeley.edu:8080/gcweb/service/" + 
                   "gamesman/puzzles/";
  }

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

  this.getBoardValues = function(board, notifier){
    requestUrl = this.baseUrl + this.gameName + "/getMoveValue;" +
                 "width=" + this.width + ";height=" + this.height + 
                 ";pieces=" + this.pieces + ";board=" + escape(board);
    $.ajax({
      url: requestUrl,
      dataType: "json",
      success: function(data){
        notifier(data)
      }
    });
  }

  this.getPossibleMoves = function(board, notifier){
    requestUrl = this.baseUrl + this.gameName + "/getNextMoveValues;" +
                 "width=" + this.width + ";height=" + this.height + 
                 ";pieces=" + this.pieces + ";board=" + escape(board);
    $.ajax({
      url: requestUrl,
      dataType: "json",
      success: function(data){
        notifier(data)
      }
    });
  }
}

function loadBoard(){
  data = new GCConnection("ttt");
  data.setBoardHeight(3);
  data.setBoardWidth(3);
  // data.getBoardValues("         ", function(data){ alert(data); });
  data.getPossibleMoves("         ", 
    function(data){ 
      alert(data['status']); 
      for(i = 0; i < data['response'].length; i++){
        alert(JSON.stringify(data['response'][i]));
      }
    });
}
