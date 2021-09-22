export const toggleLines = (color, index) => {
	const firstLine = document.getElementById(`line-${index}`);

	if (firstLine) {
		firstLine.style.borderColor = color;
	}

	const secondLine = document.getElementById(`line-${index - 1}`);

	if (secondLine) {
		secondLine.style.borderColor = color;
	}
};