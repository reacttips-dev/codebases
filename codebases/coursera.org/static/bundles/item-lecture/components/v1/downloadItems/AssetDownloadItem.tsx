import React from 'react';
import DownloadItemLink from 'bundles/item-lecture/components/v1/downloadItems/DownloadItemLink';

import _t from 'i18n!nls/item-lecture';

type Props = {
  itemName: string;
  downloadUrl: string;
  // TODO enumerate all possible fileTypes
  fileType: string;
  assetTypeName: 'url' | 'asset';
};

const AssetDownloadItem = ({ downloadUrl, itemName, fileType, assetTypeName }: Props) => (
  <DownloadItemLink
    trackingName="download_asset"
    data={{ asset_type: assetTypeName }}
    href={downloadUrl}
    target="_blank"
    download={assetTypeName === 'asset' ? itemName : undefined}
    title={_t('Download Asset')}
  >
    <span style={{ marginRight: '8px' }}>{itemName}</span>
    <span className="caption-text color-secondary-dark-text">{fileType}</span>
  </DownloadItemLink>
);

export default AssetDownloadItem;
