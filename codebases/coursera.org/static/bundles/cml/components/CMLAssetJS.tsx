import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import AssetNode from 'bundles/cml/components/cds/AssetNode';

type Props = {
  children: JSX.Element;
};

/**
 * Wrapper that injects AssetNode into the rendered html content for all non-media assets (pdf/generic/subtitle)
 * */
class CMLAssetJS extends React.Component<Props> {
  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    const dom = ReactDOM.findDOMNode(this);

    if (!dom) {
      return;
    }

    // find and replace all non-media assets (not audio/video)
    const fileAssets: NodeListOf<HTMLElement> = (dom as Element).querySelectorAll(
      'div[data-asset-type="pdf"], div[data-asset-type="generic"], div[data-asset-type="subtitle"]'
    );

    _.map(fileAssets, (assetEl) => {
      const assetId = assetEl.dataset.id as string;
      const src = assetEl.dataset.url || (assetEl.querySelector('a')?.getAttribute('href') as string);
      const assetType = assetEl.dataset.assetType as string;
      const fileName = assetEl.dataset.name || '';
      const ariaLabel = assetEl.dataset.ariaLabel || '';
      const fileExtension = assetEl.dataset.extension || '';

      if (src) {
        // retain ariaLabel so it can be added back after the DOM is replaced
        const assetNode = $(
          ReactDOMServer.renderToStaticMarkup(
            <AssetNode id={assetId} url={src} filename={fileName} typeName={assetType} fileExtension={fileExtension} />
          )
        ).get(0);

        // clean up any child content before appending AssetNode
        assetEl.innerHTML = ''; // eslint-disable-line no-param-reassign
        // assetEl.appendChild(assetNode);
        assetEl.replaceWith(assetNode);

        if (ariaLabel) {
          // set the previously retained ariaLabel
          $(assetEl.childNodes[0]).attr('aria-label', ariaLabel);
        }
      }
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return this.props.children;
  }
}

export default CMLAssetJS;
