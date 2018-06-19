import React, { Component, PropTypes } from 'react';
import { Chart as ChartJS } from 'chart.js';

export default class Chart extends Component {

  static defaultProps = {
    options : ChartJS.defaults.global,
  };

  /**
   * Instantiates the component and sets initial state.
   *
   * @param  {object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      chart : null,
    };
  }

  componentDidMount() {
    this.createChart(this.props);
  }

  componentWillUnmount() {
    this.state.chart.destroy();
  }

  componentDidUpdate() {
    this.state.chart.data = this.props.data;
    this.state.chart.update({duration: 0});
  }

  createChart(props) {
    this.setState({
      chart : new ChartJS(this.refs.canvas.getContext('2d'), {
        type    : props.type,
        data    : props.data,
        options : props.options,
      }),
    });
  }

  render() {
    const { height, width } = this.props;
    return (<canvas ref="canvas" height={height} width={width} />);
  }
}
