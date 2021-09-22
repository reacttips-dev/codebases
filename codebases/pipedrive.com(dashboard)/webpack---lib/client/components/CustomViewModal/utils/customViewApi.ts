import axios, { AxiosRequestConfig, Method } from 'axios';
import { CustomViewField, Field } from 'Components/CustomViewModal/types';

import { fieldEquals } from './comparators';

const getCookie = (name: string) => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);

	if (parts.length !== 2) {
		return '';
	}

	const lastPart = parts.pop();

	if (!lastPart) {
		return '';
	}

	return lastPart.split(';').shift();
};

export const getAddedColumns = (oldFields: CustomViewField[], newFields: Field[]) =>
	newFields
		.filter((newField) => !oldFields.some(fieldEquals(newField)))
		.map((field) => `${field.itemType}.${field.key}`);

export const getRemovedColumns = (oldFields: CustomViewField[], newFields: Field[]) => {
	return oldFields
		.filter((oldField) => !newFields.some(fieldEquals(oldField)))
		.map((field) => `${field.itemType}.${field.key}`);
};

export const performRequest = (id: number, method: Method, data: Record<string, unknown>) => {
	const url = `customViews/${id}`;

	const req: AxiosRequestConfig = {
		method,
		url,
		baseURL: '/api/v1/',
		data,
		params: {
			session_token: getCookie('pipe-session-token'),
			strict_mode: true,
		},
	};

	return axios(req);
};

export const preparePayload = (customViewFields: CustomViewField[], fields: Field[]) => {
	const existingFieldsWithoutRemoved = customViewFields.filter((field) => fields.some(fieldEquals(field)));

	const newFields = fields
		.filter((field) => !customViewFields.some(fieldEquals(field)))
		.map<CustomViewField>((field) => ({
			itemType: field.itemType,
			key: field.key,
		}));

	return [...existingFieldsWithoutRemoved, ...newFields].map((field) => ({
		item_type: field.itemType,
		key: field.key,
	}));
};

export async function updateCustomView(
	id: number,
	customViewFields: CustomViewField[],
	fields: Field[],
): Promise<void> {
	const apiFields = preparePayload(customViewFields, fields);

	await performRequest(id, 'patch', {
		fields: apiFields,
	});
}

export async function resetCustomView(id: number): Promise<void> {
	await performRequest(id, 'put', {
		reset_fields: true,
	});
}
