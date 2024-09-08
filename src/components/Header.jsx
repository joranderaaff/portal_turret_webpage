import { Accelerameter } from "./Accelerameter";

export function Header(props) {

    var accel = props.showAccel ? <Accelerameter></Accelerameter> : null;

    return <div id="header">
        <a id="aperture-logo" href="/"></a>
    </div>
}