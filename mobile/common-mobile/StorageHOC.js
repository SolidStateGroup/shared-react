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
                    instructions={instructions} //Instructions to the user
                    isLoading={isLoading} //Whether the storage is loading
                    isSaving={isSaving} //Whether the storage is saving
                    value={value} //The current value entered for the storage
                    save={save} //A function to save the current value
                    reset={reset} //A function to reset the stored value
                    onChange={onChange} //A function to call when the text value changes
                    success={success} //Determines whether saving was successful
                    {...this.props} //Pass all other props
                />
            );
        }
    }

    return HOC;
};

