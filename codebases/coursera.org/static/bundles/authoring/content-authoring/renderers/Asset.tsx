import PropTypes from 'prop-types';
import * as React from 'react';
import CdsMigrationTypography from 'bundles/authoring/common/components/cds/CdsMigrationTypography';
import { SvgButton, color } from '@coursera/coursera-ui';

import {
  SvgTrash,
  SvgPhoto,
  SvgVideo,
  SvgMicrophone,
  SvgDownload,
  SvgProgressDoc,
  SvgAttachment,
} from '@coursera/coursera-ui/svg';
import TooltipWrapper from 'bundles/authoring/common/components/TooltipWrapper';
import _t from 'i18n!nls/authoring';
import type { Asset as AssetType } from 'bundles/asset-admin/types/assets';
import { getAttributes } from '../utils/slateUtils';
import type { SlateChange, SlateRenderNodeProps } from '../types';

import 'css!./__styles__/Asset';

type Props = SlateRenderNodeProps & {
  getAsset: (assetId: string) => Promise<{ [key: string]: AssetType }>;
};

type State = {
  asset: AssetType | {};
};

class Asset extends React.Component<Props, State> {
  static propTypes = {
    node: PropTypes.shape({
      data: PropTypes.shape({
        attributes: PropTypes.string,
      }),
    }),
    editor: PropTypes.object, // TODO: use this to type after migrating to TSX: https://github.com/chilbi/slate-types/tree/master/src/types
    getAsset: PropTypes.func,
  };

  state = {
    asset: {},
  };

  componentDidMount() {
    const { node, getAsset } = this.props;
    const assetId = node.data.getIn(['attributes', 'id']) as string | null;

    if (assetId) {
      getAsset(assetId).then((assetData) => {
        const asset = assetData[assetId];
        if (asset) {
          this.setState({ asset });
        }
      });
    }
  }

  handleRemove = (e: React.ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { editor, node } = this.props;

    // eslint-disable-next-line no-alert
    if (window.confirm(_t('Are you sure you want to remove this attachment?'))) {
      editor.change((c: SlateChange) => c.removeNodeByKey(node.key));
    }
  };

  handleDownload = (e: React.ChangeEvent<HTMLButtonElement>) => {
    const { asset } = this.state;

    e.preventDefault();
    e.stopPropagation();

    if ((asset as AssetType).url) {
      window.open((asset as AssetType).url.url);
    }
  };

  renderAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'audio':
        return <SvgMicrophone size={32} />;
      case 'image':
        return <SvgPhoto size={32} />;
      case 'pdf':
        return <SvgProgressDoc size={32} />;
      case 'video':
        return <SvgVideo size={32} />;
      default:
        return <SvgAttachment size={32} />;
    }
  };

  render() {
    const { node } = this.props;
    const { id, name, extension, assetType } = getAttributes(node);

    return (
      <div
        className="slate-asset cml-asset"
        data-id={id}
        data-name={name}
        data-type={assetType}
        data-extension={extension}
      >
        <div className="asset-container horizontal-box align-items-vertical-center p-a-1">
          <div className="asset-info horizontal-box align-items-vertical-center">
            <div className="asset-icon">{this.renderAssetIcon(assetType)}</div>
            <div className="asset-info vertical-box p-l-1">
              <CdsMigrationTypography variant="h3bold" component="h4" cuiComponentName="H4" className="asset-name">
                {name}
              </CdsMigrationTypography>
              <span className="asset-extension font-xs">
                {extension.toUpperCase()} {_t('File')}
              </span>
            </div>
          </div>
          <div className="asset-download">
            <TooltipWrapper message={_t('Download')} placement="bottom">
              <SvgButton
                type="icon"
                size="sm"
                svgElement={<SvgDownload size={18} color={color.primaryText} hoverColor={color.primary} />}
                onClick={this.handleDownload}
              />
            </TooltipWrapper>
          </div>
          <div className="asset-delete">
            <TooltipWrapper message={_t('Delete')} placement="bottom">
              <SvgButton
                type="icon"
                size="sm"
                svgElement={<SvgTrash size={18} color={color.primaryText} hoverColor={color.primary} />}
                onClick={this.handleRemove}
              />
            </TooltipWrapper>
          </div>
        </div>
      </div>
    );
  }
}

export default Asset;
