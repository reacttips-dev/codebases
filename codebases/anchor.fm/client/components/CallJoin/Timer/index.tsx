import React from 'react';

interface ITimerProps {
  children: any;
  interval: number;
}
interface ITimerState {
  startTime: any;
  elapsedTimeInMs: number;
}

export class Timer extends React.Component<ITimerProps, ITimerState> {
  public state = {
    startTime: new Date(),
    elapsedTimeInMs: 0,
  };
  public componentDidMount() {
    const { startTime } = this.state;
    const { interval } = this.props;
    setInterval(() => {
      this.setState(() => ({
        elapsedTimeInMs: new Date().getTime() - startTime.getTime(),
      }));
    }, interval);
  }
  public render() {
    const { elapsedTimeInMs } = this.state;
    const { children } = this.props;
    return children({
      elapsedTimeInMs,
    });
  }
}
