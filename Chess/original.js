var sqsize = 41;function responseHandler0() { reqcollection[0].HandleResponse(); }
function responseHandler1() { reqcollection[1].HandleResponse(); }
function responseHandler2() { reqcollection[2].HandleResponse(); }
function responseHandler3() { reqcollection[3].HandleResponse(); }
function responseHandler4() { reqcollection[4].HandleResponse(); }
function responseHandler5() { reqcollection[5].HandleResponse(); }
function responseHandler6() { reqcollection[6].HandleResponse(); }
function responseHandler7() { reqcollection[7].HandleResponse(); }
function responseHandler8() { reqcollection[8].HandleResponse(); }
function responseHandler9() { reqcollection[9].HandleResponse(); }
function responseHandler10() { reqcollection[10].HandleResponse(); }
function responseHandler11() { reqcollection[11].HandleResponse(); }
function responseHandler12() { reqcollection[12].HandleResponse(); }
function responseHandler13() { reqcollection[13].HandleResponse(); }
function responseHandler14() { reqcollection[14].HandleResponse(); }
function responseHandler15() { reqcollection[15].HandleResponse(); }
function responseHandler16() { reqcollection[16].HandleResponse(); }
function responseHandler17() { reqcollection[17].HandleResponse(); }
function responseHandler18() { reqcollection[18].HandleResponse(); }
function responseHandler19() { reqcollection[19].HandleResponse(); }
function responseHandler20() { reqcollection[20].HandleResponse(); }

var reqcollection = new Array();
var reqcount = 0;

function RequestObject(ownerid) {
	this.ownerid = ownerid;
	this.skipallbutlast = true;
	this.http = createRequestObject();
	this.script = 'getServerResponse.php';
	this.responsehandlername = "responseHandler"+reqcount;
	reqcollection[reqcount] = this;
	reqcount++;	
	this.queue = new Array();
}

function sendNext(no) {
	var ob = Objectmap.Get(no).req;
	if (ob.skipallbutlast && ob.queue.length > 1) {
		ob.queue.splice(0,ob.queue.length-1);
	}
	var thenext = ob.queue[0];
		try {
    ob.http.open("GET", thenext, true);
    ob.http.onreadystatechange = eval(ob.responsehandlername);
    ob.http.send(null);
	} catch (x) {alert(x);}
}


function RequestObject_HandleResponse() {

	  if(this.http.readyState == 4){
        var response = this.http.responseText;
        
        var reqid = null;
        var hook = null;
        var obid = null;
        var value = null;
        var data = response.split('|');
				for (var i = 0; i < data.length; i++) {
					if (data[i] == "hook") {
						hook = data[i+1];
						i++;
					}
					else if (data[i] == "reqid") {
						reqid = data[i+1];
						i++;
					}
					else if (data[i] == "value") {
						value = data[i+1];
						i++;
					}
					else if (data[i] == "obid") {
						obid = data[i+1];
						i++;
					}
        }      
      if (obid != null) {
      	var theob = Objectmap.Get(obid);
      	theob.ParseRequestResult(reqid,value);
      }

      this.queue.splice(0,1);
      if (this.queue.length > 0) {
				setTimeout('sendNext(\''+this.ownerid+'\')',100);
    	}
    }
}

RequestObject.prototype.HandleResponse = RequestObject_HandleResponse;


function RequestObject_SendRequest(hook,action) {
	var reqid = 'req'+Math.random();
	var u = this.script+'?obid='+this.ownerid+'&reqid='+reqid+'&hook='+hook+'&action='+action;
	if (this.queue.length == 0) {
		try {
			this.queue.push(u);
	    this.http.open("GET", u, true);
	    this.http.onreadystatechange = eval(this.responsehandlername);
	    this.http.send(null);
  	} catch (x) {alert(x);}
  }
	else {
		this.queue.push(u);
	}
  return reqid;
}

RequestObject.prototype.SendRequest = RequestObject_SendRequest;

function createRequestObject() {
    var ro;
    var browser = navigator.appName;
    if(browser == "Microsoft Internet Explorer"){
        ro = new ActiveXObject("Microsoft.XMLHTTP");
    }else{
        ro = new XMLHttpRequest();
    }
    return ro;
}



function Objectmap() {}

Objectmap.objectcount = 0;
Objectmap.objectmap = new Array();

function Objectmap_Add(baseid,ob) {
	var theid = baseid + '' + Objectmap.objectcount + Math.random();
	Objectmap.objectmap[theid] = ob;
	Objectmap.objectcount++;
	return theid;
}

Objectmap.Add = Objectmap_Add;

function Objectmap_Get(id) {
	return Objectmap.objectmap[id];
}

Objectmap.Get = Objectmap_Get;



function scrollOffsetX() {
	if (self.pageYOffset) // all except Explorer
	{
		return self.pageXOffset;
	}
	else if (document.documentElement && document.documentElement.scrollTop)
		// Explorer 6 Strict
	{
		return document.documentElement.scrollLeft;
	}
	else if (document.body) // all other Explorers
	{
		return document.body.scrollLeft;
	}
}
function scrollOffsetY() {
	if (self.pageYOffset) // all except Explorer
	{
		return self.pageYOffset;
	}
	else if (document.documentElement && document.documentElement.scrollTop)
		// Explorer 6 Strict
	{
		return document.documentElement.scrollTop;
	}
	else if (document.body) // all other Explorers
	{
		return document.body.scrollTop;
	}
}
var piecegraphics = new Array("images/a"+sqsize+"free.gif","images/a"+sqsize+"wk.gif","images/a"+sqsize+"wq.gif","images/a"+sqsize+"wr.gif","images/a"+sqsize+"wb.gif","images/a"+sqsize+"wn.gif","images/a"+sqsize+"wp.gif",
"images/a"+sqsize+"bk.gif","images/a"+sqsize+"bq.gif","images/a"+sqsize+"br.gif","images/a"+sqsize+"bb.gif","images/a"+sqsize+"bn.gif","images/a"+sqsize+"bp.gif");
var moveindicatorgraphics = new Array("images/a"+sqsize+"mw0.gif","images/a"+sqsize+"mw1.gif","images/a"+sqsize+"mb0.gif","images/a"+sqsize+"mb1.gif");
var emptyboardgraphics = "images/a"+sqsize+"empty.gif";
var startboardgraphics = "images/a"+sqsize+"start.gif";
var promowgraphics = "images/a"+sqsize+"promow.gif";
var promobgraphics = "images/a"+sqsize+"promob.gif";
var movegraphics = "images/a"+sqsize+"move.gif";
var _f=false, _t=true;




function Position() {
	this.b = new Array(64);
	this.wtm = _t;
	this.ep = 0;
	this.castling = 0;
	this.pliesplayed = 0;
	this.halfmovecounter = 0;
	this.moves = null;
	this.listeners = new Array();
	this.lastmove = 0;
	this.makemovetext = false;
	this.lastmovetext = null;
		this.piececodes = new Array('','K','Q','R','B','N','','K','Q','R','B','N',''); 
	
}

function Position_CopyFrom(p) {
	var o=this;	for (var i=0;i<64;i++) o.b[i] = p.b[i];	o.wtm = p.wtm;o.ep = p.ep;o.castling = p.castling;o.pliesplayed = p.pliesplayed; 
	o.halfmovecounter = p.halfmovecounter;} Position.prototype.CopyFrom = Position_CopyFrom;

