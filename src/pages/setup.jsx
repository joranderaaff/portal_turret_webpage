import { useEffect, useState } from 'preact/hooks';
import { origin } from "../endpoint";
import { Fragment } from 'preact/jsx-runtime';
import './setup.css';
import { getJSON } from '../getJson';
import { Header } from '../components/Header';

export function Setup() {

    const [networks, setNetworks] = useState([]);
    const [password, setPassword] = useState("");
    const [network, setNetwork] = useState();

    const handleFormSubmit = (event) => {
        event.preventDefault();
        return false;
    }

    const handleWifiChanged = (event) => {
        setNetwork(event.currentTarget.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.currentTarget.value);
    }

    useEffect(() => {
        getJSON(origin + "/scan", (data) => {
            setNetworks(data);
        });
    }, []);

    var networksContent;
    if (networks.length === 0) {
        networksContent = <div>Scanning for networks...</div>
    } else {
        networksContent = networks.map((n) =>
            <div>
                <input type="radio" key={n.ssid} id={n.ssid} name="ssid" value={n.ssid} checked={network === n.ssid} onInput={handleWifiChanged}></input>
                <label class="radio-label" for={n.ssid}>{n.ssid}</label>
            </div>
        )
    }

    var formContent = networks.length === 0 ? null : <Fragment>
        <div>
            <label className="text-label">Password:</label>
            <input id="password" name="pw" type="password" value={password} onInput={handlePasswordChange} />
        </div>
        <input type="submit" value="Save" />
    </Fragment>

    return (
        <Fragment>
            <Header />
            <div id="setup">
                <h1>Setup your network</h1>
                <form method="POST" action={origin + "/setup"} >
                    {networksContent}
                    {formContent}
                </form>
            </div>
        </Fragment>
    );
}