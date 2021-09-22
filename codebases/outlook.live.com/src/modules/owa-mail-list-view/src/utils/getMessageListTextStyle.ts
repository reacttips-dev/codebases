import styles from './messageListTextStyles.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export const getMessageListTextStyle = (
    textType: 'Minor' | 'Major',
    densityModeString: string,
    isFirstLine?: boolean
) => {
    // Get the Proper text styles
    return classNames(
        textType == 'Minor' ? styles.messageListMinorTextNext : styles.messageListMajorTextNext,
        isFirstLine && styles.firstLineText,
        densityModeString
    );
};
