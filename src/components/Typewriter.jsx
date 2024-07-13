import { useEffect, useState } from 'preact/hooks';

export function TypeWriter(props) {
	const [currentLine, setCurrentLine] = useState(0);

	const onDone = () => {
		setCurrentLine(currentLine + 1);
	}

	var lineContent = [];
	for (var i = 0; i <= currentLine; i++) {
		if (i < props.lines.length) {
			var line = props.lines[i];
			lineContent.push(<TypeWriterLine onDone={onDone} animate={i == currentLine} speed={line.speed} text={line.text} className={line.lineClass}>{line.text}</TypeWriterLine>)
		}
	}

	return (
		<div id="log">
			{lineContent}
		</div>
	)
}

function TypeWriterLine(props) {
	const [characterIndex, setCharacterIndex] = useState(0);
	var characterInterval = (25 / props.speed < 1) ? Math.ceil(props.speed / 10) : 1;
	if (props.animate) {
		useEffect(() => {
			const intervalId = setInterval(() => {
				if (characterIndex == props.text.length) {
					clearInterval(intervalId);
					props.onDone();
				}
				setCharacterIndex(Math.min(props.text.length, characterIndex + characterInterval));
			}, Math.ceil(25 / props.speed));
			return () => {
				clearInterval(intervalId);
			}
		})
	} else {
		setCharacterIndex(props.text.length);
	}

	return (
		<pre className={props.className}>{props.text.substring(0, characterIndex)}</pre>
	)
}