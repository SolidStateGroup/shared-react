/**
 *
 */
import StorageHoc from '../../../common-mobile/StorageHOC';

const ExampleScreen = ({instructions, isLoading, value, onSave, onReset, onChange,}) => (
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
                        onPress={onReset}
                        title={"Reset"}
                    />
                </Column>
                <Column>
                    <Button
                        testID={"Save"}
                        disabled={isLoading}
                        onPress={onSave}
                        title={"Save"}
                    />
                </Column>
            </Row>
        </ScrollView>
    </Container>
);

export default StorageHoc(ExampleScreen);