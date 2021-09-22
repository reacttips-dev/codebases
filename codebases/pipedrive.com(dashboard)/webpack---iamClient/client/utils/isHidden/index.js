const noDimensions = (el) => {
	const preventOverflow = el.style && (
		el.style.overflow === 'hidden' ||
		el.style.overflowX === 'hidden' ||
		el.style.overflowY === 'hidden'
	);

	return preventOverflow && (el.offsetWidth <= 0 && el.offsetHeight <= 0);
};

const noDisplay = (el) => {
	el.style && el.style.display === 'none';
};

const noComputedDisplay = (el) => {
	return window.getComputedStyle(el).getPropertyValue('display') === 'none';
};

const noContainingElement = (el) => {
	return el.offsetParent === null;
};

const isHidden = (el) => {
	return (
		noDimensions(el) ||
		noDisplay(el) ||
		noContainingElement(el) ||
		noComputedDisplay(el)
	);
};

export default (htmlElement) => {
	return !htmlElement || isHidden(htmlElement);
};