function Position_SetStart() {
	this.SetFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'); } Position.prototype.SetStart = Position_SetStart;

function Position_SetSetupTable(t) {
	this.setuptable = t; } Position.prototype.SetSetupTable = Position_SetSetupTable;

function Position_Clear() {
	var o = this; for (var i=0; i<64; i++) o.b[i] = 0; o.wtm = _t; o.ep = 0; o.castling = 0; o.pliesplayed = 0; o.halfmovecounter = 0; o.moves = null;
	o.PositionChanged();} Position.prototype.Clear = Position_Clear;

function Position_ClearHistory(cc,ce) {
	var o = this; if (ce) {o.ep = 0;} if (cc) {o.castling = 0;} o.pliesplayed = 0; o.halfmovecounter = 0; o.moves = null;
	o.lastmove = 0; o.lastmovetext = null; } Position.prototype.ClearHistory = Position_ClearHistory;

function Position_SetFEN(fen) {
 try { while (fen.indexOf('  ')>=0) fen=fen.replace('  ',' '); var p=0, o=this, tok=fen.split(' '); for (var r=7; r>=0; r--) {for (var f = 0; f <= 7; f++) {var s = r*8+f, c = fen.charAt(p);
 switch (c) {case '/': f--; break;case 'K': o.b[s]=1;break;case 'Q': o.b[s]=2;break; case 'R': o.b[s]=3;break;case 'B': o.b[s]=4;break; case 'N': o.b[s]=5;break;case 'P': o.b[s]=6;break;
 case 'k': o.b[s]=7;break;case 'q': o.b[s]=8;break; case 'r': o.b[s]=9;break;case 'b': o.b[s]=10;break; case 'n': o.b[s]=11;break;case 'p': o.b[s]=12;break; case '.': o.b[s]=0;break;
 case '1': o.b[s]=0;break; case '2': o.b[s]=0;o.b[s+1]=0;f++;break;case '3': o.b[s]=0;o.b[s+1]=0;o.b[s+2]=0;f+=2;break; case '4': o.b[s]=0;o.b[s+1]=0;o.b[s+2]=0;o.b[s+3]=0;f+=3;break;
 case '5': o.b[s]=0;o.b[s+1]=0;o.b[s+2]=0;o.b[s+3]=0;o.b[s+4]=0;f+=4;break; case '6': o.b[s]=0;o.b[s+1]=0;o.b[s+2]=0;o.b[s+3]=0;o.b[s+4]=0;o.b[s+5]=0;f+=5;break;
 case '7': o.b[s]=0;o.b[s+1]=0;o.b[s+2]=0;o.b[s+3]=0;o.b[s+4]=0;o.b[s+5]=0;o.b[s+6]=0;f+=6;break; case '8': o.b[s]=0;o.b[s+1]=0;o.b[s+2]=0;o.b[s+3]=0;o.b[s+4]=0;o.b[s+5]=0;o.b[s+6]=0;o.b[s+7]=0;f+=7;break;}
 p++;}} o.wtm = tok[1] == 'w'; o.castling = 0; for (var i = 0; i < tok[2].length; i++) { if (tok[2].charAt(i) == 'K') o.castling |= 1; if (tok[2].charAt(i) == 'Q') o.castling |= 2;
 if (tok[2].charAt(i) == 'k') o.castling |= 4; if (tok[2].charAt(i) == 'q') o.castling |= 8;}
 switch(tok[3].charAt(0)) {case 'a': o.ep=16;break;case 'b': o.ep=17;break;case 'c': o.ep=18;break;case 'd': o.ep=19;break;case 'e': o.ep=20;break;case 'f': o.ep=21;break;case 'g': o.ep=22;break;case 'h': o.ep=23;break;default:o.ep=0;}
 if (o.ep>0&&o.wtm) o.ep+=24; o.halfmovecounter = tok.length>4?eval(tok[4]):0; o.pliesplayed = (tok.length>5?2*eval(tok[5]):2) - (o.wtm ? 2 : 1); o.lastmove = 0; o.lastmovetext = null;} catch (e) {} o.PositionChanged();} Position.prototype.SetFEN = Position_SetFEN;

var fenpiecechars = "1KQRBNPkqrbnp";

function Position_GetFEN() {
	var r,f,R="";
	for (r = 7; r >= 0; r--) {
		for (f = 0; f <= 7; f++) {
			 if (this.b[r*8+f] == 0) {
			 		var em = 1;
			 		f++;
			 		while (f <= 7 && this.b[r*8+f] == 0) {
			 			f++;
			 			em++;
			 		}
			 		R += em;
			 		f--;
				}
			else 
	 		 R += fenpiecechars.charAt(this.b[r*8+f]);
			}
		if (r > 0) R += "/";
	}
	R += this.wtm ? " w " : " b ";
	var c = "";
	if ((this.castling & 1) == 1) c += "K";
	if ((this.castling & 2) == 2) c += "Q";
	if ((this.castling & 4) == 4) c += "k";
	if ((this.castling & 8) == 8) c += "q";
	if ( c == "" ) c = "-";
	var eptext = '-';
	if (this.ep > 0) {f=this.ep&7;switch(f) {case 0:eptext='a';break;case 1:eptext='b';break;case 2:eptext='c';break;case 3:eptext='d';break;case 4:eptext='e';break;case 5:eptext='f';break;case 6:eptext='g';break;case 7:eptext='h';break;} eptext += this.wtm?'6':'3';}
	return R + c + ' '+eptext+' ' +this.halfmovecounter + " " + (Math.floor(this.pliesplayed/2)+1);
}

Position.prototype.GetFEN = Position_GetFEN;

function Position_MakeMove(f,t,p) {
 var o=this,c=o.castling; if (o.makemovetext) {o.lastmovetext=o.GetMoveString(f|(t<<6)|(p<<12));} if (t==o.ep&& o.ep > 0 &&(o.b[f]==6||o.b[f]==12)) {o.b[o.ep+(o.wtm?-8:8)]=0;}o.b[t]=o.b[f]; o.b[f]=0; 
 o.wtm ^= _t; if (((c&1)==1)&&(f==4||t==4||f==7||t==7)) {c ^= 1;}	if (((c&2)==2)&&(f==4||t==4||f==0||t==0)) {c ^= 2;}
 if (((c&4)==4)&&(f==60||t==60||f==63||t==63)) {c ^= 4;} if (((c&8)==8)&&(f==60||t==60||f==56||t==56)) {c ^= 8;} o.castling = c;
 if (o.b[t]==1&&f==4&&t==2) {o.b[0]=0; o.b[3]=3; } if (o.b[t]==1&&f==4&&t==6) {o.b[7]=0; o.b[5]=3; } if (o.b[t]==7&&f==60&&t==58) {o.b[56]=0; o.b[59]=9; }
 if (o.b[t]==7&&f==60&&t==62) {o.b[63]=0; o.b[61]=9;} if (p!=0) {o.b[t]=p;} if ((o.b[t]==6||o.b[t]==12)&&Math.abs(f-t)==16)	o.ep = (f+t)/2;	else o.ep = 0; 
 if (o.ep>0) {if ((o.wtm&&((((t&7)>0)&&o.b[t-1]==6)||(((t&7)<7)&& o.b[t+1]==6)))||(!o.wtm&&((((t&7)>0)&&o.b[t-1]==12)||(((t&7)<7)&&o.b[t+1]==12)))); else o.ep=0;}
 o.pliesplayed++; o.lastmove=(f|(t<<6)|(p<<12)); o.PositionChanged();} Position.prototype.MakeMove = Position_MakeMove;

function Position_PositionChanged() {this.moves=null;for (var i = 0; i < this.listeners.length; i++)	this.listeners[i].PositionChanged(this);} Position.prototype.PositionChanged = Position_PositionChanged;

function Position_AddListener(listener) {	this.listeners.push(listener);} Position.prototype.AddListener = Position_AddListener;

function Position_NumberOfPieces() { var r = 0; for (var i = 0; i < 64; i++) if (this.b[i] > 0) r++; return r; } Position.prototype.NumberOfPieces = Position_NumberOfPieces;

function Position_GetMoves() {if (this.moves!=null)return this.moves; this.moves = MG.FindMoves(this);return this.moves;} Position.prototype.GetMoves = Position_GetMoves;

function Position_InCheck() {
	var wkpos = -1, bkpos = -1;
	for (var i = 0; i < 64; i++) {
		if (this.b[i] == 1) wkpos = i;
		else if (this.b[i] == 7) bkpos = i;
	}
	
	return (MG.IAS(this,this.wtm ? wkpos : bkpos,_t));
} Position.prototype.InCheck = Position_InCheck;

function Position_IsValid(doSetupTesting) {
	// TODO integritaetstest fuer ep und 0-0 / 0-0-0
	var wkpos = -1, bkpos = -1;
	for (var i = 0; i < 64; i++) {
		if (this.b[i] == 1) 
			if (wkpos >= 0)
				return _f;
			else
				wkpos = i;
		else 
			if (this.b[i] == 7) 
				if (bkpos >= 0)
					return _f;
				else
					bkpos = i;
	}
	if (wkpos == -1 || bkpos == -1) 
		return _f;

	if (MG.IAS(this,this.wtm ? bkpos : wkpos, _f))
		return _f;
	
	if (doSetupTesting) {
		var numberOfPieces = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0);
		for (var i = 0; i < 64; i++)
			numberOfPieces[this.b[i]]++;
		if (numberOfPieces[2] > 9 ||
			numberOfPieces[3] > 10 ||
			numberOfPieces[4] > 10 ||
			numberOfPieces[5] > 10 ||
			numberOfPieces[6] > 8 ||
			numberOfPieces[8] > 9 ||
			numberOfPieces[9] > 10 ||
			numberOfPieces[10] > 10 ||
			numberOfPieces[11] > 10 ||
			numberOfPieces[12] > 8
		)
			return _f;
			
		var forcedPromotionW = 0;
		if (numberOfPieces[2] > 1) forcedPromotionW += numberOfPieces[2] - 1;
		if (numberOfPieces[3] > 2) forcedPromotionW += numberOfPieces[3] - 2;
		if (numberOfPieces[4] > 2) forcedPromotionW += numberOfPieces[4] - 2;
		if (numberOfPieces[5] > 2) forcedPromotionW += numberOfPieces[5] - 2;
		if (numberOfPieces[6] + forcedPromotionW > 8)
			return _f;
		var forcedPromotionB = 0;
		if (numberOfPieces[8] > 1) forcedPromotionB += numberOfPieces[8] - 1;
		if (numberOfPieces[9] > 2) forcedPromotionB += numberOfPieces[9] - 2;
		if (numberOfPieces[10] > 2) forcedPromotionB += numberOfPieces[10] - 2;
		if (numberOfPieces[11] > 2) forcedPromotionB += numberOfPieces[11] - 2;
		if (numberOfPieces[12] + forcedPromotionB > 8)
			return _f;
		for (var i = 0; i <= 7; i++) {
			if (this.b[i] == 6 || 
				this.b[i] == 12 ||
				this.b[i+56] == 6 ||
				this.b[i+56] == 12)
				return _f;
		}
		if (numberOfPieces[1] + 
			numberOfPieces[2] + 
			numberOfPieces[3]+ 
			numberOfPieces[4] + 
			numberOfPieces[5]+ 
			numberOfPieces[6] > 16)
			return _f;
		if (numberOfPieces[7] + 
				numberOfPieces[8] + 
				numberOfPieces[9]+ 
				numberOfPieces[10] + 
				numberOfPieces[11]+ 
				numberOfPieces[12] > 16)
				return _f;
	}
	
	return _t;
}
	
Position.prototype.IsValid = Position_IsValid;

function Position_InsuffMaterial() {
		var numlights = 0;
		for (var i = 0; i < 64; i++) {
			if (this.b[i]==2 || this.b[i]==3 || this.b[i]==6 || this.b[i]==8 || this.b[i]==9 || this.b[i]==12) return false;
			if (this.b[i]==4 || this.b[i]==5 || this.b[i]==10 || this.b[i]==11) {numlights++; if (numlights > 1) return false;}
		}
	return true;	
}

Position.prototype.InsuffMaterial = Position_InsuffMaterial;
	
function Position_GetMoveString(move) {
	if (move == 0) return "";
	var from = move & 63;
	var fromrank = from >> 3;
	var fromfile = from & 7;
	var to = (move >> 6 ) & 63;
	var ispromotion = ((move >> 12) & 63 ) > 0;
	var piece = this.b[from];
	var isep = (piece == 6 || piece == 12) && (fromfile != (to&7)) && (this.b[to] == 0); 
	var iscapture = (this.b[to] != 0) || isep;
	var set = this.GetMoves();
	var countEqualFile = 0;
	var countEqualRank = 0;
	var countOtherPieces = 0;

	for (var i = 0; i < set.length; i++) {
		var m = set[i];
		
		if (((m>>6)&63) == to && this.b[m&63] == piece && (m&63) != from) {
			countOtherPieces ++;
			var rank = (m&63) >> 3;
			var file = (m&63) & 7;
			if (rank == fromrank) countEqualRank++;
			if (file == fromfile) countEqualFile++;
		}
	}
	
	var result = "";
	var castling = false;
	
	if (piece == 1 && from == 4 && to == 6) {
		result += "O-O";
		castling = true;
	}
	else if (piece == 1 && from == 4 && to == 2) {
		result += "O-O-O";
		castling = true;
	}
	else if (piece == 7 && from == 60 && to == 62) {
		result += "O-O";
		castling = true;
	}
	else if (piece == 7 && from == 60 && to == 58) {
		result += "O-O-O";
		castling = true;
	}

	if (!castling) {
		result += this.piececodes[piece];
		
		if (countOtherPieces != 0 && !(piece == 6 || piece == 12)) { // nicht eindeutig
			if (countEqualFile == 0) { // Linie reicht
				result += SQ.names[from].charAt(0);
			}
			else if (countEqualRank == 0) { // Reihe reicht
				result += SQ.names[from].charAt(1);
			}
			else { // komplettes Startfeld noetig
				result += SQ.names[from];
			}
		}

     if (iscapture) {
		    if (piece == 6 || piece == 12) {
		        result += SQ.names[from].charAt(0);
		        countOtherPieces = 0; // schon eindeutig!
		    }
		    result += "x";
		}
		result += SQ.names[to];
		//if (isep) result += " e.p.";
	}
	if (ispromotion) {
		result += "("+this.piececodes[(move>>12)&63]+")";
	}
	return result;
} Position.prototype.GetMoveString = Position_GetMoveString;















