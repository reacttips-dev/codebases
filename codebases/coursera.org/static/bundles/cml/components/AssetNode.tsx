import React from 'react';
import { SvgFile, SvgExternalLink } from '@coursera/coursera-ui/svg';
import { color } from '@coursera/coursera-ui';

import ASSET_TYPES from 'bundles/asset-admin/constants/AssetTypes';
import _t from 'i18n!nls/cml';

type Props = {
  id: string;
  url: string;
  filename: string;
  typeName: string;
};

class AssetNode extends React.Component<Props> {
  getNameAndExtension = (filename: string) => {
    const lastDotIndex = filename.lastIndexOf('.');

    let extension = '';
    let name = filename;

    if (lastDotIndex > -1) {
      name = filename.substring(0, lastDotIndex);
      extension = filename.substring(lastDotIndex + 1);
    }

    return { name, extension };
  };

  renderPDFAsset = (url: string, filename: string, typeName: string) => {
    if (typeName === ASSET_TYPES.Pdf.name) {
      return (
        <div className="asset-container horizontal-box">
          <div className="asset-info horizontal-box align-items-vertical-center">
            <SvgFile size={24} color={color.bgGrayThemeMid} suppressTitle={true} className="asset-icon-file" />
            <span className="asset-info vertical-box">
              <span className="asset-name">{filename}</span>
              <span className="asset-extension font-xs">{_t('PDF File')}</span>
            </span>
          </div>
          <a aria-label={filename} href={url} target="_blank" rel="noopener noreferrer">
            <SvgExternalLink aria-hidden={true} size={24} color={color.primary} hoverColor={color.darkPrimary} />
          </a>
        </div>
      );
    }
    return (
      <a href={url} className="cml-asset-link" target="_blank" aria-label={filename} rel="noopener noreferrer">
        {filename}
      </a>
    );
  };

  render() {
    const { id, url, filename, typeName } = this.props;
    const { name, extension } = this.getNameAndExtension(filename);

    return (
      <div
        data-id={id}
        data-url={url}
        data-name={name}
        data-type={typeName}
        data-extension={extension}
        className={`cml-asset cml-asset-${typeName}`}
        key={`asset-node-${id}`}
      >
        {this.renderPDFAsset(url, filename, typeName)}
      </div>
    );
  }
}

export default AssetNode;
