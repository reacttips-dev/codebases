// To be used when the parent of this S12nEnrollModal is not a
// react component so handleClose can be managed automatically.
import React from 'react';

import S12nEnrollModal from 'bundles/s12n-enroll/components/S12nEnrollModal';

class StandaloneEnrollModal extends React.Component {
  state = {
    showModal: true,
  };

  /**
   * Since this is a proxy container for ./S12nEnrollModal.jsx, please
   * view S12nEnrollModal to get the propTypes.
   */
  handleClose() {
    this.setState({ showModal: false });
  }

  render() {
    const props = Object.assign({}, this.props, {
      onClose: () => this.setState({ showModal: false }),
    });

    return <div className="rc-StandaloneEnrollModal">{this.state.showModal && <S12nEnrollModal {...props} />}</div>;
  }
}

export default StandaloneEnrollModal;
