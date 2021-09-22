import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Icon, Spinner } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import Logger from '@pipedrive/logger-fe';
import { useHotkeysWithCustomDispatch } from '../hooks/useHotkeys';
import useToolsContext from '../hooks/useToolsContext';
import { useRootSelector } from '../store';
import { stackOrder } from './menu/stackOrder';
import { MenuLink } from 'src/client/components/menu';
import { TooltipContentWithKeyboardShortcut } from './KeyboardShortcut';
import { toggleSupport, hideSupport } from './Header/helpers';

const SEARCH_KEYBOARD_SHORTCUT = '/';

const SearchWrapper = styled.div`
	position: relative;
	margin-right: 8px;

	#froot-global-search {
		padding: 0;
		background-color: transparent;
		position: relative;

		&.active {
			background-color: transparent;

			input {
				box-shadow: none;
			}
		}
	}

	#froot-global-search input {
		width: 360px;
		height: 40px;
		padding: 5px 8px 6px 36px;
		background-color: ${colors.white};
		border: solid 2px ${colors.black16};
		border-radius: 40px;
		box-sizing: border-box;
		box-shadow: none;
		color: ${colors.black};
		opacity: 1;
		transition: background-color 0.1s ease-in, border 0.1s ease-in;

		&:hover {
			border: solid 2px ${colors.black24};
			box-shadow: none;
		}
		&:focus {
			background-color: ${colors.white};
			border: solid 2px ${colors.blue};

			& + .cui4-icon {
				fill: ${colors.blue};
			}
		}
		&::placeholder {
			color: ${colors.black32};
		}
	}

	#froot-global-search svg {
		pointer-events: none;
		top: 8px;
		left: 8px;
		transition: fill 0.1s ease-in;
	}

	#search-spinner {
		display: none;
	}

	#froot-global-search.searching {
		#search-icon {
			display: none;
		}

		#search-spinner {
			display: block;
			position: absolute;
			top: 12px;
			left: 12px;
		}
	}

	#global-search #search-spinner {
		display: none;
	}
`;

function SearchPlaceholder() {
	const translator = useTranslator();

	return (
		<SearchWrapper>
			<div className="cui4-input cui4-input--icon-left">
				<div id="froot-global-search" data-position="left" className="cui4-input__box">
					<input placeholder={translator.gettext('Search Pipedrive')} disabled />
					<Icon id="search-icon" icon="ac-search" color="black-64" className="cui4-input__icon" />
					<Spinner id="search-spinner" size="s" light />
				</div>
			</div>
		</SearchWrapper>
	);
}

export default function GlobalSearch() {
	const { componentLoader } = useToolsContext();
	const translator = useTranslator();
	const [SearchFE, setSearchFE] = useState(null);

	const {
		items: { secondary },
	} = useRootSelector((s) => s.navigation);

	const globalSearchItem = secondary.find((item) => item.key === 'global-search') as MenuLink;

	if (!globalSearchItem) {
		return null;
	}

	useEffect(() => {
		async function loadSearchFE() {
			try {
				const component = await componentLoader.load('search-fe');

				setSearchFE(component);
			} catch (err) {
				new Logger('search-fe').logError(err, 'Failed to load search-fe into froot');
			}
		}

		loadSearchFE();
	}, []);

	const tooltipProps = {
		content: (
			<TooltipContentWithKeyboardShortcut keyboardShortcut={SEARCH_KEYBOARD_SHORTCUT}>
				{translator.gettext('Search')}
			</TooltipContentWithKeyboardShortcut>
		),
		style: { zIndex: stackOrder.headerTooltip },
	};

	const dispatchWhichPointsToFrootsReduxStore = useDispatch();

	function useSearchHotKey(inputRef) {
		useHotkeysWithCustomDispatch(
			SEARCH_KEYBOARD_SHORTCUT,
			(e) => {
				e.preventDefault();
				inputRef.current?.focus?.();
			},
			dispatchWhichPointsToFrootsReduxStore,
			[],
		);
	}

	if (!SearchFE) {
		return <SearchPlaceholder />;
	}

	return (
		<SearchWrapper>
			<SearchFE
				tooltipProps={tooltipProps}
				useSearchHotKey={useSearchHotKey}
				toggleSupport={toggleSupport}
				hideSupport={hideSupport}
			/>
		</SearchWrapper>
	);
}
