import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './inline-editor.scss';
import unescapeText from 'lodash/unescape';
import { PdWysiwyg, MergeFieldsPlugin } from '@pipedrive/pd-wysiwyg';

const setContentDirection = (editor) => {
	const rtlRegex = /[\u0591-\u07FF]/;
	const isRtl = rtlRegex.test(editor.textContent);

	if (isRtl) {
		editor.setAttribute('dir', 'rtl');
	} else {
		editor.removeAttribute('dir');
	}
};

class InlinePlugin {
	constructor(options) {
		this.editorEl = options.editorEl;
		this.eventHandler = options.eventHandler;

		this.eventHandler.addEvent(this.editorEl, 'paste.inlinePlugin', (ev) => this.onPaste(ev));
		this.eventHandler.addEvent(this.editorEl, 'keyup.inlinePlugin', () => this.onKeyUp());
	}

	onPaste(ev) {
		ev.stopPropagation();
		ev.preventDefault();
		document.execCommand(
			'insertText',
			false,
			this.removeEmptySpaces(ev.clipboardData.getData('Text'))
		);

		return false;
	}

	onKeyUp() {
		setContentDirection(this.editorEl);
	}

	removeEmptySpaces(text) {
		const re = new RegExp(String.fromCharCode(160), 'g');

		return text.replace(/\r?\n|\r/g, ' ').replace(re, ' ');
	}

	onParseContent(editorEl) {
		editorEl.innerText = this.removeEmptySpaces(editorEl.innerText);
	}

	onInsert() {
		setContentDirection(this.editorEl);
	}
}

class InlineContentEditor extends PdWysiwyg {
	getParsedContent(options) {
		return unescapeText(super.getParsedContent(options));
	}
}

const InlineEditor = React.memo(
	React.forwardRef(({ onFocus, onBlur, className, placeholder, testId }, ref) => {
		const editor = useRef(null);
		const classNames = ['inlineEditor'];

		if (className) {
			classNames.push(className);
		}

		useLayoutEffect(() => {
			if (!editor.current || ref.current) {
				return;
			}

			ref.current = new InlineContentEditor({
				editorEl: editor.current,
				placeholder,
				defaultEventsEnabled: {
					paste: false,
					keydown: false,
					keyup: false
				},
				plugins: [MergeFieldsPlugin, InlinePlugin]
			});

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [editor.current, ref]);

		return (
			<div
				className={classNames.join(' ')}
				ref={editor}
				onFocus={onFocus}
				onBlur={onBlur}
				data-ui-test-id={testId}
			></div>
		);
	})
);

InlineEditor.propTypes = {
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	className: PropTypes.string,
	placeholder: PropTypes.string,
	testId: PropTypes.string
};

export default InlineEditor;
