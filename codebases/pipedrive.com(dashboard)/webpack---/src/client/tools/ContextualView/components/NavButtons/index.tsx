import { Button, Icon, Panel as CuiPanel, Tooltip } from '@pipedrive/convention-ui-react';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ViewState } from '../../store/types';
import { useDrawerHotkeys } from '../../../../hooks/useHotkeys';
import { TooltipContentWithKeyboardShortcut } from '../../../../components/KeyboardShortcut';
import { ApiContext } from '../../utils/ApiContext';

export const buttonAreaWidth = 48;

const Panel = styled(CuiPanel)`
	width: 40px;
	height: 104px;
	top: 8px;
	left: -${buttonAreaWidth}px; //relative positioning to the parent -width - margin
	border-radius: 8px;
	position: absolute;
	display: flex;
	flex-direction: column;
	// this element prevents area between buttons and drawer being clickable
	&::before {
		display: block;
		content: '';
		width: calc(100% + 8px);
		height: calc(100% + 8px);
		position: absolute;
		top: -8px;
		left: 0;
	}
`;

export const NavButtons = () => {
	const { translator, metrics } = useContext(ApiContext);
	const { onClose, onPrevious, onNext } = useSelector((s: ViewState) => s.options);

	const handleClose = () => {
		onClose?.();
	};
	const handleNext = (isKeyboardEvent = false) => {
		const { selectedTabType, selectedTabSubType, hasDataForSelectedTab } = onNext()?.trackingData || {};

		metrics.trackUsage(null, 'contextual_view_next', 'opened', {
			is_from_keyboard_shortcut: isKeyboardEvent,
			collection_item: selectedTabSubType || selectedTabType,
			is_collection_item_linked: hasDataForSelectedTab,
		});
	};
	const handlePrev = (isKeyboardEvent = false) => {
		const { selectedTabType, selectedTabSubType, hasDataForSelectedTab } = onPrevious()?.trackingData || {};

		metrics.trackUsage(null, 'contextual_view_previous', 'opened', {
			is_from_keyboard_shortcut: isKeyboardEvent,
			collection_item: selectedTabSubType || selectedTabType,
			is_collection_item_linked: hasDataForSelectedTab,
		});
	};

	useDrawerHotkeys('Escape', () => handleClose());
	useDrawerHotkeys('j', () => handleNext(true), [onNext]);
	useDrawerHotkeys('k', () => handlePrev(true), [onPrevious]);

	return (
		<Panel elevation="16" noBorder spacing="xs">
			<Tooltip
				content={
					<TooltipContentWithKeyboardShortcut keyboardShortcut="Esc">
						{translator.gettext('Close')}
					</TooltipContentWithKeyboardShortcut>
				}
				placement="right"
			>
				<Button color="ghost" onClick={handleClose} disabled={!onClose} data-test="nav-button">
					<Icon icon="cross" />
				</Button>
			</Tooltip>

			<Tooltip
				content={
					<TooltipContentWithKeyboardShortcut keyboardShortcut="K">
						{translator.gettext('Previous')}
					</TooltipContentWithKeyboardShortcut>
				}
				placement="right"
			>
				<Button color="ghost" onClick={() => handlePrev(false)} disabled={!onPrevious} data-test="nav-button">
					<Icon icon="arrow-up" />
				</Button>
			</Tooltip>
			<Tooltip
				content={
					<TooltipContentWithKeyboardShortcut keyboardShortcut="J">
						{translator.gettext('Next')}
					</TooltipContentWithKeyboardShortcut>
				}
				placement="right"
			>
				<Button color="ghost" onClick={() => handleNext(false)} disabled={!onNext} data-test="nav-button">
					<Icon icon="arrow-down" />
				</Button>
			</Tooltip>
		</Panel>
	);
};
