let userId = document.getElementById('globalUserId').value;

let webSocket = new WebSocket(`ws://localhost:5000/?id=${userId}`);

function sendWSMessage(to, content) {
    webSocket.send(JSON.stringify({
        to: to,
        content: content
    }));
}

webSocket.onopen = e => {
    webSocket.onmessage = function(e) {
        M.toast({html: `<a href="/users/messages"><b>New message</b><br/>${e.data}</a>`});
    }
};