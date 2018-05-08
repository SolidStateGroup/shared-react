import './project/polyfil';
import './project/libs';
import './project/api';
import './styles/styles.scss';

import Root from './project/routes';
import ReactDOM from 'react-dom';

const rootElement = document.getElementById('app');

// Render the React application to the DOM
const renderApp = () => {
	ReactDOM.render(
		<Root/>,
		rootElement
	);
};

renderApp();
