import _ from 'lodash';
import { apiGetLead, apiGetLinkedLead, apiGetSuggestedLeads, apiPutActivity } from '../../api';

export const API_GET_SUGGESTED_LEADS_REQUEST = 'API_GET_SUGGESTED_LEADS_REQUEST';
export const API_GET_SUGGESTED_LEADS_SUCCESS = 'API_GET_SUGGESTED_LEADS_SUCCESS';
export const API_GET_SUGGESTED_LEADS_FAILURE = 'API_GET_SUGGESTED_LEADS_FAILURE';

export const API_GET_LINKED_LEAD_REQUEST = 'API_GET_LINKED_LEAD_REQUEST';
export const API_GET_LINKED_LEAD_SUCCESS = 'API_GET_LINKED_LEAD_SUCCESS';
export const API_GET_LINKED_LEAD_FAILURE = 'API_GET_LINKED_LEAD_FAILURE';

export const API_GET_LEAD_FAILURE = 'API_GET_LEAD_FAILURE';

export const UPDATE_LEAD = 'UPDATE_LEAD';

export const API_MARK_LINKED_LEAD_ACTIVITY_AS_DONE_REQUEST =
	'API_MARK_LINKED_LEAD_ACTIVITY_AS_DONE_REQUEST';
export const API_MARK_LINKED_LEAD_ACTIVITY_AS_DONE_FAILURE =
	'API_MARK_LINKED_LEAD_ACTIVITY_AS_DONE_FAILURE';

export const UNLINK_LEAD = 'UNLINK_LEAD';

export const getSuggestedLeads = (mailPartyIds) => (dispatch) => {
	dispatch({ type: API_GET_SUGGESTED_LEADS_REQUEST });

	apiGetSuggestedLeads(mailPartyIds, {
		success: (suggestedLeads) => {
			dispatch({
				type: API_GET_SUGGESTED_LEADS_SUCCESS,
				data: suggestedLeads
			});
		},
		error: (error) => {
			dispatch({
				type: API_GET_SUGGESTED_LEADS_FAILURE,
				errorMsg: error.message
			});
		}
	});
};

export const getLead = (options, callback) => (dispatch) => {
	const { leadId, linkedLead } = options;

	apiGetLead(leadId, {
		success: (lead) => {
			// add lead custom fields from lead object
			const customFields = {};

			Object.keys(lead).forEach((key) => {
				if (key.match(/^[a-zA-Z0-9]{40}(_\w+)?$/)) {
					Object.assign(customFields, { [key]: lead[key] });
				}
			});

			const linkedLeadData = {
				...linkedLead.node,
				...customFields
			};

			dispatch({
				type: API_GET_LINKED_LEAD_SUCCESS,
				data: linkedLeadData
			});

			if (callback) {
				return callback(linkedLeadData);
			}
		},
		error: (error) => {
			dispatch({
				type: API_GET_LEAD_FAILURE,
				data: error.message
			});
		}
	});
};

export const getLinkedLead = (options, callback) => (dispatch) => {
	const { leadId, noNextActivityAction } = options;

	apiGetLinkedLead(leadId, {
		success: async (linkedLead) => {
			if (_.isFunction(noNextActivityAction)) {
				noNextActivityAction({
					targetObject: {
						type: 'lead',
						id: linkedLead.node.id
					}
				});
			}

			// GQL doesn't return the custom fields values
			// that's why we get lead data via REST API here, not GQL
			await dispatch(getLead({ leadId, linkedLead }, callback));
		},
		error: (error) => {
			dispatch({
				type: API_GET_LINKED_LEAD_FAILURE,
				data: error.message
			});
		}
	});
};

export const getLinkedLeadInitial = (options) => (dispatch) => {
	dispatch({ type: API_GET_LINKED_LEAD_REQUEST });

	dispatch(getLinkedLead(options));
};

export const unlinkLead = () => (dispatch) => {
	dispatch({ type: UNLINK_LEAD });
};

export const markLeadActivityAsDone = (params) => (dispatch, getState) => {
	const linkedLead = _.cloneDeep(getState().linkedLead.data);

	linkedLead.activities[0].loading = true;

	dispatch({
		type: API_MARK_LINKED_LEAD_ACTIVITY_AS_DONE_REQUEST,
		data: linkedLead
	});

	apiPutActivity(linkedLead.activities[0].id, {
		payload: { done: true },
		success: () => {
			dispatch(
				getLinkedLead({
					leadId: linkedLead.id,
					noNextActivityAction: params.noNextActivityAction
				})
			);
		},
		error: () => {
			linkedLead.activities[0].loading = false;

			dispatch({
				type: API_MARK_LINKED_LEAD_ACTIVITY_AS_DONE_FAILURE,
				data: linkedLead
			});
		}
	});
};

export const socketUpdateLead = (activity) => (dispatch, getState) => {
	const currentLead = getState().linkedLead.data;
	const lead = {
		...currentLead,
		activities: [activity]
	};

	dispatch({
		type: UPDATE_LEAD,
		data: lead
	});
};
