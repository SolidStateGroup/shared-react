/**
 *
 */
import * as tf from '@tensorflow/tfjs';
import React, {Component, PropTypes} from 'react';
import Recorder from '../../Recorder';
import Chart from '../../Chart';
import {isMobile} from 'react-device-detect';
import YouTube from 'react-youtube';

// Face tracking only seems to work with a larger video (they use 320x240)
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

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

var emotionData;
const getTopKClassesFromPrediction = (logits, topK) => {
    if (!logits.data)
        return Promise.resolve(null)
    return logits.data()
        .then((values) => {
            const valuesAndIndices = [];
            for (let i = 0; i < values.length; i++) {
                valuesAndIndices.push({value: values[i], index: i});
            }
            emotionData = valuesAndIndices.slice(0);
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
            ready: modelReady,
            disableChart: true,
            calibrated: false,
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
        const normalized = img.toFloat().div(tf.scalar(255));

        // TODO could use model.inputLayers[0].batchInputShape here to get width and height
        // Resize the image to expected model input size
        let resized = normalized;
        if (img.shape[0] !== 48 || img.shape[1] !== 48) {
            const alignCorners = true;
            resized = tf.image.resizeBilinear(
                normalized, [48, 48], alignCorners);
        }

        const greyscale_image = resized.mean(2);
        const final_image = greyscale_image.expandDims(2);

        // TODO could use model.inputLayers[0].batchInputShape here (converting null to -1)
        // Reshape to fit batch input shape so we can pass it to predict.
        const batched = final_image.reshape([-1,48,48,1]);

        const prediction = model.predict(batched);

        this.setState({ready: false})
        getTopKClassesFromPrediction(prediction, 1)
            .then((res) => {
                console.log(res[0]);
                var state = {
                    ready: true, topEmotion: res[0], lastReceived: Date.now(), noFaceDetected: false, happyCount: 0
                }

                if (!this.state.calibrated) {
                    if (this.state.faceDetectedCount >= 5 && res[0].className === 'neutral') {
                        var neutralCount = this.state.neutralCount ? this.state.neutralCount : 0;
                        state.neutralCount = neutralCount + 1;
                    }
                    state.faceDetectedCount = this.state.faceDetectedCount ? this.state.faceDetectedCount + 1 : 1;
                } else if (!this.state.gameOver && this.state.videoPlaying && res[0].className === 'happy' && res[0].probability >= 0.25) {
                    if (this.state.happyCount === 2) {
                        console.log('Player caught laughing - game over');
                        this.state.videoPlayer.pauseVideo();
                        state.gameOver = true;
                    } else {
                        state.happyCount = this.state.happyCount ? this.state.happyCount + 1 : 1;
                    }
                } else if (!this.state.gameOver && this.state.videoPlaying && this.state.videoPlayer.getPlayerState() !== 1) {
                    console.log('Face found - playing video')
                    this.state.videoPlayer.playVideo();
                }
                this.setState(state);
            })
    };

    componentDidMount() {
        setInterval(() => {
            const timeSinceLastDetection = Date.now() - this.state.lastReceived;
            const noFaceDetected = this.state.lastReceived ? timeSinceLastDetection > 1000 : false;
            if (noFaceDetected != this.state.noFaceDetected) {
                var state = {noFaceDetected};
                if (!this.state.calibrated) {
                    state.neutralCount = noFaceDetected ? 0 : this.state.neutralCount;
                }
                this.setState(state);
            } else if (!this.state.gameOver && this.state.videoPlaying && timeSinceLastDetection > 1000) {
                if (timeSinceLastDetection < 3000) {
                    if (this.state.videoPlayer.getPlayerState() !== 2) {
                        console.log('Face lost - pausing video')
                        this.state.videoPlayer.pauseVideo();
                    }
                    this.setState({timeSinceLastDetection});
                } else {
                    console.log('Face lost for 3s - game over')
                    this.state.videoPlayer.pauseVideo();
                    this.setState({gameOver: true});
                }
            }
        }, 100);
    }

    startGame = () => {
        this.setState({calibrated: true});

        // TODO play funny random video
    }

    onVideoEnd = () => {
        if (!this.state.gameOver) {
            console.log('Player won - game over')
            this.setState({gameOver: true, won: true, videoPlaying: false});
        }
    }

    renderCalibration = () => {
        const {faceDetectedCount, noFaceDetected, neutralCount, lastReceived} = this.state;

        if (!lastReceived || faceDetectedCount < 20) {
            return (
                <div>
                    Let's start with some calibration. Position your face so that it takes up at least 75% of the camera
                </div>
            )
        } else if (faceDetectedCount >= 20 && neutralCount < 40) {
            if (noFaceDetected) {
                return (
                    <div>
                        Uh oh. I can't see your face! Make sure you are in an evenly lit environment.
                    </div>
                )
            } else {
                return (
                    <div>
                        Ok great! Now give us your most neutral expression. 😐
                    </div>
                )
            }
        } else if (faceDetectedCount >= 20 && neutralCount >= 40) {
            if (noFaceDetected) {
                if (this.starting) {
                    clearInterval(this.starting);
                    this.starting = null;
                }
                this.setState({neutralCount: 0});
            } else {
                if (!this.starting) {
                    this.starting = setInterval(this.startGame, 2000);
                }
            }
            return (
                <div>
                    That's it! All calibrated. Are you ready?
                </div>
            )
        }
    }

    renderGame() {
        return (
            <div>
                <YouTube
                    videoId="5uqUV4prf4Q"
                    opts={{
                        height: '390',
                        width: '640',
                        playerVars: {
                            autoplay: 1,
                            controls: 0
                        }
                    }}
                    onEnd={this.onVideoEnd}
                    onPlay={(e) => this.setState({videoPlaying: true, videoPlayer: e.target})}
                />
                {this.state.gameOver ? (
                    <div>
                        {this.state.won ? (
                            <div>You won! Why so serious?</div>
                        ) : (
                            <div>You lose! Be better</div>
                        )}
                    </div>
                ) : (
                    <div>
                        {this.state.noFaceDetected && (
                            <div>
                                Where did you go?! {((3000 - (Date.now() - this.state.lastReceived)) / 1000).toFixed(1)}s till you lose!
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    renderEmoji() {
        const {topEmotion, noFaceDetected} = this.state;
        return (
            <div>
                {topEmotion && !noFaceDetected && topEmotion.className === 'happy' && (() => {
                    if (topEmotion.probability >= 0.7) {
                        return (
                            <div>
                                <div className="emotion-alert">You're laughing!</div>
                                <div className="emoji">😆</div>
                            </div>
                        )
                    } else if (topEmotion.probability >= 0.3) {
                        return (
                            <div>
                                <div className="emotion-alert">Are you about to laugh?!</div>
                                <div className="emoji">🤨</div>
                            </div>
                        )
                    } else {
                        return null;
                    }
                })()}
                {topEmotion && !noFaceDetected && (() => {
                    switch (topEmotion.className) {
                        case "neutral":
                            return (
                                <div>
                                    <div className="emoji">😐</div>
                                </div>
                            )
                        case "sad":
                            return (
                                <div>
                                    <div className="emoji">☹️</div>
                                </div>
                            )
                        case "angry":
                            return (
                                <div>
                                    <div className="emoji">😡</div>
                                </div>
                            )
                        case "disgust":
                            return (
                                <div>
                                    <div className="emoji">😒</div>
                                </div>
                            )
                        case "fear":
                            return (
                                <div>
                                    <div className="emoji">😨</div>
                                </div>
                            )
                        case "surprise":
                            return (
                                <div>
                                    <div className="emoji">😯</div>
                                </div>
                            )
                        default:
                            return null;
                    }
                })()}
                {noFaceDetected && (
                    <div>
                        <div className="emotion-alert">Where have you gone?!</div>
                        <div className="emoji">🧐</div>
                    </div>
                )}
            </div>
        )
    }

    render() {
        const {ready} = this.state;
        var data = [];
        if (emotionData) {
            for (var i = 0; i < 7; i++) {
                data.push(emotionData[i].value);
            }
        }
        const barChartData = {
            labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'],
            datasets: [{
                data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(192, 192, 192, 0.2)',
                ],
            }]
        }
        const barChartOptions = {
            responsive: false,
            scales: {
                xAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 1
                    }
                }]
            },
            legend: {
                display: false
            }
        }
        return (
            <div>
                <div className="container">
                    <Recorder
                        captureWidth={isMobile ? CANVAS_WIDTH : CANVAS_HEIGHT}
                        captureHeight={isMobile ? CANVAS_HEIGHT : CANVAS_WIDTH}
                        ready={ready}
                        onData={this.onData}
                        captureRate={100}
                        onError={this.onError}
                        onReady={this.onReady}
                        start={true}
                    />
                    {this.state.calibrated ? this.renderGame() : this.renderCalibration()}
                </div>
                {!this.state.disableChart && (
                    <div className="emotion-chart">
                        <Chart type="horizontalBar" data={barChartData} options={barChartOptions} width="400" height="200" />
                    </div>
                )}
            </div>
        );
    }

    onReady = () => {

    };
    onError = (err) => {
        console.log(err)
    };
};

ExamplePage.propTypes = {};

export default ExamplePage;