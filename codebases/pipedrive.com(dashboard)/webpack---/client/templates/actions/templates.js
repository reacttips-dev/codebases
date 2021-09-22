import update from 'immutability-helper';
import { isFunction, orderBy, isEqual } from 'lodash';
import {
	apiGetTemplates,
	apiPutTemplate,
	apiPostTemplate,
	apiDeleteTemplate
} from '../../api/index';
import { storeAttachmentsTemplateId } from './attachments';
import { actionTypes } from '../../shared/constants/action-types';
import { getSortedMailTemplates } from '../../shared/helpers/mail-templates';
import { asyncForEach } from '../../utils/helpers';

export const getTemplates = () => (dispatch, getState) => {
	if (getState().fetchingTemplates) {
		return false;
	}

	dispatch({ type: actionTypes.GET_TEMPLATES_REQUEST });
	apiGetTemplates(getState().userSelf.get('language').language_code, {
		success: (data) => {
			const sortedTemplates = getSortedMailTemplates(data, getState().templatesOrder);

			dispatch({
				type: actionTypes.SET_TEMPLATES_DATA,
				data: sortedTemplates
			});
			dispatch({ type: actionTypes.GET_TEMPLATES_SUCCESS });
		},
		error: () => {
			dispatch({ type: actionTypes.GET_TEMPLATES_ERROR });
		}
	});
};
export const saveTemplatesOrder = (templates, userSettings) => (dispatch) => {
	if (userSettings) {
		const order = templates.map((t) => t.id);

		userSettings.save(
			{ email_templates_order: order },
			{
				success: () => {
					dispatch({
						type: actionTypes.SET_TEMPLATES_ORDER,
						order
					});
				}
			}
		);
	}
};
/**
 * Changes templates array order according to given item
 * And changes email_templates_order map in user settings
 * @param {Object} options
 * @param {Object} options.id - template id
 * @param {Number} options.newIndex - template new index in array
 * @param {Object} [options.userSettings] - pass userSelf.settings if order should be stored
 */
export const changeOrder = (options) => (dispatch, getState) => {
	const newIndex = options.newIndex;
	const state = getState();

	let oldIndex;

	const template = state.templates.find((template, index) => {
		if (template.id === options.id) {
			oldIndex = index;

			return template;
		}
	});

	const reorderedTemplates = update(state.templates, {
		$splice: [
			[oldIndex, 1],
			[newIndex, 0, template]
		]
	});

	dispatch({
		type: actionTypes.SET_TEMPLATES_DATA,
		data: reorderedTemplates
	});

	dispatch(saveTemplatesOrder(reorderedTemplates, options.userSettings));
};
export const setInitialTemplatesOrder = (userSettings) => (dispatch) => {
	const order = userSettings.get('email_templates_order') || [];

	dispatch({
		type: actionTypes.SET_TEMPLATES_ORDER,
		order
	});
};
/**
 * Posts and adds new template to state
 * @param {Object} payload - payload containing template data
 * @param {Function} callback - callback when POST request is done
 */
export const addNewTemplate = (payload, userSettings, callback) => (dispatch, getState) => {
	dispatch({ type: actionTypes.SAVE_TEMPLATE_REQUEST });

	apiPostTemplate({
		payload,
		success: async (template) => {
			const attachmentrequests = getState().attachments.requests;

			if (isFunction(attachmentrequests.finally)) {
				// wait until attachments are uploaded, if upload still in progress.
				await attachmentrequests.finally();
			}

			await dispatch(storeAttachmentsTemplateId(template.id));

			template = {
				...template,
				has_attachments: payload.has_attachments
			};

			const data = update(getState().templates, { $push: [template] });

			dispatch({
				type: actionTypes.SET_TEMPLATES_DATA,
				data
			});
			dispatch(changeOrder({ id: template.id, newIndex: data.length - 1, userSettings }));
			dispatch({ type: actionTypes.SAVE_TEMPLATE_REQUEST_SUCCESS });

			callback(template);
		},
		error: (error) => {
			dispatch({
				type: actionTypes.SAVE_TEMPLATE_REQUEST_ERROR,
				errorText: getState().translator.gettext(
					'Something went wrong, please try again later.'
				),
				errorCause: error
			});
		}
	});
};
export const editTemplate = (payload, callback) => (dispatch, getState) => {
	dispatch({ type: actionTypes.SAVE_TEMPLATE_REQUEST });
	apiPutTemplate(payload.id, {
		payload,
		success: async (template) => {
			const data = getState().templates.map((existingTemplate) => {
				if (existingTemplate.id === payload.id) {
					return {
						...template,
						has_attachments: payload.has_attachments
					};
				}

				return existingTemplate;
			});

			await dispatch(storeAttachmentsTemplateId(template.id));

			dispatch({
				type: actionTypes.SET_TEMPLATES_DATA,
				data
			});
			dispatch({ type: actionTypes.SAVE_TEMPLATE_REQUEST_SUCCESS });

			if (isFunction(callback)) {
				return callback();
			}
		},
		error: (err) => {
			dispatch({
				type: actionTypes.SAVE_TEMPLATE_REQUEST_ERROR,
				errorText: 'Something went wrong, please try again',
				errorCause: err
			});
		}
	});
};
/**
 * Deletes given templates from state and BE by id
 * @param {Array} [ids] - ids of templates to delete
 * @param {Function} [callback] - callback function to call if request done
 */
