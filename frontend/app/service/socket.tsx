import io from "socket.io-client";

if (process.env.SOCKET_URL === undefined) {
  throw new Error("SOCKET_URL is not defined");
}
export const socket = io(process.env.SOCKET_URL, {
  autoConnect: false
});
