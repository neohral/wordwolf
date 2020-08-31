import io from "socket.io-client";
let host = window.document.location.host.replace(/:.*/, "");
let socket = io.connect(`http://${host}:3000`, { reconnection: false });
export default socket;
