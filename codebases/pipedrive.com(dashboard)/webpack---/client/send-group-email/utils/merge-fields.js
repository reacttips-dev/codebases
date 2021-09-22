import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { MergeFieldsPlugin } from '@pipedrive/pd-wysiwyg';

export const validateMergeFields = (editors, messages, setRecipientFieldErrors) => {
	const validateMergeFields = () => {
		const inputs = [];

		editors.forEach((editor) => inputs.push(...editor.getElementsByTagName('input')));

		const usedFields = inputs
			.map((input) => ({ ...input.dataset }))
			.filter((dataset) => !['placeholder', 'user'].includes(dataset.pipefield));

		const messageErrors = messages.map((message) =>
			usedFields.filter(({ pipefield: field, pipefieldkey: key }) => {
				// example: in case merge field is "deal owner", field is "deal" and key is "owner"
				const mergeFieldItem = message[field];

				if (!mergeFieldItem || !mergeFieldItem[key]) {
					return true;
				}
			})
		);

		setRecipientFieldErrors((errors) => {
			if (isEqual(errors, messageErrors)) {
				return errors;
			}

			return messageErrors;
		});
	};
	const onElementChange = debounce(validateMergeFields, 250);

	validateMergeFields();

	// Add listeners
	editors.forEach((element) => {
		element.addEventListener('input', onElementChange);
	});

	// Return a function to remove listeners
	return () => {
		editors.forEach((element) => {
			element.removeEventListener('input', onElementChange);
		});
	};
};

export const hasEmptyPlaceholders = (editor, editorElements = []) => {
	return !!editorElements.find((editorElement) => {
		return editor.callPluginMethod(MergeFieldsPlugin.name, 'checkForEmptyFields', [
			editorElement
		]);
	});
};

export const getMergeFieldCounts = (editor) => {
	const composerInputTypeCounts = editor.callPluginMethod(
		MergeFieldsPlugin.name,
		'getInputTypeCounts'
	);
	const data = {
		personInputCount: composerInputTypeCounts.person || 0,
		dealInputCount: composerInputTypeCounts.deal || 0,
		orgInputCount: composerInputTypeCounts.organization || 0,
		otherInputCount: composerInputTypeCounts.user || 0
	};

	data.totalCount =
		data.personInputCount + data.dealInputCount + data.orgInputCount + data.otherInputCount;

	return data;
};
