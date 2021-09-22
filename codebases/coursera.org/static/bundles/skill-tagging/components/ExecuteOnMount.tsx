import React from 'react';

type Props = {
  execute: Function;
};

/*
This component takes an execute function, and executes it after it's been mounted
We need to do this on componentDidMount because render must be pure function without any side effect
*/
export default class ExecuteOnMount extends React.Component<Props> {
  componentDidMount() {
    this.props.execute();
  }

  render() {
    return null;
  }
}
