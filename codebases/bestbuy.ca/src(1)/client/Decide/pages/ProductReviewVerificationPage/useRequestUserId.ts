import { useState, useEffect } from "react";

import { parseQueryString, QueryParams } from "utils/queryString/";

import ApiCustomerReviewsProvider from "../../providers/CustomerReviewsProvider/ApiCustomerReviewsProvider";

interface TokenParams extends QueryParams {
    bv_authtoken: string;
}

export interface UseRequestUserId {
    loading: boolean;
    isSuccessful: boolean;
}

const useRequestUserId = (baseUrl: string, locale: Locale = "en-CA"): UseRequestUserId => {
    const [ loading, setLoading ] = useState(true);
    const [ isSuccessful, setIsSuccessful ] = useState(undefined);

    useEffect(() => {
        const requestUserID = async () => {
            setLoading(true);
            try {
                const { bv_authtoken } = parseQueryString(location && location.search) as TokenParams;
                await (new ApiCustomerReviewsProvider(baseUrl, locale)).verifyReviewer(bv_authtoken);
                setIsSuccessful(true);
            } catch (e) {
                setIsSuccessful(false);
            }
            setLoading(false);
        };
        requestUserID();
    }, [baseUrl, locale]);

    return { loading, isSuccessful };
};

export default useRequestUserId;
