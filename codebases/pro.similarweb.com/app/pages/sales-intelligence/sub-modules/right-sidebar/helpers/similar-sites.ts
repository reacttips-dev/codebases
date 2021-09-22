import { CompetitorUpdateDto, SimilarSiteType } from "../types/similar-sites";

export const toUpdateCompetitorDto = (similarSite: SimilarSiteType): CompetitorUpdateDto => {
    return {
        domain: similarSite.domain,
        isSelected: !similarSite.removed,
    };
};

export const wasNotAdded = (website: SimilarSiteType) => {
    return !website.added;
};

export const wasNotRemoved = (website: SimilarSiteType) => {
    return !website.removed;
};

export const wasTouched = (website: SimilarSiteType) => {
    return website.added || website.removed;
};

export const removeSimilarSiteAddedProperty = (competitor: SimilarSiteType) => {
    const newCompetitor = { ...competitor };
    delete newCompetitor.added;

    return newCompetitor;
};

export const removeSimilarSiteRemovedProperty = (competitor: SimilarSiteType) => {
    const newCompetitor = { ...competitor };
    delete newCompetitor.removed;

    return newCompetitor;
};
