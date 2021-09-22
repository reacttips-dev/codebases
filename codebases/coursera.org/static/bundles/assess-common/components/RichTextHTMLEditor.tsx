/**
 * The RichTextHTMLEditor allows users to create and edit content that will be stored
 * by the backend as html strings.  To streamline this process and to minimize the number of
 * text editors that Coursera needs to support, this component uses CMLEditorV2 to edit
 * the content itself, but this means the raw html must be converted to cml and vice versa
 * when saving.
 *
 * Unfortunately, the legacy rich text html data may include naked text that is not
 * bounded by any html tags.  This naked text becomes a problem when it is passed to
 * HTMLToCMLConverter, because the converter will fail to parse when it encounters naked
 * text while constructing a DOM of the data.
 *
 * For example, the html value returned by the backend could be a simple text string
 * "This is text".  The converter would be unable to decide how to treat "This" when the
 * last DOM tag created is undefined and would throw the error:
 *    Unsupported HTML element "[object Text], undefined"
 *
 * To solve this situation, the legacy peer review html data is first passed through a
 * converter that wraps any naked text in "<p>" tags before sending it to
 * HTMLToCMLConverter.
 *
 * note: The final goal is to deprecate html data and migrate everything to use cml format.
 *       However, this would be a significant project requiring BE resources to migrate
 *       all legacy data before FE logic for html data types can be deleted
 *
 * [be-tech-debt]
 */

import React from 'react';
import initBem from 'js/lib/bem';

import type { CmlContent } from 'bundles/cml/types/Content';

import HTMLToCMLConverter from 'bundles/cml/models/HTMLToCMLConverter';
import type { CMLToHTMLConverterType } from 'bundles/cml/models/CMLToHTMLConverter';
import CMLToHTMLConverter from 'bundles/cml/models/CMLToHTMLConverter';
import { create, getValue } from 'bundles/cml/utils/CMLUtils';

import CMLEditorV2orFallbackEditor from 'bundles/authoring/content-authoring/components/CMLEditorV2orFallbackEditor';
import { BoldButton } from 'bundles/authoring/content-authoring/plugins/Bold';
import { ItalicButton } from 'bundles/authoring/content-authoring/plugins/Italic';
import { LinkButton, UnlinkButton } from 'bundles/authoring/content-authoring/plugins/Link';
import { BulletListButton, NumberedListButton } from 'bundles/authoring/content-authoring/plugins/List';
import ToolbarDivider from 'bundles/authoring/content-authoring/components/toolbar/ToolbarDivider';

const bem = initBem('RichTextHTMLEditor');

type Props = {
  content?: string; // html string
  ariaLabelledBy?: string;
  onChange: (newContent: string) => void;
};

class RichTextHTMLEditor extends React.Component<Props> {
  htmlToCmlConverter: HTMLToCMLConverter;

  cmlToHtmlConverter: CMLToHTMLConverterType;

  constructor(props: Props) {
    super(props);
    this.htmlToCmlConverter = new HTMLToCMLConverter();
    // @ts-ignore [fe-tech-debt] make CMLToHTMLConverter a class so we can use 'new' on it correctly
    this.cmlToHtmlConverter = new CMLToHTMLConverter();

    // this component is used as an editor so we need to disable math conversion
    // in order to preserve the original latex expression (i.e. content with the $$ delimiters)
    this.cmlToHtmlConverter.setupOptions({ disableMath: true });
  }

  onContentChange = (cml: CmlContent) => {
    const { onChange } = this.props;
    onChange(this.cmlToHtmlConverter.toHTML(getValue(cml)));
  };

  render() {
    const { content = '', ariaLabelledBy } = this.props;
    const initialCML = create(this.htmlToCmlConverter.toCML(content, true, true));

    return (
      <div className={bem()}>
        <CMLEditorV2orFallbackEditor
          initialCML={initialCML}
          onContentChange={this.onContentChange}
          ariaLabelledBy={ariaLabelledBy}
          customTools={[
            <BoldButton key="BoldButton" />,
            <ItalicButton key="ItalicButton" />,
            <ToolbarDivider key="ToolbarDivider1" />,
            <LinkButton key="LinkButton" />,
            <UnlinkButton key="UnlinkButton" />,
            <ToolbarDivider key="ToolbarDivider2" />,
            <BulletListButton key="BulletListButton" />,
            <NumberedListButton key="NumberedListButton" />,
          ]}
        />
      </div>
    );
  }
}

export default RichTextHTMLEditor;
