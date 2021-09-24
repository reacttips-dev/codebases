import React from 'react';

// TODO: Remove the any types from this file. I'm not good enought at typescript to
//       know how to get it to typecheck correcty. Maybe as on the TS slack channel

const noop = () => null;

interface IfProps {
  condition: boolean;
  ifRender: () => React.ReactNode;
  elseRender: () => React.ReactNode;
}

const defaultProps = {
  elseRender: noop,
  ifRender: noop,
};

/**
 * @deprecated Use plain ternary operator or `if` statement
 */
const If = ({ condition, ifRender, elseRender }: IfProps): any =>
  condition ? ifRender() : elseRender(); // TODO: Should not use `any`

/**
 * @deprecated Use plain ternary operator or `if` statement
 */
const isIfComponent = (
  component: any // TODO: Should not use `any`
) => component && component.type && component.type === If;

/**
 * @deprecated Use plain ternary operator or `if` statement
 */
const isIfComponentNull = (ifComponent: any) => {
  if (!isIfComponent(ifComponent)) {
    throw Error(
      "'isIfComponentNull' cannot be called with a non <If> component"
    );
  }
  const { condition, ifRender, elseRender } = ifComponent.props;

  return condition ? ifRender() === null : elseRender() === null;
};

If.defaultProps = defaultProps;

export { If as default, If, isIfComponent, isIfComponentNull };
