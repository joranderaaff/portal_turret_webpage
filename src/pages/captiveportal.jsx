import { Fragment } from 'preact/jsx-runtime';
import { Header } from '../components/Header';
import './captiveportal.css';

export function CaptivePortal() {
    return <Fragment>
        <Header />
        <div id="captive-portal">
            <a href="/">Home</a>
            <a href="/settings">Settings</a>
            <a href="/setup">Setup</a>
            <a href="/diagnose">Diagnose</a>
        </div>
    </Fragment>
}