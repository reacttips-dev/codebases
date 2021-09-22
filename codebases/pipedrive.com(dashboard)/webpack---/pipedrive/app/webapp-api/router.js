module.exports = {
	go: function(...args) {
		app.router.go.apply(app.router, args);
	},
	on: function(...args) {
		app.router.on.apply(app.router, args);
	},
	off: function(...args) {
		app.router.off.apply(app.router, args);
	},
	blockNavigation: function(...args) {
		app.router.blockNavigation.apply(app.router, args);
	},
	unblockNavigation: function(...args) {
		app.router.unblockNavigation.apply(app.router, args);
	},
	restoreBlockedNavigation: function(...args) {
		app.router.restoreBlockedNavigation.apply(app.router, args);
	}
};
