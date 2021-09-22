/**
 * When using html tags other than `button` to create clickable UI elements, we
 * need to handle "clicks" through the spacebar and enter keys. The jsx-a11y
 * eslint plugin will automatically force developers to include a keyboard
 * handling method. Developers should use `onKeyPress`, and then pass the event
 * and the component's onClick handler into a11yKeyPress.
 */

export default (event: $TSFixMe, onClick: ((e?: $TSFixMe) => void) | undefined) => {
  if (event.key === 'Enter' || event.key === ' ') {
    onClick && onClick(event);
  }
};
