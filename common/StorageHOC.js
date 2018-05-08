import React from 'react';
import Utils from './utils'
import strings from './strings';

const STORAGE_KEY = "storage";

export default (WrappedComponent) => {
    class HOC extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                isLoading: false
            };
        }

        componentDidMount() {
            AsyncStorage.getItem(STORAGE_KEY, (err, value) => {
                this.setState({
                    value: value || "",
                    isLoading: false
                })
            });
        }

        onChange = (e) => {
            this.setState({value: Utils.safeParseEventValue(e)})
        };

        reset = () => {
            this.setState({value: ""});
            API.recordEvent("Reset storage");
            AsyncStorage.removeItem(STORAGE_KEY)
        };

        save = () => {
            const {value} = this.state;
            this.setState({isSaving: true, success: false}, () => {
                API.recordEvent("Save storage");
                AsyncStorage.setItem(STORAGE_KEY, value, () => {
                    this.setState({isSaving: false, success: true});
                });
            });
        };

        render() {
            const {isLoading, value, isSaving, success} = this.state,
                {save, reset, onChange} = this,
                {instructions} = strings;
            return (
                <WrappedComponent
                    ref="wrappedComponent"
                    instructions={instructions}
                    isLoading={isLoading}
                    isSaving={isSaving}
                    value={value}
                    save={save}
                    reset={reset}
                    onChange={onChange}
                    success={success}
                    {...this.props}
                />
            );
        }
    }

    return HOC;
};

