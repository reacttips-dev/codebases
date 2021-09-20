const cloneAnswerStyles = {
    borderRadius: '4px',
    border: 'none',
    boxSizing: 'border-box',
    position: 'absolute',
    top: '-150px',
    color: 'white',
    minHeight: '44px',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 15px',
    width: 'auto',
};

const cloneAnswerShadowStyles = {
    borderRadius: '4px',
    border: 'none',
    boxSizing: 'border-box',
    opacity: '0.1',
    backgroundColor: '#02b3e4',
    color: '#02b3e4',
    minHeight: '44px',
    display: 'inline-flex',
    width: 'auto',
};

const invisibleAnswerStyles = {
    color: 'transparent',
    backgroundColor: 'transparent',
    boxSizing: 'border-box',
    boxShadow: 'none',
    opacity: 0,
};

export default {
    cloneAnswerStyles,
    cloneAnswerShadowStyles,
    invisibleAnswerStyles,
};