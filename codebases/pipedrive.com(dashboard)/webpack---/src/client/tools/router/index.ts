import { parsePath } from 'history';
import { EventEmitter } from '../../utils/EventEmitter';
import { trackRouteChange } from '../../utils/newrelic';
import browserHistory, { InternalHistory } from './history';
import { matchPath as routerMatchPath } from 'react-router-dom';
import Logger from '@pipedrive/logger-fe';

const logger = new Logger('froot', 'FrootRouter');

interface RouterOptions {
	replace?: boolean;
	popEvent?: boolean;
	search?: string;
	silent?: boolean;
	trackingData?: object;
}

type EventName = 'routeChange' | 'hashChange' | 'searchChange' | 'beforeNavigate';

export class FrootRouter {
	private readonly events: EventEmitter;
	private currentBasePath: string;
	private previousBasePath: string;
	private currentPath: string;
	private currentPathIsSilent: boolean;
	private currentSearch: string;
	private previousPath: string;
	private previousSearch: string;
	public history: InternalHistory;
	private reloadOnLeave?: string;

	private navigationBlockedCallback: Function;
	private navigationBlockedCallbackResult: any;
	private historyUnblock?: () => void;
	private historyRestoreBlockedNavigation?: () => void;

	constructor(history: InternalHistory = browserHistory) {
		this.history = history;
		this.events = new EventEmitter();
		this.currentBasePath = '';
		this.previousBasePath = '';
		this.currentPath = this.history.location.pathname;
		this.currentSearch = this.history.location.search;

		this.history.listen((h) => {
			if (h?.location?.pathname) {
				if (h.action === 'POP') {
					const options: RouterOptions = { popEvent: true, search: h.location.search };

					this.navigateTo(h.location.pathname, options);
				}

				if (h.location?.state?.hasBeenBlocked) {
					const options: RouterOptions = { popEvent: true, search: h.location.search };

					this.navigateTo(h.location.pathname, options);
				}

				this.previousPath = this.currentPath;
				this.previousSearch = this.currentSearch;
				this.currentPath = h.location.pathname;
				this.currentSearch = h.location.search;
			}
		});
	}

	private emitBeforeNavigate({ path, previousPath }: { path: string; previousPath: string }) {
		this.events.emit('beforeNavigate', {
			type: 'beforeNavigate',
			path,
			previousPath,
			blocked: !!this.navigationBlockedCallback,
		});
	}

	private emitHashChange({ path, trackingData }) {
		this.events.emit('hashChange', {
			type: 'hashChange',
			hash: path,
			trackingData,
		});
	}

	private emitRouteChange({ path, previousPath, popEvent, replace, silent }) {
		this.currentPathIsSilent = silent;

		if (popEvent) {
			this.previousPath = previousPath;
			this.currentPath = path;
		} else {
			this.updateUrl(path, replace);
		}

		if (!silent) {
			this.events.emit('routeChange', {
				type: 'routeChange',
				replace,
				path,
				previousPath,
			});
		}
	}

	private emitSearchChange({ path, search, previousSearch, replace, popEvent, silent }) {
		if (popEvent) {
			this.previousSearch = previousSearch;
			this.currentSearch = search;
		} else {
			this.updateUrl(path, replace);
		}

		if (!silent) {
			this.events.emit('searchChange', {
				type: 'searchChange',
				previousSearch,
				search,
			});
		}
	}

	private checkReload(path) {
		return this.reloadOnLeave && !path.startsWith(this.reloadOnLeave);
	}

	private updateUrl(path: string, replace: boolean) {
		const parsedPath = { pathname: '', search: '', hash: '', ...parsePath(path) };

		if (replace) {
			this.history.replace(parsedPath);
		} else {
			this.history.push(parsedPath);
		}
	}

	private isHistoryBlocked() {
		return this.historyUnblock;
	}

	public isCurrentPathSilent() {
		return this.currentPathIsSilent;
	}

