import React from 'react';
import { omit } from 'lodash';

/**
 * A small utility function to return a component with some props filtered out.
 *
 * Used within styled-components files to stop props passing.
 * See: https://github.com/styled-components/styled-components/issues/135#issuecomment-485315176
 */
export default function filterPropsFromComponent(Component, filter = []) {
	return (props) => <Component {...omit(props, filter)} />;
}
