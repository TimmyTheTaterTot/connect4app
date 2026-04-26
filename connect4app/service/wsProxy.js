const { WebSocketServer, WebSocket } = require('ws');

function wsProxy(httpServer) {
    const wsClients = []
    const wsServer = new WebSocketServer({ server: httpServer });

    wsServer.on('connection', (socket) => {
        socket.isAlive = true;

        socket.on('message', (data) => {
            wsServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });

        socket.on('pong', () => {
            socket.isAlive = true;
        });
    });

    setInterval(() => {
        wsServer.clients.forEach((client) => {
            if (!client.isAlive) {
                client.terminate();
                return;
            }

            client.isAlive = false;
            client.ping();
        });
    }, 10000);
}

function registerClientSocket(socket) {
    const newClient = {

    }
}

module.exports = { wsProxy };