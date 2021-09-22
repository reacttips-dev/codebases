import { get } from '@pipedrive/fetch';

const fetchDealData = async (dealId) => {
	const {data: deal} = await get(`/api/v1/deals/${dealId}`);
	const {data: participantsResponse} = await get(`/api/v1/deals/${dealId}/participants`);
	const {data: stagesResponse} = await get(`/api/v1/stages`);

	const stages = stagesResponse.filter(stage => stage.pipeline_id === deal.pipeline_id);
	const participants = participantsResponse && participantsResponse.map(({ person: { name, id }}) => {
		return {name, id};
	});

	return { ...deal, stages, participants };
};

export default fetchDealData;