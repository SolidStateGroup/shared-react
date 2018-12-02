import React from 'react';
import { Route, Link, Router, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import createBrowserHistory from 'history/createBrowserHistory';
import ExamplePage from '../pages/example/ExamplePage';
import NotFoundPage from '../pages/NotFoundPage';

// Examples


window.Link = Link;

const history = createBrowserHistory();

const TheComponent = () => (
    <Router history={history}>
        <div>
            <Switch>
                <Route exact path="/" component={ExamplePage}/>
                <Route exact path="*" component={NotFoundPage}/>
            </Switch>
        </div>
    </Router>
);

TheComponent.displayName = 'Router';
TheComponent.propTypes = {};

export default hot(module)(TheComponent);