function Board(sqsize, darkcolor, lightcolor, posx, posy) {
	this.sqsize = sqsize;
	this.darkcolor = darkcolor;
	this.lightcolor = lightcolor;
	this.posx = posx;
	this.posy = posy;
	this.currentpieces = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
	this.boardid = Objectmap.Add("b",this);
	this.liftedpiece=0;
	this.liftedfrom=0;
	this.promoshown=new Array();
	this.inputenabled=_t;
	this.position = null;
	this.whiteonbottom=true;
	this.hasmarked = _f;
	this.setuptable = null;
	this.allowfreemoving = false;
	this.bordercolor = 'rgb(207,213,223)';
	var d = this.GetDivElement();	
	document.getElementsByTagName("body")[0].appendChild(d);
}

function Board_GetDivElement() {
	var d = document.createElement("div");
	d.id = this.boardid;
	d.style.visibility = 'hidden';
	d.style.position = 'absolute';
	d.style.left = this.posx;
	d.style.top = this.posy;
	var result = "";
	var i;
	for (i = 0; i < 64; i++) {
		var f = i & 7; 
		var r = i >> 3;
		var le = f * this.sqsize;
		var to = (7-r) * this.sqsize;
		var col = ((r % 2) == (f % 2)) ? this.darkcolor : this.lightcolor;
		var sqid = this.boardid+"_"+i;
		result += "<div id=\""+sqid+"\" style=\"position:absolute;left:"+le+";top:"+to+";width:"+this.sqsize+";height:"+this.sqsize+";background-color:"+col+";\" onmousedown=\"Board.Mousedown(event,this);\" onmouseup=\"Board.Mouseup(event,this);\" onmousemove=\"Board.Mousemove(event,this);\" ></div>\n";	
	}
	result += "<div id=\""+this.boardid+"_dr\" style=\"position:absolute;left:"+0+";top:"+0+";visibility:hidden;\" onmousedown=\"Board.Mousedown(event,this);\" onmousemove=\"Board.Mousemove(event,this);\" onmouseup=\"Board.Mouseup(event,this);\"><img src=\""+piecegraphics[0]+"\" ></div>\n";	
	result += '<div id="'+this.boardid+'_pro0" style="position:absolute;left:0;top:0;width:'+this.sqsize+';height:'+this.sqsize+';visibility:hidden;" onmousemove=\"Board.Mousemove(event,this);\" onmouseup=\"Board.Mouseup(event,this);\"> </div>';
	result += '<div id="'+this.boardid+'_pro1" style="position:absolute;left:0;top:0;width:'+this.sqsize+';height:'+this.sqsize+';visibility:hidden;" onmousemove=\"Board.Mousemove(event,this);\" onmouseup=\"Board.Mouseup(event,this);\"> </div>';
	result += '<div id="'+this.boardid+'_pro2" style="position:absolute;left:0;top:0;width:'+this.sqsize+';height:'+this.sqsize+';visibility:hidden;" onmousemove=\"Board.Mousemove(event,this);\" onmouseup=\"Board.Mouseup(event,this);\"> </div>';

	result += '<div id="'+this.boardid+'_miw" style="position:absolute;left:'+(this.sqsize*8+20)+';top:'+(this.sqsize*7)+';width:'+this.sqsize+';height:'+this.sqsize+';visibility:visible;" onmousedown=\"Board.Mousedownmoveind(event,this);\"><img src="'+moveindicatorgraphics[0]+'"></div>';
	result += '<div id="'+this.boardid+'_mib" style="position:absolute;left:'+(this.sqsize*8+20)+';top:'+(0)+';width:'+this.sqsize+';height:'+this.sqsize+';visibility:visible;" onmousedown=\"Board.Mousedownmoveind(event,this);\"><img src="'+moveindicatorgraphics[2]+'"></div>';
    
  var ls = new Array('a','b','c','d','e','f','g','h');
	var letters='<div id="'+this.boardid+'_lettersbottom" style="position:absolute;left:0;top:'+(8*this.sqsize)+';width:'+(8*this.sqsize)+';"><table border="0" cellpadding="0" cellspacing="0"><tr height="'+(20)+'">';
	for (var i=0;i<8;i++)
		letters += '<td width="'+this.sqsize+'" style="color:rgb(81,89,106);font-family:verdana,arial,helvetica,sans-serif;font-size:11px;'+(this.sqsize>30?'font-weight:bold;':'')+'vertical-align:middle;text-align:center;">'+ls[i]+'</td>';
	letters += '</tr></table></div>\n';
	letters += '<div id="'+this.boardid+'_lettersbottominv" style="visibility:hidden;position:absolute;left:0;top:'+(8*this.sqsize)+';width:'+(8*this.sqsize)+';"><table border="0" cellpadding="0" cellspacing="0"><tr height="'+(20)+'">';
	for (var i=0;i<8;i++)
		letters += '<td width="'+this.sqsize+'" style="color:rgb(81,89,106);font-family:verdana,arial,helvetica,sans-serif;font-size:11px;'+(this.sqsize>30?'font-weight:bold;':'')+'vertical-align:middle;text-align:center;">'+ls[7-i]+'</td>';
	letters += '</tr></table></div>\n';
	
	letters += '<div id="'+this.boardid+'_numbersright" style="position:absolute;left:'+(8*this.sqsize)+';top:0;height:'+(8*this.sqsize)+';width:'+(20)+';"><table border="0" cellpadding="0" cellspacing="0">';
	for (var i=0;i<8;i++)
		letters += '<tr height="'+this.sqsize+'"><td width="'+(20)+'" height="'+this.sqsize+'" style="color:rgb(81,89,106);font-family:verdana,arial,helvetica,sans-serif;font-size:11px;'+(this.sqsize>30?'font-weight:bold;':'')+'vertical-align:middle;text-align:center;">'+(8-i)+'</td></tr>';
	letters += '</table></div>\n';

	letters += '<div id="'+this.boardid+'_numbersrightinv" style="visibility:hidden;position:absolute;left:'+(8*this.sqsize)+';top:0;height:'+(8*this.sqsize)+';width:'+(20)+';"><table border="0" cellpadding="0" cellspacing="0">';
	for (var i=0;i<8;i++)
		letters += '<tr height="'+this.sqsize+'"><td width="'+(20)+'" height="'+this.sqsize+'" style="color:rgb(81,89,106);font-family:verdana,arial,helvetica,sans-serif;font-size:11px;'+(this.sqsize>30?'font-weight:bold;':'')+'vertical-align:middle;text-align:center;">'+(1+i)+'</td></tr>';
	letters += '</table></div>\n';

  result += letters;
    
	d.innerHTML = result;
	return d;
}

Board.prototype.GetDivElement = Board_GetDivElement;

function Board_SetPieceAt(s,p) {
	if (this.currentpieces[s] == p) return;
	document.getElementById(this.boardid+"_"+s).innerHTML = "<img src=\""+piecegraphics[p]+"\">";
	this.currentpieces[s] = p;
}
Board.prototype.SetPieceAt = Board_SetPieceAt;


function Board_Mousedownmoveind(ev, ob) {
	var o = Objectmap.Get(ob.id.split('_')[0]);
	var c = ob.id.split('_')[1];
	if (o.setuptable == null) return;
	if (c == 'miw') {
		if (o.position.wtm == _t) return;
		o.position.wtm = true;
	  o.position.ClearHistory(_t,_t);
	  o.position.PositionChanged();
	}
	else if (c == 'mib') {
		if (o.position.wtm == _f) return;
		o.position.wtm = false;
	  o.position.ClearHistory(_t,_t);
	  o.position.PositionChanged();	
	 }
}
Board.Mousedownmoveind = Board_Mousedownmoveind;


function Board_Mousedown(ev, ob) {
	var o = Objectmap.Get(ob.id.split('_')[0]);
	
	o.UnmarkAll();
	if (!o.inputenabled||o.position==null) { return;}
	if (o.liftedpiece != 0)  { return;}

	var sq = eval(ob.id.split('_')[1]);

	if (o.setuptable != null && o.setuptable.IsSetupMode()) {
		var old = o.position.b[sq];
		if (old == o.setuptable.selectedpiece && old != 0)	
			o.position.b[sq] = old < 7 ?  old+6 : old-6;
		else if (((old == o.setuptable.selectedpiece+6) || (old == o.setuptable.selectedpiece-6))&& old != 0)	
			o.position.b[sq] = 0;
		else {
			if ((sq < 8 || sq >= 56) && (o.setuptable.selectedpiece == 6 || o.setuptable.selectedpiece == 12)) return; 
			if (o.setuptable.selectedpiece == 1) {
				for (var i=0; i<64;i++) if (o.position.b[i]==1) o.position.b[i]=0;
			}
			else if (o.setuptable.selectedpiece == 7) {
				for (var i=0; i<64;i++) if (o.position.b[i]==7) o.position.b[i]=0;
			}
			o.position.b[sq] = o.setuptable.selectedpiece;
		}	
		o.position.ClearHistory(_f);
		o.position.PositionChanged();
		
		return;
	}

	var set = o.position.GetMoves();
		 
	var moveable = false;
	var promosq = new Array();
	if (o.allowfreemoving==_f) {
		for (var i = 0; i < set.length; i++) {
			if ((set[i]&63) == sq) { o.MarkSquare((set[i]>>6)&63); moveable = true; if(((set[i]>>12)&63)>0) promosq.push((set[i]>>6)&63);}
		}	
	}
	else {
		if (sq >=48 && o.position.b[sq] == 6) {if (o.position.b[sq+8] == 0) promosq.push(sq+8); if (sq != 48 && o.position.b[sq+7] > 6) promosq.push(sq+7);if (sq != 55 && o.position.b[sq+9] > 6) promosq.push(sq+9); }
		if (sq <=15 && o.position.b[sq] == 12) {if (o.position.b[sq-8] == 0)promosq.push(sq-8); if (sq != 8 && o.position.b[sq-9] > 0 && o.position.b[sq-9] < 7) promosq.push(sq-9);if (sq != 15 && o.position.b[sq-7] > 0 && o.position.b[sq-7] < 7) promosq.push(sq-7); }
		if (o.position.b[sq] > 0) moveable = true;
		for (var i = 0; i < set.length; i++) {
			if ((set[i]&63) == sq) { o.MarkSquare((set[i]>>6)&63);}
		}	
	}
	if (promosq.length>0) {promosq.sort();for(var i=1;i<promosq.length;i++) if (promosq[i]==promosq[i-1]){promosq.splice(i,1);i--;}  }

	if (!moveable) return;

	o.liftedpiece=o.position.b[sq];
	o.liftedfrom=sq;

	var el = o.boardid+"_"+sq;
	var eldr = o.boardid+"_dr";

	o.SetPieceAt(sq,0);
	document.getElementById(eldr).innerHTML = "<img src=\""+piecegraphics[o.liftedpiece]+"\">";
 
 	var x = ev.clientX - document.getElementById(o.boardid).offsetLeft + scrollOffsetX();
	var y = ev.clientY - document.getElementById(o.boardid).offsetTop + scrollOffsetY();
 	
 	document.getElementById(eldr).style.left = x - o.sqsize/2;
 	document.getElementById(eldr).style.top = y - o.sqsize/2;
	document.getElementById(eldr).style.visibility = 'visible';
	
	if (o.promoshown.length>0)o.promoshown.splice(0,o.promoshown.length);	
	for (var i=0;i<promosq.length;i++) {
		document.getElementById(o.boardid+"_pro"+i).innerHTML = "<img src=\""+(promosq[i]<8?promobgraphics:promowgraphics)+"\">";
		document.getElementById(o.boardid+"_pro"+i).style.left = document.getElementById(o.boardid+"_"+promosq[i]).style.left;
		document.getElementById(o.boardid+"_pro"+i).style.top = document.getElementById(o.boardid+"_"+promosq[i]).style.top;
		
		document.getElementById(o.boardid+"_pro"+i).style.visibility = 'visible';
		o.promoshown.push(promosq[i]);
	}			
}
Board.Mousedown = Board_Mousedown;






