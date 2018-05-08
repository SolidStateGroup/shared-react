/**
 *
 */
import StorageHoc from '../../../common-mobile/StorageHOC';

import React, {Component, PropTypes} from 'react';

const ExampleScreen = class extends Component {
    displayName: 'ExampleScreen';

    componentWillReceiveProps = (newProps) => {
        if(this.props.isSaving && !newProps.isSaving && newProps.success){
            alert("Saved")
        }
    };

    render() {
        const {instructions, isLoading, value, save, reset, onChange} = this.props;
        return (
            <Container>
                <ScrollView>
                    <FormGroup>
                        <H2>
                            {instructions}
                        </H2>
                    </FormGroup>
                    <Row>

                        <Flex>
                            <Column>
                                <TextInput onChangeText={onChange}
                                           disabled={isLoading}
                                           placeholder="Enter value to store"
                                           value={value}
                                />
                            </Column>
                        </Flex>
                        <Column>
                            <Button
                                testID={"Reset"}
                                disabled={isLoading}
                                onPress={reset}
                                title={"Reset"}
                            />
                        </Column>
                        <Column>
                            <Button
                                testID={"Save"}
                                disabled={isLoading}
                                onPress={save}
                                title={"Save"}
                            />
                        </Column>
                    </Row>
                </ScrollView>
            </Container>
        );
    }
};
ExampleScreen.propTypes = {};
export default StorageHoc(ExampleScreen);