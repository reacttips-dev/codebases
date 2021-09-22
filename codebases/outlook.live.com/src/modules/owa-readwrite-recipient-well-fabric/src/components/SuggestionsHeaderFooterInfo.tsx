import { getStyles } from './SuggestionsHeaderFooterInfo.styles';
import type { ITheme } from '@fluentui/style-utilities';
import { classNamesFunction } from '@fluentui/utilities';
import { Icon } from '@fluentui/react/lib/Icon';
import { Spinner } from '@fluentui/react/lib/Spinner';
import { ControlIcons } from 'owa-control-icons';
import { getExtendedTheme } from 'owa-fabric-theme';
import loc, { format } from 'owa-localize';
import { findRecipientInfo_NoResultsFound } from 'owa-locstrings/lib/strings/findrecipientinfo_noresultsfound.locstring.json';
import { findRecipientInfo_SearchDirectory } from 'owa-locstrings/lib/strings/findrecipientinfo_searchdirectory.locstring.json';
import { findRecipientInfo_Searching } from 'owa-locstrings/lib/strings/findrecipientinfo_searching.locstring.json';
import { findRecipientInfo_SearchPeople } from 'owa-locstrings/lib/strings/findrecipientinfo_searchpeople.locstring.json';
import { findRecipientInfo_TopNResults } from 'owa-locstrings/lib/strings/findrecipientinfo_topnresults.locstring.json';
import { findRecipientInfo_TypeToSearch } from 'owa-locstrings/lib/strings/findrecipientinfo_typetosearch.locstring.json';
import { findRecipientInfo_UseThisAddress } from 'owa-locstrings/lib/strings/findrecipientinfo_usethisaddress.locstring.json';
import { findRecipientResult_SuggestedContactsHeader } from 'owa-locstrings/lib/strings/findrecipientresult_suggestedcontactsheader.locstring.json';
import FeedbackFooter from 'owa-readwrite-recipient-well-internal-feedback/lib/components/FeedbackFooter';
import { FindRecipientInfoType } from 'owa-recipient-common-components/lib/components/FindRecipientInfo';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import * as React from 'react';

import type {
    SuggestionsHeaderFooterInfoProps,
    SuggestionsHeaderFooterInfoStyles,
    SuggestionsHeaderFooterInfoStyleProps,
} from './SuggestionsHeaderFooterInfo.types';

const getClassNames = classNamesFunction<
    SuggestionsHeaderFooterInfoStyleProps,
    SuggestionsHeaderFooterInfoStyles
>();

import classNamesUtil from 'classnames';

const SuggestionsHeaderFooterInfo = (props: SuggestionsHeaderFooterInfoProps) => {
    let { infoType, queryString, numberOfResults, theme = getExtendedTheme() as ITheme } = props;
    const classNames = getClassNames(getStyles, { theme: theme });
    switch (infoType) {
        case FindRecipientInfoType.SuggestedContacts:
            return (
                <div
                    className={classNamesUtil(
                        classNames.textContainer,
                        classNames.suggestedContactsHeaderBox
                    )}>
                    <span className={classNames.suggestedContactsText}>
                        {loc(findRecipientResult_SuggestedContactsHeader)}
                    </span>
                </div>
            );
        case FindRecipientInfoType.Searching:
            return (
                <div className={classNamesUtil(classNames.footerBorder, classNames.container)}>
                    <div className={classNames.iconContainer}>
                        <Spinner theme={theme} />
                    </div>
                    <div className={classNames.textContainer}>
                        {format(loc(findRecipientInfo_Searching), queryString)}
                    </div>
                </div>
            );
        case FindRecipientInfoType.TypeToSearch:
            return (
                <div className={classNames.container}>
                    <div className={classNamesUtil(classNames.textContainer, classNames.centered)}>
                        {loc(findRecipientInfo_TypeToSearch)}
                    </div>
                </div>
            );
        case FindRecipientInfoType.SearchDirectory:
            return (
                <div className={classNamesUtil(classNames.footerBorder, classNames.container)}>
                    <div className={classNames.iconContainer}>
                        <Icon className={classNames.searchIcon} iconName={ControlIcons.Search} />
                    </div>
                    <div className={classNames.textContainer}>
                        {isConsumer()
                            ? loc(findRecipientInfo_SearchPeople)
                            : loc(findRecipientInfo_SearchDirectory)}
                    </div>
                </div>
            );
        case FindRecipientInfoType.TopNResults:
            return (
                <div className={classNamesUtil(classNames.footerBorder, classNames.container)}>
                    <div className={classNamesUtil(classNames.textContainer, classNames.centered)}>
                        {numberOfResults
                            ? format(loc(findRecipientInfo_TopNResults), numberOfResults)
                            : loc(findRecipientInfo_NoResultsFound)}
                    </div>
                </div>
            );
        case FindRecipientInfoType.UseAddress:
            return (
                <div
                    className={classNamesUtil(
                        classNames.headerBorder,
                        classNames.textContainer,
                        classNames.useAddressContainer
                    )}>
                    {format(loc(findRecipientInfo_UseThisAddress), queryString)}
                </div>
            );
        case FindRecipientInfoType.FindPeopleFeedback:
            return (
                <FeedbackFooter
                    className={classNamesUtil(
                        classNames.footerBorder,
                        classNames.textContainer,
                        classNames.feedbackContainer
                    )}
                />
            );
        default:
            return null;
    }
};

export default SuggestionsHeaderFooterInfo;