function Board_Mousemove(ev,ob) {
	var o = Objectmap.Get(ob.id.split('_')[0]);
	if (!o.inputenabled||o.position==null) return;
	if (o.liftedpiece == 0) return;
//	var sq = eval(ob.id.split('_')[1]);
		
	var x = ev.clientX - document.getElementById(o.boardid).offsetLeft - o.sqsize/2 +scrollOffsetX();
	var y = ev.clientY - document.getElementById(o.boardid).offsetTop - o.sqsize/2 +scrollOffsetY();
	
	if (x +o.sqsize/2 >= 8 * o.sqsize || x+o.sqsize/2 <= 0 || y+o.sqsize/2 <= 0 || y+o.sqsize/2 >= 8*o.sqsize) {
		document.getElementById(o.boardid+"_dr").style.visibility = "hidden";
		o.SetPieceAt(o.liftedfrom,o.liftedpiece);
		o.liftedpiece = 0;
		o.HidePromos();
		o.UnmarkAll();
		return;

	}
	
	document.getElementById(o.boardid+"_dr").style.left = x;
	document.getElementById(o.boardid+"_dr").style.top = y;
}
Board.Mousemove = Board_Mousemove;










function Board_Mouseup(ev, ob) {
	var o = Objectmap.Get(ob.id.split('_')[0]);
	if (!o.inputenabled||o.position==null) return;
	if (o.liftedpiece == 0) return;
	o.UnmarkAll();

	document.getElementById(o.boardid+"_dr").style.visibility = 'hidden';

	var s = ob.id.split('_')[1];

	var promo=0;
	if (s.indexOf('pro') >= 0) {
		s = 'dr';
		var x = (ev.clientX - document.getElementById(o.boardid).offsetLeft+scrollOffsetX())%o.sqsize;
		var y = (ev.clientY - document.getElementById(o.boardid).offsetTop+scrollOffsetY())%o.sqsize;
		x *= 2; y *= 2;
		promo = x > o.sqsize ? (y > o.sqsize ? 5 : 3 ) : (y > o.sqsize ? 4 : 2);
		if (o.liftedpiece > 6)promo += 6;
	}

		if (s == 'dr') {
			var x = ev.clientX - document.getElementById(o.boardid).offsetLeft+scrollOffsetX();
			var y = ev.clientY - document.getElementById(o.boardid).offsetTop+scrollOffsetY();
			s = o.GetClicksquare(x,y);
		}
		s = eval(s);

  o.HidePromos();
 	
 	if (o.allowfreemoving==_t) {
		if (o.liftedfrom != s) {
			if ((s >= 56 && o.liftedpiece == 12) || (s <= 7 && o.liftedpiece == 6)) {  o.SetPieceAt(o.liftedfrom,o.liftedpiece); o.liftedpiece = 0; return; }
			if (s >= 56 && o.liftedpiece == 6 && promo == 0) promo = 2;
			else if (s <= 7 && o.liftedpiece == 12 && promo == 0) promo = 8;
			
			var set = o.position.GetMoves();
			var islegal = false;
			for (var i = 0; i < set.length; i++) {
				if ((set[i]&63) == o.liftedfrom && ((set[i]>>6)&63) == s) islegal = true;
			}

			if (!islegal) {o.position.wtm ^= true;}			
			o.position.MakeMove(o.liftedfrom, s, promo);
			o.position.ClearHistory(_t,_f);
		}
		else
			o.SetPieceAt(o.liftedfrom,o.liftedpiece);
 		o.liftedpiece = 0;
 		return;
 	}
 	
 	var set =o.position.GetMoves();
 	for (var i = 0; i < set.length; i++) {
 		if ((set[i]&63)==o.liftedfrom&&((set[i]>>6)&63)==s) {
	  	o.position.MakeMove(o.liftedfrom, s, promo);
	  	o.liftedpiece = 0;
	  	return;
 		}
 	} 
	o.SetPieceAt(o.liftedfrom,o.liftedpiece);
  o.liftedpiece = 0;
}
Board.Mouseup = Board_Mouseup;


function Board_GetClicksquare(x,y) {
	return this.whiteonbottom ? (Math.floor(x/this.sqsize) + (7 - Math.floor(y/this.sqsize)) * 8) : (7 - Math.floor(x/this.sqsize) + Math.floor(y/this.sqsize) * 8);
}
Board.prototype.GetClicksquare = Board_GetClicksquare;

function Board_HidePromos() {
	for (var i=0;i<this.promoshown.length;i++) try{
		document.getElementById(this.boardid+"_pro"+i).style.visibility = 'hidden';
	} catch (ex) {}
	this.promoshown.splice(0,this.promoshown.length);	
}
Board.prototype.HidePromos = Board_HidePromos;


function Board_SetRefPosition(pos) {
	this.position=pos;
}
Board.prototype.SetRefPosition = Board_SetRefPosition;

function Board_SetPosition(pos) {
	for (var i = 0; i < 64; i++) {
	//	var el = this.boardid+"_"+i;
	//	document.getElementById(el).innerHTML = "<img src=\""+piecegraphics[pos.b[i]]+"\">";
			this.SetPieceAt(i,pos.b[i]);
	}
	document.getElementById(this.boardid+'_miw').innerHTML = "<img src=\""+moveindicatorgraphics[pos.wtm?1:0]+"\">";
	document.getElementById(this.boardid+'_mib').innerHTML = "<img src=\""+moveindicatorgraphics[pos.wtm?2:3]+"\">";
}

Board.prototype.SetPosition = Board_SetPosition;

function Board_SetVisible(b) {
	document.getElementById(this.boardid).style.visibility = b ? 'visible' : 'hidden';
}
Board.prototype.SetVisible = Board_SetVisible;


function Board_MarkSquare(sq) {
	var f = sq & 7;
	var r = sq >> 3;
	var col = ((r % 2) == (f % 2)) ? "rgb(146,174,221)" : "rgb(198,221,255)";
	document.getElementById(this.boardid+"_"+sq).style.background = col;
	this.hasmarked = _t;
}

Board.prototype.MarkSquare = Board_MarkSquare;

function Board_UnmarkSquare(sq) {
	var f = sq & 7;
	var r = sq >> 3;
	var col = ((r % 2) == (f % 2)) ? this.darkcolor : this.lightcolor;
	document.getElementById(this.boardid+"_"+sq).style.background = col;
}

Board.prototype.UnmarkSquare = Board_UnmarkSquare;

function Board_UnmarkAll() {
	if (this.hasmarked == _f) return;
	for (var i=0;i<64;i++) this.UnmarkSquare(i);
	this.hasmarked = false;
}

Board.prototype.UnmarkAll = Board_UnmarkAll;

function Board_PositionChanged(pos) {
	this.SetPosition(pos);
	for (var i = 0; i < 64; i++) {
		this.UnmarkSquare(i);
	}
}

Board.prototype.PositionChanged = Board_PositionChanged;


function Board_Flip() {
	for (var i=0;i<32;i++) {
		var l = document.getElementById(this.boardid+"_"+i).style.left;
		var t = document.getElementById(this.boardid+"_"+i).style.top;
		document.getElementById(this.boardid+"_"+i).style.left = document.getElementById(this.boardid+"_"+(63-i)).style.left;
		document.getElementById(this.boardid+"_"+i).style.top = document.getElementById(this.boardid+"_"+(63-i)).style.top;
		document.getElementById(this.boardid+"_"+(63-i)).style.left = l;
		document.getElementById(this.boardid+"_"+(63-i)).style.top = t;
	}
	var l = document.getElementById(this.boardid+"_mib").style.left;
	var t = document.getElementById(this.boardid+"_mib").style.top;
	document.getElementById(this.boardid+"_mib").style.left = document.getElementById(this.boardid+"_miw").style.left;
	document.getElementById(this.boardid+"_mib").style.top = document.getElementById(this.boardid+"_miw").style.top;
	document.getElementById(this.boardid+"_miw").style.left = l;
	document.getElementById(this.boardid+"_miw").style.top = t;
	this.whiteonbottom ^= true;
	document.getElementById(this.boardid+"_lettersbottom").style.visibility = this.whiteonbottom ? 'visible' : 'hidden';
	document.getElementById(this.boardid+"_lettersbottominv").style.visibility = this.whiteonbottom ? 'hidden' : 'visible';
	document.getElementById(this.boardid+"_numbersright").style.visibility = this.whiteonbottom ? 'visible' : 'hidden';
	document.getElementById(this.boardid+"_numbersrightinv").style.visibility = this.whiteonbottom ? 'hidden' : 'visible';
}
Board.prototype.Flip = Board_Flip;





















function Hashtable() {
	this.keys = new Array();
	this.values = new Array();
}

function Hashtable_Get(key) {
	if (key == null) return null;
	for (var i = this.keys.length-1; i>=0; i--) {
		if (this.keys[i] == key) return this.values[i];
	}
	return null;
} Hashtable.prototype.Get = Hashtable_Get;

function Hashtable_Put(key,value) {
	if (key == null || value == null) return;
	for (var i = this.keys.length; i>=0; i--) {
		if (this.keys[i] == key) { 
			this.values[i] = value;
			return;
		}
	}
	this.values.push(value);
	this.keys.push(key);
	if (this.keys.length > 500) {
		this.keys.splice(0,10);
		this.values.splice(0,10);
	}
} Hashtable.prototype.Put = Hashtable_Put;


// Endgame Table

