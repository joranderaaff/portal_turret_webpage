
import { origin } from '../endpoint';
import { apertureLogo } from '../apertureLogo';
import './diagnose.css';

export function Diagnose() {

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
	]

	return (
		<div class="diagnose">
			<div id="header">
				<img id="logo" src={apertureLogo()}></img>
			</div>
			<h1>Diagnose</h1>
			{diagnoseButtons.map((buttonInfo) => {
				return <input type="button" value={buttonInfo.label} onClick={() => { postDiagnose(buttonInfo.index) }} />
			})}
		</div>
	);
}