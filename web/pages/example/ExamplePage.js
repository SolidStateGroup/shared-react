/**
 *
 */
import React, { Component } from 'react';
// eslint-disable-line
import propTypes from 'prop-types';

import StorageHoc from '../../../common/StorageHOC';

const ExamplePage = class extends Component {
    static displayName = 'ExamplePage';

    componentWillReceiveProps = (newProps) => {
        if (this.props.isSaving && !newProps.isSaving && newProps.success) {
            alert('Saved');
        }
    };

    render() {
        const { instructions, isLoading, value, save, reset, onChange } = this.props;
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
                      value={value || ''}
                    />
                    <button
                      type="button"
                      className="btn btn-danger form-control mb-2 mr-sm-2"
                      disabled={isLoading}
                      onClick={reset}
                    >
                        Reset
                    </button>
                    <button
                      type="button"
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

ExamplePage.propTypes = {
    instructions: propTypes.string.isRequired,
    isSaving: propTypes.bool.isRequired,
    isLoading: propTypes.bool.isRequired,
    onChange: propTypes.func.isRequired,
    reset: propTypes.func.isRequired,
    save: propTypes.func.isRequired,
    value: propTypes.string,
};

ExamplePage.propTypes = {};

export default StorageHoc(ExamplePage);