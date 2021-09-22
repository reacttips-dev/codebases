/** @jsx jsx */
import React from 'react';
import { FileIcon, ShareIcon, DownloadIcon } from '@coursera/cds-icons';
import { css, jsx } from '@emotion/react';

import ASSET_TYPES from 'bundles/asset-admin/constants/AssetTypes';

import { Provider } from '@coursera/cds-core';
import _t from 'i18n!nls/cml';

type Props = {
  id: string;
  url: string;
  filename: string;
  typeName: string;
  fileExtension?: string;
};

const verticalBox = css`
  display: flex;
  flex-direction: column;
`;

const alignItemsVerticalEnd = css`
  align-items: flex-end;
`;

const horizontalCenterBox = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const flexStyle = css`
  flex: 1;
  max-width: 80%;
`;

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

  renderAssetLink = () => {
    const { typeName, url, filename } = this.props;

    const [assetTitle, Icon] =
      typeName === ASSET_TYPES.Pdf.name ? [_t('Open file'), ShareIcon] : [_t('Download file'), DownloadIcon];

    // Preferred anchor tags over cds-core link because of className issues caused by nested default theme
    return (
      <a aria-label={filename} href={url} target="_blank" rel="noopener noreferrer">
        <div css={[horizontalCenterBox, alignItemsVerticalEnd]}>
          <span className="asset-link-title">{assetTitle}</span>
          <Icon aria-hidden={true} size="large" color="interactive" />
        </div>
      </a>
    );
  };

  render() {
    const { id, url, filename, typeName, fileExtension } = this.props;
    const { name, extension } = this.getNameAndExtension(filename);
    return (
      <div
        data-id={id}
        data-url={url}
        data-name={name}
        data-type={typeName}
        data-extension={extension}
        className={`cml-asset cml-asset-${typeName}`}
        key={`asset-node-cds-${id}`}
      >
        <div className="asset-container" css={[horizontalCenterBox]}>
          <div css={[horizontalCenterBox, flexStyle]}>
            <FileIcon size="large" color="default" className="asset-icon-file" />
            <span className="asset-info" css={verticalBox}>
              <span className="asset-name">{filename}</span>
              <span className="asset-extension">
                {_t('#{fileType} File', { fileType: (fileExtension || extension).toUpperCase() })}
              </span>
            </span>
          </div>
          {this.renderAssetLink()}
        </div>
      </div>
    );
  }
}

// TODO: Remove nested default theme
export default (props: Props) => (
  <Provider locale={_t.getLocale()}>
    <AssetNode {...props} />
  </Provider>
);
