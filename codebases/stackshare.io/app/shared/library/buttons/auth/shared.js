import {BASE_TEXT} from '../../../style/typography';
import {WHITE} from '../../../style/colors';

export const containerStyle = color => [
  {
    ...BASE_TEXT,
    letterSpacing: 0.2,
    color: color,
    display: 'flex',
    border: `1px solid ${color}`,
    borderRadius: 20,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    '> svg': {
      marginRight: 8
    }
  },
  ({invert = false}) => ({
    color: invert ? color : WHITE,
    backgroundColor: invert ? WHITE : color,
    ':visited': {
      color: invert ? color : WHITE
    },
    ':active': {
      color: invert ? color : WHITE
    },
    ':hover': {
      color: invert ? color : WHITE,
      backgroundColor: invert ? WHITE : color,
      boxShadow: '0 2px 4px 0 rgba(0,0,0,.43)'
    }
  })
];

export const handleClick = (service, redirect, sendAnalyticsEvent, payload = {}) => event => {
  event.preventDefault();
  const dest = event.target.getAttribute('href');
  sendAnalyticsEvent(`signup.clicked_${service}`, payload);
  if (redirect) {
    fetch('/api/v1/base/set_redirect', {
      method: 'POST',
      body: JSON.stringify({redirect_to: redirect}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      window.location = dest;
    });
  } else {
    window.location = dest;
  }
};
