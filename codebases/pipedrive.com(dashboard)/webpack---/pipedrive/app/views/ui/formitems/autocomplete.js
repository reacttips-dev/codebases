const IS = require('views/ui/inputsearch');
const _ = require('lodash');
const AddressIS = require('views/ui/address-inputsearch');

let autocompleteBinds = [];

const hideModalOverlays = function() {
	autocompleteBinds.forEach((bind) => {
		if (bind && _.isFunction(bind.hide)) {
			bind.hide();
		}
	});
};
const destroyOverlays = function(type) {
	autocompleteBinds = _.filter(autocompleteBinds, (item) => {
		if (item.$el.parents(type).length) {
			item.destroy();

			return false;
		}

		return true;
	});
};

app.global.bind('ui.*.event.scroll', hideModalOverlays);
app.global.bind('ui.modal.dialog.close', _.bind(destroyOverlays, this, '#modal'));
app.global.bind('ui.popover.event.close', _.bind(destroyOverlays, this, '#popover'));

module.exports = {
	render: function(settings, options) {
		const inputSearch = new IS(settings);

		inputSearch.on('resultsFound', (results) => {
			if (options && _.isFunction(options.onResultsFound)) {
				options.onResultsFound(results);
			}
		});

		autocompleteBinds.push(inputSearch);

		return inputSearch;
	},

	renderAddress: function(settings) {
		autocompleteBinds.push(new AddressIS(settings));
	}
};
