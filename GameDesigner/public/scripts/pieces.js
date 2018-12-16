function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0)
        return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping
            ? 1
            : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else
            break;
    }
    return n;
}

function removeClassesFromDiv(formName) {
    formName = '#' + formName + ' *'
    $(formName).filter(':input').each(function () {
        $(this).parent().removeClass("attempted-submit");
        $(this).removeClass("field-error");
    });
}

function validateFields(formName) {
    removeClassesFromDiv(formName);
    var valid = true;
    formName = '#' + formName + ' *';
    // console.log("validating...")

    var inputs = $(formName).filter('input');
    inputs.splice(0, 1);

    inputs.each(function () {
        console.log($(this).val())
        console.log(!$(this).val(), !$(this).is("button"), $(this).prop('name') !== 'csrfmiddlewaretoken', $(this).prop('id').toLowerCase().indexOf('honey') == -1)
        if ((!$(this).val() && !$(this).is("button") && $(this).prop('name') !== 'csrfmiddlewaretoken' && $(this).prop('id').toLowerCase().indexOf('honey') == -1)) {
            $(this).parent().addClass("attempted-submit");
            $(this).addClass("field-error");
            valid = false;
        } else if ($(this).val() && $(this).prop('id').toLowerCase().indexOf('honey') !== -1) {
            valid = false;
        }
    });
    // console.log("Valid:", valid);
    return valid;
}

function abortButtonLoading(tid, button, text) {
    clearTimeout(tid);
    $(button).text(text);
}

function loadingButton(button, text, processing) {
    var count = occurrences($(button).text(), ".")
    dots = "."
    if (count != 3) {
        dots = dots.repeat(count);
        dots += "."
    }

    msg = processing + dots;

    $(button).text(msg);
}

function generateFormDict(formName) {
    formName = '#' + formName + ' *';
    d = {};

    $(formName).filter(':input').each(function () {
        if (!$(this).is("button") && ($(this).prop('id')) && $(this).prop('id').toLowerCase().indexOf('honey') == -1) {
            var key = $(this).prop('id');
            var val = escapeHtml($(this).val());
            d[key] = val;
        } else if ($(this).prop('name') == 'csrfmiddlewaretoken') {
            d['csrfmiddlewaretoken'] = escapeHtml($(this).val());
        }
    });

    return d;
}

function failRedirect(formName) {
    formName = '#' + formName
    $(formName).fadeOut(300, function () {
        var $parent = $(formName).parent();
        $(formName).remove();
        $('span#thanks').html("<h3 class='uppercase color-red mb10 mb-xs-24'>Error!</h3><h4 class='uppercase'>There was an error with your submission. Reloading page...</h4>");
    });

    $(this).delay(2000).queue(function () {
        window.location.href = '/#contact';
        $(this).dequeue();
    });
}

function sendAjaxRequest(formName) {
    var dictToSend = {}
    $('#displayBoard tr').each(function(){
        $(this).find('td').each(function(){
            console.log("iteration")
            var td = $(this)
            var item = td[0]
            var piece = item.firstChild
            var foundPiece = piece;
            while (foundPiece.nodeName !== "DIV") {
                item.removeChild(item.firstChild)
                foundPiece = item.firstChild
            }

            foundPiece.removeChild(foundPiece.firstChild)
            var foundInnerItem = foundPiece.firstChild;

            if (foundInnerItem.nodeName == "P") {
                //DO NOTHING
            } else {
                console.log(foundPiece)
                dictToSend[foundPiece.getAttribute("pos")] = foundPiece.getAttribute("piece")
            }

            // while (foundInnerItem.nodeName !== "P" || foundInnerItem.nodeName !== "IMG") {
            //     foundPiece.removeChild(foundPiece.firstChild)
            //     foundInnerItem = foundPiece.firstChild
            // }

            // console.log(foundInnerItem)

            //do your stuff, you can use $(this) to get current cell
        })
    })

    var guid = document.getElementById('displayBoard').getAttribute('game');


    // u = formName;
    // d = generateFormDict(formName);
    // formName = '#' + formName;
    // var $submitform = $(formName);
    // var airtable_write_endpoint = "";
    // var final_dict = {};
    // final_dict["fields"] = d;

    var name = getParameterByName("name")
    var game = getParameterByName("game")
    var rows = getParameterByName("rows")
    var columns = getParameterByName("columns")

    dictToSend["name"] = name
    dictToSend["game"] = game
    dictToSend["rows"] = rows
    dictToSend["columns"] = columns
    dictToSend["guid"] = guid

    var params = $.param(dictToSend);
    var next = '/game?' + params
    window.location.href = next;
    $(this).dequeue();
}


