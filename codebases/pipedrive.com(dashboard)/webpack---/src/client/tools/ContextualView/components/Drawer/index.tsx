import React, { useCallback, useContext, useEffect } from 'react';
import { useSelector, useStore } from 'react-redux';
import { Panel as CuiPanel } from '@pipedrive/convention-ui-react';
import styled, { keyframes } from 'styled-components';

import { ViewState } from '../../store/types';
import { unmountDrawer } from '../../store/actions';
import { NavButtons } from '../NavButtons';
import { stackOrder } from '../../../../components/menu/stackOrder';
import useTopSpace from '../../../../utils/useTopSpace';
import { useHotkeysRoot } from '../../../../hooks/useHotkeys';
import WrapperComponent from '../WrapperComponent';
import { ApiContext } from '../../utils/ApiContext';
import getTabItemId from '../../../TabbedComponents/utils/getTabItemId';

const topMenuFallbackHeight = 56;

const open = keyframes`
	from {
		transform: translateX(100%);
		visibility: hidden;
	}
	to {
		transform: translateX(0);
		visibility: visible;
	}
`;

const close = keyframes`
	from {
		transform: translateX(0);
		visibility: visible;
	}
	to {
		transform: translateX(100%);
		visibility: hidden;
	}
`;

export const Wrapper = styled.div<{ hasSidebar: boolean; topMenuHeight: number; visible: boolean }>`
	z-index: ${stackOrder.contextualView};
	position: fixed;
	width: ${(props) => (props.hasSidebar ? '70vw' : '75vw')};
	max-width: 1440px;
	min-width: ${(props) => (props.hasSidebar ? '900px' : '960px')};
	height: calc(100vh - ${(props) => props.topMenuHeight}px);
	top: ${(props) => props.topMenuHeight ?? topMenuFallbackHeight}px;
	right: 0;
	transform: translateX(100%);
	visibility: hidden;
	animation-fill-mode: both;
	animation-name: ${(props) => (props.visible ? open : close)};
	animation-duration: ${(props) => (props.visible ? '300ms' : '250ms')};
	animation-timing-function: ${(props) =>
		props.visible ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'cubic-bezier(0.55, 0.09, 0.68, 0.53)'};
	// this is here so that on unsupported screensize, the navbutton still say visible
	@media (max-width: 1080px) {
		right: auto;
		left: 112px;
	}
`;

export const Panel = styled(CuiPanel)`
	width: 100%;
	height: 100%;
	position: absolute;
	border-radius: 0;
	top: 0;
	right: 0;
	& > .cui4-spacing {
		height: 100%;
	}
`;

export const ScrollContainer = styled.div`
	overflow-y: auto;
	height: 100%;
	display: flex;
	align-items: stretch;
	flex-direction: column;
`;

export const Drawer = () => {
	const store = useStore();
	const { metrics } = useContext(ApiContext);
	const options = useSelector((s: ViewState) => s.options);
	const visible = useSelector((s: ViewState) => s.visible);
	const mounted = useSelector((s: ViewState) => s.mounted);
	const topMenuHeight = useTopSpace();

	const hasSidebar = options?.hasSidebar;

	const getTrackingParameters = () => {
		if (options.componentName === 'froot:TabbedComponents') {
			const tabs = options.componentOptions?.tabs;
			const defaultTab = options.componentOptions?.defaultTab;
			const selectedTab = tabs?.find((tab) => tab.tabType === defaultTab);
			const collectionItemId = getTabItemId(selectedTab);

			return {
				collectionItem: selectedTab?.tabSubType || selectedTab?.tabType,
				collectionItemId,
			};
		}

		// tracking parameters for an untabbed Contextual View will probably
		// need to be fine-tuned once we have a Contextual View of this type
		return {
			collectionItem: options.componentType,
			collectionItemId: options.id,
		};
	};

	useHotkeysRoot();

	useEffect(() => {
		if (visible) {
			const { collectionItem, collectionItemId } = getTrackingParameters();

			metrics.trackUsage(null, 'contextual_view', 'opened', {
				collection_item: collectionItem,
				collection_item_id: collectionItemId,
			});
		}
	}, [visible]);

	const onWrapperAnimationEnd = useCallback(() => {
		if (!visible) {
			store.dispatch(unmountDrawer());
		}
	}, [visible]);

	if (!options || !mounted) {
		return null;
	}

	return (
		<Wrapper
			visible={visible}
			topMenuHeight={topMenuHeight}
			hasSidebar={hasSidebar}
			onAnimationEnd={onWrapperAnimationEnd}
			style={options.customStyle_DO_NOT_USE}
		>
			<NavButtons />
			<Panel elevation="16" noBorder spacing="none">
				<ScrollContainer>
					<WrapperComponent />
				</ScrollContainer>
			</Panel>
		</Wrapper>
	);
};
