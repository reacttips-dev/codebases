/* eslint-disable @typescript-eslint/ban-ts-comment */

import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import { getShouldLoadRaven } from 'js/lib/sentry';
import raven from 'raven-js';

import { BLOCK_TYPES } from 'bundles/cml/models/CMLParser';
import CMLUtils, { getCmlBlockTypes } from 'bundles/cml/utils/CMLUtils';

import Tex from 'bundles/phoenix/components/Tex';
import CMLCode from 'bundles/cml/components/CMLCode';
import CMLVideoJS from 'bundles/cml/components/CMLVideoJS';
import CMLAudioJS from 'bundles/cml/components/CMLAudioJS';
import CMLToHTMLConverter from 'bundles/cml/models/CMLToHTMLConverter';
import type { CMLToHTMLConverterType } from 'bundles/cml/models/CMLToHTMLConverter';
import type { CmlContent, VariableData } from 'bundles/cml/types/Content';

import TrackedDiv from 'bundles/page/components/TrackedDiv';
import { TrackedOnLinkClickDiv } from 'bundles/page/components/TrackedOnLinkClick';
import { isMonacoEnabled } from 'bundles/cml/utils/FeatureUtils';
import { CmlCdsContext } from 'bundles/cml/components/CmlCdsContext';
import CDSToCMLStylesheet from './cds/CDSToCMLStylesheet';
import RenderableHtml from './RenderableHtml';

import 'css!./__styles__/CML';

type Props = {
  className?: string;
  cml?: CmlContent | null;
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

  // display soft breaks in CML content - enabled by default
  showSoftBreaks?: boolean;
  // render CML content with CDS styles
  isCdsEnabled?: boolean;
};

type State = {
  assetsAvailable?: boolean;
  key?: number | string;
  contentDirection: string;
};

/**
 * Renders CML content. See overview of CML at https://coursera.atlassian.net/wiki/spaces/EN/pages/48267760/Frontend+-+CML
 * Optionally renders "renderable html" via `RenderableHtml` when provided in the cml data
 */
class CML extends React.Component<Props, State> {
  converter: CMLToHTMLConverterType | null;

  _useRenderableHtml = false;

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

  static contextType = CmlCdsContext;

  constructor(props: Props) {
    super(props);

    const { shouldRenderMath, variableData, isCdsEnabled, forceLTR, cml } = props;

    this.converter = null;

    if (!this.shouldUseRenderableHtml({ cml })) {
      // @ts-ignore [fe-tech-debt] make CMLToHTMLConverter a class so we can use 'new' on it correctly
      this.converter = new CMLToHTMLConverter();
      this.converter?.setupOptions({ disableMath: !shouldRenderMath, isCdsEnabled });

      if (variableData) {
        this.converter?.setupVariables(variableData);
      }
    }

    this.state = {
      assetsAvailable: false,
      key: 'default', // A default key is required to prevent SSR and CSR mismatches on initial render
      contentDirection: forceLTR ? 'ltr' : 'auto',
    };
  }

