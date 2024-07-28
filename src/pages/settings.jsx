import { useEffect, useState } from "preact/hooks";
import { origin } from "../endpoint";
import { Fragment } from "preact/jsx-runtime";
import { getJSON } from '../getJson';

import './settings.css'
import { Header } from "../components/Header";

export function Settings() {

    const [settingsLoaded, setSettingsLoaded] = useState(false);

    const [settings, setSettings] = useState({
        "audioVolume": 10,
        "openDuration": 1000,
        "maxRotation": 50,
        "centerAngle": 90,
        "idleAngle": 90,
        "wingPin": 12,
        "rotatePin": 13,
        "panicTreshold": 3.00,
        "restTreshold": 1.00,
        "tippedOverZTreshold": 5.00
    });

    useEffect(() => {
        getJSON(origin + "/get_settings", (data) => {
            if (data) {
                setSettingsLoaded(true);
                setSettings(data);
            }
        });
    }, []);

    const handleInputChanged = (event) => {
        setSettings((oldSettings) => {
            let { name, value } = event.currentTarget;
            const dataType = event.currentTarget.getAttribute("data-type");
            if (dataType === "int") value = parseInt(value);
            if (dataType === "float") value = parseFloat(value);

            if (isNaN(value)) {
                return oldSettings;
            }

            var updatedSettings = { ...oldSettings };
            updatedSettings[name] = value;
            return updatedSettings;
        })
    }

    const properties = [
        { label: "Audio Volume (0-30)", name: "audioVolume", type: "int" },
        { label: "Open Duration (ms)", name: "openDuration", type: "int" },
        { label: "Max Rotation (deg)", name: "maxRotation", type: "int" },
        { label: "Center Angle", name: "centerAngle", type: "int" },
        { label: "Idle Angle", name: "idleAngle", type: "int" },
        { label: "Panic Gravity Treshold", name: "panicTreshold", type: "float" },
        { label: "Rest Gravity Treshold", name: "restTreshold", type: "float" },
        { label: "Tipped Over Gravity Treshold", name: "tippedOverTreshold", type: "float" },
        { label: "Rotate GPIO Pin", name: "rotatePin", type: "int" },
        { label: "Wing GPIO Pin", name: "wingPin", type: "int" },
    ]

    let settingsContent;
    if (settingsLoaded) {
        settingsContent = <form method="POST" action={origin + "/settings"} >
            {properties.map((property) =>
                <Fragment>
                    <label>{property.label}</label>
                    <input name={property.name} data-type={property.type} type="text" value={settings[property.name]} onFocusOut={handleInputChanged} />
                </Fragment>
            )}
            <input type="submit" value="Save and Reboot" />
        </form>
    } else {
        settingsContent = "Loading Settings...";
    }

    return (
        <Fragment>
            <Header />
            <div id="settings">
                <h1>Settings</h1>
                {settingsContent}
            </div>
        </Fragment>
    )
}