/**
 *
 */
import * as tf from '@tensorflow/tfjs';
import React, {Component, PropTypes} from 'react';
import Recorder from '../../Recorder';

const CANVAS_WIDTH = 48;
const CANVAS_HEIGHT = 48;

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

const IMAGENET_CLASSES = {0:'angry',1:'disgust',2:'fear',3:'happy',
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
        const preview = tf.fromPixels(canvas);
        const normalized = preview.toFloat().div(tf.scalar(255));

        // TODO could use model.inputLayers[0].batchInputShape here to get width and height
        // // Resize the image to
        // let resized = normalized;
        // if (img.shape[0] !== 48 || img.shape[1] !== 48) {
        //     const alignCorners = true;
        //     resized = tf.image.resizeBilinear(
        //         normalized, [48, 48], alignCorners);
        // }

        const greyscale_image = normalized.mean(2);
        const final_image = greyscale_image.expandDims(2);

        // TODO could use model.inputLayers[0].batchInputShape here (converting null to -1)
        // Reshape to fit batch input shape so we can pass it to predict.
        const batched = final_image.reshape([-1,CANVAS_WIDTH,CANVAS_HEIGHT,1]);

        if (this.debugCanvas) {
            tf.toPixels(final_image, this.debugCanvas);
        }

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
                    captureWidth={CANVAS_WIDTH}
                    captureHeight={CANVAS_HEIGHT}
                    ready={ready}
                    onData={this.onData}
                    captureRate={100}
                    onError={this.onError}
                    onReady={this.onReady}
                    start={true}
                />
                <canvas width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT} ref={c => this.debugCanvas = c} />
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