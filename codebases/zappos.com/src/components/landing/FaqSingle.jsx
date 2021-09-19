import PropTypes from 'prop-types';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { cleanUp } from 'helpers';

const FaqSingle = ({ faq }, { testId }) => (
  <>
    <dl data-test-id={'faqEntry'} id={faq.id}>
      <dt>
        <abbr title="Question">Q:</abbr>
        <h4 data-test-id={testId('faqQuestion')}>{faq.question}</h4>
      </dt>
      <dd>
        <abbr title="Answer">A:</abbr>
        {/* sanitize html returned from Mafia/Gateway Content Symphony API */}
        <div dangerouslySetInnerHTML={{ __html: cleanUp(faq.answer) }} data-test-id={testId('faqAnswer')}/>
      </dd>
      <dd><a href={'#faq-list'}>Return to Top</a></dd>
    </dl>
  </>
);

FaqSingle.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('FaqSingle', FaqSingle);
