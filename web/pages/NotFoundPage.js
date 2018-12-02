import React from 'react';

const NotFoundView = () => (
    <div className="container app-container text-center">
        <h1>404, you seem a bit lost.</h1>
        <hr/>
        <Link to="/">Back To Home View</Link>
    </div>
);

NotFoundView.displayName = 'NotFoundView';
export default NotFoundView;