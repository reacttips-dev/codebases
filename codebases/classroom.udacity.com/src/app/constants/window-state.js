import PropTypes from 'prop-types';

export const WINDOW_EVENTS = {
    FOCUS: 'focus',
    BLUR: 'blur',
};

export const WindowEventType = PropTypes.oneOf(_.values(WINDOW_EVENTS));