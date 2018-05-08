import React from 'react';
import {Route, Link, Router, IndexRoute, Redirect, Switch} from 'react-router-dom';
import ExamplePage from '../pages/example/ExamplePage';
import NotFoundPage from '../pages/NotFoundPage';

window.Link = Link;

//Examples

import {hot} from 'react-hot-loader';


import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

const TheComponent = class extends React.Component {

    render() {
        return (
            <Router history={history}>
                <div>
                    <Switch>
                        <Route exact path="/" component={ExamplePage}/>
                        <Route exact path="*" component={NotFoundPage}/>
                    </Switch>
                </div>
            </Router>
        );
    }
};

TheComponent.propTypes = {};

export default hot(module)(TheComponent)

