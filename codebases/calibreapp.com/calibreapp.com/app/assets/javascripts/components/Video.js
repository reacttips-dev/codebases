import React from 'react'

import { PlainFormatter } from '../utils/MetricFormatter'

class Video extends React.Component {
  constructor() {
    super()
    this.vidRef = React.createRef()

    this.state = {
      playing: false,
      timer: 0
    }
  }

  timeUpdated = () => {
    this.setState(() => {
      return {
        timer: this.vidRef.current.currentTime * 1000
      }
    })
  }

  play() {
    this.setState({
      playing: true
    })

    this.vidRef.current.play()
  }

  get formattedTimer() {
    return PlainFormatter({
      number: this.state.timer,
      formatter: 'humanDuration'
    })
  }

  render() {
    return (
      <div className="video-player">
        <div className="video-player__timer">
          <span>{this.formattedTimer}</span>
        </div>
        <video
          ref={this.vidRef}
          onTimeUpdate={this.timeUpdated}
          onPlay={this.play.bind(this)}
          poster={this.props.poster}
          src={this.props.src}
          controls
          playsInline
        />
      </div>
    )
  }
}

export default Video
