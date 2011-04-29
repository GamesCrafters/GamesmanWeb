/*
Object.prototype.contains = function(property) {
    for(var p in this) {
	if(this.hasOwnProperty(p)) {
	    return true;
	}
    }
    return false; 
};
*/


function contains(obj, property) {
    for(var p in obj) {
	if(obj.hasOwnProperty(p) && p == property) {
	    return true;
	}
    }
    return false; 
}

function GameMenu(options, rules, onOptionsChanged, onNewGame, dataContainerId, buttonContainerId, formContainerId,
		  overlayCSS, containerCSS, dataCSS, buttonCSS, completelyOverRideCSS, callbacks) {
    
    var MODAL_OPACITY = 80;
    var MODAL_PERSIST = true;

    var dataContainer = '#' + dataContainerId;
    var buttonContainer = '#' + buttonContainerId;
    var formContainer = '#' + formContainerId;
    
    var default_overlayCSS = {
	backgroundColor: '#000066'
	
    };
    var default_containerCSS = {
	backgroundColor: '#000066',
	border: '8px solid #FFCC33', 
	padding: '12px'
    };
    var default_dataCSS = {
//	color: 'white'
    };

    var cancel = false;
    var previousOptions;

    //Fix button id hack
    var optionsButtonHTML = '<button type="button" id="options-button">Playing Options</button>';
    var rulesButtonHTML = '<button type="button" id="rules-button">Rules</button>';
    var newGameButtonHTML = '<button type="button" id="new-game-button">New Game</button>';
    var orderedOptions = [{
			      option: 'names',
			      inTable: true,
			      html: '<tr> <td> <b> Blue Player\'s Name: </b> </td> <td> <b> Red Player\'s Name: </b> </td> </tr>'
				  + '<tr> <td> <input name="blue-player-name" value="Blue-Player" type="text"/> </td>'
				  + '<td> <input name="red-player-name" value="Red-Player" type="text"/> </td> </tr>'
			  },
			  {
			      option: 'firstPlayer',
			      inTable: true,
			      html:'<tr>'
				  + '<td> <input type="radio" checked="checked" name="first-player" value="Blue" />'
				  + 'Blue Plays First </td>'
				  + '<td> <input type="radio" name="first-player" value="Red" />Red Plays First </td>'
				  + '</tr>'

			  },
			  {
			      option: 'humanOrComputerPlayers',
			      inTable: true,
			      html: '<tr>'
				  + '<td> <input type="radio" name="blue-control" value="computer" /> Computer </td>'
				  + '<td> <input type="radio" name="red-control" checked="checked" value="computer" /> Computer </td>'
				  + '</tr>'
				  + '<tr>'
				  + '<td> <input type="radio" name="blue-control" checked="checked"  value="human" /> Human </td>'
				  + '<td> <input type="radio" name="red-control" value="human" /> Human </td>'
				  + '</tr>'
				
			  },
			  {
			      option: 'styleOfPlay',
			      inTable: true,
			      html: '<tr>'
				  + '<td> <b>How should the blue computer player play?</b> </td>'
				  + '<td> <b>How should the red computer player play?</b> </td>'
				  + '</tr>'
			      
				  + '<tr>'
				  + '<td> <input type="radio" name="blue-comp-diff" checked="checked" value="perfect" />'
				  + 'Perfectly Always </td>'
				  + '<td> <input type="radio" name="red-comp-diff" checked="checked" value="perfect" />'
				  + 'Perfectly Always </td>'
				  + '</tr>'
			      
				  + '<tr>'
				  + '<td> <input type="radio" name="blue-comp-diff" value="semi-perfect" /> Perfectly Sometimes </td>'
				  + '<td> <input type="radio" name="red-comp-diff" value="semi-perfect" /> Perfectly Somtimes </td>'
				  + '</tr>'
			      
				  + '<tr>'
				  + '<td> <input type="radio" name="blue-comp-diff" value="random" /> Randomly </td>'
				  + '<td> <input type="radio" name="red-comp-diff" value="random" /> Randomly </td>'
				  + '</tr>'
			      
			  },
			  {
			      option: 'winningCondition',
			      inTable: false,
			      html: '<select>'
				  + '<option value="standard" selected="selected">Standard</option>'
				  + '<option value="misere">Misere</option>'
				  + '</select>'
			  }];
			  
    var generateMenuHTML = function() {
	var currentOption;
	var tableTagClosed = false;
	var rtn = "";
	//Fix id hack!!!
	rtn += '<form id=\"' + formContainerId + '\">'; //Required by jQuery's serializeArray to work
	rtn += '<table>';	
	
	for(var i = 0; i < orderedOptions.length; i++) {
	    currentOption = orderedOptions[i];
	    if(options[currentOption.option]) {
		rtn += currentOption.html; 
	    }
/*	    if(!tableTagClosed && !currentOption.inTable) {
		rtn += '</table>';
	    }*/
	}
	rtn+='<br>';
	rtn+='<tr>';
	rtn+='<td></td>';
	rtn+='<td align="right"><button id="okay" type="button">Okay</button>';
	rtn+='<button id="cancel" type="button">Cancel</button></td>';
	rtn+='</tr>';
	rtn+='</form>';
	return rtn;
    };
    
    var combineDefaultandUserCSS = function(userCSS, defaultCSS) {
	var rtn = userCSS;
	if(userCSS != undefined) {
	    for(var style in defaultCSS) {
		if(!contains(rtn, style)) {
		    rtn[style] = defaultCSS[style];
		}
	    }
	}
	return rtn; 
    };

    var createButtons = function() {
	$(buttonContainer).append(optionsButtonHTML);
	$(buttonContainer).append(rulesButtonHTML);
	$(buttonContainer).append(newGameButtonHTML);
	//Fix magic ID 
	$('#options-button').click(onOptionsClick);
	$('#rules-button').click(onRulesClick);
	$('#new-game-button').click(onNewGameClick);
    };
    
    var onNewGameClick = function() {
	onNewGame();	
    };

    var setOptionsBack = function() {
	var uncheck = true;
	$('input:text').each(function() {
				 this.value = previousOptions[this.name];
			     });
	$('input:radio').each(function() {
				  for(var prop in previousOptions) {
				      if(this.name == prop && this.value == previousOptions[prop]) {
					  this.checked = 'checked';
					  uncheck = false;
				      }
				  }
				  if(uncheck) {
				      this.checked = "";
				      uncheck = false; 
				  }
			      });
};
    
    var onOptionsClick = function() {
	previousOptions=getOptions();
	var options = {
	    persist: MODAL_PERSIST,
	    overlayClose: true, 
	    opacity: MODAL_OPACITY,
	    overlayCss: overlayCSS,
	    containerCss: containerCSS,
	    dataCss: dataCSS,
	    close: true,
	    onClose: function() {
		if(cancel) {
		    if(callbacks.onClose) {
			onClose();
		    }
		    $.modal.close();
		    setOptionsBack();
		} else {
		    if(callbacks.onClose) {
			onClose();
		    }
		    onOptionsChanged(getOptions());
		    $.modal.close();
		}
	    },
	    onShow: callbacks.onShow,
	    onOpen: callbacks.onOpen
	};
	if(callbacks.onShow) {
	    options.onShow = callbacks.onShow;
	}
	if(callbacks.onOpen) {
	    options.onOpwn = callbacks.onOpen;
	}
	$(dataContainer).modal(options);
    };
    
    var onRulesClick = function() {
	//if first time, retrieve from site and store into a variable
	//if second time, modal dialog the variable's contents
    };

    var getOptions = function() {
	var rtn = {};
	var options = $(/*formContainer*/"form").serializeArray();
	var currentObj;
	for(var i = 0; i < options.length; i++) {
	    currentObj = options[i];
	    rtn[currentObj.name] = currentObj.value;
	}
	return rtn; 
    };

    return {
	//this should be called automatically when menu is made 
	createMenu : function(){ 
	    $(dataContainer).css('display', 'none');
	    $(dataContainer).append(generateMenuHTML());
	    createButtons();
	    if(!completelyOverRideCSS) {
 		overlayCSS = combineDefaultandUserCSS(overlayCSS, default_overlayCSS);
		dataCSS = combineDefaultandUserCSS(dataCSS, default_dataCSS);
		containerCSS = combineDefaultandUserCSS(containerCSS, default_containerCSS);
	    }
//	    $('#okay,#cancel').attr({align:'right'});
	    $('#okay,#cancel').attr({'class': 'simplemodal-close'} );
	    $('#cancel').click(function() {
				   cancel = true;
				   $.modal.close();
				   cancel = false; 
			       });
	},

	getCurrentPlayingOptions: function() {
	    return getOptions();
	}
    };
};