import PropTypes from 'prop-types';
import React from 'react';

import { H3 } from '@coursera/coursera-ui';
import { assets } from 'pages/open-course/common/constants';
import path from 'js/lib/path';
import Imgix from 'js/components/Imgix';
import Modal from 'bundles/phoenix/components/Modal';
import TopLevelModal from 'bundles/phoenix/components/TopLevelModal';

import 'css!./__styles__/HonorsModal';

const assetPath = assets.rootPath;

const CERT_HONORS_IMAGE = path.join(assetPath, 'bundles/ondemand/assets/images/modal-cert.png');

/**
 * Template for Honors modals.
 */
export default class HonorsModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
  };

  render() {
    const { title, content, onClose } = this.props;
    return (
      // TopLevelModal is disabled until inputs/re-rendering works with it.
      // <TopLevelModal>
      <Modal handleClose={onClose} modalName="Honors Modal" className="rc-HonorsModal" trackingName="honors_modal">
        <div className="vertical-box honors-modal-content">
          <div className="horizontal-box align-items-absolute-center modal-title">
            <H3 tag="div" rootClassName="honors-modal-title">
              {title}
            </H3>
          </div>
          <div className="honors-divider align-self-center" />
          <div className="align-self-center flex-1 honors-image">
            <Imgix src={CERT_HONORS_IMAGE} alt="Honors certificate" width={300} />
          </div>
          {content}
        </div>
      </Modal>
      // </TopLevelModal>
    );
  }
}
