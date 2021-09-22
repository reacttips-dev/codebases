import React, { FC, useMemo } from "react";
import { IRelatedSearchTerm } from "services/relatedSearchTerms/RelatedSearchTermsServiceTypes";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles/";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { IRelatedSearchTermsListProps } from "./RelatedSearchTermsListTypes";
import {
    ListTitleContainer,
    ListContainer,
    LoaderContainer,
} from "pages/keyword-analysis/RelatedSearchTerms/RelatedSearchTermsModal/RelatedSearchTermsList/RelatedSearchTermsListStyles";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { ListContentLoader } from "@similarweb/ui-components/dist/content-loaders";
import { renderRelatedSearchTermsListItems } from "../../Utils/RelatedSearchTermsUtils";
import { i18nFilter } from "filters/ngFilters";

export const RelatedSearchTermsList: FC<IRelatedSearchTermsListProps> = (props) => {
    const {
        isLoading,
        isSavingGroupInProgress,
        relatedSearchTerms,
        totalAvailableSearchTerms,
        selectedKeyword,
        onRemoveRelatedSearchTerm,
    } = props;

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
        };
    }, []);

    const ListHeader = useMemo(() => {
        const title = services.translate("related.search.terms.modal.list.title");
        const subtitle = isLoading
            ? services.translate("related.search.terms.modal.list.subtitle", {
                  added: "-",
                  total: "-",
              })
            : services.translate("related.search.terms.modal.list.subtitle", {
                  added: `${relatedSearchTerms.length}`,
                  total: `${totalAvailableSearchTerms}`,
              });

        return (
            <ListTitleContainer>
                <span>{title}</span>
                <span>{subtitle}</span>
            </ListTitleContainer>
        );
    }, [relatedSearchTerms, isLoading]);

    const ListLoader = useMemo(() => {
        return (
            <LoaderContainer>
                <ListContentLoader
                    loaderTitle={services.translate("related.search.terms.modal.list.loader.title")}
                    loaderSubtitle={services.translate(
                        "related.search.terms.modal.list.loader.subtitle",
                        {
                            keyword: selectedKeyword,
                        },
                    )}
                />
            </LoaderContainer>
        );
    }, [isLoading]);

    const ListBody = useMemo(() => {
        const listItems = renderRelatedSearchTermsListItems(
            selectedKeyword,
            relatedSearchTerms,
            isSavingGroupInProgress,
            onRemoveRelatedSearchTerm,
        );

        return (
            <ListContainer>
                <ScrollArea
                    style={{ maxHeight: 360, minHeight: 0, padding: "0 17px" }}
                    verticalScrollbarStyle={{ borderRadius: 5 }}
                    horizontal={false}
                    smoothScrolling={true}
                    minScrollSize={48}
                >
                    {listItems}
                </ScrollArea>
            </ListContainer>
        );
    }, [relatedSearchTerms, onRemoveRelatedSearchTerm, selectedKeyword]);

    return (
        <FlexColumn>
            {ListHeader}
            {isLoading ? ListLoader : ListBody}
        </FlexColumn>
    );
};
