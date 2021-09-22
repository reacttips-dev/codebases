const $ = require('jquery');
const selectBinds = {};
const destroyType = function(type) {
	// eslint-disable-next-line no-unused-vars
	for (const selectBindId in selectBinds) {
		if ($(`#${selectBindId}`).parents(type).length) {
			selectBinds[selectBindId].select2('destroy');
			delete selectBinds[selectBindId];
		}
	}
};

app.global.bind('ui.modal.dialog.close', function() {
	destroyType('#modal');
});

app.global.bind('ui.popover.event.close', function() {
	destroyType('#popover');
});

module.exports = {
	get: function(id) {
		return selectBinds[id];
	},
	render: function(id, options) {
		selectBinds[id] = $(`#${id}`).select2(options);
	},
	destroy: function(id) {
		if (selectBinds[id]) {
			selectBinds[id].destroy();
			delete selectBinds[id];
		}
	}
};
