import { Accelerameter } from "./Accelerameter";

export function Header(props) {

    var accel = props.showAccel ? <Accelerameter></Accelerameter> : null;

    return <div id="header">
        <div id="aperture-logo"></div>
    </div>
}