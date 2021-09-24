import React from 'react';
import PropTypes from 'prop-types';
import {NavigationContext} from '../../../enhancers/router-enhancer';
import glamorous from 'glamorous';
import {FOCUS_BLUE, WHITE} from '../../../style/colors';
import {DESKTOP} from '../../../style/breakpoints';

const Highlight = glamorous.span({
  color: WHITE,
  backgroundColor: FOCUS_BLUE,
  padding: '3px 10px',
  borderRadius: 3,
  [DESKTOP]: {
    fontSize: 13
  }
});

const MenuItem = ({url, children, navigate: useNavigate, highlight = false, onClick}) => (
  <li>
    <NavigationContext.Consumer>
      {navigate => (
        <a
          href={url}
          title={children}
          onClick={event => {
            if (typeof onClick === 'function') {
              return onClick(event);
            }
            if (useNavigate) {
              event.preventDefault();
              navigate(url);
            }
          }}
        >
          {highlight ? <Highlight>{children}</Highlight> : children}
        </a>
      )}
    </NavigationContext.Consumer>
  </li>
);
MenuItem.displayName = 'MobileHeaderMenuItem';
MenuItem.propTypes = {
  url: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  navigate: PropTypes.bool,
  highlight: PropTypes.bool,
  onClick: PropTypes.func
};

export default MenuItem;
