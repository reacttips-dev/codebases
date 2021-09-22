/** @jsx jsx */
/**
 * Render the final HTML representation of CML data as generated from the backend unified renderer
 * See https://docs.google.com/document/d/1gczQELUoqAwVQ4dPfjxWd3CP5_HloJ87KH6CQPi96QU/edit#
 */
import _ from 'lodash';
import React from 'react';
import { css, jsx } from '@emotion/react';

import classNames from 'classnames';
import { getShouldLoadRaven } from 'js/lib/sentry';
import raven from 'raven-js';

import Tex from 'bundles/phoenix/components/Tex';
import CMLCodeV2 from 'bundles/cml/components/CMLCodeV2';
import CMLVideoJSV2 from 'bundles/cml/components/CMLVideoJSV2';
import CMLAudioJS from 'bundles/cml/components/CMLAudioJS';
import CMLAssetJS from 'bundles/cml/components/CMLAssetJS';
import katex from 'js/lib/katex';

import type { CmlContent, VariableData } from 'bundles/cml/types/Content';

import TrackedDiv from 'bundles/page/components/TrackedDiv';
import { TrackedOnLinkClickDiv } from 'bundles/page/components/TrackedOnLinkClick';

import CDSToCMLStylesheet from './cds/CDSToCMLStylesheet';

/**
 *
 * Substitute variables in the given string with the values
 * e.g. %NAME% will be replaced by the user's profile name
 */
function substituteVariables(renderableHtml: string, variableData?: VariableData) {
  let newHtml = renderableHtml;
  _.forEach(variableData, (value, key) => {
    newHtml = newHtml.replace(new RegExp(`%${key}%`, 'g'), value as string);
  });

  return newHtml;
}

const styles = {
  container: css`
    width: 100%;

    .cmlToHtml-content-container {
      width: 100%;
    }
  `,
};

type Props = {
  className?: string;
  cml?: CmlContent | null;
  htmlContent?: string | null;
  shouldRenderMath?: boolean;
  shouldRenderCode?: boolean;
  shouldRenderAssets?: boolean;
  shouldApplyTracking?: boolean;
  variableData?: VariableData;
  isEditorPreview?: boolean;
  contentId?: string;
  /**
   * Unless `forceLTR` is enabled, CML will render with dir="auto" for directional content
   * support.
   * See https://coursera.atlassian.net/browse/PARTNER-14791
   * and https://listed.standardnotes.org/@mo/312/psa-add-dir-auto-to-your-inputs-and-textareas
   */
  forceLTR?: boolean;
  /**
   * "display" allows the parent component to manually override the historical default "display=block"
   * of CML for the purpose of refactoring parent elements to treat CML as "display=inline-block".  By
   * using "display=inline-block", the CML content block can align itself based on the top-level html
   * prop "dir=[ ltr | rtl ]".  The new display property is necessary, because there are places where
   * CML is used as part of a page's layout instead of nested within a layout div.  As a result, the CML
   * content's directionality can impact the page's layout.  The merging of content and layout directionality
   * causes problems when the learner's layout should be RTL, but the content being rendered should be LTR.
   * For example, an Arabic course teaching English terms should display radio buttons and should align each
   * multiple choice answer block to the right.  However, the text within the answer block should be displayed
   * LTR, because the content is English.  (see https://coursera.atlassian.net/browse/LP-714)
   * note: The "display" property can be deprecated once all code treats CML as "display=inline-block"
   */
  display?: 'inline-block' | 'block';
  /**
   * Force redraw CML on `cml` prop changed.
   * CMLVideoJS, CMLAudioJS and CMLCode all have `shouldComponentUpdate` always return
   * `false` for performance reasons. This means that if you change cml, it will not rerender.
   * If isControlled is true, it will always force rerender component if `cml` value changed.
   */
  isControlled?: boolean;

  // render CML content with CDS styles
  isCdsEnabled?: boolean;

  // display soft breaks in CML content - enabled by default
  showSoftBreaks?: boolean;
};

type State = {
  key?: number | string;
  contentDirection: string;
  renderableHtml: string;
};

