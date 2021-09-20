import { Heading, Text } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';

const SUPPORT_REQ_LINK =
  'https://udacitymentorops.zendesk.com/hc/en-us/requests/new';

export const ErroredMessage = ({ error }) => (
  <div test-data="errored">
    <Heading size="h1">{__('Error')}</Heading>
    <Text>
      {__(
        `There was an issue creating your plagiarism case. Please reach out to <%= linkStart %>support<%= linkEnd%> for further assistance. The error we recieved is: <%=error%>.`,
        {
          linkStart: `<a href="${SUPPORT_REQ_LINK}" target="_blank" rel="noreferrer noopener">`,
          linkEnd: '</a>',
          error: error,
        },
        { renderHTML: true }
      )}
    </Text>
  </div>
);

ErroredMessage.displayName =
  'common/assessments/contest-plagiarism-button/errored-message';

ErroredMessage.propTypes = {
  error: PropTypes.string,
};

export default ErroredMessage;
