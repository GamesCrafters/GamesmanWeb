let socketId = null;
let guid = null

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

socket.on('connect', function() {
    // sessionId = socket.socket.sessionid;
    // console.log(sessionId);
    socketId = socket.id;
    guid = String(getParameterByName('guid'))
    socket.emit('add player to game', {guid, socketId})
});

function sendMove(oldPos, newPos) {
    let pos = {
        "oldPos": oldPos,
        "newPos": newPos,
        "socketId": socketId,
        "gameGUID": guid
    };
    socket.emit('chess new move', pos);
}

socket.on('chess receive move', function(oldPos, newPos, playerId){
    console.log(oldPos, newPos);
    console.log("move received!");

    var oldParent = document.getElementById(`td-${oldPos}`)
    var newParent = document.getElementById(`td-${newPos}`)
    var piece = document.getElementById(`id-${oldPos}`).cloneNode(true);

    if (oldPos != newPos && playerId != socketId) {
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
});

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

        sendMove(oldPos, newPos)
    }
}