let socketId = null;
let guid = "${guid}"

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function dropPiece(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var piece = document.getElementById(data).cloneNode(true);
    var oldParent = document.getElementById(data).parentNode;
    var newParent = ev.target;

    while (newParent.nodeName !== "TD") {
        newParent = newParent.parentNode
    }

    let oldPos = piece.getAttribute('pos');
    let newPos = newParent.getAttribute('pos')

    // console.log(oldPos);
    // console.log(newPos);
    // console.log(newParent)

    if (oldPos) {
        // console.log("here")
        drop(ev)
    } else {
        // console.log("only once")
        while (newParent.firstChild) {
            newParent.removeChild(newParent.firstChild);
        }

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        piece.setAttribute("id", `${piece.id.replace('drag','id')}${s4()}`)
        piece.setAttribute("pos", newPos)
        newParent.appendChild(piece);
        $(`#${newParent.id}`).find('img').addClass('board-icon')
    }
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var oldParent = document.getElementById(data).parentNode;
    var piece = document.getElementById(data).cloneNode(true);
    var newParent = ev.target;

    while (newParent.nodeName !== "TD") {
        newParent = newParent.parentNode
    }

    let oldPos = piece.getAttribute('pos');
    let newPos = newParent.getAttribute('pos')

    if (oldPos != newPos) {
        while (newParent.firstChild) {
            newParent.removeChild(newParent.firstChild);
        }

        piece.setAttribute('oldPos', piece.getAttribute('pos'));
        piece.setAttribute('oldId', piece.getAttribute('id'));
        piece.setAttribute('pos', newParent.getAttribute('pos'));
        piece.setAttribute('id', "id-" + newParent.getAttribute('pos'));

        newParent.appendChild(piece);

        while (oldParent.firstChild) {
            oldParent.removeChild(oldParent.firstChild);
        }

        if (!oldParent.firstChild) {
            let oldId = piece.getAttribute('oldId');
            let oldPos = piece.getAttribute('oldPos');
            let innerHTMLBeg = "<div ";
            let innerHTMLparams = "id=" + "'" + oldId + "'" + " " + "pos='" + oldPos + "'" + " draggable='true' ondragstart='drag(event)'";
            let innerHTMLend = ">";
            let innerHTMLbody = `<p id="empty-text">Empty</p>`;
            let innerHTMLclose = "</div>";
            oldParent.innerHTML = innerHTMLBeg + innerHTMLparams + innerHTMLend + innerHTMLbody + innerHTMLclose;
        }
    }
}

$(function () {
    $('form#submit-form').on('submit', function (e) {
        var $submitform = $('#submit-form');
        // console.log("testing submit");

        // Disable the submit button to prevent repeated clicks
        $submitform.find(':submit').prop('disabled', true);
        // set interval

        var processing = "Processing"
        var text = processing + "."
        $submitform.find(':submit').text(text);
        var $button = $submitform.find(':submit');
        var tid = setInterval(loadingButton, 300, $button, text, processing);
        sendAjaxRequest('submit-form')

        // Prevent the form from submitting with the default action
        return false;
    })
});
