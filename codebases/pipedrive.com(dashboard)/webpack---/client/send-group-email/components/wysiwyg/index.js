import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from '@pipedrive/sanitize-html';
import {
	PdWysiwyg,
	MergeFieldsPlugin,
	InlineImagesPlugin,
	ImageResizerPlugin,
	LinkHandlerPlugin,
	ListAutoConverterPlugin,
	Toolbar,
	DefaultToolbar
} from '@pipedrive/pd-wysiwyg';
import { getWysiwygLabels } from '../../../utils/wysiwyg-translations';
import Editor from './editor';
import AttachmentsDropArea from 'shared/components/drag-and-drop-area';
import useStore from '../../store';
import {
	addFiles,
	deleteFile,
	inlineImageDrop,
	inlineImageRemove
} from '../../actions/attachments';
import { APIContext } from 'shared/contexts';
import { useTranslator } from 'utils/translator/translator-hook';

const Wysiwyg = React.forwardRef(({ onFocus }, ref) => {
	const editor = useRef(null);
	const editorWrapper = useRef(null);
	const toolbar = useRef(null);
	const translator = useTranslator();
	const wysiwygLabels = getWysiwygLabels(translator);
	const {
		state: {
			attachments: { files }
		},
		actions
	} = useStore({
		addFiles,
		deleteFile,
		inlineImageDrop,
		inlineImageRemove
	});
	const API = useContext(APIContext);
	const [activeButtons, setActiveButtons] = useState([]);
	const fontPickersEnabled = API.userSelf.companyFeatures.get('wysiwyg_formatting');

	let toolbarButtons = ['bold', 'italic', 'underline', 'link', 'image', 'ul', 'ol', 'remove'];

	if (fontPickersEnabled) {
		toolbarButtons = toolbarButtons.concat([
			'undo',
			'redo',
			'fontfamily',
			'fontsize',
			'fontcolor',
			'outdent',
			'indent',
			'quote',
			'strikethrough'
		]);
	}

	useLayoutEffect(() => {
		if (!editor.current || !toolbar.current || ref.current) {
			return;
		}

		ref.current = new PdWysiwyg({
			editorEl: editor.current,
			toolbarEl: toolbar.current,
			translations: wysiwygLabels,
			trackUsage: API.pdMetrics.trackUsage,
			fontPickersEnabled,
			sanitizePasteData: true,
			useDefaultTooltips: false,
			useEventsDelegation: true,
			sanitizeHtml,
			plugins: [
				[
					InlineImagesPlugin,
					{
						allowImageDropAndPaste: true,
						uploadImage: actions.inlineImageDrop,
						removeImage: () => actions.inlineImageRemove(ref)
					}
				],
				[
					ImageResizerPlugin,
					{
						removeImage: () => actions.inlineImageRemove(ref)
					}
				],
				LinkHandlerPlugin,
				MergeFieldsPlugin,
				ListAutoConverterPlugin
			],
			...(fontPickersEnabled && {
				onToolbarActiveButtonsChange: (buttons) => setActiveButtons([...buttons])
			})
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editor.current, toolbar.current, ref, wysiwygLabels]);

	return (
		<div ref={editorWrapper}>
			<AttachmentsDropArea onDrop={actions.addFiles}>
				<Editor
					contentEditable="true"
					ref={editor}
					attachments={files}
					deleteFile={actions.deleteFile}
					onFocus={onFocus}
				/>
			</AttachmentsDropArea>
			<Toolbar ref={toolbar}>
				<DefaultToolbar
					editorElWrapper={editorWrapper.current}
					translations={wysiwygLabels}
					trackUsage={API.pdMetrics.trackUsage}
					buttons={toolbarButtons}
					fontPickersEnabled={fontPickersEnabled}
					{...(fontPickersEnabled && { activeButtons })}
				/>
			</Toolbar>
		</div>
	);
});

Wysiwyg.propTypes = { onFocus: PropTypes.func };

export default Wysiwyg;
