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
                    id="video"
                />

                <canvas
                    width={this.props.captureWidth}
                    height={this.props.captureHeight}
                    ref={(canvas) => {
                        if (canvas) {
                            this.canvas = canvas;
                        }
                    }}
                    id="canvas"
                />
            </div>
        );
    }

    capture = () => {
        if (this.interval) {
            clearInterval(this.interval);
        }

        const {video, canvas} = this;
        let width,
            height;

        const video_canvas = document.createElement('canvas');
        video_canvas.width = canvas.clientWidth;
        video_canvas.height = canvas.clientHeight;
        const video_context = video_canvas.getContext('2d');
        this.interval = setInterval(() => {
            if (!this.props.ready || !video.videoWidth)
                return;

            if (!width) {
                width = this.props.captureWidth || video.videoWidth;
                height = this.props.captureHeight || video.videoHeight;
                // Setup a canvas with the same dimensions as the video.
                video_context.width = width;
                video_context.height = height;
                this.setState({width, height})

            }
            // Make a copy of the current frame in the video on the canvas.
            video_context.drawImage(video, 0, 0, canvas.clientWidth, canvas.clientHeight);
        }, this.props.captureRate)

        // document.body.appendChild(video_canvas); // USEFUL FOR DEBUGGING PURPOSES

        const tracker = new tracking.ObjectTracker('face');

        tracking.track('#video', tracker, {});

        const context = canvas.getContext('2d');

        tracker.on('track', event => {
            event.data.forEach(rect => {
              context.clearRect(0, 0, canvas.width, canvas.height);

              context.strokeStyle = '#a64ceb';
              context.strokeRect(rect.x - 5, rect.y - 20, rect.width + 10, rect.height + 40);
              context.font = '11px Helvetica';
              context.fillStyle = "#fff";
              context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
              context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);

              // Get the cropped image
              const img_data = video_context.getImageData(rect.x - 5, rect.y - 20, rect.width + 10, rect.height + 40);
              this.props.onData && this.props.onData(img_data, width, height);
            });
          });
    };

    start = () => {
        const {video} = this;
        if (!navigator.getUserMedia) {
            this.props.onError && this.props.onError("Your browser doesn't have support for the navigator.getUserMedia interface.");
            return;
        }
        navigator.getUserMedia(
            {
                video: {width: this.props.captureHeight, height: this.props.captureWidth}
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
                    this.capture();
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
    captureRate: 100
};
