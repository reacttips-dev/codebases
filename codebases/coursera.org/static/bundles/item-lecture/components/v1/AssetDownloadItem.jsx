import React from 'react';
import { TrackedA } from 'bundles/page/components/TrackedLink2';
import PropTypes from 'prop-types';
import Q from 'q';
import API from 'js/lib/api';

import _t from 'i18n!nls/item-lecture';

const api = API('', { type: 'rest' });

class AssetDownloadItem extends React.Component {
  static propTypes = {
    assetData: PropTypes.object,
    type: PropTypes.oneOf(['url', 'asset']),
  };

  state = {
    itemName: '',
    url: '',
    fileType: '',
  };

  componentDidMount() {
    this.getAssetInfo();
  }

  getAssetInfo() {
    const { type } = this.props;
    if (type === 'url') {
      this.getUrlData();
    } else {
      this.getAssetData();
    }
  }

  getUrlData() {
    const { assetData } = this.props;
    const assetUrl = assetData.definition.url;
    const assetName = assetData.definition.name;

    this.setState({
      url: assetUrl,
      itemName: assetName,
      fileType: _t('Link'),
    });
  }

  getAssetData() {
    const { assetData } = this.props;
    const { assetId } = assetData.definition;

    Q(api.get(`api/assets.v1/${assetId}`, { data: { fields: 'fileExtension' } })).then((result) => {
      const assetSource = result.elements[0];
      const assetUrl = assetSource.url.url;
      const { fileExtension } = assetSource;
      const assetName = assetData.definition.name || assetSource.name;

      this.setState({
        url: assetUrl,
        itemName: assetName,
        fileType: fileExtension,
      });
    });
  }

  render() {
    const { assetData, type } = this.props;
    const { itemName, url, fileType } = this.state;
    if (!assetData) {
      return null;
    }

    return (
      <li className="rc-AssetDownloadItem resource-list-item">
        <TrackedA
          className="resource-link nostyle"
          trackingName="download_asset"
          data={{ asset_type: type }}
          href={url}
          target="_blank"
          download={type === 'asset' ? itemName : null}
          title={_t('Download Asset')}
        >
          <div className="horizontal-box align-items-vertical-center wrap">
            <span className="resource-name body-2-text color-secondary-text">{itemName}</span>
            <span className="caption-text color-hint-text">{fileType}</span>
          </div>
        </TrackedA>
      </li>
    );
  }
}

export default AssetDownloadItem;
