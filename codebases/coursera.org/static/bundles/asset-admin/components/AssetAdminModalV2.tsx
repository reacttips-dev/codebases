import React from 'react';

import Modal from 'bundles/phoenix/components/Modal';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import UploadActionCreators from 'bundles/author-lecture/actions/UploadActionCreators';
import AssetAdminManager from 'bundles/asset-admin/components/AssetAdminManager';
import type { PropsFromCaller } from 'bundles/asset-admin/components/AssetAdminManager';
import { MODAL_WIDTH } from 'bundles/asset-admin/constants/TableConstants';

const closeModal = () => {
  UploadActionCreators.closeAssetModal();
};

const AssetAdminModalV2: React.FunctionComponent<PropsFromCaller> = (props) => {
  const propsToPass = {
    ...props,
    onCancel: props.onCancel || closeModal,
    onAfterConfirm: props.onAfterConfirm || closeModal,
    assetBrowserWidth: MODAL_WIDTH,
  };
  return (
    <Modal handleClose={propsToPass.onCancel} modalName={propsToPass.title || ''} className="rc-AssetAdminModalV2">
      <AssetAdminManager {...propsToPass} />
    </Modal>
  );
};

export default AssetAdminModalV2;
