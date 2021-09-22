let documentFragment;

const getDocumentFragment = () => {
	if (!documentFragment) {
		documentFragment = document.createDocumentFragment();
	}

	return documentFragment;
};

const create = () => {
	const canvas = document.createElement('canvas');
	const fragment = getDocumentFragment();

	fragment.appendChild(canvas);

	return canvas;
};

const destroy = (canvas) => {
	const fragment = getDocumentFragment();

	fragment.removeChild(canvas);
};

export default {
	create,
	destroy,
};