function EndgameTable(posx, posy, tabheight, lang, position) {
	this.posx = posx;
	this.posy = posy;
	this.width = 200;
	this.height = tabheight;
	this.lang = lang;
	this.rowcount = 0;
	this.tableid = Objectmap.Add("et",this);
	this.movefrom = new Array();
	this.moveto = new Array();
	this.movepromo = new Array();
	this.position = position;
	this.observer = null;
	this.lastreqid = -1;
	this.cachefens = new Array();
	this.cacheresults = new Array();
	this.posval = new Array();
	this.req = new RequestObject(this.tableid);
	this.cache = new Hashtable();
	var d = this.GetDivElement();
	document.getElementsByTagName("body")[0].appendChild(d);
	this.SetHeaderTable(lang);
}

function EndgameTable_GetDivElement() {
	var d = document.createElement("div");
	d.id = this.tableid;
	d.style.visibility = 'hidden';
	d.style.position = 'absolute';
	d.style.left = this.posx;
	d.style.top = this.posy;
	d.style.height = this.height;
	d.style.width = this.width;
	var result = '<div id="'+this.tableid+'_value" style="font-family:verdana,arial,helvetica,sans-serif;font-size:11px;font-weight:bold;font-style:italic;"></div>';
	result += '<div id="'+this.tableid+'_header" style="position:absolute;left:0;top:23;"></div>';
	result += '<div id="'+this.tableid+'_body" style="position:absolute;left:0;top:44;height:'+(this.height-44)+';width:'+(this.width-25)+';overflow:auto;"></div>';
	d.innerHTML = result;
	return d;
}

EndgameTable.prototype.GetDivElement = EndgameTable_GetDivElement;

function EndgameTable_SetHeaderTable(lang) {
	var result = '<table border="0" cellpadding="0" cellspacing="0">';
	var texts;
	if (lang == 'de')	texts = new Array("Zug","Wert");
	else texts = new Array("Move","Value");
	var lengths = new Array(60,100);
	var thestyle = 'style="font-family:Verdana,Geneva,Arial,Helvetica,sans-serif; font-size:11px;font-weight:600;"';
	result += '<tr>';
	for (var i = 0; i < texts.length; i++) {
		result += '<td width="'+lengths[i]+'" '+thestyle+'>'+texts[i]+'</td>';
	}

	result += '</tr></table>';
	document.getElementById(this.tableid+'_header').innerHTML = result;
}

EndgameTable.prototype.SetHeaderTable = EndgameTable_SetHeaderTable;

function EndgameTable_SetVisible(b) {
		document.getElementById(this.tableid).style.visibility = b ? 'visible' : 'hidden';
}

EndgameTable.prototype.SetVisible = EndgameTable_SetVisible;

function EndgameTable_SetObserver(board) {
		this.observer = board;
}

EndgameTable.prototype.SetObserver = EndgameTable_SetObserver;

function EndgameTable_SetData(moves) {
	if (moves.length == 0 && this.posval.length == 0) {
		this.ShowNoInfoAvailable();
		return;
	}
		
	var txt = '<table border="0" cellpadding="0" cellspacing="0">';
	for (var k = 0; k < moves.length; k++) {
		var lengths = new Array(60,100);
		var thestyle = 'style="font-family:Verdana,Geneva,Arial,Helvetica,sans-serif; font-size:11px;font-weight:100;"';
		txt += '<tr id="'+this.tableid+'_'+k+'" onmousedown="javascript:EndgameTable.Endingdown(event,this);" onmouseover="javascript:EndgameTable.Endingover(event,this);" onmouseout="javascript:EndgameTable.Endingout(event,this);" >';		
		
		var toks = moves[k][0].split('-');
		
		var p = this.position.b[toks[0]];
		var f = eval(toks[0]);
		var t = eval(toks[1]);
		var pi = this.position.piececodes[p];
		
		var isep = (p == 6 || p == 12) && ((f&7) != (t&7)) && (this.position.b[t] == 0); 
		var iscapture = (this.position.b[t] != 0) || isep;
		var mi = iscapture ? 'x' : '-';
		
		var rem = toks.length > 2 ? "("+this.position.piececodes[toks[2]]+")" : '';
		
		moves[k][0] = pi+SQ.names[toks[0]]+mi+SQ.names[toks[1]]+rem;
		
		for (var i = 0; i < moves[k].length; i++) {
			txt += '<td width="'+lengths[i]+'" '+thestyle+'>'+moves[k][i]+'</td>';
		}
		txt += '</tr>';
	}
	txt += '</table>';
	document.getElementById(this.tableid+'_body').innerHTML = txt;
	if (this.posval.length == 2 && this.position.wtm) 
		document.getElementById(this.tableid+'_value').innerHTML = this.posval[0];
	else if (this.posval.length == 2 && !this.position.wtm) 
		document.getElementById(this.tableid+'_value').innerHTML = this.posval[1];
}

EndgameTable.prototype.SetData = EndgameTable_SetData;

function EndgameTable_RequestData(pos) {
	document.getElementById(this.tableid+'_body').innerHTML = "";
	document.getElementById(this.tableid+'_value').innerHTML = "";
	var n = pos.NumberOfPieces();
	var valid = pos.IsValid(true);
	if (!valid) {
		pos.wtm ^= true;
		valid |= pos.IsValid(true);
		pos.wtm ^= true;
	}
	if (n <= 6 && n >= 2 && valid) {
		var fen = pos.GetFEN();
		var t = 'egtb&fen='+fen;
		var tok = t.split(' ');
		tok[1] = 'w';
		tok[tok.length-2] = '0';
		tok[tok.length-1] = '1';
		t = tok[0];
		for (var i = 0; i < tok.length; i++)
			t += " "+tok[i];
			
		var cr = this.cache.Get(t);
	
		if (cr != null) {
			this.lastreqid = this.lastreqid.split(':')[0]+':'+t;
			this.ParseRequestResult(this.lastreqid.split(':')[0],cr);
		}
		else {
			this.lastreqid = this.req.SendRequest(null,t)+':'+t;
			this.cachefens[0] = t;
			this.cacheresults[0] = null;
		}
	}
	else this.ShowNoInfoAvailable();
}

EndgameTable.prototype.RequestData = EndgameTable_RequestData;

function EndgameTable_ShowNoInfoAvailable() {
	if (this.lang == 'de')
		document.getElementById(this.tableid+'_body').innerHTML = '<span style="font-family:Verdana,Geneva,Arial,Helvetica,sans-serif; font-size:11px;font-weight:100;"> Keine Information verf&uuml;gbar</span>';
	else
		document.getElementById(this.tableid+'_body').innerHTML = '<span style="font-family:Verdana,Geneva,Arial,Helvetica,sans-serif; font-size:11px;font-weight:100;"> No information available</span>';
}

EndgameTable.prototype.ShowNoInfoAvailable = EndgameTable_ShowNoInfoAvailable;


function EndgameTable_ParseRequestResult(req,text) {
	var lastreqtok = this.lastreqid.split(':');
	if (lastreqtok[0] != req) return;
	this.cacheresults[0] = text;
	this.cache.Put(lastreqtok[1],text);
	var moves = new Array();
	this.movefrom = new Array();
	this.moveto = new Array();
	this.movepromo = new Array();
	var num = 0;
	this.posval = new Array('','');
	if (text) {

		var tok = text.split('\n');
		var wtm = _t;
		for (var i = 0; i < tok.length; i++) {
			if (tok[i] == "NEXTCOLOR") { wtm = _f; continue; }
			var line = tok[i].split(':');
			if (line.length != 2) {
				if (line.length == 1 && line[0].length >= 4) {
					var t = line[0].substr(0,3);
					if (t == "Dra" || t == "Win" || t == "Los") { 
						if (this.lang == 'de') {
							line[0] = line[0].replace("Draw","Remis");			
							line[0] = line[0].replace("Win in","Gewinn in");			
							line[0] = line[0].replace("Lose in","Verlust in");			
						}
						this.posval[wtm?0:1] = line[0]; 
						}
				}
				 continue;
		}
			if (this.position.wtm != wtm) continue;
	
			var curr = new Array(2);
	
			var m = line[0].split('-');
			
			curr[0] = line[0]; curr[1] = line[1];
			if (this.lang == 'de') {
				curr[1] = curr[1].replace("Draw","Remis");			
				curr[1] = curr[1].replace("Win in","Gewinn in");			
				curr[1] = curr[1].replace("Lose in","Verlust in");			
			}

	
			this.movefrom[num] = eval(m[0]);	this.moveto[num] = eval(m[1]);	this.movepromo[num] = m.length == 3 ? eval(m[2]) : 0;
			if (this.movepromo[num] != 0 && this.moveto[num] >= 56 && this.movepromo[num] > 6) this.movepromo[num]-=6;
			moves[num] = curr; num++;
		}
	}

	this.SetData(moves);
}

EndgameTable.prototype.ParseRequestResult = EndgameTable_ParseRequestResult;

function EndgameTable_Endingover(ev, ob) {
	ob.style.background = '#A0B9E5';
	var tab = Objectmap.Get(ob.id.split('_')[0]);
	if (tab.observer != null) {	
		var row = ob.id.split('_')[1];
		tab.observer.MarkSquare(tab.movefrom[row]); 
		tab.observer.MarkSquare(tab.moveto[row]);
	}
}

EndgameTable.Endingover = EndgameTable_Endingover;

function EndgameTable_Endingout(ev, ob) {
	ob.style.background = 'rgb(255,255,255)';
	var tab = Objectmap.Get(ob.id.split('_')[0]);
	if (tab.observer != null) {	
		var row = ob.id.split('_')[1];
		tab.observer.UnmarkSquare(tab.movefrom[row]);
		tab.observer.UnmarkSquare(tab.moveto[row]);
	}
}

EndgameTable.Endingout = EndgameTable_Endingout;

function EndgameTable_Endingdown(ev, ob) {
	var row = ob.id.split('_')[1];
	var tab = Objectmap.Get(ob.id.split('_')[0]);
	if (tab.position != null) {
		document.getElementById(tab.tableid+'_body').innerHTML = "";
		tab.position.MakeMove(tab.movefrom[row],tab.moveto[row],tab.movepromo[row]);
	}
}

EndgameTable.Endingdown = EndgameTable_Endingdown;

function EndgameTable_PositionChanged(pos) {
	this.RequestData(pos);
}

EndgameTable.prototype.PositionChanged = EndgameTable_PositionChanged;







var imagesguicheckbox = new Array("images/check0.gif","images/check1.gif");
var imagesguiradio = new Array("images/radio0.gif","images/radio1.gif");

function GuiCheckbox(label, state) {
	this.label = label;
	this.state = state;
	this.changehandler = new Array();
	this.guiid = Objectmap.Add("cb",this);
}

