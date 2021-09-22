export const FULLSCREEN_SHOW = 'FULLSCREEN_SHOW';
export const FULLSCREEN_CLOSE = 'FULLSCREEN_CLOSE';

export const show = (content) => {
	return ({
		type: FULLSCREEN_SHOW,
		content,
	});
};

export const close = () => {
	return ({
		type: FULLSCREEN_CLOSE,
	});
};
