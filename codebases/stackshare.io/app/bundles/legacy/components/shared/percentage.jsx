import React, {Component} from 'react';

// Props:
// [animate: true]: Indicates whether an animation will occur
// [strokeWidth: 4]: Width of the stroke in the circle

export default class Percentage extends Component {
  colors = [
    '#FF7F17',
    '#FF7F17',
    '#FF7F17',
    '#FF7F17',
    '#FF7F17',
    '#FF7F17',
    '#0090F9',
    '#0090F9',
    '#45C57C',
    '#45C57C'
  ];

  constructor(props) {
    super(props);
    this.state = {
      percent: Math.min(props.percent, 99.999),
      color: '#ccc'
    };

    this.opts = Object.assign(
      {
        animate: true,
        strokeWidth: 2,
        bgStrokeWidth: 2
      },
      props
    );
  }

  getColor(percent) {
    return this.colors[Math.min(Math.max(Math.floor(percent * 10) - 1, 0), this.colors.length - 1)];
  }

  componentDidMount() {
    import(/* webpackChunkName: "snapsvg" */ 'snapsvg')
      .then(module => {
        if (!this.refs.svg) {
          return;
        }
        const Snap = module.default;
        this.s = Snap(this.refs.svg);
        this.canvasWidth = this.refs.svg.getBoundingClientRect().width;
        this.canvasCenter = this.canvasWidth / 2;
        this.radius = this.canvasWidth / 2 - 3;
        this.startY = this.canvasCenter - this.radius;

        this.path = '';
        this.arc = this.s.path(this.path);
        this.circle = this.s.path(this.path);
        this.drawBGCircle(1);

        this.timeout = setTimeout(() => {
          let color = this.getColor(this.props.percent / 100);
          this.setState({color});
          this.drawBGCircle(0.15);
          if (this.opts.animate) this.animate(Snap);
          else this.drawCircle(this.state.percent * 3.6);
        }, 1000);
      })
      .catch(() => null);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  drawBGCircle(alpha) {
    this.circle.remove();
    this.circle = this.s.path(
      `M${this.canvasCenter},${this.startY} A${this.radius},${this.radius} 0 1,1 ${this
        .canvasCenter - 0.001},${this.startY}Z`
    );

    this.circle.attr({
      stroke: this.state.color,
      strokeOpacity: alpha,
      fill: 'none',
      strokeWidth: this.opts.bgStrokeWidth
    });
  }

  animate = Snap => {
    Snap.animate(
      0,
      this.state.percent * 3.6,
      val => {
        this.drawCircle(val);
      },
      2000,
      mina.easeinout
    );
  };

  drawCircle = val => {
    this.arc.remove();

    let d = val,
      dr = d - 90;
    let radians = (Math.PI * dr) / 180;
    let endx = this.canvasCenter + this.radius * Math.cos(radians),
      endy = this.canvasCenter + this.radius * Math.sin(radians),
      largeArc = d > 180 ? 1 : 0;
    this.path =
      'M' +
      this.canvasCenter +
      ',' +
      this.startY +
      ' A' +
      this.radius +
      ',' +
      this.radius +
      ' 0 ' +
      largeArc +
      ',1 ' +
      endx +
      ',' +
      endy;

    this.arc = this.s.path(this.path);
    this.arc.attr({
      stroke: this.state.color,
      fill: 'none',
      strokeWidth: this.opts.strokeWidth
    });

    if (this.refs.labelPer) {
      this.refs.labelPer.innerHTML = `${Math.round(
        (val / 360) * 100
      )}%<div class='match-per'>Match</div>`;
    }
  };

  styles = () => {
    if (this.props.fill) {
      return {color: this.state.color};
    } else {
      return {color: this.state.color};
    }
  };

  render() {
    return (
      <div className="percent-container" style={this.styles()}>
        <svg ref="svg" />
        <label className="label-per" ref="labelPer">
          ? <div className="match-per">Match</div>
        </label>
      </div>
    );
  }
}
