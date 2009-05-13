	function right_arrow_handler() {
    if(!$("#game-list").is(':animated')) {
        $("#game-list").animate({'left': '-=164px'}, 300);
        window.check_arrows(parseInt($("#game-list").css('left')) - 165);
    }
    return false;
}

function left_arrow_handler() {
    if(!$("#game-list").is(':animated')) {
        $("#game-list").animate({'left': '+=164px'}, 300);
        window.check_arrows(parseInt($("#game-list").css('left')) + 165);
    }
    return false;
}

function check_arrows(new_left) {
    if (parseInt($("#game-list").css('width')) + new_left
            > parseInt($("#game-list-container").css('width'))) {
        $("#right").click(window.right_arrow_handler);
        $("#right").css({'visibility': 'visible'});
    } else {
        $("#right").unbind('click');
        $("#right").css({'visibility': 'hidden'});
    }
    
    if (new_left < 0) {
        $("#left").click(window.left_arrow_handler);
        $("#left").css({'visibility': 'visible'});
    } else {
        $("#left").unbind('click');
        $("#left").css({'visibility': 'hidden'});
    }
}

	$(document).ready(function() {
	    // Add arrows and container box
	    $(".arrow img").css({'display': 'inline'});
	    $(".arrow").css({'display': 'block'});
	    $("#browser-container").css({'display': 'block', 'z-index': '-1', 'margin': '0'});
	    $("#game-list").css({'position': 'absolute',
	                         'top': '0px', 
	                         'left': -164 * Math.floor(($("#game-list").children().length - 4) / 2) + 'px',
	                         'width': ($("#game-list").children().length * 164) + 'px' /* 165 * num  */});
	    $("#game-list-container").css({'height': '192px', /* 152 + 40 */
	                                'overflow': 'hidden'});
	    $("#game-browser").css({'width': '916px',
                        	'height': '232px'});
    $("#game-browser .arrow").focus(function() { return false; });
    $("#game-browser .arrow").mousedown(function() { return false; });
    check_arrows(parseInt($("#game-list").css('left')));
	});