class RenderableHtml extends React.Component<Props, State> {
  _isMounted = false;

  static defaultProps = {
    shouldRenderMath: true,
    shouldRenderCode: true,
    shouldRenderAssets: true,
    isEditorPreview: false,
    contentId: '',
    forceLTR: false,
    showSoftBreaks: true,
  };

  constructor(props: Props) {
    super(props);

    const { forceLTR } = props;

    this.state = {
      key: 'default', // A default key is required to prevent SSR and CSR mismatches on initial render
      contentDirection: forceLTR ? 'ltr' : 'auto',
      renderableHtml: '',
    };
  }

  componentDidMount() {
    const { forceLTR } = this.props;

    if (!forceLTR) {
      // override only when document direction is 'rtl' [CP-6003]
      if (document.dir === 'rtl') {
        this.setState({ contentDirection: 'rtl' });
      }
    }
  }

  // Certain updates and re-renders can be very costly, e.g. when rendering LaTeX with MathJax.
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !(_.isEqual(nextProps, this.props) && _.isEqual(nextState, this.state));
  }

  render() {
    const {
      htmlContent,
      className,
      shouldRenderMath,
      shouldRenderCode,
      shouldRenderAssets,
      shouldApplyTracking,
      isEditorPreview,
      contentId,
      isControlled,
      showSoftBreaks,
      variableData,
      isCdsEnabled,
    } = this.props;
    const { key, contentDirection } = this.state;

    let html = htmlContent || '';

    if (html) {
      if (shouldRenderMath) {
        try {
          // run katex on the html for rendering any math
          html = katex(html);
        } catch (error) {
          console.error('[RenderableHtml] Katex conversion error: ', error); // eslint-disable-line no-console

          if (getShouldLoadRaven()) {
            raven.captureException(error, {
              tags: {
                product: 'cml', // use this tag for categorizing cml errors caught on FE, surfaced via Sentry alert rule "CML errors"
              },
              extra: {
                message: 'Katex conversion failed, falling back to Mathjax. See `htmlContent` for further debugging',
                htmlContent,
              },
            });
          }
        }
      }

      // replaces variables with user data
      // note: this cannot be done in the unified render lib currently
      // since the usage is defined on the client-side and for certain instances only
      html = substituteVariables(html, variableData);
    }

    let content = <div dangerouslySetInnerHTML={{ __html: html }} />; // eslint-disable-line react/no-danger

    if (shouldRenderMath) {
      // wrap with Tex as Mathjax fallback if katex conversion above has failed
      content = <Tex>{content}</Tex>;
    }

    // wrap with respective asset renderers to handle dynamic/interactive content
    if (shouldRenderAssets) {
      content = (
        <CMLAssetJS>
          <CMLVideoJSV2>
            <CMLAudioJS>{content}</CMLAudioJS>
          </CMLVideoJSV2>
        </CMLAssetJS>
      );
    }

    // wrap with code block renderer
    if (shouldRenderCode) {
      content = <CMLCodeV2 useUserExpression={!isEditorPreview}>{content}</CMLCodeV2>;
    }

    if (shouldApplyTracking) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      content = <TrackedOnLinkClickDiv trackingName="cml_link">{content}</TrackedOnLinkClickDiv>;
      content = (
        <TrackedDiv trackingName="cml" trackClicks={false} requireFullyVisible={false} withVisibilityTracking={true}>
          {content}
        </TrackedDiv>
      );
    }

    const controlledKey = isControlled ? `${key}${html}` : key;
    const cmlNode = (
      <div
        id={contentId}
        key={controlledKey /* Key is required to force DOM re-render */}
        className={classNames('rc-RenderableHtml rc-CML', className, {
          'show-soft-breaks': showSoftBreaks,
        })}
        dir={contentDirection}
        css={[styles.container]}
      >
        {content}
      </div>
    );

    if (isCdsEnabled) {
      return <CDSToCMLStylesheet>{cmlNode}</CDSToCMLStylesheet>;
    }

    return cmlNode;
  }
}

export default RenderableHtml;
