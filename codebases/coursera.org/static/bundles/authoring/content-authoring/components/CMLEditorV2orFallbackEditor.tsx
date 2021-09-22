/**
 * This component will automatically use the fallback editor in browsers where
 * CMLEditorV2, which uses Slate under the hood, is not supported or works poorly.
 * Currently, Slate is not supported in IE. (see https://docs.slatejs.org/general/faq)
 *
 * For more info about CML, see https://coursera.atlassian.net/wiki/spaces/EN/pages/48267760/Frontend+-+CML
 */

import React from 'react';

import UserAgent from 'js/lib/useragent';
import deferToClientSideRender from 'js/lib/deferToClientSideRender';

import FallbackEditor from 'bundles/cml/components/FallbackEditor';
import type { Props as CMLEditorV2Props } from 'bundles/authoring/content-authoring/components/CMLEditorV2';
import CMLEditorV2 from 'bundles/authoring/content-authoring/components/CMLEditorV2';

type Props = {} & CMLEditorV2Props;

type State = {
  useFallback: boolean;
};

export class CMLEditorV2orFallbackEditor extends React.Component<Props, State> {
  state = {
    useFallback: false,
  };

  componentDidMount() {
    const agent = new UserAgent(navigator.userAgent);
    const isIE = agent.browser.name === 'IE';
    // excluding android here because android on web is not able to type into the CML editor
    // related Jira: https://coursera.atlassian.net/browse/LP-5167?atlOrigin=eyJpIjoiZmQwOWNlN2MzODYxNGViZThkMGZjYTdiM2RjZjc1OTgiLCJwIjoiaiJ9
    const useFallback = isIE || agent.isAndroid;
    this.setState({ useFallback });
  }

  render() {
    const { contentId, initialCML, placeholder, onContentChange } = this.props;
    const { useFallback } = this.state;

    return useFallback ? (
      <FallbackEditor id={contentId} cml={initialCML} placeholder={placeholder} onChange={onContentChange} />
    ) : (
      <CMLEditorV2 {...this.props} />
    );
  }
}

export default deferToClientSideRender(CMLEditorV2orFallbackEditor);
