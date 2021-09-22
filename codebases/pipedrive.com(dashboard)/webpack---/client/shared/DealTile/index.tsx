import { noop, round, isNil } from 'lodash';
import { Avatar, Icon, Tooltip, StageSelector } from '@pipedrive/convention-ui-react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DealTileSizes, FlowCoachmarkTypes } from '../../utils/constants';
import ConditionalTooltip from '../../components/Shared/ConditionalTooltip';
import formatCurrency from '../../utils/formatCurrency';
import { isDealLost, isDealRotten, isDealWon } from '../../utils/dealStatus';
import StatusIndicator from './StatusIndicator';
import StatusPill from './StatusPill';
import {
	DealPanel,
	DealPanelContent,
	Description,
	Left,
	LeftTop,
	Right,
	Bottom,
	DealLabelHoverArea,
	DealLabel,
	Title,
	Value,
	ValueContainer,
	WeightedValueTooltipContainer,
	RowContainer,
	Progress,
} from './StyledComponents';
import { Translator, useTranslator } from '@pipedrive/react-utils';
import { getDealLabelOptions, getStages } from '../../shared/api/webapp';
import { OnActivityPopoverOpenedParam } from './ActivityPopover/ActivityContent';
import { hideFlowCoachmark, addFlowCoachmark, getRecentlyAddedDeal } from '../../utils/flowCoachmarks';
import { getStagesCount } from '../../selectors/pipelines';

export interface DealTileProps {
	key?: number;
	index?: number;
	deal?: Pipedrive.Deal;
	user?: Pipedrive.User | any;
	isClickable?: boolean;
	isLast?: boolean;
	isDragging?: boolean;
	size?: DealTileSizes;
	includeDescription?: boolean;
	includeStageSelector?: boolean;
	popoverBoundariesElement?: HTMLElement;
	renderCustomEmptyActivities?: () => React.ReactElement | null;
	onActivityPopoverOpened?: (param: OnActivityPopoverOpenedParam) => void;
	onActivitySaved?: () => void;
	onActivityMarkedAsDone?: (activity: Pipedrive.Activity) => void;
	onActivityIconClick?: (activityType: string) => void;
	onError?: (error: Error) => void;
	isViewer?: boolean;
	isForecastView?: boolean;
	hideActivities?: boolean;
}

export const getDealContactName = (deal: Pipedrive.Deal, translator: Translator): string | null => {
	if (deal.org_name) {
		return deal.org_name;
	}

	if (deal.person_name) {
		return deal.person_name;
	}

	if (deal.org_hidden || deal.person_hidden) {
		return `(${translator.gettext('hidden')})`;
	}

	// There is a rare case where this can happen. For example in Import it is possible
	// to create deal without person or org.
	// Also Viewer user might not have permission to see it, then this data won't be in response
	return null;
};

export const getDealPanelColor = (deal: Pipedrive.Deal) => {
	if (isDealRotten(deal)) {
		return 'red';
	}

	if (isDealWon(deal)) {
		return 'green';
	}

	if (isDealLost(deal)) {
		return 'gray';
	}

	return null;
};

const getUserAvatar = (isViewer: boolean, user: Pipedrive.User, deal: Viewer.Deal) => {
	if (!isViewer) {
		return <Avatar name={user.name} type="user" img={user.icon_url} size="xs" />;
	}
	if (!isNil(deal.user)) {
		return <Avatar name={deal.user.name} type="user" img={deal.user.pic_url} size="xs" />;
	}
};

