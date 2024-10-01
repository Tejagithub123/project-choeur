const net = require('net');

const SERVER_PORT = 12345;

const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', (data) => {
        console.log(`Notification reçue : ${data.toString()}`);
        
    });

   
    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

server.on('error', (err) => {
    console.error(`Erreur du serveur : ${err.message}`);
});


server.listen(SERVER_PORT, () => {
    console.log(`Serveur de notification en écoute sur le port ${SERVER_PORT}`);
});
