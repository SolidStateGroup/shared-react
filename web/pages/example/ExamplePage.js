/**
 *
 */
import * as tf from '@tensorflow/tfjs';
import React, {Component, PropTypes} from 'react';
import Recorder from '../../Recorder';

const path = document.location.origin + "/model/model.json";
let modelReady = false;
let model = tf.loadModel(path).then((res) => {
    res.layers.map(l => l.name);
    // // Warmup the model.
    // const result = res.predict(
    //     tf.zeros([null, 48, 48, 3]));
    //
    // if (!result.data) {
        modelReady = true;
        return model = res;
    // }

    return result.data().then((data) => {
        console.log("Model ready")
        modelReady = true;
        result.dispose();
        return model = res;
    })
});

const IMAGENET_CLASSES = {0:'angry',1:'disgust',2:'sad',3:'happy',
    4:'sad',5:'surprise',6:'neutral'};
const getTopKClassesFromPrediction = (logits, topK) => {
    if (!logits.data)
        return Promise.resolve(null)
    return logits.data()
        .then((values) => {
            const valuesAndIndices = [];
            for (let i = 0; i < values.length; i++) {
                valuesAndIndices.push({value: values[i], index: i});
            }
            valuesAndIndices.sort((a, b) => {
                return b.value - a.value;
            });
            const topkValues = new Float32Array(topK);
            const topkIndices = new Int32Array(topK);
            for (let i = 0; i < topK; i++) {
                topkValues[i] = valuesAndIndices[i].value;
                topkIndices[i] = valuesAndIndices[i].index;
            }

            const topClassesAndProbs = [];
            for (let i = 0; i < topkIndices.length; i++) {
                topClassesAndProbs.push({
                    className: IMAGENET_CLASSES[topkIndices[i]],
                    probability: topkValues[i]
                });
            }
            return topClassesAndProbs;
        })
};


const ExamplePage = class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: modelReady
        };
        if (!modelReady) {
            this.interval = setInterval(() => {
                if (modelReady) {
                    this.setState({ready: true});
                    clearInterval(this.interval);
                }
            })
        }
        this.normalizationOffset = tf.scalar(127);
    }

    onData = (canvas, IMAGE_WIDTH, IMAGE_HEIGHT) => {
        const img = tf.fromPixels(canvas);


        // Normalize the image from [0, 255] to [-1, 1].
        const normalized = img.toFloat()
            .sub(this.normalizationOffset)
            .div(this.normalizationOffset);

        // Resize the image to
        let resized = normalized;
        if (img.shape[0] !== 48 || img.shape[1] !== 48) {
            const alignCorners = true;
            resized = tf.image.resizeBilinear(
                normalized, [48, 48], alignCorners);
        }

        // Reshape to a single-element batch so we can pass it to predict.
        const batched = resized.reshape([-1,48,48,1]);

        const prediction = model.predict(batched);

        this.setState({ready: false})
        getTopKClassesFromPrediction(prediction, 1)
            .then((res) => {
                console.log(res[0]);
                this.setState({ready: true})
            })
    };

    render() {
        const {ready} = this.state;
        return (
            <div className="container">
                <Recorder
                    captureWidth={48}
                    captureHeight={48}
                    ready={ready}
                    onData={this.onData}
                    captureRate={100}
                    onError={this.onError}
                    onReady={this.onReady}
                    start={true}
                />
            </div>
        );
    }

    onReady = () => {

    };
    onError = () => {

    };
};

ExamplePage.propTypes = {};

export default ExamplePage;