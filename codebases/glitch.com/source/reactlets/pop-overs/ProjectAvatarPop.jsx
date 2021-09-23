import React, { useRef } from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import FilePromptButton from '../../components/FilePromptButton';
import AssetUtils from '../../utils/assets';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

export default function ProjectAvatarPop() {
  const application = useApplication();
  const visible = useObservable(application.projectAvatarPopVisible);
  const avatarSrc = useObservable(application.projectAvatarImage);
  const assetUtils = useRef();

  if (!assetUtils.current) {
    assetUtils.current = AssetUtils(application);
  }

  const hideProjectAvatarPop = () => {
    application.projectAvatarPopVisible(false);
    application.projectPopVisible(true);
  };

  const newRandomProjectAvatar = () => {
    application.projectAvatarUtils.random().then(application.uploadProjectAvatarAsset);
  };

  if (!visible) {
    return null;
  }

  return (
    <dialog className="pop-over project-avatar-pop">
      {/* Existing accessibility issue ported to React.  */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <section role="presentation" className="info clickable-label" onClick={hideProjectAvatarPop}>
        <div className="back icon" />
        <h1>Project Avatar</h1>
      </section>

      <section className="actions">
        <img className="avatar-image" src={avatarSrc} alt="Project Avatar" />

        <div className="button-wrap">
          <button className="button" onClick={newRandomProjectAvatar}>
            Random <Icon icon="bouquet" />
          </button>
        </div>

        <div className="button-wrap">
          <FilePromptButton
            accept="image/*"
            onSelection={(files) => {
              const [file] = files;
              assetUtils.current
                .createThumbnail(file)
                .then(application.uploadProjectAvatarAsset)
                .catch((error) => {
                  application.notifyUploadFailure(true);
                  application.logger().log('error addFileFromComputer()', error);
                });
            }}
          >
            Upload <Icon icon="arrowUp" />
          </FilePromptButton>
        </div>
      </section>
    </dialog>
  );
}