function GuiCheckbox_GetDivText(x,y) {
	var r = '<div id="'+this.guiid+'" onclick="GuiCheckbox.Clicked(event,this);" style="position:absolute;left:'+x+';top:'+y+';cursor:default;"><img src="'+imagesguicheckbox[this.state?1:0]+'" width="10" height="10">&nbsp;'+this.label+'</div>';
	return r;
}
GuiCheckbox.prototype.GetDivText = GuiCheckbox_GetDivText;

function GuiCheckbox_Clicked(ev,ob) {
	var o = Objectmap.Get(ob.id);
	o.SetState(o.state ^ true);
}
GuiCheckbox.Clicked = GuiCheckbox_Clicked;

function GuiCheckbox_AddListener(l) {
		this.changehandler.push(l);
} GuiCheckbox.prototype.AddListener = GuiCheckbox_AddListener;


function GuiCheckbox_SetState(b) {
	if (this.state == b) return;
	this.state = b;
	document.getElementById(this.guiid).innerHTML = '<img src="'+imagesguicheckbox[this.state?1:0]+'" width="10" height="10">&nbsp;'+this.label;		
	for (var i = 0; i < this.changehandler.length; i++) this.changehandler[i].StateChanged(this);
} GuiCheckbox.prototype.SetState = GuiCheckbox_SetState;

function GuiCheckbox_GetState() { return this.state; } GuiCheckbox.prototype.GetState = GuiCheckbox_GetState;




function GuiRadio(label, state) {
	this.label = label;
	this.state = state;
	this.changehandler = new Array();
	this.guiid = Objectmap.Add("rb",this);
}

function GuiRadio_GetDivText(x,y) {
	var r = '<div id="'+this.guiid+'" onclick="GuiRadio.Clicked(event,this);" style="position:absolute;left:'+x+';top:'+y+';cursor:default;"><img src="'+imagesguiradio[this.state?1:0]+'" width="10" height="10">&nbsp;'+this.label+'</div>';
	return r;
}
GuiRadio.prototype.GetDivText = GuiRadio_GetDivText;

function GuiRadio_Clicked(ev,ob) {
	var o = Objectmap.Get(ob.id);
	o.SetState (true);
}
GuiRadio.Clicked = GuiRadio_Clicked;

function GuiRadio_AddListener(l) {
		this.changehandler.push(l);
} GuiRadio.prototype.AddListener = GuiRadio_AddListener;

function GuiRadio_SetState(b) {
	if (this.state == b) return;
	this.state = b;
	document.getElementById(this.guiid).innerHTML = '<img src="'+imagesguiradio[this.state?1:0]+'" width="10" height="10">&nbsp;'+this.label;		
	for (var i = 0; i < this.changehandler.length; i++) this.changehandler[i].StateChanged(this);
} GuiRadio.prototype.SetState = GuiRadio_SetState;

function GuiRadio_GetState() { return this.state; } GuiRadio.prototype.GetState = GuiRadio_GetState;


function GuiCheckgroup() {
	this.elements = new Array();
}

function GuiCheckgroup_Add(o) {
	this.elements.push(o);
	o.AddListener(this);
}
GuiCheckgroup.prototype.Add = GuiCheckgroup_Add;

function GuiCheckgroup_StateChanged(o) {
	if (!o.GetState()) return;
	for (var i = 0; i < this.elements.length; i++) {
		if (o == this.elements[i]) continue;
		this.elements[i].SetState(_f);
	}
//	this.elements.push(o);
//	o.AddListener(this);
}
GuiCheckgroup.prototype.StateChanged = GuiCheckgroup_StateChanged;


// Setup Table

function SetupTable(posx, posy, lang, position) {
	this.posx = posx;
	this.posy = posy;
	this.width = 655;
	this.sqsize = sqsize; // TODO
	this.lang = lang;
	this.selectedpiece = 1;
	this.darkcolor = "rgb(181,189,206)";
	this.lightcolor = "rgb(233,236,240)";
	this.tableid = Objectmap.Add("st",this);
	this.position = position;
	this.inputboard = null; 	// Brett zum Setzen der Figuren
	var d = this.GetDivElement();
	document.getElementsByTagName("body")[0].appendChild(d);
	this.SetPiece(1);
}

function SetupTable_GetDivElement() {
	var d = document.createElement("div");
	d.id = this.tableid;
	d.style.visibility = 'hidden';
	d.style.position = 'absolute';
	d.style.left = this.posx;
	d.style.top = this.posy;
	d.style.width = this.width;
	var result = "";
	
	for (i = 1; i <= 12; i++) {
		var f = (i-1) % 6;
		var r = Math.floor((i-1) / 6);
		var le = f * this.sqsize;
		var to = r * this.sqsize;
		var col = ((r % 2) == (f % 2)) ? this.darkcolor : this.lightcolor;
		var sqid = this.tableid+"_"+i;
		result += "<div id=\""+sqid+"\" style=\"position:absolute;left:"+le+";top:"+to+";background-color:"+col+";\" onmousedown=\"SetupTable.Mousedown(event,this);\" ><img src=\""+piecegraphics[i]+"\" ></div>\n";	
	}

	result += "<div id=\""+this.tableid+"_move\" style=\"position:absolute;left:"+(6*this.sqsize)+";top:0;background-color:"+this.darkcolor+"\" onmousedown=\"SetupTable.Mousedown(event,this);\" ><img src=\""+movegraphics+"\" ></div>\n";	
	result += "<div id=\""+this.tableid+"_0\" style=\"position:absolute;left:"+(6*this.sqsize)+";top:"+this.sqsize+";background-color:"+this.lightcolor+"\" onmousedown=\"SetupTable.Mousedown(event,this);\" ><img src=\""+piecegraphics[0]+"\" ></div>\n";	

	result += "<div id=\""+this.tableid+"_empty\" style=\"position:absolute;left:"+(7*this.sqsize+this.sqsize/4)+";top:0;\" onmousedown=\"SetupTable.Mousedown(event,this);\" ><img src=\""+emptyboardgraphics+"\" ></div>\n";	



	result += '<div class="button" id="'+this.tableid+'_u" style="position:absolute; left:'+(this.sqsize*8+13+20)+'; top:'+(0)+';width:13;height:13;" onmouseover="over(this);" onmouseout="leave(this);" onmousedown="SetupTable.Mousedown(event,this);" onclick=""><img src="images/arr13u.gif"></div>';
	result += '<div class="button" id="'+this.tableid+'_d" style="position:absolute; left:'+(this.sqsize*8+13+20)+'; top:'+(26)+';width:13;height:13;" onmouseover="over(this);" onmouseout="leave(this);" onmousedown="SetupTable.Mousedown(event,this);"><img src="images/arr13d.gif"></div>';
	result += '<div class="button" id="'+this.tableid+'_r" style="position:absolute; left:'+(this.sqsize*8+26+20)+'; top:'+(13)+';width:13;height:13;" onmouseover="over(this);" onmouseout="leave(this);" onmousedown="SetupTable.Mousedown(event,this);"><img src="images/arr13r.gif"></div>';
	result += '<div class="button" id="'+this.tableid+'_l" style="position:absolute; left:'+(this.sqsize*8+20)+'; top:'+(13)+';width:13;height:13;" onmouseover="over(this);" onmouseout="leave(this);" onmousedown="SetupTable.Mousedown(event,this);"><img src="images/arr13l.gif"></div>';
 
	d.innerHTML = result;
	return d;
}

SetupTable.prototype.GetDivElement = SetupTable_GetDivElement;

function SetupTable_SetPiece(p) {
	this.UnmarkSquare(this.selectedpiece);
	this.MarkSquare(p);
	this.selectedpiece = eval(p);	
} 
SetupTable.prototype.SetPiece = SetupTable_SetPiece;

function SetupTable_IsSetupMode() {
	return this.selectedpiece >= 0;
} SetupTable.prototype.IsSetupMode = SetupTable_IsSetupMode;

function SetupTable_MarkSquare(sq) {
		var col;
		if (sq >= 0) {
			var f = sq & 7;
			var r = sq >> 3;
			col = ((r % 2) == (f % 2)) ? "rgb(146,174,221)" : "rgb(198,221,255)";
		}
		else { sq = 'move'; col="rgb(198,221,255)"; }
		document.getElementById(this.tableid+"_"+sq).style.background = col;
}

SetupTable.prototype.MarkSquare = SetupTable_MarkSquare;

function SetupTable_UnmarkSquare(sq) {
		var col;
		if (sq >= 0) {
			var f = (sq-1) % 6;
			var r = Math.floor((sq-1) / 6);
			col = ((r % 2) == (f % 2)) ? this.darkcolor : this.lightcolor;
			if (sq == 0) col = this.lightcolor;
		}
		else { 
			sq = 'move'; col = this.darkcolor;
	 	}
		document.getElementById(this.tableid+"_"+sq).style.background = col;
}

SetupTable.prototype.UnmarkSquare = SetupTable_UnmarkSquare;

function SetupTable_StateChanged(b) {
	
} 
SetupTable.prototype.StateChanged = SetupTable_StateChanged;

function SetupTable_Mousedown(ev,ob) {
	var elem = ob.id.split('_')[1];
	var tab = Objectmap.Get(ob.id.split('_')[0]);
//	if (tab.position != null) {
//		tab.position.MakeMove(tab.movefrom[row],tab.moveto[row],tab.movepromo[row]);
//		document.getElementById(tab.tableid+'_body').innerHTML = "";
//	}

	if (tab.inputboard != null && tab.inputboard.whiteonbottom == _f) {
		if (elem == 'd') elem = 'u';
		else if (elem == 'u') elem = 'd';
		else if (elem == 'l') elem = 'r';
		else if (elem == 'r') elem = 'l';
	}

	if (elem == 'empty') {
		p.Clear();
	}
	else if (elem == 'd') {
		for (var i = 8; i < 16; i++) {if (tab.position.b[i] == 6 || tab.position.b[i] == 12) return; }
		var t = new Array(8); for (var i = 0; i < 8; i++) t[i] = tab.position.b[i];
		for (var i = 0; i < 56; i++)tab.position.b[i] = tab.position.b[i+8];
		for (var i = 56; i < 64; i++) tab.position.b[i] = t[i-56];
		tab.position.ClearHistory(_t,_t); tab.position.PositionChanged();
	}
	else if (elem == 'r') {
		var t = new Array(8); for (var i = 0; i < 8; i++) t[i] = tab.position.b[(i<<3)+7];
		for (var i = 63; i >= 0; i--) tab.position.b[i] = ((i&7)!=0) ? tab.position.b[i-1] : t[i>>3];
		tab.position.ClearHistory(_t,_t); tab.position.PositionChanged();
	}
	else if (elem == 'l') {
		var t = new Array(8); for (var i = 0; i < 8; i++) t[i] = tab.position.b[i<<3];
		for (var i = 0; i < 64; i++) tab.position.b[i] = ((i&7)!=7) ? tab.position.b[i+1] : t[(i-7)>>3];
		tab.position.ClearHistory(_t,_t); tab.position.PositionChanged();
	}
	else if (elem == 'u') {
		for (var i = 48; i < 56; i++) {if (tab.position.b[i] == 6 || tab.position.b[i] == 12) return; }
		var t = new Array(8); for (var i = 0; i < 8; i++) t[i] = tab.position.b[56+i];
		for (var i = 63; i >= 8; i--)tab.position.b[i] = tab.position.b[i-8];
		for (var i = 0; i < 8; i++) tab.position.b[i] = t[i];
		tab.position.ClearHistory(_t,_t); tab.position.PositionChanged();

	}
	else if (elem =='move') {
		tab.SetPiece(-1);
	}
	else if (elem == 'start')
		p.SetStart();
//	p.b[elem] = 0;
//	p.PositionChanged();
	else if (!isNaN(elem)) { tab.SetPiece(elem); }
}

