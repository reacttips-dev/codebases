import { Button, Modal } from '@udacity/veritas-components';
import ErroredMessage from './errored-message';
import { PLAGIARISM_CASE_STATES } from './contest-plagiarism-button-container';
import PlagiarismButtonGateway from './plagiarism-button-gateway';
import PropTypes from 'prop-types';
import SuccessMessage from './success-message';
import { __ } from 'services/localization-service';

export function ContestPlagiarismButton({
  showsModalOnButtonClick,
  closeButtonClick,
  handleCreatePlagiarismCase,
  shouldDisplayPlagiarismButton,
  caseCreationStatus,
  gatewayOpen,
  errorMessage,
  plagiarismCase,
  children,
}) {
  const renderModalContent = () => {
    switch (caseCreationStatus) {
      case PLAGIARISM_CASE_STATES.UNREQUESTED:
        return (
          <PlagiarismButtonGateway
            createPlagiarismCase={handleCreatePlagiarismCase}
            closeButtonClick={closeButtonClick}
            isLoading={caseCreationStatus === PLAGIARISM_CASE_STATES.LOADING}
          />
        );
      case PLAGIARISM_CASE_STATES.SUCCESSFUL:
        return <SuccessMessage plagiarismCaseID={plagiarismCase.id} />;
      case PLAGIARISM_CASE_STATES.ERRORED:
        return <ErroredMessage error={errorMessage} />;
    }
  };

  return (
    <div test-data="contest-plagiarism-button">
      {shouldDisplayPlagiarismButton ? (
        <Button
          label={__('Open Plagiarism Case')}
          variant="primary"
          small
          onClick={showsModalOnButtonClick}
        />
      ) : (
        children
      )}
      <Modal
        label={__('Open Plagiarism Case')}
        open={gatewayOpen}
        onClose={closeButtonClick}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}

ContestPlagiarismButton.displayName =
  'common/assessments/contest-plagiarism-button/contest-plagiarism-button';

ContestPlagiarismButton.propTypes = {
  showsModalOnButtonClick: PropTypes.func,
  closeButtonClick: PropTypes.func,
  handleCreatePlagiarismCase: PropTypes.func,
  shouldDisplayPlagiarismButton: PropTypes.bool,
  caseCreationStatus: PropTypes.string,
  gatewayOpen: PropTypes.bool,
  errorMessage: PropTypes.string,
  plagiarismCase: PropTypes.object,
  children: PropTypes.element,
};

export default ContestPlagiarismButton;
