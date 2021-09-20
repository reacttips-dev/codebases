import { Button, Heading, Text } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './plagiarism-button-gateway.module.scss';

export const PlagiarismButtonGateway = ({
  createPlagiarismCase,
  closeButtonClick,
  isLoading,
}) => (
  <div>
    <Heading size="h1">{__('Submission Plagiarism Review')}</Heading>
    <Text>
      {__(
        'You are not permitted to submit projects at this time because previous submissions have been flagged for plagiarism. You may request an additional review for your most recent flagged submission by opening a plagiarism case, after which Udacity staff will assess your submission for plagiarism.'
      )}
    </Text>
    <Text>
      {__(
        'If your submission is determined to not be plagiarized, you will be able to submit projects again.'
      )}
    </Text>
    <Text>{__('Would you like to open a plagiarism case?')}</Text>
    <div className={styles['plagiarism-action-buttons']}>
      <Button
        label={__('Yes')}
        variant="primary"
        onClick={createPlagiarismCase}
        disabled={isLoading}
      />
      <Button label={__('No')} variant="minimal" onClick={closeButtonClick} />
    </div>
  </div>
);

PlagiarismButtonGateway.displayName =
  'common/assessments/contest-plagiarism-button/plagiarism-button-gateway';

PlagiarismButtonGateway.propTypes = {
  createPlagiarismCase: PropTypes.func,
  closeButtonClick: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default PlagiarismButtonGateway;
