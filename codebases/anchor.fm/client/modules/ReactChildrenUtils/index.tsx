/**
 * Inspired / adjusted from
 * https://github.com/fernandopasik/react-children-utilities/, a library that is
 * unfortunately bundled in a way that does not play well with Webpack, jest or
 * node.
 */
import type { ReactElement } from 'react';
import { Children, cloneElement, isValidElement } from 'react';

const hasChildren = (element: ReactElement): element is ReactElement<{ children: ReactElement[] }> =>
  isValidElement<{ children?: ReactElement[] }>(element) && Boolean(element.props.children);

const hasComplexChildren = (
  element: ReactElement,
): element is ReactElement<{ children: ReactElement[] }> =>
  isValidElement(element) &&
  hasChildren(element) &&
  Children.toArray(element.props.children).reduce(
    (response: boolean, child: ReactElement): boolean => response || isValidElement(child),
    false,
  );

type MapFunction = (
  child: ReactElement,
  index?: number,
  children?: readonly ReactElement[],
) => ReactElement;

export const deepMap = (children: ReactElement | ReactElement[], deepMapFn: MapFunction): ReactElement[] => {
  return Children.toArray(children).map(
    (child: ReactElement, index: number, mapChildren: readonly ReactElement[]) => {
      if (isValidElement(child) && hasComplexChildren(child)) {
        return deepMapFn(
          cloneElement(child, {
            ...child.props,
            children: deepMap(child.props.children, deepMapFn),
          }),
        );
      }
      return deepMapFn(child, index, mapChildren);
    },
  );
};
