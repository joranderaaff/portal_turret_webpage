import { useEffect, useRef, useState } from 'preact/hooks';
import { socket } from '../socket';
import { Fragment } from 'preact/jsx-runtime';

export function Accelerameter() {

    const canvasRef = useRef();
    const currentDataIndex = useRef(0);

    const [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        }
    }, []);

    const twosComplement = (x) => {
        if (x & 0x8000) {
            x--;
            x = (~x) & 0xFFFF;
            x = -x;
        }
        return x;
    }

    const draw = (x, y1, y2, c) => {
        const canvas = canvasRef.current || undefined;
        if (canvas !== undefined) {
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.strokeStyle = c;
            ctx.moveTo(x * 2, y1);
            ctx.lineTo(x * 2 + 2, y2);
            ctx.stroke();
        }
    }

    const lerp = (from, to, t) => {
        let diff = to - from;
        return from + diff * t;
    }

    const handleMessage = (event) => {
        const canvas = canvasRef.current || undefined;
        if (canvas !== undefined) {

            const view = new Uint8Array(event.data);

            var x = (view[0] << 8) | view[1];
            var y = (view[2] << 8) | view[3];
            var z = (view[4] << 8) | view[5];

            x = twosComplement(x);
            y = twosComplement(y);
            z = twosComplement(z);

            setOrientation((prev) => {
                const h = canvas.height / 2;
                draw(currentDataIndex.current, h - h * prev.x / 255, h - h * x / 255, '#a88438');
                draw(currentDataIndex.current, h - h * prev.y / 255, h - h * y / 255, '#a88438');
                draw(currentDataIndex.current, h - h * prev.z / 255, h - h * z / 255, '#a88438');

                currentDataIndex.current++;
                if (currentDataIndex.current > canvas.width / 2) {
                    currentDataIndex.current = 0;
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                return { x, y, z };
            });
        }
    }

    let coordinateContent = Object.keys(orientation).map(coordinate => {
        let val = orientation[coordinate];
        val *= 0.004 * 9.80665;
        let stringVal = val > 0 ? '\u00A0' + val.toFixed(4) : val.toFixed(4) ;
        return <div>{coordinate}: {stringVal}</div>
    });

    return (
        <Fragment>
            <div>
                <canvas id="accel-canvas" ref={canvasRef} width="400" height="150"></canvas>
                {coordinateContent}
            </div>
        </Fragment>
    );
}