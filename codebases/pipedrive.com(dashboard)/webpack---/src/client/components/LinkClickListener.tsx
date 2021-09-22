import { useCallback, useEffect } from 'react';
import { parsePath } from 'history';

import useToolsContext from '../hooks/useToolsContext';
import useUserDataContext from '../hooks/useUserDataContext';

const shouldUseDefaultClick = (event, aElement, url) => {
	// Check for cmd or ctrl key press, open link in new tab
	const isCmdOrCtrl = event && (event.metaKey || event.ctrlKey) && url.substr(0, 1) !== '#';
	// Having target should always open in the target with standard navigation
	const hasTargetAndIsNotMail = aElement.hasAttribute('target') && !url.startsWith('mailto:');
	// Download links should force a download
	const hasDownload = aElement.hasAttribute('download');

	return isCmdOrCtrl || hasTargetAndIsNotMail || hasDownload;
};

const LinkClickListener = () => {
	const { router } = useToolsContext();
	const { user, mailConnections } = useUserDataContext();

	const handleContextualViewLinkClick = (event: MouseEvent & { target: Element }, url: string) => {
		event.preventDefault();

		const { search } = parsePath(url);

		if (search) {
			const urlParams = new URLSearchParams(search);
			const urlParamsOld = new URLSearchParams(router.getCurrentSearch());

			router.navigateTo(url, {
				search,
				replace: urlParams.get('selected') === urlParamsOld.get('selected'),
			});

			return;
		}

		router.navigateTo(url);
	};

	const handleMailLink = useCallback(
		(event: MouseEvent & { target: Element }, url: string) => {
			if (!mailConnections) {
				return;
			}

			const link = event.target.closest('a');
			const openInNewWindow = link.getAttribute('target') === '_blank';
			const usePipedriveMailtoLinks = user.settings.get('use_pipedrive_mailto_links');
			const hasNylasConnection = mailConnections.hasActiveNylasConnection();

			if (usePipedriveMailtoLinks && hasNylasConnection) {
				url = url.replace('?', '&').replace('mailto:', '/mail/new?to=');

				if (openInNewWindow) {
					event.preventDefault();
					event.stopPropagation();

					window.open(url);
				} else if (!event.defaultPrevented) {
					event.preventDefault();
					event.stopPropagation();

					router.navigateTo(url);
				}
			} else if (!openInNewWindow) {
				event.preventDefault();
				event.stopPropagation();

				// Handles mailto: link without cancelling socket connection
				const win = window.open(url);

				if (win) {
					setTimeout(() => win.close(), 100);
				}
			}
		},
		[mailConnections],
	);

	const onClick = (event) => {
		const aElement = event.target.closest('a');
		const inputElement = event.target.closest('input');

		if (!aElement || inputElement?.type === 'file') {
			return;
		}

		const url = aElement
			.getAttribute('href')
			?.replace(/[^\x20-\x7E]/gim, ' ') // replace non-printing characters with spaces
			?.trim();

		if (!url) {
			return;
		}

		if (shouldUseDefaultClick(event, aElement, url)) {
			return true;
		}

		const sameDomain = /^[/#?](.*)$/.test(url);

		if (url === '#') {
			event.preventDefault();
		} else if (aElement.dataset.contextualView === 'true') {
			handleContextualViewLinkClick(event, url);
		} else if (sameDomain) {
			event.preventDefault();

			const { search } = parsePath(url);

			if (search) {
				router.navigateTo(url, { search });

				return;
			}

			router.navigateTo(url);
		} else if (url.match(/^mailto:/)) {
			handleMailLink(event, url);
		}
	};

	useEffect(() => {
		if (!user) {
			return;
		}

		document.body.addEventListener('click', onClick);

		return () => {
			document.body.removeEventListener('click', onClick);
		};
	}, [user]);

	return null;
};

export default LinkClickListener;
