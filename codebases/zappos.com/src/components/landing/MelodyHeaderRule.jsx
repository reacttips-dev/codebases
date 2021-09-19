import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import styles from 'styles/components/landing/melodyHeaderRule.scss';

export const MelodyHeaderRule = ({ slotDetails }) => {
  const { monetateId } = slotDetails;

  return (
    <hr className={styles.melodyRule} data-monetate-id={monetateId}/>
  );
};

export default withErrorBoundary('MelodyHeaderRule', MelodyHeaderRule);
