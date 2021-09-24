import React, { useRef } from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import styled from 'styled-components';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';
import AssetUtils from '../utils/assets';
import FilePromptButton from '../components/FilePromptButton';

const AssetsHelperText = styled.span`
  font-size: 12px;
  margin-left: 5px;
`;

export default function AssetsHelper() {
  const application = useApplication();
  const currentProject = useObservable(application.currentProject);
  const currentProjectPrivacy = useObservable(currentProject?.privacy);
  const projectIsReadOnlyForCurrentUser = useObservable(application.projectIsReadOnlyForCurrentUser);
  const assetUtils = useRef();

  if (!assetUtils.current) {
    assetUtils.current = AssetUtils(application);
  }

  if (projectIsReadOnlyForCurrentUser) {
    return null;
  }

  return (
    <div className="editor-helper">
      <div className="editor-helper-contents">
        <FilePromptButton
          accept="image/*,audio/*,video/*"
          onSelection={(files) => {
            application.closeAllPopOvers();
            files.forEach((file) => {
              assetUtils.current.addAssetFile(file);
            });
          }}
        >
          Upload an Asset <Icon icon="arrowUp" />
        </FilePromptButton>
        {/* When project is set to private, warn users that assets are still public */}
        {currentProjectPrivacy !== 'public' ? (
          <AssetsHelperText>
            *URLs for assets are public.
            <a target="_blank" rel="noopener noreferrer" href="https://glitch.happyfox.com/kb/article/94-who-can-see-the-assets-in-my-project/">
              Learn more
            </a>
            .
          </AssetsHelperText>
        ) : null}
      </div>
    </div>
  );
}
