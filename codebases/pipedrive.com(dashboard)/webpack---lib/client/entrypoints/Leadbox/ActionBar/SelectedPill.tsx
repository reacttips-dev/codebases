import React from 'react';
import { Pill, Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import styled from 'styled-components';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

export const Wrapper = styled.div`
	margin-right: 16px !important;
`;

export const IconWrapper = styled.div`
	display: inline-flex;
	cursor: pointer;
`;

interface IProps {
	readonly resetSelection?: () => void;
}

export const SelectedPill: React.FC<IProps> = (props) => {
	const translator = useTranslator();
	const { selectedRows } = useListContext();

	const discardSelected = () => {
		selectedRows.reset();
		props.resetSelection?.();
	};

	const idsCount = selectedRows.totalSelected;

	if (idsCount === 0) {
		return null;
	}

	return (
		<Wrapper>
			<Pill color="blue">
				<span className="cui4-pill__label" data-testid="SelectedPillText">
					{translator.ngettext('%d selected', '%d selected', idsCount, idsCount)}
				</span>
				<IconWrapper onClick={discardSelected}>
					<Icon size="s" color="white" icon="cross" />
				</IconWrapper>
			</Pill>
		</Wrapper>
	);
};
