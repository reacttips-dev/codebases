export const getFirstStageFromPipeline = (stages) =>
	Object.values(stages).reduce((prev: Pipedrive.Stage, curr: Pipedrive.Stage) =>
		prev.order_nr < curr.order_nr ? prev : curr,
	) as Pipedrive.Stage;
