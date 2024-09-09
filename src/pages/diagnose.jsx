
import { origin } from '../endpoint';
import './diagnose.css';
import { Header } from '../components/Header';
import { socket } from '../socket';
import { Fragment } from 'preact/jsx-runtime';
import { useEffect, useState } from 'preact/hooks';

export function Diagnose() {

	const [wingsOpen, setWingsOpen] = useState(false);
	const [motionDetected, setMotionDetected] = useState(false);

	const postDiagnose = (index) => {
		const body = new FormData();
		body.set("action", index);
		fetch(`${origin}/diagnose`, { method: "POST", body });
	}

	const diagnoseButtons = [
		{ label: "Wings Out", index: 0 },
		{ label: "Wings In", index: 1 },
		{ label: "Rotate Left", index: 2 },
		{ label: "Rotate Right", index: 3 },
		{ label: "Gun", index: 4 },
		{ label: "LED Ring", index: 5 },
		{ label: "Audio", index: 6 },
		{ label: "Center LED", index: 7 },
	]

	const handleMessage = (event) => {
		const messageData = new Uint8Array(event.data);
		setWingsOpen(parseInt(messageData[6]) == 0);
		setMotionDetected(parseInt(messageData[7]) == 1);
	}

	useEffect(() => {
		socket.addEventListener('message', handleMessage);

		return () => {
			socket.removeEventListener('message', handleMessage);
		}
	})

	return (
		<Fragment>
			<Header />
			<div id="diagnose">
				<h1>Diagnose</h1>
				<p>Wings Open: {wingsOpen ? "TRUE" : "FALSE"}</p>
				<p>Motion Detected: {motionDetected ? "TRUE" : "FALSE"}</p>
				{diagnoseButtons.map((buttonInfo) => {
					return <input type="button" value={buttonInfo.label} onClick={() => { postDiagnose(buttonInfo.index) }} />
				})}
			</div>
		</Fragment>
	);
}