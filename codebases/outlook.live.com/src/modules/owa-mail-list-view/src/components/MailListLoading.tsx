import * as React from 'react';
import { Spinner } from '@fluentui/react/lib/Spinner';

import styles from './MailListLoading.scss';

const MailListLoading = () => <Spinner className={styles.spinner} />;

export default MailListLoading;
