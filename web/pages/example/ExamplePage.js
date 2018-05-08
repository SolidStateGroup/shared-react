/**
 *
 */
import StorageHoc from '../../../common/StorageHOC';

import React, {Component, PropTypes} from 'react';

const ExamplePage = class extends Component {
    displayName: 'ExamplePage';

    componentWillReceiveProps = (newProps) => {
        if(this.props.isSaving && !newProps.isSaving && newProps.success){
            alert("Saved")
        }
    };

    render() {
        const {instructions, isLoading, value, save, reset, onChange} = this.props;
        return (
            <div className="container">
                <h2>
                    {instructions}
                </h2>
                <div className="form-inline">
                    <input
                        className="form-control mb-2 mr-sm-2"
                        type="text"
                        onChange={onChange}
                        disabled={isLoading}
                        placeholder="Enter value to store"
                        value={value||""}
                    />
                    <button
                        className="btn btn-danger form-control mb-2 mr-sm-2"
                        disabled={isLoading}
                        onClick={reset}
                    >
                        Reset
                    </button>
                    <button
                        className="btn form-control mb-2 mr-sm-2"
                        disabled={isLoading}
                        onClick={save}
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }
};

ExamplePage.propTypes = {};

export default StorageHoc(ExamplePage);