	public async navigateTo(path: string, options: RouterOptions = {}) {
		if (this.checkReload(path)) {
			window.location.href = path;

			return;
		}

		const previousPath = this.currentPath;
		const previousSearch = this.currentSearch;
		const { search = '', trackingData, silent, replace, popEvent } = options;
		const eventData = { path, search, silent, previousSearch, previousPath, replace, popEvent };

		return new Promise<void>((resolve, reject) => {
			const startedAt = Date.now();

			this.emitBeforeNavigate(eventData);

			if (this.isHistoryBlocked()) {
				// imitate navigation so the blocking callback gets triggered
				const parsedPath = { pathname: '', search: '', hash: '', ...parsePath(path) };
				this.history[replace ? 'replace' : 'push'](parsedPath, { hasBeenBlocked: true });

				trackRouteChange({
					startedAt,
					status: 'blocked',
					path: this.currentBasePath,
					previousPath: this.previousBasePath,
				});

				return reject(this.navigationBlockedCallbackResult);
			}

			if (path?.match(/^https?:/)) {
				logger.warn(`navigateTo should not be called with an absolute URL: (${path})`);

				trackRouteChange({
					startedAt,
					status: 'fallback-external-url',
					path: this.currentBasePath,
					previousPath: this.previousBasePath,
				});

				window.open(path);

				return resolve();
			}

			if (path?.match(/^\/(.*)$/)) {
				const { pathname: previousPathname } = parsePath(previousPath);
				const { pathname } = parsePath(path);
				const searchChanged = search !== previousSearch;
				const pathChanged = pathname !== previousPathname;

				if (searchChanged) {
					this.emitSearchChange(eventData);
				}

				if (pathChanged) {
					this.emitRouteChange({
						...eventData,
						// Avoid creating two history records in case we need to also emit routeChange
						replace: searchChanged || replace,
					});
				}
			} else if (path?.match(/#[a-z]+/)) {
				logger.remote('info', `Hash routing triggered`, path);

				const searchParams = new URLSearchParams(search);
				const params = {};

				searchParams.forEach((value, key) => {
					params[key] = value;
				});

				this.emitHashChange({ ...eventData, trackingData: { ...trackingData, ...params } });
			}

			trackRouteChange({
				startedAt,
				status: 'success',
				path: this.currentBasePath,
				previousPath: this.previousBasePath,
			});

			return resolve();
		});
	}

	/**
	 * Currently needed to have similar structure to webappAPI's router.
	 *
	 * @deprecated
	 */
	public async go(event: Event, url, replace, silent, trackingData) {
		if (event && event.defaultPrevented) {
			return;
		}

		await this.navigateTo(url, { replace, trackingData, silent });
	}

	public blockNavigation(navigationBlockedCallback = () => {}) {
		if (this.historyUnblock) {
			throw new Error('Navigation is already blocked, unblock it first');
		}

		this.navigationBlockedCallback = navigationBlockedCallback;

		this.historyUnblock = this.history.block((transition) => {
			this.historyRestoreBlockedNavigation = transition.retry;
			this.navigationBlockedCallbackResult = navigationBlockedCallback();
		});
	}

	public unblockNavigation() {
		if (this.historyUnblock) {
			this.historyUnblock();
			this.historyUnblock = null;
		}
		this.navigationBlockedCallbackResult = null;
	}

	public async restoreBlockedNavigation() {
		this.unblockNavigation();
		if (this.historyRestoreBlockedNavigation) {
			this.historyRestoreBlockedNavigation();
			this.historyRestoreBlockedNavigation = null;
		}
	}

	public matchPath(pattern, path) {
		return routerMatchPath(pattern, path);
	}

	public getCurrentPath(): string {
		return this.currentPath;
	}

	public getPreviousPath(): string {
		return this.previousPath;
	}

	public getCurrentSearch(): string {
		return this.currentSearch;
	}

	public getPreviousSearch(): string {
		return this.previousSearch;
	}

	public updateBasePath(basePath: string): void {
		if (basePath === this.currentBasePath) {
			return;
		}

		this.previousBasePath = this.currentBasePath;
		this.currentBasePath = basePath;
	}

	public once(eventName: EventName, handler: (event) => any) {
		return this.events.once(eventName, handler);
	}

	public on(eventName: EventName, handler: (event) => any) {
		return this.events.on(eventName, handler);
	}

	public off(eventName: EventName, handler: (event) => any) {
		this.events.off(eventName, handler);
	}

	public setReloadOnLeave(path: string) {
		this.reloadOnLeave = path;
	}
}

export default new FrootRouter();
