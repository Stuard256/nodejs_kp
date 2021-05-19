let WebSocket = require('ws')
let wsServer = new WebSocket.Server({ port: 5000, path: '/' });
let url = require('url');

wsServer.on('connection', (ws, req) => {
    let parsedUrl = url.parse(req.url, true);

    if (parsedUrl.query.id) {
        ws.userId = parseInt(parsedUrl.query.id);
    } else {
        ws.close();
    }

    ws.on('message', (message) => {
        let messageObject = JSON.parse(message);
        wsServer.clients.forEach(client => {
            if (client.userId === messageObject.to) {
                client.send(messageObject.content);
            }
        });
    });
});

module.exports = wsServer;