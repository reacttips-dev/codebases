import { Levels } from '@pipedrive/logger-fe';

function isErrorInWhiteListedDomain(errorStack) {
	if (!errorStack) {
		return false;
	}

	const stackFrames = errorStack.split(/\r|\n/gi);
	const lastStackFrame = stackFrames[stackFrames.length - 1];

	// exclude New Relic's wrapper from domain search
	if (lastStackFrame.includes('nrWrapper')) {
		stackFrames.pop();
	}

	const firstFrameWithMessage = stackFrames.slice(0, 2).join('');
	const whiteListedDomains = new RegExp(window.app?.config?.cdnDomain, 'gi');

	return whiteListedDomains.test(firstFrameWithMessage);
}

export default (error: ErrorEvent): Levels => {
	const stack = error.error?.stack;
	const hasErrorStack = typeof stack === 'string';
	const isBlackListedDomain = !isErrorInWhiteListedDomain(stack);
	const isSupportedBrowser = window.app?.supportedBrowser;

	if (!hasErrorStack || isBlackListedDomain || !isSupportedBrowser) {
		return 'info';
	}

	return 'error';
};
