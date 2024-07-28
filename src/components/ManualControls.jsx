import { useEffect, useState } from 'preact/hooks';
import { origin, endpoint } from "../endpoint";
import { socket } from '../socket';

export function ManualControls(props) {

    const movementData = new Uint8Array(2);
    const [wingsOpen, setWingsOpen] = useState(false);

    const handleMessage = (event) => {
        const messageData = new Uint8Array(event.data);
        setWingsOpen(messageData[6] !== 1);
    }

    useEffect(() => {
        socket.addEventListener('message', handleMessage);
        return () => {
            socket.removeEventListener('message', handleMessage);
        }
    })

    const sendFire = () => {
        movementData[0] = 1;
        socket.send(movementData);
    };

    const startMoveLeft = () => {
        movementData[0] = 2;
        movementData[1] = 1;
        socket.send(movementData);
    };

    const stopMoveLeft = () => {
        movementData[0] = 2;
        movementData[1] = 0;
        socket.send(movementData);
    };

    const startMoveRight = () => {
        movementData[0] = 2;
        movementData[1] = 2;
        socket.send(movementData);
    };

    const stopMoveRight = () => {
        movementData[0] = 2;
        movementData[1] = 0;
        console.log(0);
        socket.send(movementData);
    };

    const setOpen = (open) => {
        const body = new FormData();
        body.set("open", open ? "1" : "0");
        fetch(`${origin}/set_open`, { method: "POST", body });
    }

    const toggleWings = () => {
        if (wingsOpen) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    };

    return (
        <div id="manual-controls">
            <div class="manual-button-container">
                <input type="button" value={wingsOpen ? "Close" : "Open"} onClick={() => {
                    toggleWings();
                    props.onMessage("[Manual Command] Open.");
                }} />
                <input type="button" value="Fire" onClick={() => {
                    sendFire();
                    props.onMessage("[Manual Command] Fire!");
                }} />
            </div>
            <div class="manual-button-container">
                <input type="button" value="Left" onMouseDown={startMoveLeft} onMouseUp={stopMoveLeft} />
                <input type="button" value="Right" onMouseDown={startMoveRight} onMouseUp={stopMoveRight} />
            </div>
        </div>
    )
}