import styled from 'styled-components';
import colors from '../../colors.scss';
import fonts from '../../fonts.scss';

export const ToolbarWrapper = styled.div`
	display: flex;
	height: 40px;
	align-items: center;
	background-color: ${colors.toolbarBackground};
	border: 1px solid ${colors.toolbarBorder};
	padding-left: 16px;
	padding-right: 16px;
`;

export const WordWrapped = styled.div`
	word-wrap: break-word;
`;

export const ContentEditable = styled.div`
	outline: none;
	box-sizing: border-box;
	padding: 12px 16px;
	border-bottom: none;
	flex: 2;

	tbody,
	tr,
	td {
		border: 1px solid ${colors.contentEditableTables};
	}

	td {
		line-height: ${fonts.contentEditableLineHeight};
		padding: 6px 8px;
		text-align: left;
	}

	th {
		font-weight: ${fonts.contentEditableFontWeight};
	}

	a {
		color: ${colors.contentEditableLink};
	}

	b,
	strong {
		font-weight: bold;
	}

	em,
	i {
		font-style: italic;
	}

	u {
		text-decoration: underline;
	}

	ul {
		list-style: disc;
	}

	ol {
		list-style: decimal;
	}

	ul,
	ol {
		margin-top: 1em;
		margin-bottom: 1em;
		padding: 0 2.5em 0 2.5em;
		padding-inline-start: 2.5em;
		padding-inline-end: 0;

		ul,
		ol {
			margin-top: 0;
			margin-bottom: 0;
		}
	}

	&.isInline {
		ul,
		ol {
			display: inline;
			margin: 0;
			padding: 0;

			li {
				position: relative;
				display: inline;
				margin-left: 16px;

				&:last-child {
					margin-right: 5px;
				}
			}
		}

		ol {
			counter-reset: numList;
			li {
				&:before {
					position: absolute;
					left: -16px;
					counter-increment: numList;
					content: counter(numList, decimal) '.';
				}
			}
		}

		ul {
			li:before {
				position: absolute;
				left: -14px;
				top: 8px;
				content: '';
				width: 4px;
				height: 4px;
				background: ${colors.contentEditableButtonUnderline};
				border-radius: 2px;
			}
		}

		div {
			display: inline;
		}

		br {
			display: none;
		}
	}

	a[data-mentions] {
		color: ${colors.mentionsColor} !important;
		pointer-events: none;
	}
`;

export const WysiwygMessage = styled.p`
	padding-top: 0;
	margin-top: 4px;
	color: ${colors.fieldMessageColor};
	font: ${fonts.notePlaceholderFont};
`;

export const WysiwygWrapper = styled.div`
	border: 1px solid ${colors.inputBorderColor};
	border-radius: 2px;

	&:focus,
	&:focus-within {
		border-color: ${colors.focusedFieldBorderColor};
	}
`;

export const WysiwygContainer = styled.div`
	max-width: 100%;
	overflow: hidden;
`;