  componentDidMount() {
    const { assetsAvailable } = this.state;
    const { forceLTR, cml, isCdsEnabled } = this.props;

    if (!this.shouldUseRenderableHtml({ cml })) {
      /* 
       * temporarily muted while we roll out more services, this currently adds a lot of noise.
      
      if (getShouldLoadRaven()) {
        // Log to sentry for cases where we've enabled html rendering but the data/field is missing from a BE resource.
        // This will be sampled but we should get events if this happens often on some critical resources
        raven.captureException(
          new Error(`
            [CML] renderableHtml missing on page: ${window.location.href}, cml: "${CMLUtils.getValue(cml).substr(
            0,
            30
          )}..."`),
          {
            tags: {
              product: 'cml', // use this tag for categorizing cml errors caught on FE, surfaced via Sentry alert rule "CML errors"
            },
          }
        );
      }

      */

      this.converter?.on('assetsAvailable', () => {
        if (!assetsAvailable) {
          // Update the key so that React will re-render the entire component tree
          this.setState({ assetsAvailable: true, key: Math.random() });
        }
        // we can't check the context for determining if we should use cds styles until componentDidMount if the prop for isCdsEnabled is not set explicity then we will use what is in the context
        if (isCdsEnabled === undefined && this.context.isCdsEnabled) {
          this.converter?.setupOptions({ isCdsEnabled: this.context.isCdsEnabled });
        }
      });
    }

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

  shouldUseRenderableHtml = ({ cml }: { cml: CmlContent | null | undefined }): boolean => {
    return !!CMLUtils.getRenderableHtml(cml);
  };

  render() {
    const {
      cml,
      className,
      shouldRenderMath,
      shouldRenderCode,
      shouldRenderAssets,
      shouldApplyTracking,
      isEditorPreview,
      contentId,
      display = 'block',
      isControlled,
      showSoftBreaks,
      isCdsEnabled,
    } = this.props;

    const useCdsStyles = isCdsEnabled ?? this.context.isCdsEnabled;
    if (this.shouldUseRenderableHtml({ cml })) {
      // skip CML rendering and use the new "renderable html" provided via the unified renderer
      const htmlNode = <RenderableHtml {...this.props} htmlContent={CMLUtils.getRenderableHtml(cml)} />;
      return useCdsStyles ? <CDSToCMLStylesheet>{htmlNode}</CDSToCMLStylesheet> : htmlNode;
    }

    const { key, contentDirection } = this.state;
    const cmlValue = CMLUtils.getValue(cml);

    let html = '';
    if (cml) {
      try {
        html = this.converter?.toHTML(cmlValue) || '';
      } catch (error) {
        html = '';

        console.error('[CML] toHTML() conversion error: ', error); // eslint-disable-line no-console

        if (getShouldLoadRaven()) {
          raven.captureException(error, {
            tags: {
              product: 'cml', // use this tag for categorizing cml errors caught on FE, surfaced via Sentry alert rule "CML errors"
            },
            extra: {
              message:
                'CMLToHTML conversion failure: see the `cmlValue` field for any invalid content like unsupported tags or characters.',
              cmlValue,
            },
          });
        }
      }
    }

    let content = <div dangerouslySetInnerHTML={{ __html: html }} />; // eslint-disable-line react/no-danger

    if (shouldRenderMath) {
      content = <Tex>{content}</Tex>;
    }

    if (shouldRenderAssets) {
      content = (
        <CMLVideoJS>
          <CMLAudioJS>{content}</CMLAudioJS>
        </CMLVideoJS>
      );
    }

    if (shouldRenderCode) {
      const useMonacoEditor = isMonacoEnabled();
      content = (
        <CMLCode useUserExpression={!isEditorPreview} useMonacoEditor={useMonacoEditor}>
          {content}
        </CMLCode>
      );
    }

    if (shouldApplyTracking) {
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      content = <TrackedOnLinkClickDiv trackingName="cml_link">{content}</TrackedOnLinkClickDiv>;
      content = (
        <TrackedDiv trackingName="cml" trackClicks={false} requireFullyVisible={false} withVisibilityTracking={true}>
          {content}
        </TrackedDiv>
      );
    }

    const controlledKey = isControlled ? `${key}${html}` : key;
    let displayInlineBlock = display === 'inline-block';
    if (displayInlineBlock) {
      // note: certain cml block types are not compatible with inline-block display, because these block types
      //       have no inherent width when rendering editors or players which results in a no-width collapsed div
      const cmlBlockTypes = getCmlBlockTypes(cml);
      displayInlineBlock = !cmlBlockTypes.some((blockType) =>
        [BLOCK_TYPES.Code, BLOCK_TYPES.Asset].includes(blockType)
      );
    }

    const cmlNode = (
      <div
        id={contentId}
        key={controlledKey /* Key is required to force DOM re-render */}
        className={classNames('rc-CML', className, {
          displayInlineBlock,
          'show-soft-breaks': showSoftBreaks,
        })}
        dir={contentDirection}
      >
        {content}
      </div>
    );

    if (useCdsStyles) {
      return <CDSToCMLStylesheet>{cmlNode}</CDSToCMLStylesheet>;
    }

    return cmlNode;
  }
}

export default CML;
