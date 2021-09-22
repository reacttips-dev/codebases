import React from 'react';

import _ from 'lodash';
import CML from 'bundles/cml/components/CML';

import { HTMLContent } from 'bundles/compound-assessments/types/FormParts';
import { Content as ContentType } from 'bundles/cml/types/Content';

type Props = {
  assumeStringIsHtml: boolean;
  content?: ContentType | HTMLContent;
  contentId?: string;
  display?: 'inline-block' | 'block';
  className?: string;
};

/**
 * Renders [[org.coursera.ondemand.content.{Content,PlainTextOrCmlContent}]]s
 * returned by APIs.
 *
 * Pass `assumeStringIsHtml = true` to render a [[Content]], and pass
 * `assumeStringIsHtml = false` to render a [[PlainTextOrCmlContent]].
 *
 * TODO: This component is also very similar to static/bundles/cml/components/CMLOrHTML.tsx,
 * maybe we can refeactor it out.
 */
class Content extends React.Component<Props> {
  static defaultProps = {
    assumeStringIsHtml: false,
  };

  render() {
    const { assumeStringIsHtml, content } = this.props;
    if (content) {
      if (typeof content !== 'string' && content.typeName === 'cml') {
        const passThroughProps = _.omit(this.props, 'assumeStringIsHtml', 'content');
        return <CML cml={content} {...passThroughProps} />;
      } else if (typeof content !== 'string' && content.typeName === 'htmlText') {
        return <span dangerouslySetInnerHTML={{ __html: content.definition.content }} />;
      } else if (typeof content !== 'string' && content.typeName === 'html') {
        return <span dangerouslySetInnerHTML={{ __html: content.definition }} />;
      } else if (assumeStringIsHtml) {
        return <span dangerouslySetInnerHTML={{ __html: content }} />;
      } else {
        return <span>{content}</span>;
      }
    } else {
      return false;
    }
  }
}

export default Content;
