import React from 'react';

// TODO: The `any` states here should be converted to actual types, when we learn more about types
interface StatesmanProps {
  children: (state: any, setState: (prevState: any) => void) => React.ReactNode;
  initialState: any;
}

const defaultProps = {
  initialState: {},
};

/**
 * @deprecated Use plain ol' React state management
 */
class Statesman extends React.Component<StatesmanProps, any> {
  public static defaultProps = defaultProps;

  constructor(props: StatesmanProps) {
    super(props);
    const { initialState } = props;
    this.state = initialState;
  }

  public render() {
    const { children, initialState } = this.props;
    return children(this.state, this.setState.bind(this));
  }
}

export { Statesman };
