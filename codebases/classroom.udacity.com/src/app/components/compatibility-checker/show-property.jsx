import { CHECK_DONE, CHECK_NOT_STARTED, CHECK_STARTED } from './constants';
import { IconCheck, IconClose } from '@udacity/veritas-icons';
import { Loading } from '@udacity/veritas-components';
import cx from 'classnames';
import styles from './index.scss';

const ShowProperty = (props) => {
  if (props.checkingStatus === CHECK_NOT_STARTED) {
    return;
  }

  return (
    <section className={styles.propertySection}>
      {props.checkingStatus === CHECK_STARTED && (
        <div className={styles.property}>
          <h4 className={styles.name}>{props.checkingTitle}</h4>
          <div className={styles.result}>
            <Loading />
          </div>
        </div>
      )}
      {props.checkingStatus === CHECK_DONE && (
        <div className={styles.property}>
          <h4 className={styles.name}>{props.checkedTitle}</h4>
          {props.value ? (
            <div className={cx(styles.result, styles.success)}>
              <IconCheck size="lg" />
            </div>
          ) : (
            <div className={cx(styles.result, styles.fail)}>
              <IconClose size="lg" />
            </div>
          )}
        </div>
      )}
      <p className={styles.propertyNote}>{props.description}</p>
    </section>
  );
};

export default cssModule(ShowProperty, styles);
