import {
	getPipelineAttributeStatus,
	getStageAttributeChangedCount,
	getAddedStagesLength,
	getActiveStagesLength,
} from './pipelineData';
import {
	getDefaultPipelineName,
	getDefaultPipelineDealProbability,
	getDefaultPipelineStageNames,
	getDefaultStage,
} from './defaultPipeline';
import { getSelectedPipelineId, getStagesCount } from '../selectors/pipelines';
import {
	getAllDealsCount,
	getDealsWithoutScheduledActivityCount,
	getDealsWithActivitiesDueInFutureCount,
	getDealsWithActivitiesDueTodayCount,
	getDealsWithActivitiesOverdueCount,
	getRottenDealsCount,
	hasMoreDeals,
} from '../selectors/deals';
import { getSelectedFilter } from '../selectors/filters';
import { Translator } from '@pipedrive/react-utils';

export function getPipelineEditedAndCanceledMetrics(
	originalPipeline: Pipedrive.Pipeline,
	updatedPipeline: Pipedrive.Pipeline,
	extraData: {
		entryPoint: string;
		draggedStatus: boolean;
		isScrollable: boolean;
		scrolledStatus: boolean;
	},
) {
	return {
		pipeline_id: originalPipeline.id,
		entry_point: extraData.entryPoint,
		pipeline_name_edited: getPipelineAttributeStatus(originalPipeline, updatedPipeline, 'name'),
		pipeline_probability_toggled: getPipelineAttributeStatus(originalPipeline, updatedPipeline, 'deal_probability'),
		added_stages_count: getAddedStagesLength(updatedPipeline),
		deleted_stages_count: Object.values(updatedPipeline.stages).reduce((count, stage) => {
			if (!stage.active_flag) {
				return count + 1;
			}

			return count;
		}, 0),
		stage_name_edit_count: getStageAttributeChangedCount(originalPipeline, updatedPipeline, 'name'),
		stage_probability_edit_count: getStageAttributeChangedCount(
			originalPipeline,
			updatedPipeline,
			'deal_probability',
		),
		stage_rotting_edit_count: getStageAttributeChangedCount(originalPipeline, updatedPipeline, 'rotten_flag'),
		stage_sequence_edited: extraData.draggedStatus,
		stage_count: getActiveStagesLength(updatedPipeline),
		is_horizontal_scroll_possible: extraData.isScrollable,
		horizontal_scroll_peformed: extraData.scrolledStatus,
	};
}

export function getPipelineReorderedMetrics(pipelineCount: number, reorderedPipelinesCount: number) {
	return {
		pipeline_count: pipelineCount,
		reordered_pipelines_count: reorderedPipelinesCount,
	};
}

export function getPipelineDeletedMetrics(pipeline: Pipedrive.Pipeline, dealCount: number, dealsResolution: string) {
	return {
		pipeline_id: pipeline.id,
		deal_count: dealCount,
		deals_resolution: dealsResolution,
	};
}

export function getPipelineAddedAndCanceledMetrics(
	updatedPipeline: Pipedrive.Pipeline,
	translator: Partial<Translator>,
	extraData: {
		draggedStatus: boolean;
		isScrollable: boolean;
		scrolledStatus: boolean;
	},
) {
	const defaultStageNames = getDefaultPipelineStageNames(translator);
	const defaultStage = getDefaultStage();
	const defaultStagesCount = Object.values(updatedPipeline.stages).filter((stage: Pipedrive.Stage) => {
		return defaultStageNames.includes(stage.name) && stage.active_flag;
	}).length;
	const customStagesCount = getActiveStagesLength(updatedPipeline) - defaultStagesCount;

	return {
		pipeline_name_edited: updatedPipeline.name === getDefaultPipelineName(translator) ? 'no' : 'yes',
		pipeline_probability_toggled:
			updatedPipeline.deal_probability === getDefaultPipelineDealProbability() ? 'no' : 'yes',
		stage_probability_edit_count: Object.values(updatedPipeline.stages).filter(
			(stage: Pipedrive.Stage) => stage.active_flag && stage.deal_probability !== defaultStage.deal_probability,
		).length,
		stage_rotting_edit_count: Object.values(updatedPipeline.stages).filter(
			(stage: Pipedrive.Stage) => stage.active_flag && stage.rotten_flag !== defaultStage.rotten_flag,
		).length,
		stages_reordered: extraData.draggedStatus,
		default_stages_count: defaultStagesCount,
		custom_stages_count: customStagesCount,
		is_horizontal_scroll_possible: extraData.isScrollable,
		horizontal_scroll_peformed: extraData.scrolledStatus,
	};
}

export function getPipelineViewOpenedMetrics(state: PipelineState) {
	const selectedPipelineId = getSelectedPipelineId(state);
	const selectedFilter = getSelectedFilter(state);

	return {
		pipeline_id: selectedPipelineId,
		stage_count: getStagesCount(state, selectedPipelineId),
		deal_count: getAllDealsCount(state),
		deals_without_next_activity_count: getDealsWithoutScheduledActivityCount(state),
		deals_with_activities_due_in_future_count: getDealsWithActivitiesDueInFutureCount(state),
		deals_with_activity_due_today_count: getDealsWithActivitiesDueTodayCount(state),
		deals_with_overdue_activity_count: getDealsWithActivitiesOverdueCount(state),
		rotting_deal_count: getRottenDealsCount(state),
		pipeline_has_more_deals_to_load: hasMoreDeals(state),
		filter_type: selectedFilter.type,
		filter_value: selectedFilter.value,
	};
}
