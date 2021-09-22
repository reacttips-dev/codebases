// since we are moving toward using froot - this is the
// hack to support both together and should be removed when froot is the main navigation tool
export default function wrapFrootRouter(frootRouter: any) {
	const combinedMethods: { [method: string]: Function } = {
		blockNavigation(cb: Function) {
			window.app.router?.blockNavigation(cb);
			frootRouter.blockNavigation(cb);
		},
		unblockNavigation() {
			window.app.router?.unblockNavigation();
			frootRouter.unblockNavigation();
		},
		async restoreBlockedNavigation() {
			window.app.router?.restoreBlockedNavigation();

			frootRouter.restoreBlockedNavigation();
		},
	};

	return new Proxy(frootRouter, {
		get(target: any, fieldName: string) {
			return target[fieldName];
		},
	});
}
