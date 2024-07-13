import { useEffect, useState } from 'preact/hooks';
import { socket } from '../socket';
import { origin, endpoint } from "../endpoint";

import { Accelerameter } from '../components/Accelerameter';
import { TypeWriter } from '../components/Typewriter';

import { apertureLogo } from '../apertureLogo';
import { ManualControls } from '../components/ManualControls';

export function Home() {

	const [lines, setLines] = useState([
		{ text: "Aperture Science Sentry", speed: 1 },
		{ text: "Unit [FUAX-3722-1628]", speed: 1 },
		{ text: "Retreiving Status", speed: 1 },
		{ text: "........", speed: 0.1 },
	]);

	const [turretState, setTurretState] = useState(-1);

	const [turretInAutomaticMode, setTurretInAutomaticMode] = useState(true);


	const toggleControl = async function () {
		let nextTurretInAutomaticMode = !turretInAutomaticMode;

		const body = new FormData();
		body.set("mode", nextTurretInAutomaticMode ? "0" : "1");

		await fetch(`${origin}/set_mode`, { method: "POST", body });

		setTurretInAutomaticMode(() => {
			if (nextTurretInAutomaticMode) {
				addMessage("[Manual Mode] Deactivated.");
			} else {
				addMessage("[Manual Mode] Activated.");
			}
			return nextTurretInAutomaticMode;
		});
	}

	const addMessage = (text, speed) => {
		setLines(oldLines => [...oldLines, { text, speed }]);
	}

	const handleMessage = (event) => {
		var stateNames = [
			"Idle",
			"Activated",
			"Searching",
			"Engaging",
			"Target Lost",
			"Picked Up",
			"Shutdown",
			"Rebooting"
		]
		const messageData = new Uint8Array(event.data);
		let newState = parseInt(messageData[10]);

		if (newState !== turretState) {
			setTurretState((oldState) => {
				switch (newState) {
					case 6:
						addMessage("[[[ CRITICAL ERROR ]]]", 3);
						break;
					case 8:
						addMessage("Rebooting", 3);
						addMessage("............", 0.05);
						break;
					default:
						addMessage(stateNames[newState]);
						break;
				}
				return newState;
			});
		}
	}

	const onOpen = () => {
		addMessage("Status: [Online]", 1);
	}

	const onError = () => {
		addMessage("Status: [Offline]. Can't connect.", 1);
	}

	const onClose = () => {
		addMessage("Status: [Offline]. Connection closed.", 1);
	}

	useEffect(() => {
		socket.addEventListener('open', onOpen);
		socket.addEventListener('close', onClose);
		socket.addEventListener('error', onError);
		socket.addEventListener('message', handleMessage);

		return () => {
			socket.removeEventListener('open', onOpen);
			socket.removeEventListener('close', onClose);
			socket.removeEventListener('error', onError);
			socket.removeEventListener('message', handleMessage);
		}
	})

	var override = turretInAutomaticMode ? null : <ManualControls onMessage={(message) => {
		addMessage(message);
	}} />;

	const apertureLogoBase64 = apertureLogo();

	return (
		<div id="main-content" class="home">
			<div id="header">
				<img id="logo" src={apertureLogoBase64}></img>
				<Accelerameter></Accelerameter>
			</div>
			<TypeWriter lines={lines}></TypeWriter>
			{override}
			<input id="override-button" type="button" value="Override" onClick={toggleControl} />
		</div>
	);
}