// eslint-disable-next-line complexity
const DealTile: React.FunctionComponent<DealTileProps> = (props) => {
	const {
		index,
		deal,
		isClickable = true,
		isLast,
		isDragging,
		size = DealTileSizes.REGULAR,
		user = { name: 'Unknown User', icon_url: null },
		includeDescription,
		includeStageSelector,
		popoverBoundariesElement,
		renderCustomEmptyActivities = () => null,
		onActivityPopoverOpened = noop,
		onActivitySaved = noop,
		onActivityMarkedAsDone = noop,
		onActivityIconClick = noop,
		onError = noop,
		isViewer = false,
		isForecastView = false,
		hideActivities = false,
	} = props;

	const translator = useTranslator();
	const dealTitle = deal.title || `(${translator.gettext('no title')})`;
	const dealLabel = !isViewer && getDealLabelOptions()[deal.label];

	const renderStatusIndicator = () => {
		if (isViewer && hideActivities) {
			return null;
		}
		return (
			<StatusIndicator
				dealTileSize={size}
				isClickable={isClickable}
				deal={deal}
				popoverBoundariesElement={popoverBoundariesElement}
				renderCustomEmptyActivities={renderCustomEmptyActivities}
				onActivityPopoverOpened={onActivityPopoverOpened}
				onActivitySaved={onActivitySaved}
				onActivityMarkedAsDone={onActivityMarkedAsDone}
				onActivityIconClick={onActivityIconClick}
				onError={onError}
				isViewer={isViewer}
			/>
		);
	};

	const percentageValue = round(deal.weighted_value / deal.value, 2) * 100;
	const isRegularTile = size === DealTileSizes.REGULAR;
	const getLink = () => {
		if (isClickable && !isViewer) {
			return `/deal/${deal.id}`;
		}

		return null;
	};

	const lastAddedDealId = getRecentlyAddedDeal();

	const isFirstDealOfFirstStage = () => index === 0 && deal.stage_id === 1;

	const getProgress = (stageOrderNr: number, pipelineId: number): number => {
		const stagesCount: number = useSelector((state: PipelineState) => getStagesCount(state, pipelineId));
		return (stageOrderNr / stagesCount) * 100;
	};

	useEffect(() => {
		if (lastAddedDealId === deal.id) {
			addFlowCoachmark(FlowCoachmarkTypes.DRAG_AND_DROP);
		}
		addFlowCoachmark(FlowCoachmarkTypes.DEAL_DETAILS);
	}, []);

	React.useEffect(() => {
		if (isDragging && deal.id === lastAddedDealId) {
			hideFlowCoachmark(FlowCoachmarkTypes.DRAG_AND_DROP);
		}
	}, [isDragging]);

	return (
		<DealPanel
			className="fs-block"
			data-test="pipeline-deal-tile"
			data-coachmark={lastAddedDealId === deal.id ? 'drag-and-drop' : 'pipeline-deal-tile'}
			data-test-deal-index={index || 0}
			data-test-deal-id={isForecastView ? `forecast-${deal.id}` : deal.id}
			isDragging={isDragging || deal.is_hidden}
			backgroundColor={getDealPanelColor(deal)}
			isLocked={deal.is_locked}
			isLast={isLast}
			isClickable={isClickable}
			size={size}
			elevation="01"
			spacing="none"
			noBorder
		>
			<DealPanelContent>
				<Left {...(isFirstDealOfFirstStage() ? { 'data-coachmark': 'deal-details' } : {})}>
					<LeftTop draggable={false} href={getLink()}>
						{dealLabel && (
							<Tooltip
								placement="top-start"
								content={<span>{dealLabel.label}</span>}
								portalTo={document.body}
								innerRefProp="ref"
							>
								<DealLabelHoverArea>
									<DealLabel color={dealLabel.color} data-test="deal-label" />
								</DealLabelHoverArea>
							</Tooltip>
						)}
						<Title>{dealTitle}</Title>
						{includeDescription && getDealContactName(deal, translator) && (
							<Description>{getDealContactName(deal, translator)}</Description>
						)}
						{!isRegularTile && !isViewer && (
							<RowContainer>
								<StatusPill deal={deal} />
							</RowContainer>
						)}
						{size === DealTileSizes.EXTRA_SMALL && (
							<RowContainer>
								<ConditionalTooltip
									condition={deal.value > 0 && deal.value !== deal.weighted_value}
									placement="bottom-start"
									innerRefProp="ref"
									content={
										<WeightedValueTooltipContainer>
											<Icon icon="weighted" color="white" size="s" />
											<span>{formatCurrency(deal.weighted_value, deal.currency)}</span>
											<span>({percentageValue}%)</span>
										</WeightedValueTooltipContainer>
									}
								>
									<Value>{formatCurrency(deal.value, deal.currency)}</Value>
								</ConditionalTooltip>
							</RowContainer>
						)}
					</LeftTop>
					<ValueContainer size={size}>
						<a href={getLink()}>
							{getUserAvatar(isViewer, user, deal as Viewer.Deal)}

							{isRegularTile && !isViewer && <StatusPill deal={deal} />}
							{size !== DealTileSizes.EXTRA_SMALL && (
								<ConditionalTooltip
									condition={deal.value !== deal.weighted_value}
									placement="bottom-start"
									innerRefProp="ref"
									content={
										<WeightedValueTooltipContainer>
											<Icon icon="weighted" color="white" size="s" />
											<span>{formatCurrency(deal.weighted_value, deal.currency)}</span>
											<span>({percentageValue}%)</span>
										</WeightedValueTooltipContainer>
									}
								>
									{!isNil(deal.value) && <Value>{formatCurrency(deal.value, deal.currency)}</Value>}
								</ConditionalTooltip>
							)}
						</a>
						{!isRegularTile && renderStatusIndicator()}
					</ValueContainer>
				</Left>
				{isRegularTile && <Right>{renderStatusIndicator()}</Right>}
			</DealPanelContent>
			{isForecastView && <Progress progress={getProgress(deal.stage_order_nr, deal.pipeline_id)} />}
			{includeStageSelector && !isViewer && (
				<Bottom>
					<StageSelector size="xs" dealStageId={deal.stage_id}>
						{getStages(deal.pipeline_id).map((stage: Pipedrive.Stage) => (
							<StageSelector.Stage key={stage.id} id={stage.id} dealStageId={stage.id} />
						))}
					</StageSelector>
				</Bottom>
			)}
		</DealPanel>
	);
};

export default DealTile;
