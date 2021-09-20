import PropTypes from 'prop-types';

export const textSubPrompt = PropTypes.shape({
    prompt: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
});

export const timeSubPrompt = PropTypes.shape({
    prompt: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
});

export const radioChoice = PropTypes.shape({
    text: PropTypes.string.isRequired,
    input: textSubPrompt,
});

export const radioSubPrompt = PropTypes.shape({
    prompt: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(radioChoice),
    required: PropTypes.bool,
});

export const subPrompt = PropTypes.oneOfType([
    textSubPrompt,
    radioSubPrompt,
    timeSubPrompt,
]);

export const feedback = PropTypes.shape({
    feedback: PropTypes.string.isRequired,
    subPrompts: PropTypes.arrayOf(subPrompt),
});

export const response = PropTypes.shape({
    answer: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    question: PropTypes.string,
    radioKey: PropTypes.number,
});