import { useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/loader.scss';

/**
 * Loader component that, in addition to showing the large loader, adds placeholder vertical space.
 *
 * This allows the browser to scroll to the correct spot the user was on in the case of browser forward/back.
 *
 * Loader is centered horizontally, with no vertical positioning outside of minor margins.
 */

export const PageLoader = ({ centered = false }) => {
  // returning in a useEffect is the equivalent of "componentWillUnmount"
  useEffect(() => () => {
    /*
      This is to make sure other components know `.whitespacePlaceholder` has been removed
      and things may now be in the viewport that once weren't. This specifically is because of
      ImageLazyLoader. Timeout exists because we want to fire after the component has fully unmounted.
    */
    setTimeout(() => window.dispatchEvent(new CustomEvent('resize')), 100);
  }, []);

  const { testId } = useMartyContext();

  return (
    <div>
      <div className={cn(css.pageLoader, css.loader, { [css.centered]: centered })} data-test-id={testId('loader')}/>
      <div className={css.whitespacePlaceholder}/>
    </div>
  );
};

export const Loader = (_, { testId = () => null }) => (<div className={css.loader} data-test-id={testId('loader')}></div>);

export const SmallLoader = ({ additionalClassNames }, { testId = () => null }) => (<div className={cn(css.smallLoader, additionalClassNames)} data-test-id={testId('smallLoader')}></div>);

export const ButtonSpinner = ({ className = undefined, size = '20' }) => (
  <svg
    className={cn(css.buttonSpinner, className)}
    viewBox="0 0 20 20"
    width={size}
    height={size}>
    <path fill="#fff" d="M20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0v2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8h2z"/>
  </svg>
);

export const Spinner = ({ color = '#fff', size = '15', strokeWidth = '2', viewBox = '38' }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${viewBox} ${viewBox}`}
    xmlns="http://www.w3.org/2000/svg"
    stroke={color}>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth={strokeWidth}>
        <circle
          strokeOpacity=".5"
          cx="18"
          cy="18"
          r="18"/>
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"/>
        </path>
      </g>
    </g>
  </svg>
);

Loader.contextTypes = {
  testId: PropTypes.func
};

SmallLoader.defaultProps = {
  additionalClassNames: ''
};

SmallLoader.contextTypes = {
  testId: PropTypes.func
};
