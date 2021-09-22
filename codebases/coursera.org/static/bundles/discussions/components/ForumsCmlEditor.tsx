import React from 'react';
import _t from 'i18n!nls/discussions';

import { BoldButton } from 'bundles/authoring/content-authoring/plugins/Bold';
import { ItalicButton } from 'bundles/authoring/content-authoring/plugins/Italic';
import { UnderlineButton } from 'bundles/authoring/content-authoring/plugins/Underline';
import { LinkButton, UnlinkButton } from 'bundles/authoring/content-authoring/plugins/Link';
import { BulletListButton, NumberedListButton } from 'bundles/authoring/content-authoring/plugins/List';
import { ImageButton } from 'bundles/authoring/content-authoring/plugins/Image';
import { CodeButton } from 'bundles/authoring/content-authoring/plugins/Code';
import ToolbarDivider from 'bundles/authoring/content-authoring/components/toolbar/ToolbarDivider';
import CMLEditorV2OrFallbackEditor from 'bundles/authoring/content-authoring/components/CMLEditorV2orFallbackEditor';
import type { CmlContent, ImageUploadOptions } from 'bundles/cml/types/Content';
import type { Props as CMLEditorV2Props } from 'bundles/authoring/content-authoring/components/CMLEditorV2';

type Props = {
  cml: CmlContent;
  onChange: (cml: CmlContent) => void;
  imageUploadOptions: ImageUploadOptions;
  placeholder?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onFirstFocus?: () => void;
  removeFocus?: () => void;
} & Partial<CMLEditorV2Props>;

/**
 * Wrapper around CMLEditorV2 for all forumsV2 CML editing instances such as replying and creating new threads/posts.
 */
class ForumsCmlEditor extends React.Component<Props> {
  static defaultProps = {
    focusOnLoad: true,
  };

  render() {
    const {
      cml,
      onChange,
      imageUploadOptions,
      placeholder,
      onFocus,
      onBlur,
      ariaLabel,
      ariaDescribedBy,
      focusOnLoad,
    } = this.props;

    return (
      <div className="rc-ForumsCmlEditor">
        <CMLEditorV2OrFallbackEditor
          initialCML={cml}
          onContentChange={onChange}
          uploadOptions={{ image: imageUploadOptions, asset: imageUploadOptions }}
          isLearnerUpload={true}
          onFocus={onFocus}
          onBlur={onBlur}
          focusOnLoad={focusOnLoad}
          placeholder={placeholder || _t('Reply')}
          customTools={[
            <BoldButton key="BoldButton" />,
            <ItalicButton key="ItalicButton" />,
            <UnderlineButton key="UnderlineButton" />,
            <ToolbarDivider key="ToolbarDivider1" />,
            <LinkButton key="LinkButton" />,
            <UnlinkButton key="UnlinkButton" />,
            <ToolbarDivider key="ToolbarDivider2" />,
            <ImageButton key="ImageButton" />,
            <BulletListButton key="BulletListButton" />,
            <NumberedListButton key="NumberedListButton" />,
            <CodeButton key="CodeButton" />,
          ]}
          ariaLabel={ariaLabel || _t('Post Reply')}
          ariaDescribedBy={ariaDescribedBy}
        />
      </div>
    );
  }
}

export default ForumsCmlEditor;
