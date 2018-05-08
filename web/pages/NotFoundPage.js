import React, {Component, PropTypes} from 'react';

export default class NotFoundView extends Component {
	render() {
		return (
			<div className='container app-container text-center'>
				<h1>404, you seem a bit lost.</h1>
				<hr />
				<Link to='/'>Back To Home View</Link>
			</div>
		);
	}
}