SetupTable.Mousedown = SetupTable_Mousedown;


function SetupTable_SetVisible(b) {
		document.getElementById(this.tableid).style.visibility = b ? 'visible' : 'hidden';
}

SetupTable.prototype.SetVisible = SetupTable_SetVisible;





function SQ() {}
function SQ_ILB(s) {return (s&7)==0;} SQ.ILB = SQ_ILB;
function SQ_IRB(s) {return ((~(s))&7)==0;} SQ.IRB = SQ_IRB;
function SQ_IBB(s) {return ((s)&120)==0;} SQ.IBB = SQ_IBB;
function SQ_ITB(s) {return ((~(s))&56) == 0;} SQ.ITB = SQ_ITB;
SQ.names = new Array('a1','b1','c1','d1','e1','f1','g1','h1','a2','b2','c2','d2','e2','f2','g2','h2','a3','b3','c3','d3','e3','f3','g3','h3','a4','b4','c4','d4','e4','f4','g4','h4','a5','b5','c5','d5','e5','f5','g5','h5','a6','b6','c6','d6','e6','f6','g6','h6','a7','b7','c7','d7','e7','f7','g7','h7','a8','b8','c8','d8','e8','f8','g8','h8');

function MG () {}
function MG_TML(s,n,b,w,S) {return !(SQ.ILB(s-n))&&MG.TMAST(s,s-1-n,b,w,S,s-1-n);} MG.TML = MG_TML;
function MG_TMR(s,n,b,w,S) {return !(SQ.IRB(s+n))&&MG.TMAST(s,s+1+n,b,w,S,s+1+n);} MG.TMR = MG_TMR;
function MG_TMD(s,n,b,w,S) {return !(SQ.IBB(s-8*n))&&MG.TMAST(s,s-8-8*n,b,w,S,s-8-8*n);} MG.TMD = MG_TMD;
function MG_TMU(s,n,b,w,S) {return !(SQ.ITB(s+8*n))&&MG.TMAST(s,s+8+8*n,b,w,S,s+8+8*n);} MG.TMU = MG_TMU;
function MG_TMUL(s,n,b,w,S) {return !(SQ.ITB(s+7*n) || SQ.ILB(s+7*n))&&MG.TMAST(s,s+7+7*n,b,w,S,s+7+7*n);} MG.TMUL = MG_TMUL;
function MG_TMUR(s,n,b,w,S) {return !(SQ.ITB(s+9*n) || SQ.IRB(s+9*n))&&MG.TMAST(s,s+9+9*n,b,w,S,s+9+9*n);} MG.TMUR = MG_TMUR;
function MG_TMDL(s,n,b,w,S) {return !(SQ.IBB(s-9*n) || SQ.ILB(s-9*n))&&MG.TMAST(s,s-9-9*n,b,w,S,s-9-9*n);} MG.TMDL = MG_TMDL;
function MG_TMDR(s,n,b,w,S) {return !(SQ.IBB(s-7*n) || SQ.IRB(s-7*n))&&MG.TMAST(s,s-7-7*n,b,w,S,s-7-7*n);} MG.TMDR = MG_TMDR;
function MG_TKM(f,d,D,b,w,S) {
 var t=(f&7)+d,T=(f>>3)+D;	if (t< 0||t>7||T< 0||T>7) return; var x=T*8+t; if (b[x]==0) {S.push(f|(x<<6)); return;}
 if (w&&(b[x]>=7)) S.push(f|(x<<6)); else if ((!w)&&b[x]>=0&&b[x]<=6) S.push(f|(x<<6));} MG.TKM = MG_TKM;
function MG_TPM(f,b,w,e,S) {
 var F=f>>3; if (w) {if (b[f+8]==0) {if (F<6) {S.push(f|((f+8)<<6));if (F==1&&b[f+16]==0) S.push(f|((f+16)<<6));} else {var t=f|((f+8)<<6);S.push(t|(2<<12),t|(3<<12),t|(4<<12),t|(5<<12));}}
 if (!SQ.ILB(f)&&b[f+7]>=7) {if (F<6) S.push(f|((f+7)<<6)); else {var t=f|((f+7)<<6);S.push(t|(2<<12),t|(3<<12),t|(4<<12),t|(5<<12));}}
 if (!SQ.IRB(f)&&b[f+9]>=7) {if (F<6) S.push(f|((f+9)<<6)); else {var t=f|((f+9)<<6);S.push(t|(2<<12),t|(3<<12),t|(4<<12),t|(5<<12));}}
 if (e>0) {if (!SQ.ILB(f)&&f+7==e) S.push(f|((f+7)<<6)); if (!SQ.IRB(f)&&f+9==e) S.push(f|((f+9)<<6));}} else {
 if (b[f-8]==0) {if (F>1) {S.push(f|((f-8)<<6));if (F==6&&b[f-16]==0) S.push(f|((f-16)<<6));} else {var t=f|((f-8)<<6);S.push(t|(8<<12),t|(9<<12),t|(10<<12),t|(11<<12));}}
 if (!SQ.ILB(f)&&b[f-9]>0&&b[f-9]<=6) {if (F>1) S.push(f|((f-9)<<6)); else {var t=f|((f-9)<<6);S.push(t|(8<<12),t|(9<<12),t|(10<<12),t|(11<<12));}}
 if (!SQ.IRB(f)&&b[f-7]>=1&&b[f-7]<=6) {if (F>1) S.push(f|((f-7)<<6)); else {var t=f|((f-7)<<6);S.push(t|(8<<12),t|(9<<12),t|(10<<12),t|(11<<12));}}
 if (e>0) {if (!SQ.ILB(f)&&f-9==e) S.push(f|((f-9)<<6)); if (!SQ.IRB(f)&&f-7==e) S.push(f|((f-7)<<6));}}} MG.TPM = MG_TPM;
function MG_TMAST(f,t,b,w,S,T) {
 if (b[t]==0) {if (t==T) S.push(f|(t<<6)); return _t;} if (t!=T)	return _f; if (w&&b[t]>=7) S.push(f|(t<<6));	else if ((!w)&&b[t]>0&&b[t]<=6) S.push(f|(t<<6)); return _f;} MG.TMAST = MG_TMAST;
function MG_FindMoves(p) {var S = MG.FPM(p); MG.RIM(S,p); return S;} MG.FindMoves = MG_FindMoves;
function MG_FPM(p) {
 var S=new Array(),b=p.b,i; if (p.wtm) {	for (var s=0; s<64; s++) {switch (b[s]) {case 0: continue; case 1:	MG.TML(s,0,b,_t,S);MG.TMR(s,0,b,_t,S);MG.TMU(s,0,b,_t,S);MG.TMD(s,0,b,_t,S);MG.TMUL(s,0,b,_t,S);MG.TMUR(s,0,b,_t,S);MG.TMDL(s,0,b,_t,S);MG.TMDR(s,0,b,_t,S);	
 if (((p.castling&1)==1)&&b[5]==0&&b[6]==0&&s==4&&b[7]==3)	S.push(s|(6<<6));	if (((p.castling&2)==2)&&b[3]==0&&b[2]==0&&b[1]==0&&s==4&&b[0]==3)S.push(s|(2<<6));break;
 case 2:	i=0;while(MG.TML(s,i++,b,_t,S));i=0;while(MG.TMR(s,i++,b,_t,S));i=0;while(MG.TMU(s,i++,b,_t,S));i=0;while(MG.TMD(s,i++,b,_t,S));
 i=0;while(MG.TMUL(s,i++,b,_t,S));i=0;while(MG.TMUR(s,i++,b,_t,S));i=0;while(MG.TMDL(s,i++,b,_t,S));i=0;while(MG.TMDR(s,i++,b,_t,S));break;
 case 3:	i=0;while(MG.TML(s,i++,b,_t,S));i=0;while(MG.TMR(s,i++,b,_t,S));i=0;while(MG.TMU(s,i++,b,_t,S));i=0;while(MG.TMD(s,i++,b,_t,S));break;
 case 4:	i=0;while(MG.TMUL(s,i++,b,_t,S));i=0;while(MG.TMUR(s,i++,b,_t,S));i=0;while(MG.TMDL(s,i++,b,_t,S));i=0;while(MG.TMDR(s,i++,b,_t,S));break;
 case 5:	MG.TKM(s,1,2,b,_t,S);MG.TKM(s,2,1,b,_t,S);MG.TKM(s,2,-1,b,_t,S);MG.TKM(s,1,-2,b,_t,S);MG.TKM(s,-1,-2,b,_t,S);MG.TKM(s,-2,-1,b,_t,S);MG.TKM(s,-2,1,b,_t,S);MG.TKM(s,-1,2,b,_t,S);break;
 case 6:	MG.TPM(s,b,_t,p.ep,S);break;}}}else {	for (var s=0; s<64; s++) {switch (b[s]) {case 0: continue; case 7: MG.TML(s,0,b,_f,S);MG.TMR(s,0,b,_f,S);MG.TMU(s,0,b,_f,S);MG.TMD(s,0,b,_f,S);MG.TMUL(s,0,b,_f,S);MG.TMUR(s,0,b,_f,S);MG.TMDL(s,0,b,_f,S);MG.TMDR(s,0,b,_f,S);	
 if (((p.castling&4)==4)&&b[61]==0&&b[62]==0&&s==60&&b[63]==9)	S.push(s|(62<<6));if (((p.castling&8)==8)&&b[59]==0&&b[58]==0&&b[57]==0&&s==60&&b[56]==9) S.push(s|(58<<6));break;
 case 8:	i=0;while(MG.TML(s,i++,b,_f,S));i=0;while(MG.TMR(s,i++,b,_f,S));i=0;while(MG.TMU(s,i++,b,_f,S));i=0;while(MG.TMD(s,i++,b,_f,S));i=0;while(MG.TMUL(s,i++,b,_f,S));
 i=0;while(MG.TMUR(s,i++,b,_f,S));i=0;while(MG.TMDL(s,i++,b,_f,S));i=0;while(MG.TMDR(s,i++,b,_f,S));break;
 case 9:	i=0;while(MG.TML(s,i++,b,_f,S));i=0;while(MG.TMR(s,i++,b,_f,S));i=0;while(MG.TMU(s,i++,b,_f,S));i=0; while(MG.TMD(s,i++,b,_f,S));break;
 case 10: i=0; while(MG.TMUL(s,i++,b,_f,S));i=0;while(MG.TMUR(s,i++,b,_f,S));i=0;while(MG.TMDL(s,i++,b,_f,S));i=0;while(MG.TMDR(s,i++,b,_f,S));break;
 case 11: MG.TKM(s,1,2,b,_f,S);MG.TKM(s,2,1,b,_f,S);MG.TKM(s,2,-1,b,_f,S);MG.TKM(s,1,-2,b,_f,S);MG.TKM(s,-1,-2,b,_f,S);MG.TKM(s,-2,-1,b,_f,S);MG.TKM(s,-2,1,b,_f,S);MG.TKM(s,-1,2,b,_f,S);break;
 case 12: MG.TPM(s,b,_f,p.ep,S);	break;}}}return S;} MG.FPM = MG_FPM;
