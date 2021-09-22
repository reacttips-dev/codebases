import { Button, Icon, Input, Separator, Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import React, { useEffect, useRef, useState } from 'react';
import { LabelColors } from 'Types/types';
import { useKeyPress } from 'Hooks/useKeyPress';

import { ColorPalette } from './ColorPalette/ColorPalette';
import * as S from './LabelsSelectList.styles';

interface Props {
	title: string;
	initName: null | string;
	initColor: null | LabelColors;
	onClose: () => void;
	onSave: (label: { readonly name: string; readonly color: LabelColors }) => void;
	isLoading: boolean;
	inputErrorMessage?: string;
	footerButtons?: React.ReactNode;
}

export const LabelsSelectForm: React.FC<Props> = ({
	title,
	onClose,
	onSave,
	initName,
	initColor,
	inputErrorMessage: initInputErrorMessage,
	isLoading,
	footerButtons,
}) => {
	const [inputValue, setInputValue] = useState(initName);
	const [selectedColor, setSelectedColor] = useState(initColor);
	const [inputErrorMessage, setInputErrorMessage] = useState(initInputErrorMessage);
	const translator = useTranslator();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	useEffect(() => {
		setInputErrorMessage(initInputErrorMessage);
	}, [initInputErrorMessage]);

	const onCloseHandler = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClose();
	};

	const onSaveHandler = async (e: React.MouseEvent | KeyboardEvent) => {
		e.stopPropagation();
		if (!inputValue) {
			setInputErrorMessage(translator.gettext('Label needs to have a name'));
		}
		if (inputValue && selectedColor) {
			onSave({
				name: inputValue,
				color: selectedColor,
			});
		}
	};

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (inputErrorMessage) {
			setInputErrorMessage('');
		}
		setInputValue(e.target.value);
	};

	useKeyPress('Enter', onSaveHandler);

	return (
		<S.CreateEditWrapper>
			<S.Header left="s" right="s" top="s">
				<S.BackButton color="ghost" onClick={onCloseHandler}>
					<Icon icon="arrow-back" size="s" />
				</S.BackButton>
				<S.HeaderText>{title}</S.HeaderText>
			</S.Header>
			<Separator />
			<Spacing top="s" left="m" right="m" bottom="m">
				<label>{translator.gettext('Label name')}</label>
				<Input
					value={inputValue ?? ''}
					onChange={onInputChange}
					inputRef={inputRef}
					placeholder={translator.gettext('Label name')}
					message={inputErrorMessage}
					color={inputErrorMessage ? 'red' : undefined}
				/>
				<label>{translator.gettext('Label color')}</label>
				<ColorPalette
					availableColors={Object.values(LabelColors)}
					selectedColor={selectedColor}
					onChange={setSelectedColor}
				/>
			</Spacing>
			<S.Footer left="m" right="m" bottom="s" top="s">
				<div>{footerButtons}</div>
				<S.FooterButtons>
					<Button onClick={onCloseHandler}>Cancel</Button>
					<Button color="green" onClick={onSaveHandler} loading={isLoading}>
						Save
					</Button>
				</S.FooterButtons>
			</S.Footer>
		</S.CreateEditWrapper>
	);
};
