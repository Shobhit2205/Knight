import io from "socket.io-client";

var socket;
var connected;

function connectSocket(user){
    socket = io(process.env.REACT_APP_API);
    socket.emit("setup", user);
    socket.on("connected", () => {connected = true});
}

export {socket, connected, connectSocket}