import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { RelatedSearchTermsBanner } from "./RelatedSearchTermsBanner/RelatedSearchTermsBanner";
import { RelatedSearchTermsService } from "services/relatedSearchTerms/RelatedSearchTermsService";
import {
    IRelatedSearchTermsRequest,
    IRelatedSearchTerm,
} from "services/relatedSearchTerms/RelatedSearchTermsServiceTypes";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { RelatedSearchTermsModal } from "./RelatedSearchTermsModal/RelatedSearchTermsModal";
import { KeywordGroupEditorHelpers } from "../KeywordGroupEditorHelpers";
import { saveRelatedKeywordsGroup } from "./Utils/RelatedSearchTermsUtils";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

interface IRelatedSearchTermsProps {
    params: IRelatedSearchTermsRequest;
    isBannerVisible: boolean;
}

export const RelatedSearchTerms: FC<IRelatedSearchTermsProps> = (props) => {
    const { params, isBannerVisible } = props;
    const [relatedKeywords, setRelatedKeywords] = useState<IRelatedSearchTerm[]>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSavingGroup, setIsSavingGroup] = useState(false);

    const services = useMemo(() => {
        return {
            relatedSearchService: new RelatedSearchTermsService(),
            navigator: Injector.get<SwNavigator>("swNavigator"),
            keywordsGroupsService: keywordsGroupsService,
            tracking: TrackWithGuidService,
        };
    }, []);

    useEffect(() => {
        const updateRelatedSearchTerms = async () => {
            setIsLoading(true);
            const relatedSearchTerms = await services.relatedSearchService.getRelatedSearchTerms(
                params,
            );
            setRelatedKeywords(relatedSearchTerms);
            setIsLoading(false);
        };

        if (isBannerVisible) {
            updateRelatedSearchTerms();
        }
    }, [services, params, isBannerVisible]);

    const saveRelatedKeywords = useCallback(
        async (selectedKeywords: string[], groupName: string) => {
            services.tracking.trackWithGuid("related.search.terms.modal", "submit-ok");
            setIsSavingGroup(true);

            const groupSaveResult = await saveRelatedKeywordsGroup(
                groupName,
                selectedKeywords,
                services.keywordsGroupsService,
            );

            setIsModalOpen(false);
            setIsSavingGroup(false);

            if (groupSaveResult.isSuccess) {
                services.navigator.applyUpdateParams({
                    keyword: `*${groupSaveResult.newGroup.Id}`,
                });
            }
        },
        [setIsModalOpen, setIsSavingGroup, services],
    );

    return (
        <>
            {isBannerVisible && (
                <RelatedSearchTermsBanner
                    onButtonClick={() => {
                        services.tracking.trackWithGuid("related.search.terms.banner", "click");
                        setIsModalOpen(true);
                    }}
                />
            )}
            <RelatedSearchTermsModal
                isLoading={isLoading}
                isSavingGroupInProgress={isSavingGroup}
                isOpen={isModalOpen}
                selectedKeyword={params?.keys}
                relatedSearchTerms={relatedKeywords}
                onCloseClick={() => {
                    services.tracking.trackWithGuid("related.search.terms.modal", "cancel");
                    setIsModalOpen(false);
                }}
                onSaveClick={saveRelatedKeywords}
            />
        </>
    );
};
