import { findRecipientInfo_UseThisAddress } from 'owa-locstrings/lib/strings/findrecipientinfo_usethisaddress.locstring.json';
import { findRecipientInfo_NoResultsFound } from 'owa-locstrings/lib/strings/findrecipientinfo_noresultsfound.locstring.json';
import { findRecipientInfo_TopNResults } from 'owa-locstrings/lib/strings/findrecipientinfo_topnresults.locstring.json';
import { findRecipientInfo_SearchDirectory } from 'owa-locstrings/lib/strings/findrecipientinfo_searchdirectory.locstring.json';
import { findRecipientInfo_SearchPeople } from 'owa-locstrings/lib/strings/findrecipientinfo_searchpeople.locstring.json';
import { findRecipientInfo_TypeToSearch } from 'owa-locstrings/lib/strings/findrecipientinfo_typetosearch.locstring.json';
import { findRecipientInfo_Searching } from 'owa-locstrings/lib/strings/findrecipientinfo_searching.locstring.json';
import loc, { format } from 'owa-localize';
import { Icon } from '@fluentui/react/lib/Icon';
import { Spinner } from '@fluentui/react/lib/Spinner';
import { ControlIcons } from 'owa-control-icons';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

import * as React from 'react';

import styles from './FindRecipientInfo.scss';
import classnamesBind from 'classnames/bind';
let classNames = classnamesBind.bind(styles);

export interface FindRecipientInfoProps {
    infoType: FindRecipientInfoType;
    highlighted: boolean;
    queryString: string;
    numberOfResults: number;
    searchDirectoryAction?: () => void;
    useTypedAddressAction?: () => void;
}

export enum FindRecipientInfoType {
    Default = 0,
    Searching,
    TypeToSearch,
    SearchDirectory,
    TopNResults,
    UseAddress,
    SuggestedContacts,
    FindPeopleFeedback,
}

const FindRecipientInfo = (props: FindRecipientInfoProps): JSX.Element => {
    switch (props.infoType) {
        case FindRecipientInfoType.Searching:
            return (
                <div className={styles.container}>
                    <div className={styles.iconContainer}>
                        <Spinner className={styles.loadingSpinner} />
                    </div>
                    <div className={styles.textContainer}>
                        {format(loc(findRecipientInfo_Searching), props.queryString)}
                    </div>
                </div>
            );
        case FindRecipientInfoType.TypeToSearch:
            return (
                <div className={styles.container}>
                    <div className={classNames(styles.textContainer, styles.centered)}>
                        {loc(findRecipientInfo_TypeToSearch)}
                    </div>
                </div>
            );
        case FindRecipientInfoType.SearchDirectory:
            if (props.searchDirectoryAction) {
                return (
                    <div
                        className={classNames(styles.container, styles.hoverable, {
                            isHighlighted: props.highlighted,
                        })}
                        onClick={props.searchDirectoryAction}>
                        <div className={styles.iconContainer}>
                            <Icon className={styles.searchIcon} iconName={ControlIcons.Search} />
                        </div>
                        <div className={styles.textContainer}>
                            {isConsumer()
                                ? loc(findRecipientInfo_SearchPeople)
                                : loc(findRecipientInfo_SearchDirectory)}
                        </div>
                    </div>
                );
            }
            break;
        case FindRecipientInfoType.TopNResults:
            return (
                <div className={styles.container}>
                    <div className={classNames(styles.textContainer, styles.centered)}>
                        {props.numberOfResults
                            ? format(loc(findRecipientInfo_TopNResults), props.numberOfResults)
                            : loc(findRecipientInfo_NoResultsFound)}
                    </div>
                </div>
            );
        case FindRecipientInfoType.UseAddress:
            if (props.useTypedAddressAction) {
                return (
                    <div>
                        <div
                            className={classNames(styles.hoverable, {
                                isHighlighted: props.highlighted,
                            })}>
                            <div
                                className={classNames(
                                    styles.textContainer,
                                    styles.useAddressContainer
                                )}
                                onClick={props.useTypedAddressAction}>
                                {format(loc(findRecipientInfo_UseThisAddress), props.queryString)}
                            </div>
                        </div>
                        <FindRecipientInfo
                            infoType={FindRecipientInfoType.TopNResults}
                            highlighted={false}
                            queryString={props.queryString}
                            numberOfResults={props.numberOfResults}
                        />
                    </div>
                );
            }
            break;
    }
    return <></>;
};

export default FindRecipientInfo;
