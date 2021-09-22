import { flagTitle, unflagTitle } from './getFlagCompleteHelper.locstring.json';
import { ControlIcons } from 'owa-control-icons';
import loc from 'owa-localize';
import FlagFilled from 'owa-fluent-icons-svg/lib/icons/FlagFilled';
import FlagRegular from 'owa-fluent-icons-svg/lib/icons/FlagRegular';
import CheckmarkRegular from 'owa-fluent-icons-svg/lib/icons/CheckmarkRegular';

import styles from '../components/MailListItem.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export default function getFlagCompleteHelper(
    flagCompleteEntry: any,
    isFlagged: boolean,
    isComplete: boolean,
    hasDensityNext: boolean
) {
    if (isComplete) {
        flagCompleteEntry.title = loc(flagTitle);
        flagCompleteEntry.key = 'completeIcon';
        flagCompleteEntry.iconName = hasDensityNext ? CheckmarkRegular : ControlIcons.CheckMark;
    } else {
        let flagIconName;
        if (hasDensityNext) {
            flagIconName = isFlagged ? FlagFilled : FlagRegular;
        } else {
            flagIconName = isFlagged ? ControlIcons.EndPointSolid : ControlIcons.Flag;
        }
        const flagClasses = classNames(isFlagged && styles.flagIcon);
        flagCompleteEntry.title = isFlagged ? loc(unflagTitle) : loc(flagTitle);
        flagCompleteEntry.key = 'flagIcon';
        flagCompleteEntry.iconName = flagIconName;
        flagCompleteEntry.iconClassName = flagClasses;
    }
    return flagCompleteEntry;
}
