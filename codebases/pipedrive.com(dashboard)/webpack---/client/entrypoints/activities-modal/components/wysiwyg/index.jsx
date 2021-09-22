import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isString, isNil } from 'lodash';
import sanitizeHtml from '@pipedrive/sanitize-html';
import { PdWysiwyg, MentionsPlugin, LinkHandlerPlugin } from '@pipedrive/pd-wysiwyg';
import {
	ToolbarWrapper,
	ContentEditable,
	WordWrapped,
	WysiwygMessage,
	WysiwygWrapper,
	WysiwygContainer,
} from './styles';
import DefaultToolbar from './default-toolbar';

const wrapMessage = (message) => {
	if (isString(message)) {
		return <WysiwygMessage>{message}</WysiwygMessage>;
	}

	return message;
};

class Wysiwyg extends Component {
	constructor(props) {
		super(props);

		this.editorEl = createRef();
		this.toolbarEl = createRef();
		this.wysiwygWrapperDiv = createRef();
		this.wysiwyg = null;
		this.htmlChangeObserver = null;

		this.handleContentChanged = this.handleContentChanged.bind(this);
		this.focusInsideEditor = this.focusInsideEditor.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	focusInsideEditor() {
		if (this.editorEl.current && document.activeElement !== this.editorEl.current) {
			this.editorEl.current.focus();
		}
	}

	initWysiwyg() {
		this.wysiwyg = new PdWysiwyg({
			focusAndPlaceholder: false,
			sanitizePasteData: true,
			editorEl: this.editorEl.current,
			toolbarEl: this.toolbarEl.current,
			useEventsDelegation: true,
			sanitizeHtml,
			plugins: [LinkHandlerPlugin],
		});

		if (this.props.autoFocus) {
			this.editorEl.current.focus();
		}

		if (typeof MutationObserver === 'function') {
			this.htmlChangeObserver = new MutationObserver(() =>
				this.handleContentChanged({
					target: this.editorEl.current,
				}),
			);

			this.htmlChangeObserver.observe(this.editorEl.current, {
				attributes: true,
				childList: true,
				characterData: true,
			});
		}
	}

	componentDidMount() {
		this.initWysiwyg();
	}

	componentWillUnmount() {
		this.htmlChangeObserver && this.htmlChangeObserver.disconnect();
		this.wysiwyg && this.wysiwyg.unload();
	}

	shouldComponentUpdate(props) {
		return (
			props.modalVisible !== this.props.modalVisible ||
			props.value !== this.editorEl.current.innerHTML
		);
	}

	handleContentChanged(e) {
		if (!this.editorEl.current || !this.props.onChange) {
			return;
		}

		MentionsPlugin.removeMentionsStyles(this.editorEl.current);

		const isDefaultText = this.wysiwyg.placeholder === this.editorEl.current.innerHTML;

		if (isDefaultText && !isNil(this.props.placeholder)) {
			return;
		}

		const html = this.editorEl.current.innerHTML;

		if (html === this.lastHtml) {
			return;
		}

		const event = Object.assign({}, e, {
			target: {
				...e.target,
				value: html,
			},
		});

		this.props.onChange(event);
		this.lastHtml = html;
	}

	handleBlur(e) {
		if (!this.props.onBlur) {
			return null;
		}

		const blurredTo = e.relatedTarget;

		if (!this.wysiwygWrapperDiv.current || !blurredTo) {
			return this.props.onBlur(e);
		}

		if (!this.wysiwygWrapperDiv.current.contains(blurredTo)) {
			return this.props.onBlur(e);
		}

		return null;
	}

	render() {
		const {
			message,
			context,
			value,
			placeholder,
			contentEditableClassName,
			className,
			dataTest,
		} = this.props;

		return (
			<WysiwygContainer>
				<WysiwygWrapper>
					{context ? context : null}
					<WordWrapped
						ref={this.wysiwygWrapperDiv}
						onClick={this.focusInsideEditor}
						className={className}
					>
						<ContentEditable
							contentEditable="true"
							dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
							ref={this.editorEl}
							style={{
								minHeight: 56,
							}}
							data-default={placeholder || ''}
							data-test={dataTest}
							onInput={(e) => this.handleContentChanged(e)}
							onBlur={this.handleBlur}
							className={`bodyEditor ${contentEditableClassName || ''}`}
						/>
						<ToolbarWrapper className="editorToolbar" ref={this.toolbarEl}>
							<DefaultToolbar />
						</ToolbarWrapper>
					</WordWrapped>
				</WysiwygWrapper>
				{message ? wrapMessage(message) : null}
			</WysiwygContainer>
		);
	}
}

Wysiwyg.propTypes = {
	value: PropTypes.string,
	placeholder: PropTypes.string,
	message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	context: PropTypes.any,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	className: PropTypes.string,
	contentEditableClassName: PropTypes.string,
	dataTest: PropTypes.string,
	autoFocus: PropTypes.bool,
	modalVisible: PropTypes.bool,
};

export default connect((store) => ({
	modalVisible: store.getIn(['modal', 'visible']),
}))(Wysiwyg);
