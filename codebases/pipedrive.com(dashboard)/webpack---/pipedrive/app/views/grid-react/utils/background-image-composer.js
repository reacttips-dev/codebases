const _ = require('lodash');

class BackgroundImageComposer {
	constructor() {
		this.specs = [];
	}

	addLinear({ image, size, position }) {
		this.specs.push({ image, size, position });
	}

	toCSS() {
		const cssCollections = _.reduce(
			this.specs,
			(css, backgroundSpec) => {
				css.backgroundImage.push(backgroundSpec.image);
				css.backgroundSize.push(backgroundSpec.size);
				css.backgroundPosition.push(backgroundSpec.position);

				return css;
			},
			{ backgroundImage: [], backgroundSize: [], backgroundPosition: [] }
		);

		return {
			backgroundImage: cssCollections.backgroundImage.join(','),
			backgroundSize: cssCollections.backgroundSize.join(','),
			backgroundPosition: cssCollections.backgroundPosition.join(',')
		};
	}
}

module.exports = BackgroundImageComposer;
