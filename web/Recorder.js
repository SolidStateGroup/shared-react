import React, {Component, PropTypes} from 'react';

export default class TheComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        if (this.props.start)
            this.start();
    }

    render() {
        const {videoProps} = this.props;
        const {width, height} = this.state;
        return (
            <div className='camera'>
                <video
                    width={this.props.captureWidth}
                    height={this.props.captureHeight}
                    {...videoProps}
                    ref={
                        (video) => {
                            this.video = video
                        }}
                />

                <canvas
                    width={this.props.captureWidth}
                    height={this.props.captureHeight}
                    ref={(canvas) => {
                        if (canvas) {
                            this.canvas = canvas;
                        }
                    }}
                />
            </div>
        );
    }

    capture = (interval) => {
        if (this.interval) {
            clearInterval(this.interval);
        }

        const {video, canvas} = this;
        let width,
            height;

        this.interval = setInterval(() => {
            if (!this.props.ready || !video.videoWidth)
                return;
            const context = canvas.getContext('2d');

            if (!width) {
                width = this.props.captureWidth || video.videoWidth;
                height = this.props.captureHeight || video.videoHeight;
                // Setup a canvas with the same dimensions as the video.
                context.width = width;
                context.height = height;
                this.setState({width, height})

            }
            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(video, 0, 0, width, height);
            this.props.onData && this.props.onData(canvas, width, height);
        }, this.props.captureRate)
    };

    start = () => {
        const {video} = this;
        if (!navigator.getMedia) {
            this.props.onError && this.props.onError("Your browser doesn't have support for the navigator.getUserMedia interface.");
        }
        navigator.getUserMedia(
            {
                video: true
            },
            // Success Callback
            (stream) => {

                // Create an object URL for the video stream and
                // set it as src of our HTML video element.
                if (typeof video.srcObject == "object") {
                    video.srcObject = stream;
                } else {
                    video.src = URL.createObjectURL(stream);
                }

                // Play the video element to start the stream.
                video.play();
                video.onplay = () => {
                    this.props.onReady && this.props.onReady();
                    this.capture(this.props.interval);
                };

            },
            // Error Callback
            (err) => {
                this.props.onError && this.props.onError(err);
            }
        );
    }
}

TheComponent.defaultProps = {
    interval: 100
};
