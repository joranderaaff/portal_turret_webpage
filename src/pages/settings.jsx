import { useEffect, useState } from "preact/hooks";
import { origin } from "../endpoint";
import { Fragment } from "preact/jsx-runtime";
import { getJSON } from '../getJson';

import './settings.css'
import { Header } from "../components/Header";

export function Settings() {

    const [settingsLoaded, setSettingsLoaded] = useState(true);

    const [settings, setSettings] = useState({
        "startInManualMode": 0,
        "audioVolume": 10,
        "openDuration": 1000,
        "maxRotation": 50,
        "centerAngle": 90,
        "idleAngle": 90,
        "wingRotateDirection": 1,
        "wingPin": 12,
        "rotatePin": 13,
        "panicTreshold": 3.00,
        "restTreshold": 1.00,
        "tippedOverTreshold": 5.00
    });

    useEffect(() => {
        getJSON(origin + "/get_settings", (data) => {
            if (data) {
                setSettingsLoaded(true);
                setSettings(data);
            }
        });
    }, []);

    const handleInputChanged = (value, event) => {
        setSettings((oldSettings) => {
            let { name } = event.currentTarget;
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

    const limit30 = (val) => {
        val = parseInt(val);
        if (val < 0) val = 0;
        if (val > 30) val = 30;
        return val;
    }

    const limit01 = (val) => {
        val = parseInt(val);
        if (val != 1) val = 0;
        return val;
    }

    const limitRotation = (val) => {
        val = parseInt(val);
        if (val != -1) val = 1;
        return val;
    }

    const properties = [
        { label: "Audio Volume (0-30)", name: "audioVolume", type: "int", validation: limit30 },
        { label: "Start In Manual Mode (0 or 1)", name: "startInManualMode", type: "int", validation: limit01 },
        { label: "Open Duration (ms)", name: "openDuration", type: "int" },
        { label: "Max Rotation (deg)", name: "maxRotation", type: "int" },
        { label: "Center Angle", name: "centerAngle", type: "int" },
        { label: "Idle Angle", name: "idleAngle", type: "int" },
        { label: "Rotate Direction Of Wing Servo (1 or -1)", name: "wingRotateDirection", type: "int", validation: limitRotation },
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
                    <input name={property.name} data-type={property.type} type="text" value={settings[property.name]} onFocusOut={(e) => {
                        let value = e.currentTarget.value;
                        if (property.validation != undefined) {
                            value = property.validation(value);
                        }
                        handleInputChanged(value, e);
                    }
                    } />
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