function MG_RIM(S,p) {
 var X = new Position();	for (var i = 0; i < S.length; i++) {X.CopyFrom(p); var c=S[i],f=c&63,t=(c>>6)&63,q=(c>>12)&63,P=p.b[f];
 if (P==1&&f==4) {if (t==6) {X.wtm ^= _t;if (MG.IAS(X,4,_f)||MG.IAS(X,5,_f)) {S.splice(i,1);i--;X.wtm ^= _t;continue;}	X.wtm ^= _t;}
 else if (t==2) {X.wtm ^= _t;if (MG.IAS(X,4,_f)||MG.IAS(X,3,_f)) {S.splice(i,1);i--;X.wtm ^= _t;continue;}	X.wtm ^= _t;}} else if (P==7&&f==60) {
 if (t==62) {X.wtm ^= _t;if (MG.IAS(X,60,_f)||MG.IAS(X,61,_f)) {S.splice(i,1);i--;X.wtm ^= _t;continue;}	X.wtm ^= _t;}
 else if (t==58) {X.wtm ^= _t;	if (MG.IAS(X,60,_f)||MG.IAS(X,59,_f)) {S.splice(i,1);i--;X.wtm ^= _t;continue;} X.wtm ^= _t;}}
 X.MakeMove(f,t,q);if (!X.IsValid(_f)) {S.splice(i,1);i--;}}} MG.RIM = MG_RIM;
function MG_IAS(p, s, W) {
 var B=p.b,q,r,b,n,k,S=s,w=W?!p.wtm:p.wtm; if (w) {q=2;r=3;b=4;n=5;k=1;} else {q=8;r=9;b=10;n=11;k=7;} while (!SQ.ILB(S)) {S--; if (B[S]==0) continue; if (B[S]==r||B[S]==q) return _t;
 break;} if (!SQ.ILB(s)&&B[s-1]==k) return _t; S=s; while (!SQ.IRB(S)) {S++; if (B[S]==0) continue; if (B[S]==r||B[S]==q) return _t; break;} if (!SQ.IRB(s)&&B[s+1]==k) return _t;
 S=s; while (!SQ.ITB(S)) {S+=8; if (B[S]==0) continue; if (B[S]==r||B[S]==q) return _t; break;} if (!SQ.ITB(s)&&B[s+8]==k) return _t; S=s;	while (!SQ.IBB(S)) {S-=8;	if (B[S]==0) continue;
 if (B[S]==r||B[S]==q) return _t; break;} if (!SQ.IBB(s)&&B[s-8]==k) return _t; S=s; while (!SQ.ILB(S)&&!SQ.ITB(S)) {S+=7;	if (B[S]==0) continue;if (B[S]==b||B[S]==q) return _t; break;}
 if (!SQ.ILB(s)&&!SQ.ITB(s)&&B[s+7]==k) return _t; S=s; while (!SQ.IRB(S)&&!SQ.ITB(S)) {S+=9; if (B[S]==0) continue; if (B[S]==b||B[S]==q) return _t; break;}
 if (!SQ.IRB(s)&&!SQ.ITB(s)&&B[s+9]==k) return _t; S=s; while (!SQ.ILB(S)&&!SQ.IBB(S)) {S-=9; if (B[S]==0) continue; if (B[S]==b||B[S]==q) return _t; break;}
 if (!SQ.ILB(s)&&!SQ.IBB(s)&&B[s-9]==k) return _t; S=s; while (!SQ.IRB(S)&&!SQ.IBB(S)) {S-=7; if (B[S]==0) continue; if (B[S]==b||B[S]==q) return _t; break;}
 if (!SQ.IRB(s)&&!SQ.IBB(s)&& B[s-7]==k) return _t; if (w) {if (!SQ.IBB(s)) {if (!SQ.ILB(s)&&B[s-9]==6) return _t;if (!SQ.IRB(s)&&B[s-7]==6) return _t;}} else {
 if (!SQ.ITB(s)) {if (!SQ.ILB(s)&&B[s+7]==12) return _t;if (!SQ.IRB(s)&&B[s+9]==12) return _t;}}p=s&7;r=s>>3;
 return (p>=1&&r<=5&&B[s+15]==n)||(p<=6&&r<=5&&B[s+17]==n)||(p<=5&&r<=6&&B[s+10]==n)||(p>=2&&r<=6&&B[s+6]==n)||(p<=6&&r>=2&&B[s-15]==n)||(p>=1&&r>=2&&B[s-17]==n)||(p>=2&&r>=1&&B[s-10]==n)||(p<=5&&r>=1&&B[s-6]==n); } MG.IAS = MG_IAS;




























	var p;
	var b;
	var et;
	var em;
	var st;
	
	var bwtm,bbtm;
	
	function keypress(ev) {
		if (ev.keyCode == 73) {
			inputfen();
		}
		if (ev.keyCode == 37) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+'_l'));
		}
		else if (ev.keyCode == 39) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+'_r'));
		}
		else if (ev.keyCode == 38) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+'_u'));
		}
		else if (ev.keyCode == 40) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+'_d'));
		}
		else if (ev.keyCode == 49) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+(st.selectedpiece!=1?'_1':'_7')));
		}
		else if (ev.keyCode == 50) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+(st.selectedpiece!=2?'_2':'_8')));
		}
		else if (ev.keyCode == 51) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+(st.selectedpiece!=3?'_3':'_9')));
		}
		else if (ev.keyCode == 52) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+(st.selectedpiece!=4?'_4':'_10')));
		}
		else if (ev.keyCode == 53) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+(st.selectedpiece!=5?'_5':'_11')));
		}
		else if (ev.keyCode == 54) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+(st.selectedpiece!=6?'_6':'_12')));
		}
		else if (ev.keyCode == 55) {
			SetupTable.Mousedown(null,document.getElementById(st.tableid+(st.selectedpiece!=-1?'_move':'_0')));
		}
		else if (ev.keyCode == 84) {
			takeback();
		}
		else if (ev.keyCode == 70) {
			flip();
		}
		else if (ev.keyCode == 66) {
			if (et.movefrom.length > 0) {
				var ob = document.getElementById(et.tableid+'_0');
				if (ob != null)
					EndgameTable.Endingdown(null,ob);
			}
		}
		else if (ev.keyCode == 67) {
			if (p.wtm) {
				bbtm.SetState(true);
			}
			else {
				bwtm.SetState(true);
			}
		}
		
	}
	
	function buildIt() {
		bwtm = new GuiRadio('<span style="font-family:verdana,arial,helvetica,sans-serif;font-size:11px;font-weight:bold;">'+'White to move'+'</span>',_t);
		bbtm = new GuiRadio('<span style="font-family:verdana,arial,helvetica,sans-serif;font-size:11px;font-weight:bold;">'+'Black to move'+'</span>',_f);
		var cg = new GuiCheckgroup();
		cg.Add(bwtm);
		cg.Add(bbtm);
		
		p = new Position();
		b = new Board(sqsize, "rgb(181,189,206)" , "rgb(233,236,240)", 0, 10);
		b.SetVisible(true);	
		b.allowfreemoving = true;
		p.AddListener(b);
		b.SetRefPosition(p);
		et = new EndgameTable(400,60,279,"en",p);
		p.AddListener(et);
		et.SetVisible(true);
		et.SetObserver(b);
		em = new EndgameManager();
		p.AddListener(em);

		st = new SetupTable(0,389,'de',p);
		st.SetVisible(true);
		st.inputboard = b;
		b.setuptable = st;
		p.Clear();
		
		bwtm.AddListener(em);
		bbtm.AddListener(em);

		
		var d = document.createElement("div");
		d.style.position = 'absolute';
		d.style.left = 400;
		d.style.top = 10;
		d.style.height = 30;
		d.style.width = 250;
		d.innerHTML = bwtm.GetDivText(0,0)+bbtm.GetDivText(0,17);
	
		
		document.getElementsByTagName("body")[0].appendChild(d);

	}

	
	function flip() {
		b.Flip();
	}

	
	var sp = new Position();
	function inputfen() {
		var t = prompt("Please enter the FEN / EPD:");
		if (t != null) {
			sp.SetFEN(t);
			sp.ClearHistory(_t,_f);
			if (sp.IsValid(true)) {				
				em.history = new Array();
				setInfo("");
				p.SetFEN(sp.GetFEN());
			}
		}
	}


	function setInfo(text) {
		document.getElementById('info').innerHTML = text;
	}

		
	function over(t) {
		t.style.background = '#455D7F';
		t.style.color = '#E7F1FF';
	}
	function leave(t) {
		t.style.color = '#455D7F';
		t.style.background = '#E7F1FF';
	}
	

function EndgameManager() {
	this.bmid = Objectmap.Add("bm",this);
	this.history = new Array();
}


function EndgameManager_PositionChanged(p) {
	if (p.wtm != bwtm.GetState()) {
		bwtm.SetState(bwtm.GetState()^_t);
		bbtm.SetState(!bwtm.GetState());
	}
	if (p.pliesplayed != 0) { 
		p.ClearHistory(_t,_f);
	}
	var f = p.GetFEN();
	this.history.push(f);
	if (this.history.length > 200)
		this.history.splice(0,10);
	setInfo(f);
}

EndgameManager.prototype.PositionChanged = EndgameManager_PositionChanged;

function EndgameManager_StateChanged(o) {
	if (o == bwtm) {
		if (bwtm.GetState() == p.wtm) {
			
		}
		else {
		  p.wtm ^= true;
		  p.ClearHistory(_t,_t);
		  p.PositionChanged();
		}
	}
	else if (o == bbtm) {
	
	}
}

EndgameManager.prototype.StateChanged = EndgameManager_StateChanged;

	function takeback() {
		if (em.history.length > 0) {
			m = em.history.pop();
			if (em.history.length > 0) {
				m = em.history.pop();
			}
			p.SetFEN(m);
		}
	}













