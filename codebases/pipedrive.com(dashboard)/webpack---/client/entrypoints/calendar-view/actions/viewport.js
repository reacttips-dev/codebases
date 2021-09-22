function setViewport(viewport) {
	return {
		type: 'UPDATE_VIEWPORT',
		viewport,
	};
}

export function updateViewport({ width, height }) {
	return setViewport({ width, height });
}
