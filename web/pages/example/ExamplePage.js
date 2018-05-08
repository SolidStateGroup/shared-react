/**
 *
 */
import StorageHoc from '../../../common/StorageHOC';

const ExampleScreen = ({instructions, isLoading, value, onSave, onReset, onChange,}) => (
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
                    onClick={onReset}
                >
                    Reset
                </button>
                <button
                    className="btn form-control mb-2 mr-sm-2"
                    disabled={isLoading}
                    onClick={onSave}
                >
                    Save
                </button>
        </div>
    </div>
);

export default StorageHoc(ExampleScreen);