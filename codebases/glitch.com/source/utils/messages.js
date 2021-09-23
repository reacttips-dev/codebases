const messageType = (name) => `glitch/${name}`;

export const GO_TO_LINE = messageType('go-to-line');
export const UPDATE_EMBED_STATE = messageType('update-embed-state');

const message = (type, payload) => ({
    type,
    payload
});

export const goToLine = (filePath, line) => message(GO_TO_LINE, {
    filePath,
    line
});
export const updateEmbedState = (attrs) => message(UPDATE_EMBED_STATE, attrs);