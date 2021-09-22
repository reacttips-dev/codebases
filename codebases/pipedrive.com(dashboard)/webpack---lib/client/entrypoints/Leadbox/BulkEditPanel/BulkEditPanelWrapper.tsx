import React, { useEffect } from 'react';
import { useUIContext } from 'Leadbox/useUIContext';
import { Panel } from '@pipedrive/convention-ui-react';
import styled from 'styled-components';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

import { BulkEditPanel } from './BulkEditPanel';

const Wrapper = styled.div<{ isVisible: boolean; topOffset?: number }>`
	box-sizing: border-box;
	height: auto;
	width: 320px;
	bottom: 0;
	${({ topOffset }) => `top: ${topOffset ? topOffset : 112}px`};
	position: fixed;
	right: 0;
	z-index: 3;
	transition-property: transform;
	transition-duration: 0.25s;
	transform: ${({ isVisible }) => (isVisible ? 'translate3d(0,0,0)' : 'translate3d(100%,0,0)')};
	*:not(svg) {
		box-sizing: border-box;
	}
`;

const StyledPanel = styled(Panel)`
	height: 100%;
	> div {
		height: 100%;
	}
`;

interface IProps {
	readonly resetSelection?: () => void;
}

export const BulkEditPanelWrapper: React.FC<IProps> = (props) => {
	const { selectedRows } = useListContext();
	const uiContext = useUIContext();

	// Sidebar should be visible when:
	// 1) select context is active, and
	// 2) user didn't hide the sidebar manually
	useEffect(() => {
		if (selectedRows.hasRowSelected) {
			uiContext.bulkSidebar.show();
		}

		return () => {
			uiContext.bulkSidebar.hide();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedRows.hasRowSelected]);
	const isSidebarVisible = uiContext.bulkSidebar.isVisible;

	const actionBarWrapperElement = document.getElementById('action-bar-wrapper');
	const topOffset = actionBarWrapperElement?.getBoundingClientRect().bottom;

	return (
		<Wrapper data-testid="BulkEditPanelWrapper" isVisible={isSidebarVisible} topOffset={topOffset}>
			<StyledPanel noMargin={true} spacing="none">
				<div className="BulkEditPanelWrapperPortalTo" style={{ width: '10px', position: 'relative' }} />
				{isSidebarVisible && <BulkEditPanel resetSelection={props.resetSelection} />}
			</StyledPanel>
		</Wrapper>
	);
};
