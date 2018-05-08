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
                    value,
                    isLoading: false
                })
            })

        }

        onChange = (e) => {
            this.setState({value: Utils.safeParseEventValue(e)})
        };

        onReset = () => {
            this.setState({value: ""});
            API.recordEvent("Reset storage");
            AsyncStorage.removeItem(STORAGE_KEY)
        };

        onSave = () => {
            const {value} = this.state;
            this.setState({isSaving: true});
            API.recordEvent("Save storage");
            AsyncStorage.setItem(STORAGE_KEY, value, () => {
                this.setState({isSaving: false})
            });
        };

        render() {
            const {isLoading, value, isSaving} = this.state,
                {onSave, onReset, onChange} = this,
                {instructions} = strings;
            return (
                <WrappedComponent
                    instructions={instructions}
                    isLoading={isLoading}
                    isSaving={isSaving}
                    value={value}
                    onSave={onSave}
                    onReset={onReset}
                    onChange={onChange}
                    {...this.props}
                />
            );
        }
    }

    return HOC;
};

