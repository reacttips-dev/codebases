const $ = require('jquery');

const CellUtils = {
	getExpandedCellClass(ref) {
		const scrollbarHeight = 16;
		const maxCellHeight = 74;
		const elementTop = $(ref).offset().top;
		const windowBottom = $(document).outerHeight();
		const isPageBottom = elementTop > windowBottom - maxCellHeight - scrollbarHeight;
		const positionClassName = isPageBottom ? ' gridRow__cell--expandedTop' : '';

		return `gridRow__cell--expanded${positionClassName}`;
	}
};

module.exports = CellUtils;
