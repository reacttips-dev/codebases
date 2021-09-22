import { Icon } from '@fluentui/react/lib/Icon';
import { AriaRoles } from 'owa-accessibility';
import { ControlIcons } from 'owa-control-icons';
import * as React from 'react';

import owaHeaderStyles from 'owa-header-common/lib/Header.scss';
import classNames from 'classnames';

export interface ISearchButtonProps {
    onClick: (evt?: any) => void;
}

export default function CompactSearchBox(props: ISearchButtonProps) {
    return (
        <button className={owaHeaderStyles.charm} onClick={props.onClick} role={AriaRoles.menuitem}>
            <Icon
                className={classNames(
                    owaHeaderStyles.suiteCharmIcon,
                    owaHeaderStyles.suiteHoverCharmIcon
                )}
                iconName={ControlIcons.Search}
            />
        </button>
    );
}
