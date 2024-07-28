import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Home } from './pages/home.jsx';
import { Diagnose } from './pages/diagnose.jsx';
import { Setup } from './pages/setup.jsx';
import { Settings } from './pages/settings.jsx';

import './style.css';
import { CaptivePortal } from './pages/captiveportal.jsx';

export function App() {
	return (
		<LocationProvider>
			<Router>
				<Route path="/" component={Home} />
				<Route path="/setup" component={Setup} />
				<Route path="/diagnose" component={Diagnose} />
				<Route path="/settings" component={Settings} />
				<Route default component={CaptivePortal} />
			</Router>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
