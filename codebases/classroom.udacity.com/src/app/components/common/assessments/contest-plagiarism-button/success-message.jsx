import { Heading, Text } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';

export const SuccessMessage = ({ plagiarismCaseID }) => (
  <div test-data="success">
    <Heading size="h1">{__('Success')}</Heading>
    <Text>
      {__(
        `Plagiarism case #<%=plagiarismCaseID%> has been created and is in review. Staff will reach out to you once a decision has been made.`,
        { plagiarismCaseID }
      )}
    </Text>
  </div>
);

SuccessMessage.displayName =
  'common/assessments/contest-plagiarism-button/success-message';

SuccessMessage.propTypes = {
  plagiarismCaseID: PropTypes.number,
};

export default SuccessMessage;
