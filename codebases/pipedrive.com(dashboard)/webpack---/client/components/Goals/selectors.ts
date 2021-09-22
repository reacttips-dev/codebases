export const getGoalsLoadingStatus = (state: PipelineState) => state.goals.isLoading;
export const getGoalsByStagesWithStats = (state: PipelineState) => state.goals.byStagesWithStats;
export const stageHasGoals = (state: PipelineState, stageId: number) =>
	state.goals.stagesWithGoals && state.goals.stagesWithGoals.length && state.goals.stagesWithGoals.includes(stageId);
