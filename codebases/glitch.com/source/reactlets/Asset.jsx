import React, { useRef } from 'react';
import AssetDetails from './overlays/AssetDetails';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';

const ACTION_KEYS = new Set(['Enter', ' ']);

export default function Asset({ asset }) {
  const application = useApplication();
  const { thumbnailHeight: height, thumbnailWidth: width, type } = asset;
  const name = asset?.name || 'undefined';
  const timestamp = new Date(asset.date).getTime();
  const thumbnail = asset.thumbnail ? `${asset.thumbnail}?${timestamp}` : `${asset.url}?${timestamp}`;
  const imageIsRetina = !!name?.match(/@2x/);
  const isImage = !!type?.match(/image/);

  const shouldShowOverlay = useObservable(application.assetOverlayAssetUUID) === asset.uuid;
  const assetRef = useRef();

  const showOverlay = () => {
    application.closeAllPopOvers();
    application.assetOverlayAssetUUID(asset.uuid);
  };

  const closeOverlay = () => {
    application.clearAssetOverlayAssetUUID();
  };

  const onKeyDown = (e) => {
    if (ACTION_KEYS.has(e.key)) {
      e.preventDefault();
      showOverlay();
    }
  };

  return (
    <>
      {/* ESLINT-CLEAN-UP */}
      {/* eslint-disable-next-line */}
      <div className="asset opens-pop-over" tabIndex={0} onKeyDown={onKeyDown} onClick={showOverlay} ref={assetRef}>
        {isImage ? (
          <>
            <div className="asset-background">
              {/* ESLINT-CLEAN-UP */}
              {/* Set width to 100 if there are no dimensions, otherwise nothing is displayed */}
              {width > 0 && height > 0 ? (
                <img className="asset-thumbnail" src={thumbnail} width={width} height={height} /> // eslint-disable-line
              ) : (
                <img className="asset-thumbnail" src={thumbnail} width={100} /> // eslint-disable-line
              )}
              {imageIsRetina && <div className="retina-badge">@2x</div>}
            </div>
            <p className="asset-thumbnail-name show-on-hover">{name}</p>
          </>
        ) : (
          <>
            {/* ESLINT-CLEAN-UP */}
            {/* eslint-disable-next-line */}
            <img className="asset-thumbnail-other" src={thumbnail} width={width} height={height} />
            <p className="asset-thumbnail-name">{name}</p>
          </>
        )}
      </div>
      {shouldShowOverlay && <AssetDetails asset={asset} onClickOut={closeOverlay} />}
    </>
  );
}
