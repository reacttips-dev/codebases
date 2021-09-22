import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Popover, Spinner, Spacing } from '@pipedrive/convention-ui-react';
import { getTotalSummary, getAllCurrencies } from '../../../selectors/summary';
import formatCurrency from '../../../utils/formatCurrency';
import TotalSummaryPopoverContent from '../TotalSummaryPopoverContent';
import { getSelectedPipelineId } from '../../../selectors/pipelines';
import { getSelectedFilter } from '../../../selectors/filters';
import { getUserSetting } from '../../../shared/api/webapp';
import { Container } from './StyledComponents';
import { getViewerState } from '../../../selectors/view';
import { getDealsByStages } from '../../../selectors/deals';
import TotalSummaryRow from './TotalSummaryRow';

interface StateProps {
	dealsByStages: PipelineState['deals']['byStages'];
	isViewer: boolean;
	isClickable: boolean;
	selectedPipelineId: number;
	selectedFilter: Pipedrive.SelectedFilter;
	summary: Pipedrive.TotalSummary;
}

interface OwnProps {
	className?: string;
}

export type TotalSummaryProps = StateProps & OwnProps;

const TotalSummary: React.FunctionComponent<TotalSummaryProps> = (props) => {
	const [isPopoverVisible, setPopoverVisible] = useState<boolean>(false);
	const canSeeDealsListSummary = getUserSetting('can_see_deals_list_summary');
	const hasNoDeals = Object.keys(props.dealsByStages).length <= 0;

	const closePopover = () => {
		setPopoverVisible(false);
	};

	const getDealsSummary = async () => {
		setPopoverVisible(true);
	};

	if (!props.summary.total_count || props.summary.total_count === 0) {
		if (props.isViewer) {
			return null;
		}
		return (
			<Container data-test="summary" isClickable={false}>
				{formatCurrency(0)}
			</Container>
		);
	}

	const renderPopoverContent = () => {
		if (props.summary) {
			return <TotalSummaryPopoverContent summary={props.summary} />;
		}

		return (
			<Spacing all="m">
				<Spinner />
			</Spacing>
		);
	};

	if (props.isViewer && hasNoDeals) {
		return null;
	}

	return (
		<Popover
			className={props.className}
			visible={isPopoverVisible}
			arrow={false}
			placement="bottom"
			content={renderPopoverContent()}
			innerRefProp="ref"
			spacing="none"
			onPopupVisibleChange={(visible) => {
				!visible && closePopover();
			}}
		>
			<Container
				data-test="summary"
				isClickable={props.isClickable && canSeeDealsListSummary}
				onClick={() => {
					if (!props.isClickable || !canSeeDealsListSummary) {
						return false;
					}

					isPopoverVisible ? closePopover() : getDealsSummary();
				}}
			>
				{<TotalSummaryRow summary={props.summary} />}
			</Container>
		</Popover>
	);
};

const mapStateToProps = (state: PipelineState) => {
	return {
		dealsByStages: getDealsByStages(state),
		isViewer: getViewerState(state),
		selectedPipelineId: getSelectedPipelineId(state),
		selectedFilter: getSelectedFilter(state),
		summary: getTotalSummary(state),
		isClickable: getAllCurrencies(state).length > 1,
	};
};

export default connect<StateProps, null, OwnProps>(mapStateToProps)(TotalSummary);
