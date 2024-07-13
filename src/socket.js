import { endpoint } from "./endpoint";
export const socket = new WebSocket(`ws://${endpoint}:81/`);
socket.binaryType = 'arraybuffer';