export const deleteTemplates = (ids = [], callback) => async (dispatch, getState) => {
	const translator = getState().translator;

	let confirmationText;

	if (ids.length > 1) {
		confirmationText = translator.gettext(
			"Are you sure you want to delete these templates? You can't undo this action."
		);
	} else {
		confirmationText = translator.gettext(
			"Are you sure you want to delete this template? You can't undo this action."
		);
	}

	if (!confirm(confirmationText)) {
		return;
	}

	dispatch({
		type: actionTypes.DELETE_TEMPLATES_REQUEST,
		ids
	});

	const successIds = [];
	const templates = getState().templates;

	// can be changed to Promise.all if delete deadlocks (order_nr) are removed or create delete LIST endpoint
	await asyncForEach(ids, async (id) => {
		try {
			const response = await apiDeleteTemplate(id);

			if (response.status === 200) {
				successIds.push(id);
			}
		} catch (e) {
			dispatch({
				type: actionTypes.DELETE_TEMPLATES_ERROR,
				errorText: getState().translator.gettext(
					'Something went wrong, please try again later.'
				),
				errorCause: e
			});
		}
	});
	const data = templates.filter((template) => !successIds.includes(template.id));

	dispatch({
		type: actionTypes.SET_TEMPLATES_DATA,
		data
	});
	dispatch({ type: actionTypes.DELETE_TEMPLATES_SUCCESS });

	if (isFunction(callback)) {
		return callback();
	}
};

export const getSortedByName = (temp, key) => {
	const orderAsc = orderBy(temp, [(template) => template[key].toLowerCase()], ['asc']);
	const orderDesc = orderBy(temp, [(template) => template[key].toLowerCase()], ['desc']);

	return [orderAsc, orderDesc];
};

export const getSortedByDate = (temp, key) => {
	const orderAsc = orderBy(temp, [(template) => new Date(template[key])], ['asc']);
	const orderDesc = orderBy(temp, [(template) => new Date(template[key])], ['desc']);

	return [orderAsc, orderDesc];
};

// sets order of sorting
export const setOrderedByState = (key, isOrderAsc) => (dispatch) => {
	if (key === 'name') {
		dispatch({
			type: actionTypes.TEMPLATES_ORDERED_BY_NAME_ASC,
			order: isOrderAsc
		});
	} else {
		dispatch({
			type: actionTypes.TEMPLATES_ORDERED_BY_DATE_ASC,
			order: isOrderAsc
		});
	}
};

// checks if templates list is already sorted or not
export const checkTemplatesOrder = (key) => (dispatch, getState) => {
	const templates = getState().templates;
	// get sorted templates based on key value
	const sortedTemplateList =
		key === 'name' ? getSortedByName(templates, key) : getSortedByDate(templates, key);

	// extract asc/desc lists
	const orderAsc = sortedTemplateList[0];
	const orderDesc = sortedTemplateList[1];

	if (isEqual(orderAsc, templates)) {
		dispatch(setOrderedByState(key, false));

		return true;
	} else if (isEqual(orderDesc, templates)) {
		dispatch(setOrderedByState(key, true));

		return true;
	} else {
		dispatch(setOrderedByState(key, true));

		return false;
	}
};

// sorts the templates list and saves the new order
export const sortTemplatesBy = (key, userSettings) => (dispatch, getState) => {
	let sortedTemplates;

	const templates = getState().templates;

	// get sorted templates based on key value
	const sortedTemplateList =
		key === 'name' ? getSortedByName(templates, key) : getSortedByDate(templates, key);

	// extract asc/desc lists
	const orderAsc = sortedTemplateList[0];
	const orderDesc = sortedTemplateList[1];

	// check if list is already sorted and decide which sorted list to apply
	if (isEqual(orderAsc, templates)) {
		dispatch(setOrderedByState(key, false));
		sortedTemplates = orderDesc;
	} else if (isEqual(orderDesc, templates)) {
		dispatch(setOrderedByState(key, true));
		sortedTemplates = orderAsc;
	} else {
		dispatch(setOrderedByState(key, true));
		sortedTemplates = orderAsc;
	}

	dispatch({
		type: actionTypes.SET_TEMPLATES_DATA,
		data: sortedTemplates
	});

	dispatch(saveTemplatesOrder(sortedTemplates, userSettings));
};
