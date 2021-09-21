import React, { useState, forwardRef } from 'react';
import { RichTextEditor } from './components/RichTextEditor';
import { FieldRichTextEditorProps } from './types';
import {
  Label,
  HeaderContainer,
  ToggleWrapper,
  ModeToggleText,
  Textarea,
  TextEditorWrapper,
  ErrorText,
  Addons,
  RightAddons,
  Header,
  Root,
} from './styles';

const FieldRichTextEditor = forwardRef(
  (
    {
      name,
      onChange,
      value,
      error,
      isShowingError = !!error,
      label,
      placeholder,
      maxLength,
      className,
    }: FieldRichTextEditorProps,
    ref: React.Ref<HTMLTextAreaElement>
  ) => {
    const [isShowingRichTextEditor, setIsShowingRichTextEditor] = useState(
      true
    );

    const [isShowingFocusStyles, setisShowingFocusStyles] = useState(false);

    const onPressEditorModeToggle = () => {
      setIsShowingRichTextEditor(!isShowingRichTextEditor);
    };

    const toggleFocusStyles = () => {
      setisShowingFocusStyles(!isShowingFocusStyles);
    };

    return (
      <Root className={className}>
        <Label htmlFor={name}>
          <HeaderContainer>
            <Header>{label}</Header>
            <ToggleWrapper>
              <ModeToggleText onClick={onPressEditorModeToggle} type="button">
                {isShowingRichTextEditor
                  ? 'Switch to HTML'
                  : 'Switch to rich text'}
              </ModeToggleText>
            </ToggleWrapper>
          </HeaderContainer>
        </Label>
        {isShowingRichTextEditor ? (
          <TextEditorWrapper
            isShowingError={isShowingError}
            isShowingFocusStyles={isShowingFocusStyles}
          >
            {/* TODO https://anchorfm.atlassian.net/browse/WHEEL-802: Pass ref to the RichTextEditor component */}
            <RichTextEditor
              onBlur={toggleFocusStyles}
              onFocus={toggleFocusStyles}
              maxCharacterLength={maxLength}
              onChange={onChange as (e: unknown) => void}
              placeholder={placeholder}
              value={value}
            />
          </TextEditorWrapper>
        ) : (
          <Textarea
            ref={ref}
            rows={15}
            name={name}
            onChange={onChange}
            placeholder="<p></p>"
            value={value}
          />
        )}
        <Addons>
          <ErrorText isShowingError={isShowingError}>
            {!!error && <span>{error.message}</span>}
          </ErrorText>
          {maxLength && (
            <RightAddons>
              {`${value?.toString().length || 0} / ${maxLength}`}
            </RightAddons>
          )}
        </Addons>
      </Root>
    );
  }
);

export { FieldRichTextEditor };
