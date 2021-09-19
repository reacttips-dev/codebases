import HtmlToReact from 'components/common/HtmlToReact';
import useMartyContext from 'hooks/useMartyContext';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import styles from 'styles/components/landing/agreement.scss';

export const Agreement = ({ slotDetails }) => {
  const { testId } = useMartyContext();
  const { agreement, style, monetateId } = slotDetails;
  return (
    <div className={styles.content} data-test-id={testId('agreement')} data-monetate-id={monetateId}>
      <HtmlToReact className={style}>
        {agreement}
      </HtmlToReact>
    </div>
  );
};

export default withErrorBoundary('Agreement', Agreement);
