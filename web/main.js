import './project/polyfill';
import './project/libs';
import './project/api';
import './styles/styles.scss';

import ReactDOM from 'react-dom';
import Root from './project/routes';

const rootElement = document.getElementById('app');

// Render the React application to the DOM
const renderApp = () => {
    ReactDOM.render(
        <Root/>,
        rootElement,
    );
};

renderApp();
