import { useEffect, useState, useRef } from 'preact/hooks';
import { origin, endpoint } from "../endpoint";
import { socket } from '../socket';

export function ManualControls(props) {

    const lastUpdateTime = useRef(0);
    const timeoutID = useRef(0);
    const movementData = new Uint8Array(2);
    const [wingsOpen, setWingsOpen] = useState(false);
    const [angle, setAngle] = useState(90);

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

    useEffect(() => {
        let now = Date.now()
        if (now > lastUpdateTime.current + 30) {
            sendAngleData();
            lastUpdateTime.current = now;
        }
        
        timeoutID.current = setTimeout(() => { sendAngleData() }, 30);

        return () => {
            clearTimeout(timeoutID.current);
        }
    }, [angle]);

    const sendAngleData = () => {
        movementData[0] = 2;
        movementData[1] = angle;
        socket.send(movementData);
        console.log(angle);
    }

    const sendFire = () => {
        movementData[0] = 1;
        socket.send(movementData);
    };

    const setTurretAngle = (e) => {
        var a = parseInt(e.currentTarget.value);
        setAngle(a);
    }

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
                <input type="range" min="0" max="180" value={angle} class="slider" onInput={setTurretAngle} onChange={setTurretAngle} id="myRange" />
            </div>
        </div>
    )
}