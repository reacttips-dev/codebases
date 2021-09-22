import React from 'react';
import PropTypes from 'prop-types';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'crea... Remove this comment to see the full error message
import createClassFactory from 'create-react-class/factory';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import DOM from 'react-dom-factories';

// We delete these properties because of issues with re-defining properties that don't have setters.
// Ultimately, we want to make sure this works as expected with monkeypatched libraries, anyway.
// @ts-expect-error ts-migrate(2339) FIXME: Property 'PropTypes' does not exist on type 'typeo... Remove this comment to see the full error message
delete React.PropTypes;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'createClass' does not exist on type 'typ... Remove this comment to see the full error message
delete React.createClass;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'DOM' does not exist on type 'typeof impo... Remove this comment to see the full error message
delete React.DOM;

// @ts-expect-error ts-migrate(2339) FIXME: Property 'PropTypes' does not exist on type 'typeo... Remove this comment to see the full error message
React.PropTypes = PropTypes;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'createClass' does not exist on type 'typ... Remove this comment to see the full error message
React.createClass = createClassFactory(React.Component, React.isValidElement, new React.Component().updater);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'DOM' does not exist on type 'typeof impo... Remove this comment to see the full error message
React.DOM = DOM;

export const createElement = React.createElement;
export const Children = React.Children;
export const Component = React.Component;
export const PureComponent = React.PureComponent;
export const cloneElement = React.cloneElement;
export const isValidElement = React.isValidElement;
export const useRef = React.useRef;
export const forwardRef = React.forwardRef;
export const createRef = React.createRef;
export const useContext = React.useContext;
export const createContext = React.createContext;
export const useLayoutEffect = React.useLayoutEffect;
export const memo = React.memo;
export const useMemo = React.useMemo;
export const useState = React.useState;
export const useEffect = React.useEffect;
export const Fragment = React.Fragment;
export const useCallback = React.useCallback;
export const useImperativeHandle = React.useImperativeHandle;
export const useDebugValue = React.useDebugValue;
export { PropTypes };
export default React;
