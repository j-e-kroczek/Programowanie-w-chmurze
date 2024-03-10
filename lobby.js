document.addEventListener("DOMContentLoaded", function() {
    const serverUrl = 'your-websocket-server-url'; // Replace with your WebSocket server URL
    const socket = new WebSocket(serverUrl);

    socket.onopen = function() {
        console.log("Connection established");
    };

    socket.onmessage = function(event) {
        console.log("Message from server: ", event.data);
        displayMessage(event.data);
    };

    socket.onerror = function(error) {
        console.log(`WebSocket error: ${error.message}`);
    };

    document.getElementById("checkLobby").onclick = function() {
        sendMessage('check-lobby');
    };

    document.getElementById("createGame").onclick = function() {
        sendMessage('create-game');
    };

    document.getElementById("joinGame").onclick = function() {
        const gameId = document.getElementById("gameId").value;
        if (gameId) {
            sendMessage('join-game', { gameId });
        } else {
            alert("Please enter a game ID to join");
        }
    };

    function sendMessage(action, data = {}) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ event: action, data: data }));
        } else {
            console.log("WebSocket is not open. Cannot send message.");
        }
    }

    function displayMessage(message) {
        const msgContainer = document.getElementById("messages");
        const msgElement = document.createElement("div");
        msgElement.textContent = message;
        msgContainer.appendChild(msgElement);
    }
});
