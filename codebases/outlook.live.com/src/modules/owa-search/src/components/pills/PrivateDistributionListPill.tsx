import { observer } from 'mobx-react-lite';
import type { PrivateDistributionListMember } from 'owa-persona-models';
import MultiPersonaControl from 'owa-persona/lib/components/MultiPersonaControl/MultiPersonaControl';
import * as React from 'react';
import { useAutoFocus } from '../../hooks/useAutoFocus';

import searchBoxPillWellStyles from './SearchBoxPillWell.scss';

export interface PrivateDistributionListPillProps {
    personas: PrivateDistributionListMember[];
    isSelected: boolean;
    name: string;
}

export default observer(function PrivateDistributionListPill(
    props: PrivateDistributionListPillProps
) {
    const pillDiv = useAutoFocus<HTMLDivElement>(props.isSelected);

    return (
        <div className={searchBoxPillWellStyles.personaPill} ref={pillDiv} tabIndex={-1}>
            <MultiPersonaControl personas={props.personas} isSearchPill={true} />
            <div className={searchBoxPillWellStyles.personaPillNameText}>{props.name}</div>
        </div>
    );
});
