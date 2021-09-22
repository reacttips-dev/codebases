import { useMemo } from "react";
import createPopularSearchesService from "../services/popularSearchesService";

const usePopularSearchesService = () => {
    return useMemo(() => {
        return createPopularSearchesService();
    }, []);
};

export default usePopularSearchesService;
