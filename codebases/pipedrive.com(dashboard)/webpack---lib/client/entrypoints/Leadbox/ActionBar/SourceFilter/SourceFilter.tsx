import React, { useState } from 'react';
import { Button, Icon, Popover } from '@pipedrive/convention-ui-react';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { useKeyPress } from 'Hooks/useKeyPress';

import type { SourceFilter_data } from './__generated__/SourceFilter_data.graphql';
import { useSourceFilter } from './useSourceFilter';
import { SourceFilterContent } from './SourceFilterContent';
import * as S from './SourceFilter.styles';

interface Props {
	readonly data: SourceFilter_data;
}

export const SourceFilterWithoutData: React.FC<Props> = ({ data }) => {
	const [isOpen, setOpen] = useState(false);

	const { selectedSourceIDs, getButtonPlaceholder, setSearchValue } = useSourceFilter(data);

	const onClose = () => {
		setOpen(false);
		setSearchValue('');
	};

	useKeyPress('Escape', onClose);

	return (
		<S.SourceFilterWrapper data-testid="SourceFilter">
			<Button data-testid="FilterButton" onClick={() => setOpen(true)}>
				<Icon icon="ac-pricetag" size="s" />
				{getButtonPlaceholder(selectedSourceIDs)}
				<Icon icon="triangle-down" size="s" />
			</Button>
			<Popover
				visible={isOpen}
				data-testid="Labels_Popover"
				content={<SourceFilterContent data={data} />}
				onPopupVisibleChange={onClose}
				spacing="none"
				popperProps={{ eventsEnabled: false }}
				placement="bottom-end"
			>
				{/* The following div has to be here, because Popover requires a children and it sets the position of the content */}
				<div />
			</Popover>
		</S.SourceFilterWrapper>
	);
};

export const SourceFilter = createFragmentContainer(SourceFilterWithoutData, {
	data: graphql`
		fragment SourceFilter_data on RootQuery {
			...useSourceFilter_data
			...SourceFilterContent_data
		}
	`,
});
