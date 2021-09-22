import * as React from 'react';
import cx from 'classnames';
import { Asset, AssetTag } from 'bundles/asset-admin/types/assets';
import { SlateRenderNodeProps } from '../types';

import { getAttributes } from '../utils/slateUtils';

import 'css!./__styles__/Image';

type Props = SlateRenderNodeProps & {
  getAsset: (assetId: string) => Promise<{ [key: string]: Asset }>;
  isFocused?: boolean;
};

type State = {
  asset: Asset | {};
  description: string;
  longDescription: string;
};

/**
 * Renderer for 'image' type nodes. Fetches the asset information for AssetManager, given the assetId from props.
 *
 */
class Image extends React.Component<Props, State> {
  state = {
    asset: {},
    description: '',
    longDescription: '',
  };

  componentDidMount() {
    const { node, getAsset } = this.props;
    const attributes = getAttributes(node);
    const assetId = attributes.assetId ? attributes.assetId : attributes.id; // assetId for <img> tag, id for <asset> tag

    if (assetId) {
      getAsset(assetId).then((assetData) => {
        const asset = assetData[assetId] as Asset;
        if (asset) {
          this.setState({
            asset,
            description: asset.tags.find((tag: AssetTag) => tag.name === 'description')?.value || '',
            longDescription: asset.tags.find((tag: AssetTag) => tag.name === 'longDescription')?.value || '',
          });
        }
      });
    }
  }

  render() {
    const { node, isFocused, isSelected, attributes } = this.props;
    const { asset, description, longDescription } = this.state;

    const { id, url } = asset as Asset;
    const nodeAttributes = getAttributes(node);
    const assetId = id || nodeAttributes.assetId || nodeAttributes.id; // assetId for <img> tag, id for <asset> tag
    const src = url ? url.url : nodeAttributes.src || '';

    if (!assetId && !src) {
      return <div className="slate-image placeholder" {...attributes} />;
    }

    const alt = nodeAttributes.alt || '';
    const captionId = `caption-${assetId}`;

    const figureAttributes = {
      ...attributes,
    };
    const imgAttributes: { src: string; alt?: string; 'data-asset-id': string; 'aria-describedby'?: string } = {
      src,
      alt,
      'data-asset-id': assetId,
    };

    if (description) {
      // attach a11y meaning to the figure/img when we have an asset description
      imgAttributes.alt = description;
    }

    if (longDescription) {
      // [ER-670] point to the longer description when available
      imgAttributes['aria-describedby'] = captionId;
    }

    return (
      <figure {...figureAttributes} role="figure" className={cx('slate-image', { selected: isFocused || isSelected })}>
        <img {...imgAttributes} />
        {/* optional screenreader-only caption for longer descriptions */}
        {longDescription && (
          <figcaption id={captionId} className="sr-only" aria-hidden="true">
            {longDescription}
          </figcaption>
        )}
      </figure>
    );
  }
}

export default Image;
