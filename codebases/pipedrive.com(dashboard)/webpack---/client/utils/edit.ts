import { EditModes } from './constants';
import _ from 'lodash';

export function getEditMode(pathName: string = document.location.pathname) {
	const pathParts = _.split(pathName, '/');
	const editPath = pathParts[3];

	let editMode = EditModes.OFF;

	if (editPath === 'edit') {
		editMode = EditModes.EDIT;
	} else if (editPath === 'add') {
		editMode = EditModes.CREATE;
	}

	return editMode;
}
