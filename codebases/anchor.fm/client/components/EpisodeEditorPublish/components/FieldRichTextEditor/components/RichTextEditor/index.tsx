import React from 'react';
// importing at react-rte is causing a ssr error.
import RichTextEditor from 'react-rte/lib/RichTextEditor';
import { EditorValue, ToolbarConfig } from 'react-rte';
// @ts-ignore
import { windowUndefined } from 'helpers/serverRenderingUtils';

import { Root } from './styles';

const TOOLBAR_CONFIG = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
    { label: 'Italic', style: 'ITALIC' },
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
  ],
};

type CustomRichTextEditorProps = {
  maxCharacterLength?: number;
  onFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: unknown) => void;
  placeholder: string;
  value: string | number | string[] | undefined;
};

const CustomRichTextEditor = (props: CustomRichTextEditorProps) => {
  const { value, placeholder, onFocus, onBlur, maxCharacterLength } = props;
  const [currentValue, setCurrentValue] = React.useState<EditorValue>(
    RichTextEditor.createEmptyValue()
  );
  const [parser, setParser] = React.useState<DOMParser | null>(null);

  const [
    currentCharacterLength,
    setCurrentCharacterLength,
  ] = React.useState<number>(0);

  React.useEffect(() => {
    const current = value
      ? RichTextEditor.createValueFromString(value.toString(), 'html')
      : RichTextEditor.createEmptyValue();
    setCurrentValue(current);
    setCurrentCharacterLength(current.toString('html').length);

    if (!windowUndefined()) {
      setParser(new DOMParser());
    }
    // eslint-disable-next-line
  }, []);

  /* Check to see if value has updated */
  React.useEffect(() => {
    if (value !== currentValue.toString('html')) {
      setCurrentValue(
        value
          ? RichTextEditor.createValueFromString(value.toString(), 'html')
          : RichTextEditor.createEmptyValue()
      );
    }
    // eslint-disable-next-line
  }, [value]);

  const onChange = (newValue: EditorValue) => {
    const newValueHtmlString = newValue.toString('html');

    const saveValue =
      maxCharacterLength && newValueHtmlString.length <= maxCharacterLength
        ? newValue
        : currentValue;
    let saveValueHtml = saveValue.toString('html');

    // check for any anchor tags
    const hasAnchors = /href=("|')(.*?)("|')/g.test(saveValueHtml);
    if (hasAnchors && parser) {
      const dom = parser.parseFromString(saveValueHtml, 'text/html');
      const links = dom && dom.links;
      if (links.length > 0) {
        for (const link of links) {
          const href = link.getAttribute('href');
          if (href) {
            // check if anchor tag contains protocol, mailto, or tel href
            const isValid = /\/\/|mailto:|tel:/.test(href);
            if (!isValid) {
              // add relative protocol if missing in url
              link.setAttribute('href', `//${href}`);
            }
          }
        }
        saveValueHtml = dom.body.innerHTML;
      }
    }
    setCurrentValue(saveValue);
    setCurrentCharacterLength(saveValueHtml.length);

    props.onChange?.(saveValueHtml);
  };

  const handleBeforeInput = (chars: string) => {
    return maxCharacterLength &&
      currentCharacterLength + chars.length <= maxCharacterLength
      ? null
      : 'handled';
  };

  /** this is giving a ts error because @types/react-rte is wrong
   * https://draftjs.org/docs/api-reference-editor/#handlebeforeinput
   */
  const draftJsProps = { handleBeforeInput, onFocus, onBlur };

  return (
    <Root>
      <RichTextEditor
        {...draftJsProps}
        onChange={onChange}
        toolbarConfig={TOOLBAR_CONFIG as ToolbarConfig}
        value={currentValue}
        placeholder={placeholder}
      />
    </Root>
  );
};

export { CustomRichTextEditor as RichTextEditor };
