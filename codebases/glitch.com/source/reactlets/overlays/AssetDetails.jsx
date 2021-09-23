import React, { useRef } from 'react';
import { Icon, useNotifications } from '@glitchdotcom/shared-components';
import qs from 'querystring';
import bytes from 'bytes';
import cn from 'classnames';
import moment from 'moment';
import Overlay from './Overlay';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import usePreventTabOut from '../../hooks/usePreventTabOut';
import copyToClipboard from '../../utils/copyToClipboard';
import { Copied } from '../NotificationTemplates';

export default function AssetDetails({ asset, onClickOut }) {
  const application = useApplication();
  const { createNotification } = useNotifications();
  const projectIsMemberOrMoreForCurrentUser = useObservable(application.projectIsMemberOrMoreForCurrentUser);
  const urlInput = useRef();

  const { date, name, imageHeight: height, size, type, url, imageWidth: width } = asset;
  const fileSize = bytes.format(size, { thousandsSeperator: ',', decimalPlaces: 0 });
  const isImage = !!type.match(/image/);
  const versionedUrl = `${url}?${qs.stringify({ v: moment(date).valueOf() })}`;

  const copyURL = () => {
    copyToClipboard(urlInput.current.value);
    createNotification(Copied);
  };

  const deleteAsset = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this asset?')) {
      application.deleteAsset(asset);
    }
  };

  const firstFocusable = useRef();
  const lastFocusable = useRef();
  usePreventTabOut(firstFocusable, lastFocusable);

  return (
    <Overlay
      className="asset-details-overlay"
      dialogClassName={cn('overlay', isImage ? 'image' : 'other')}
      onClickOut={onClickOut}
      ariaLabelledby="asset-details-overlay-name"
    >
      <section className="pop-over-hero">
        {isImage && (
          <a href={url} target="_blank" rel="noopener noreferrer" ref={firstFocusable}>
            {/* ESLINT-CLEAN-UP */}
            {/* eslint-disable-next-line */}
            <img className="asset-hero-image" src={versionedUrl} width={width} height={height} />
          </a>
        )}
      </section>
      <section className="actions">
        <h2 id="asset-details-overlay-name">{name}</h2>
        <div className="input-wrap">
          <input className="input" readOnly value={versionedUrl} ref={urlInput} />
          <button className="button button-copy-only-style" onClick={copyURL} ref={!projectIsMemberOrMoreForCurrentUser ? lastFocusable : null}>
            Copy
          </button>
        </div>
      </section>
      <section className="info">
        <p>
          {isImage && width > 0 && height > 0 ? (
            <>
              {width} × {height}, {fileSize}
            </>
          ) : (
            fileSize
          )}
        </p>
        <p>{moment(date).fromNow()}</p>
      </section>
      {projectIsMemberOrMoreForCurrentUser && (
        <section className="danger-zone">
          <button className="button" onClick={deleteAsset} ref={lastFocusable}>
            Delete <Icon icon="bomb" />
          </button>
        </section>
      )}
    </Overlay>
  );
}
